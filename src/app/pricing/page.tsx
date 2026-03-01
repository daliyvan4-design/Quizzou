"use client";
import Link from "next/link";

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-slate-50 text-black font-sans">
            {/* Header */}
            <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b-2 border-primary/10">
                <div className="max-w-7xl mx-auto px-6 h-20 md:h-24 flex items-center justify-between">
                    <Link href="/">
                        <img src="/logo.png" alt="Quizzou Logo" className="h-16 md:h-20 w-auto object-contain" />
                    </Link>
                    <Link href="/" className="text-sm font-black uppercase text-primary border-2 border-primary px-6 py-2 rounded-xl hover:bg-primary hover:text-white transition-all text-center">
                        Retour
                    </Link>
                </div>
            </header>

            <main className="pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">Choisissez votre <span className="text-primary">plan</span>.</h1>
                        <p className="text-xl text-slate-500 font-medium max-w-lg mx-auto">Démarrer gratuitement ou passez à la vitesse supérieure avec le mode Pro.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {/* Free Plan */}
                        <div className="bg-white border-4 border-white p-10 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all relative overflow-hidden flex flex-col">
                            <div className="mb-8">
                                <h3 className="text-2xl font-black mb-2 uppercase tracking-widest text-slate-400">Gratuit</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-5xl font-black">0€</span>
                                    <span className="text-slate-500 font-bold">/mois</span>
                                </div>
                            </div>

                            <ul className="space-y-6 flex-grow mb-10 text-lg font-bold">
                                <li className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-emerald-500 font-black">check_circle</span>
                                    3 quiz par jour
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-emerald-500 font-black">check_circle</span>
                                    3 résumés par jour
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-emerald-500 font-black">check_circle</span>
                                    5 quiz flash par jour
                                </li>
                                <li className="flex items-center gap-3 text-slate-400 line-through decoration-2">
                                    <span className="material-symbols-outlined text-slate-300">cancel</span>
                                    Analyses illimitées
                                </li>
                            </ul>

                            <Link href="/" className="w-full py-4 text-center bg-slate-100 text-slate-500 rounded-2xl font-black text-lg uppercase hover:bg-slate-200 transition-colors">
                                Actuellement sélectionné
                            </Link>
                        </div>

                        {/* Pro Plan */}
                        <div className="bg-white border-4 border-primary p-10 rounded-[2.5rem] shadow-2xl hover:shadow-[0_40px_60px_-15px_rgba(230,55,70,0.2)] transition-all relative overflow-hidden flex flex-col scale-105">
                            <div className="absolute top-0 right-0 bg-primary text-white font-black px-6 py-2 rounded-bl-2xl uppercase tracking-tighter shadow-lg">
                                Coming Soon
                            </div>
                            <div className="mb-8">
                                <h3 className="text-2xl font-black mb-2 uppercase tracking-widest text-primary">Pro Unlimited</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-5xl font-black">9.99€</span>
                                    <span className="text-slate-500 font-bold">/mois</span>
                                </div>
                            </div>

                            <ul className="space-y-6 flex-grow mb-10 text-lg font-bold text-black">
                                <li className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary font-black">verified</span>
                                    Quiz illimités
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary font-black">verified</span>
                                    Résumés illimités
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary font-black">verified</span>
                                    Quiz Flash sans limite
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary font-black">verified</span>
                                    Priorité sur les serveurs IA
                                </li>
                            </ul>

                            <button className="w-full py-4 bg-primary text-white rounded-2xl font-black text-lg uppercase shadow-xl shadow-primary/30 transition-all opacity-50 cursor-not-allowed">
                                Bientôt disponible
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="py-12 bg-white text-center font-bold text-slate-400 border-t-2 border-slate-100">
                <p>© 2026 Xcompany all right reserved.</p>
            </footer>
        </div>
    );
}
