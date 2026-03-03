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

        const { quizId } = await req.json();

        if (!quizId) {
            return NextResponse.json({ error: "Quiz ID manquant." }, { status: 400 });
        }

        // 1. Récupérer le quiz pour le texte
        const quizDoc = await adminFirestore.collection('quizzes').doc(quizId).get();
        if (!quizDoc.exists) {
            return NextResponse.json({ error: "Document introuvable." }, { status: 404 });
        }

        const data = quizDoc.data();

        // Vérification de sécurité : l'utilisateur est-il le propriétaire du quiz ?
        if (data?.userId !== userId) {
            return NextResponse.json({ error: "Accès refusé à ce document." }, { status: 403 });
        }

        const textToSummarize = data?.text || "";

        if (!textToSummarize) {
            // Si pas de texte, on peut essayer de résumer à partir des questions
            const questionsSummary = data?.questions?.map((q: any) => q.text).join(". ");
            if (!questionsSummary) {
                return NextResponse.json({ error: "Aucun contenu à résumer." }, { status: 400 });
            }
        }

        // 2. IA pour résumer
        if (!process.env.GOOGLE_GEMINI_API_KEY) {
            return NextResponse.json({ error: 'Clé API Gemini introuvable.' }, { status: 500 });
        }

        const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEMINI_API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: `Tu es un expert en éducation. Ton but est de créer un résumé structuré, clair et ultra-pertinent du texte suivant.
        Utilise des titres (Markdown), des puces, et mets en gras les concepts clés.
        Rédige le tout en FRANÇAIS.
        
        Voici le contenu:
        ${(textToSummarize || "").substring(0, 80000)}`,
            config: {
                responseMimeType: "text/plain",
            }
        });

        const summary = response.text || "Impossible de générer le résumé.";

        return NextResponse.json({ summary });

    } catch (err: any) {
        console.error("Summarization Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
