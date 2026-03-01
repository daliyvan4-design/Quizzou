import { NextResponse } from 'next/server';
import { adminAuth, adminFirestore } from '@/lib/firebase/admin';
const PDFParser = require("pdf2json");
import mammoth from 'mammoth';
import { GoogleGenAI } from '@google/genai';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        // 1. Vérifier si l'utilisateur est connecté via le cookie "session" HttpOnly
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get('session')?.value;

        if (!sessionCookie) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        let decodedClaims;
        try {
            decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
        } catch (e) {
            return NextResponse.json({ error: 'Session invalide' }, { status: 401 });
        }

        const userId = decodedClaims.uid;

        // 2. Extraire le fichier du FormData form (Multipart)
        const formData = await request.formData();
        const file = formData.get('document') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 });
        }

        // 3. Parser le texte selon le type de fichier
        const buffer = Buffer.from(await file.arrayBuffer());
        let extractedText = '';

        if (file.type === 'application/pdf') {
            extractedText = await new Promise((resolve, reject) => {
                const pdfParser = new PDFParser(null, 1);
                pdfParser.on("pdfParser_dataError", (errData: any) => reject(errData.parserError));
                pdfParser.on("pdfParser_dataReady", () => {
                    resolve(pdfParser.getRawTextContent());
                });
                pdfParser.parseBuffer(buffer);
            });
        } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            const docxData = await mammoth.extractRawText({ buffer });
            extractedText = docxData.value;
        } else {
            return NextResponse.json({ error: 'Format non supporté (PDF, DOCX uniquement)' }, { status: 400 });
        }

        if (!extractedText || extractedText.trim().length === 0) {
            return NextResponse.json({ error: 'Texte vide aprés analyse.' }, { status: 400 });
        }

        // Firebase Storage étant retiré pour rester 100% gratuit,
        // nous traitons le fichier en mémoire vive puis nous l'ignorons.

        // Sauvegarder dans Firestore (collection 'documents')
        const docRef = await adminFirestore.collection('documents').add({
            userId: userId,
            title: file.name,
            filePath: 'none (in-memory)',
            createdAt: new Date()
        });

        // 5. Utiliser Gemini 3.1 Pro pour analyser le texte
        if (!process.env.GOOGLE_GEMINI_API_KEY) {
            return NextResponse.json({ error: 'Clé API Gemini introuvable.' }, { status: 500 });
        }

        const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEMINI_API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Tu es un professeur expert d'université. Analyse scrupuleusement le document texte fourni à la fin et génère un quiz interactif très complet de niveau avancé.
        Je veux au minimum entre 10 et 15 questions. Veille à ce que les questions ne soient pas que de la simple récitation, mais évaluent la compréhension profonde, le raisonnement et l'analyse des concepts abordés.
        IMPORTANT: Le quiz en entier (titre, questions, options, explications, tags) DOIT ABSOLUMENT T'ÊTRE RÉDIGÉ EN FRANÇAIS, même si le texte source est dans une autre langue.
        
        Suis exactement cette structure JSON:
        {
           "title": "A relevant title",
           "totalQuestions": 10,
           "questions": [
            {
              "tag": "Category/Tag",
              "text": "The question...?",
              "options": ["A", "B", "C", "D"],
              "correctIndex": 0,
              "explanation": "Why A is correct"
            }
          ]
        }
        
        Only output the raw valid JSON. Here is the course document:
        ${extractedText.substring(0, 100000)}
        `,
            config: {
                responseMimeType: "application/json",
            }
        });

        const quizContent = response.text || '';
        let parsedQuiz;

        try {
            parsedQuiz = JSON.parse(quizContent);
        } catch (err) {
            parsedQuiz = { title: "Draft", questions: [] }; // Fallback
        }

        // 6. Sauvegarder le Quiz dans Firestore (collection 'quizzes')
        const quizRef = await adminFirestore.collection('quizzes').add({
            documentId: docRef.id,
            userId: userId,
            title: parsedQuiz.title || file.name,
            questions: parsedQuiz.questions,
            text: extractedText, // On garde le texte pour le résumé IA plus tard
            createdAt: new Date()
        });

        // 7. Renvoyer succès
        return NextResponse.json({
            success: true,
            quizId: quizRef.id
        }, { status: 200 });

    } catch (error: any) {
        console.error('Erreur Upload/Génération:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
