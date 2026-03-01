"use client";
import Link from "next/link";

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-white text-black font-sans">
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

            <main className="pt-32 pb-20 px-6 flex items-center justify-center min-h-screen">
                <div className="max-w-2xl w-full bg-slate-50 border-2 border-primary border-dashed p-10 md:p-16 rounded-[3rem] text-center shadow-2xl">
                    <span className="material-symbols-outlined text-6xl text-primary mb-6 animate-pulse">contact_support</span>
                    <h1 className="text-4xl font-black mb-8">Contactez <span className="text-primary">l'équipe</span>.</h1>

                    <div className="space-y-8 text-left max-w-sm mx-auto">
                        <div className="flex items-center gap-5">
                            <div className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined">person</span>
                            </div>
                            <p className="text-xl font-black">Xcompany</p>
                        </div>

                        <div className="flex items-center gap-5">
                            <div className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                                <span className="material-symbols-outlined">call</span>
                            </div>
                            <div className="flex flex-col">
                                <p className="text-xl font-black text-black">+225 07 88 65 53 41</p>
                                <div className="flex gap-4 mt-1">
                                    <a href="tel:+2250788655341" className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
                                        Appeler
                                    </a>
                                    <a href="https://wa.me/2250788655341" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-emerald-500 hover:underline flex items-center gap-1">
                                        WhatsApp
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-5">
                            <div className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                                <span className="material-symbols-outlined">mail</span>
                            </div>
                            <div className="flex flex-col">
                                <p className="text-xl font-black text-black">bobdali127@gmail.com</p>
                                <a href="mailto:bobdali127@gmail.com?subject=Question%20Quizzou" className="text-sm font-bold text-primary hover:underline mt-1">
                                    Envoyer un email
                                </a>
                            </div>
                        </div>

                        <div className="flex items-center gap-5">
                            <div className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined">location_on</span>
                            </div>
                            <p className="text-xl font-bold leading-tight">
                                Cocody Riviera Palmeraie,<br /> Rosier 5e barrière
                            </p>
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
