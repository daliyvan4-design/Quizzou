"use client";
import Link from 'next/link';

export default function DocumentPage() {
    return (
        <div className="max-w-6xl mx-auto px-6 md:px-8 py-8 md:py-10 bg-white min-h-[80vh] flex flex-col items-center justify-center text-center">
            <span className="material-symbols-outlined text-[100px] text-primary mb-6 animate-pulse">description</span>
            <h1 className="text-4xl font-black text-black mb-4">Mes Documents</h1>
            <p className="text-xl text-slate-500 mb-8 max-w-lg">Retrouvez tous vos PDF, notes de cours et concepts envoyés à l'IA précédemment rangés dans votre bibliothèque.</p>
            <div className="bg-slate-50 border-2 border-primary border-dashed p-8 rounded-2xl">
                <p className="font-bold text-primary mb-2">Chargement de votre Bibliothèque</p>
                <p className="text-sm text-slate-600">Boutons de tri et barre de recherche arrivent prochainement.</p>
            </div>
            <Link href="/dashboard" className="mt-8 text-primary font-bold hover:underline">
                ← Retour au tableau de bord
            </Link>
        </div>
    );
}
