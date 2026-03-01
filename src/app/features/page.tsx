"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function FeaturesPage() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const features = [
        {
            title: "Mode Résumé IA",
            description: "Transformez des heures de lecture en quelques minutes de synthèse structurée. L'IA extrait les points clés, les définitions et les concepts essentiels de vos documents.",
            icon: "summarize",
            color: "bg-blue-500",
            animation: "fade-up"
        },
        {
            title: "Génération de Quiz",
            description: "Validez vos acquis instantanément. Notre IA génère des questions pertinentes basées directement sur vos cours pour un apprentissage actif et durable.",
            icon: "quiz",
            color: "bg-primary",
            animation: "fade-up"
        },
        {
            title: "Quiz Flash Instantané",
            description: "Pas de document ? Pas de problème. Tapez simplement un sujet et laissez l'IA puiser dans son savoir universel pour vous tester immédiatement.",
            icon: "bolt",
            color: "bg-amber-400",
            animation: "fade-up"
        },
        {
            title: "Statistiques Dynamiques",
            description: "Suivez votre courbe d'apprentissage en temps réel. Visualisez votre progression, vos points forts et les domaines nécessitant plus d'attention.",
            icon: "monitoring",
            color: "bg-emerald-500",
            animation: "fade-up"
        }
    ];

    return (
        <div className="min-h-screen bg-white text-black font-sans overflow-x-hidden">
            {/* Header */}
            <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b-2 border-primary/10">
                <div className="max-w-7xl mx-auto px-6 h-20 md:h-24 flex items-center justify-between">
                    <Link href="/">
                        <img src="/logo.png" alt="Quizzou Logo" className="h-16 md:h-20 w-auto object-contain" />
                    </Link>
                    <Link href="/" className="text-sm font-black uppercase text-primary border-2 border-primary px-6 py-2 rounded-xl hover:bg-primary hover:text-white transition-all">
                        Retour
                    </Link>
                </div>
            </header>

            <main className="pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
                            Des outils puissants pour <span className="text-primary italic">exceller</span>.
                        </h1>
                        <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
                            Quizzou utilise les dernières avancées en Intelligence Artificielle pour vous offrir une expérience d'étude révolutionnaire.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                        {features.map((feature, idx) => (
                            <div
                                key={idx}
                                className={`group p-8 md:p-12 rounded-[2.5rem] bg-white border-2 border-slate-100 hover:border-primary transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(230,55,70,0.15)] flex flex-col md:flex-row gap-8 items-start transition-all duration-700 delay-[${idx * 150}ms] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
                            >
                                <div className={`w-20 h-20 shrink-0 ${feature.color} text-white rounded-3xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                                    <span className="material-symbols-outlined text-4xl">{feature.icon}</span>
                                </div>
                                <div>
                                    <h3 className="text-2xl md:text-3xl font-black mb-4 group-hover:text-primary transition-colors">{feature.title}</h3>
                                    <p className="text-lg text-slate-600 font-medium leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={`mt-24 text-center transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                        <div className="bg-primary p-12 md:p-20 rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
                            <div className="relative z-10">
                                <h2 className="text-4xl md:text-5xl font-black mb-8">Convaincu ?</h2>
                                <p className="text-xl mb-12 max-w-xl mx-auto font-medium text-white/90 leading-relaxed">
                                    Commencez dès aujourd'hui à optimiser votre temps et votre mémorisation.
                                </p>
                                <Link href="/" className="inline-block bg-white text-primary px-12 py-5 rounded-2xl font-black text-xl uppercase tracking-wider hover:scale-105 transition-transform shadow-xl">
                                    Démarrer gratuitement
                                </Link>
                            </div>
                            <span className="material-symbols-outlined absolute -bottom-10 -right-10 text-[250px] text-white/10 rotate-12 pointer-events-none">auto_awesome</span>
                            <span className="material-symbols-outlined absolute -top-10 -left-10 text-[200px] text-white/10 -rotate-12 pointer-events-none">psychology</span>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="py-12 border-t-2 border-slate-100 text-center font-bold text-slate-400">
                <p>© 2026 Xcompany all right reserved.</p>
            </footer>
        </div>
    );
}
