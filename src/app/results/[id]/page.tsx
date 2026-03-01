"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function ResultsPage() {
    const params = useParams();

    return (
        <div className="min-h-screen flex items-center justify-center bg-white font-display p-4 md:p-6">
            <div className="w-full max-w-2xl text-center space-y-6 md:space-y-8">

                <div className="bg-white rounded-3xl p-6 md:p-10 lg:p-12 shadow-md border-2 border-primary">
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border-2 border-primary">
                        <span className="material-symbols-outlined text-4xl md:text-5xl">workspace_premium</span>
                    </div>

                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-black mb-2 uppercase tracking-tight">Quiz Terminé !</h1>
                    <p className="text-lg md:text-xl font-bold text-primary mb-8">Score excellent : 14/15</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                        <div className="p-4 md:p-6 bg-white rounded-2xl border-2 border-slate-200">
                            <span className="block text-xs md:text-sm font-black text-black uppercase mb-1">Précision Globale</span>
                            <span className="block text-3xl md:text-4xl font-black text-primary">93%</span>
                        </div>
                        <div className="p-4 md:p-6 bg-white rounded-2xl border-2 border-slate-200">
                            <span className="block text-xs md:text-sm font-black text-black uppercase mb-1">Temps</span>
                            <span className="block text-3xl md:text-4xl font-black text-primary">4m 12s</span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
                        <Link
                            href={`/quiz/${params.id}?mode=review`}
                            className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 rounded-xl font-black bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors uppercase text-sm md:text-base text-center shadow-sm"
                        >
                            Réviser mes erreurs
                        </Link>
                        <Link
                            href="/dashboard"
                            className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 rounded-xl font-black bg-primary text-white border-2 border-primary shadow-md hover:bg-white hover:text-primary transition-all uppercase text-sm md:text-base text-center"
                        >
                            Retour au Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
