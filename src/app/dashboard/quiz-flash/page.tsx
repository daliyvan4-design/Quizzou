"use client";
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function QuizFlashPage() {
    const [topic, setTopic] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleGenerate = async () => {
        if (!topic.trim()) return;
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/quiz-flash', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic })
            });
            const data = await res.json();

            if (res.ok && data.quizId) {
                router.push(`/quiz/${data.quizId}`);
            } else {
                setError(data.error || 'Erreur lors de la création du Quiz.');
                setLoading(false);
            }
        } catch (err) {
            console.error(err);
            setError('Impossible de joindre le serveur.');
            setLoading(false);
        }
    };
    return (
        <div className="max-w-6xl mx-auto px-6 md:px-8 py-8 md:py-10 bg-white min-h-[80vh] flex flex-col items-center justify-center text-center">
            <span className="material-symbols-outlined text-[100px] text-primary mb-6 animate-pulse">speed</span>
            <h1 className="text-4xl font-black text-black mb-4">Quiz Flash</h1>
            <p className="text-xl text-slate-500 mb-8 max-w-lg">Créez un quiz instantané sur n'importe quel sujet en écrivant simplement 3 mots de texte sans envoyer de fichier PDF : l'IA va chercher dans son savoir général !</p>
            <div className="bg-slate-50 border-2 border-primary border-dashed p-8 rounded-2xl w-full max-w-md relative">
                {loading ? (
                    <div className="flex flex-col items-center justify-center p-4">
                        <span className="material-symbols-outlined text-4xl text-primary animate-spin mb-4">refresh</span>
                        <p className="font-bold text-black text-lg">Génération en cours...</p>
                        <p className="text-slate-500 max-w-xs mx-auto text-sm mt-2 leading-tight">Gemini cherche dans sa base de données universelle pour ce sujet.</p>
                        <div className="w-full h-2 bg-slate-200 rounded-full mt-6 overflow-hidden">
                            <div className="w-2/3 h-full bg-primary rounded-full animate-pulse"></div>
                        </div>
                    </div>
                ) : (
                    <>
                        <input
                            type="text"
                            placeholder="Entrez un sujet (ex: La Révolution Française)"
                            className="w-full text-center px-6 py-4 rounded-xl border-2 border-slate-200 text-black font-bold mb-4 focus:outline-none focus:border-primary transition-colors"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleGenerate(); }}
                            disabled={loading}
                        />
                        {error && <p className="text-red-500 font-bold mb-4 bg-red-100 p-2 rounded-lg">{error}</p>}
                        <button
                            onClick={handleGenerate}
                            disabled={loading || !topic.trim()}
                            className="bg-primary text-white font-bold w-full uppercase py-3 rounded-xl border-2 border-primary hover:bg-white hover:text-primary transition-colors disabled:opacity-50"
                        >
                            Testez vos connaissances →
                        </button>
                    </>
                )}
            </div>
            <Link href="/dashboard" className="mt-8 text-primary font-bold hover:underline">
                ← Retour au tableau de bord
            </Link>
        </div>
    );
}
