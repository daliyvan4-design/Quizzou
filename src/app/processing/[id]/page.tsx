"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function ProcessingPage() {
    const router = useRouter();
    const params = useParams();

    useEffect(() => {
        // Simulation de l'appel à l'API Gemini pour générer le JSON
        const timer = setTimeout(() => {
            router.push(`/quiz/${params.id}`);
        }, 3000);

        return () => clearTimeout(timer);
    }, [router, params.id]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-white p-4">
            <div className="relative bg-white border-2 border-primary rounded-3xl p-8 md:p-12 flex flex-col items-center text-center shadow-lg w-full max-w-sm md:max-w-md">
                <div className="w-full h-32 md:h-48 border-4 border-dashed border-primary rounded-2xl flex flex-col items-center justify-center gap-4 mb-6 relative overflow-hidden bg-primary/5">
                    <span className="material-symbols-outlined text-primary text-5xl md:text-6xl animate-bounce relative z-10">document_scanner</span>
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent animate-pulse"></div>
                </div>
                <div className="flex flex-col items-center w-full">
                    <div className="w-full h-2 md:h-3 bg-slate-100 rounded-full overflow-hidden mb-4 border border-slate-200">
                        <div className="h-full bg-primary rounded-full animate-[loading_3s_ease-in-out_forwards]"></div>
                    </div>
                    <h2 className="text-xl md:text-2xl font-black mb-2 text-black">Analyse profonde par l'IA</h2>
                    <p className="text-sm md:text-base font-medium text-black max-w-sm">
                        Extraction des concepts clés et génération des questions en cours...
                    </p>
                </div>
            </div>
        </div>
    );
}
