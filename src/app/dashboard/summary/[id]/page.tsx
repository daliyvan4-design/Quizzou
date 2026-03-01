"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

export default function SummaryPage() {
    const { id: quizId } = useParams();
    const [summary, setSummary] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const res = await fetch('/api/summarize', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ quizId })
                });
                const data = await res.json();

                if (res.ok && data.summary) {
                    setSummary(data.summary);
                } else {
                    setError(data.error || 'Erreur lors de la génération du résumé.');
                }
            } catch (err) {
                console.error(err);
                setError('Impossible de joindre le serveur.');
            } finally {
                setLoading(false);
            }
        };

        if (quizId) fetchSummary();
    }, [quizId]);

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto px-6 py-20 flex flex-col items-center justify-center text-center">
                <span className="material-symbols-outlined text-7xl text-primary animate-pulse mb-6">auto_awesome</span>
                <h1 className="text-3xl font-black text-black">Génération du Résumé IA...</h1>
                <p className="text-slate-500 mt-4 max-w-sm">Veuillez patienter pendant que Gemini analyse votre document pour en extraire la substantifique moelle.</p>
                <div className="w-64 h-2 bg-slate-100 rounded-full mt-10 overflow-hidden border">
                    <div className="w-1/2 h-full bg-primary rounded-full animate-progress-ind"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto px-6 py-20 text-center">
                <span className="material-symbols-outlined text-6xl text-red-500 mb-4">error</span>
                <h2 className="text-2xl font-black text-black mb-4">{error}</h2>
                <Link href="/dashboard" className="text-primary font-black uppercase border-2 border-primary px-6 py-2 rounded-xl">Retour au dashboard</Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-6 md:px-8 py-8 md:py-12 bg-white min-h-screen">
            <header className="mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-black mb-2 flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary text-4xl">summarize</span>
                        Résumé IA
                    </h1>
                    <p className="text-slate-500 font-bold">Points clés et concepts essentiels extraits de votre document.</p>
                </div>
                <Link href="/dashboard" className="text-primary font-black uppercase text-sm border-2 border-primary px-5 py-2 rounded-lg hover:bg-primary hover:text-white transition-all shadow-sm">
                    Fermer
                </Link>
            </header>

            <div className="bg-slate-50 border-2 border-primary border-dashed p-8 md:p-12 rounded-[2.5rem] shadow-sm text-black
                [&_h1]:text-3xl [&_h1]:font-black [&_h1]:mb-6 [&_h1]:text-primary
                [&_h2]:text-2xl [&_h2]:font-black [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:text-black [&_h2]:border-b-2 [&_h2]:border-primary [&_h2]:inline-block
                [&_h3]:text-xl [&_h3]:font-black [&_h3]:mt-6 [&_h3]:mb-3
                [&_p]:mb-4 [&_p]:leading-relaxed [&_p]:font-medium [&_p]:text-slate-700
                [&_ul]:mb-6 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-2 [&_li]:font-medium [&_li]:text-slate-700
                [&_strong]:font-black [&_strong]:text-black">
                <ReactMarkdown>{summary}</ReactMarkdown>
            </div>

            <div className="mt-12 flex flex-col md:flex-row items-center gap-6 justify-between pt-10 border-t-2 border-slate-100">
                <div className="flex gap-4">
                    <button className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-bold text-sm tracking-wide shadow-xl active:scale-95 transition-all">
                        <span className="material-symbols-outlined">download</span>
                        Exporter en PDF
                    </button>
                    <button onClick={() => window.print()} className="flex items-center gap-2 border-2 border-slate-200 text-slate-600 px-6 py-3 rounded-xl font-bold text-sm hover:bg-white hover:border-black hover:text-black transition-all">
                        <span className="material-symbols-outlined">print</span>
                        Imprimer
                    </button>
                </div>
                <p className="text-slate-400 font-bold text-sm italic">Généré par Quizzou IA</p>
            </div>
        </div>
    );
}
