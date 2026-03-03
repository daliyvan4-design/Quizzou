import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { cookies } from "next/headers";
import { adminAuth, adminFirestore } from "@/lib/firebase/admin";

export async function POST(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get("session")?.value;

        if (!session) {
            return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
        }

        const decodedToken = await adminAuth.verifySessionCookie(session);
        const userId = decodedToken.uid;

        const body = await req.json();
        const { topic } = body;

        if (!topic || typeof topic !== "string") {
            return NextResponse.json({ error: "Thème manquant." }, { status: 400 });
        }

        if (!process.env.GOOGLE_GEMINI_API_KEY) {
            return NextResponse.json({ error: 'Clé API Gemini introuvable.' }, { status: 500 });
        }

        const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEMINI_API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Tu es un professeur expert d'université. Génère un quiz interactif très complet de niveau avancé sur le thème ou sujet suivant : "${topic}".
        Je veux au minimum entre 5 et 10 questions. Veille à ce que les questions évaluent la compréhension profonde, le raisonnement et l'analyse de ce thème.
        IMPORTANT: Le quiz en entier (titre, questions, options, explications, tags) DOIT ABSOLUMENT T'ÊTRE RÉDIGÉ EN FRANÇAIS.
        
        Suis exactement cette structure JSON:
        {
           "title": "Un titre accrocheur pour ce quiz",
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
        
        Only output the raw valid JSON.`,
            config: {
                responseMimeType: "application/json",
            }
        });

        let generatedContent = response.text || "";
        generatedContent = generatedContent.replace(/```json/g, '').replace(/```/g, '').trim();

        let quizData;
        try {
            quizData = JSON.parse(generatedContent);
        } catch (e: any) {
            console.error("Erreur de parsing JSON Gemini:", generatedContent);
            return NextResponse.json({ error: "L'IA a généré une réponse malformée." }, { status: 500 });
        }

        const quizId = `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        const docRef = adminFirestore.collection('quizzes').doc(quizId);
        await docRef.set({
            ...quizData,
            userId,
            createdAt: new Date().toISOString(),
            sourceType: "flash"
        });

        return NextResponse.json({
            success: true,
            quizId,
        });

    } catch (error: any) {
        console.error("Quiz Flash Error:", error);
        return NextResponse.json({ error: error.message || "Erreur lors de la génération." }, { status: 500 });
    }
}
