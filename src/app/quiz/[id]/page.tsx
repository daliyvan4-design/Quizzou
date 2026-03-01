"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebase/config";
import confetti from "canvas-confetti";

interface Question {
    tag: string;
    text: string;
    options: string[];
    correctIndex: number;
    explanation: string;
}

interface QuizData {
    title: string;
    questions: Question[];
}

export default function QuizPage() {
    const [quizData, setQuizData] = useState<QuizData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);

    const router = useRouter();
    const params = useParams<{ id: string }>();

    useEffect(() => {
        const fetchQuiz = async () => {
            if (!params.id) return;
            try {
                const docRef = doc(firestore, "quizzes", params.id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setQuizData(docSnap.data() as QuizData);
                } else {
                    setError("Quiz introuvable.");
                }
            } catch (err: any) {
                console.error("Erreur de chargement du Quiz:", err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchQuiz();
    }, [params.id]);

    if (isLoading) {
        return (
            <div className="bg-white text-black min-h-screen flex flex-col items-center justify-center p-6 text-center">
                <span className="material-symbols-outlined text-primary text-6xl animate-spin mb-4">progress_activity</span>
                <h1 className="text-2xl font-bold tracking-tight text-primary">Chargement de votre Quiz...</h1>
            </div>
        );
    }

    if (error || !quizData || !quizData.questions || quizData.questions.length === 0) {
        return (
            <div className="bg-white text-black min-h-screen flex flex-col items-center justify-center p-6 text-center">
                <span className="material-symbols-outlined text-primary text-6xl mb-4">error</span>
                <h1 className="text-2xl font-bold text-black mb-4">Une erreur est survenue</h1>
                <p className="text-lg text-slate-500 max-w-md mx-auto">{error || "Aucune question trouvée dans ce quiz."}</p>
                <Link href="/dashboard" className="mt-8 bg-primary text-white border-2 border-primary px-6 py-3 rounded-lg font-bold hover:bg-white hover:text-primary transition-colors">Retour au Tableau de bord</Link>
            </div>
        );
    }

    const currentQuestion = quizData.questions[currentQuestionIdx];
    const totalQuestions = quizData.questions.length;

    const handleSelectOption = (index: number) => {
        if (isAnswerRevealed) return;
        setSelectedOption(index);
        setIsAnswerRevealed(true);
        if (index === currentQuestion.correctIndex) {
            setScore((prev) => prev + 1);
        }
    };

    const handleNext = () => {
        if (currentQuestionIdx < totalQuestions - 1) {
            setCurrentQuestionIdx(currentQuestionIdx + 1);
            setSelectedOption(null);
            setIsAnswerRevealed(false);
        } else {
            setIsFinished(true);
            const ratio = score / totalQuestions;
            // Un minimum de 50 confettis, et jusqu'à 400 si on fait un sans-faute
            const particleCount = Math.max(50, Math.floor(ratio * 400));
            confetti({
                particleCount,
                spread: 100,
                origin: { y: 0.6 },
                colors: ['#5964f4', '#a855f7', '#ec4899', '#facc15']
            });
        }
    };

    if (isFinished) {
        return (
            <div className="bg-white font-display text-black min-h-screen flex flex-col items-center justify-center p-6 text-center">
                <span className="material-symbols-outlined text-primary text-[80px] md:text-[100px] mb-4">social_leaderboard</span>
                <h1 className="text-3xl md:text-5xl font-black text-black mb-2">Quiz Terminé !</h1>
                <p className="text-lg md:text-xl text-slate-500 mb-8 max-w-md">Vous avez complété ce module. Voici votre résultat final :</p>
                <div className="bg-slate-50 border-2 border-slate-200 p-8 md:p-10 rounded-3xl w-full max-w-sm mb-8 shadow-sm">
                    <span className="block text-slate-400 font-bold uppercase tracking-widest text-sm mb-4">Votre Score</span>
                    <span className="text-6xl md:text-8xl font-black text-primary">{score} <span className="text-3xl md:text-5xl text-slate-300">/ {totalQuestions}</span></span>
                </div>
                <Link href="/dashboard" className="bg-primary text-white border-2 border-primary px-8 py-4 rounded-xl text-sm md:text-base font-black uppercase hover:bg-white hover:text-primary shadow-lg transition-transform hover:scale-105 flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined">dashboard</span>
                    Retour au Tableau de bord
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white font-display text-black min-h-screen flex flex-col pt-16 md:pt-20">
            {/* Progress Header */}
            <nav className="fixed top-0 left-0 w-full z-50 bg-white border-b-2 border-primary">
                <div className="h-1.5 w-full bg-slate-100">
                    <div className="h-full bg-primary transition-all duration-500" style={{ width: `${((currentQuestionIdx + 1) / totalQuestions) * 100}%` }}></div>
                </div>
                <div className="max-w-5xl mx-auto px-4 md:px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-0">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">school</span>
                        <span className="font-bold tracking-tight text-primary text-sm md:text-base">{quizData.title}</span>
                    </div>
                    <div className="flex w-full md:w-auto items-center justify-between md:justify-end gap-4">
                        <span className="text-xs md:text-sm font-black text-black uppercase tracking-widest">
                            Question {currentQuestionIdx + 1} / {totalQuestions}
                        </span>
                        <Link href="/dashboard" className="flex items-center justify-center p-2 rounded-full border-2 border-transparent hover:border-primary transition-colors text-primary" title="Quitter">
                            <span className="material-symbols-outlined text-xl">close</span>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-start md:justify-center p-4 md:p-6 w-full max-w-3xl mx-auto">
                <div className="w-full space-y-6 md:space-y-8">

                    {/* Question Card */}
                    <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-12 shadow-[0_0_15px_rgba(0,0,0,0.05)] border-2 border-primary text-center transition-all">
                        <div className="mb-4 md:mb-6">
                            <span className="px-3 py-1 rounded-full bg-primary text-white text-[10px] md:text-xs font-black uppercase tracking-wider">
                                {currentQuestion.tag || "Concept Clé"}
                            </span>
                        </div>
                        <h1 className="text-xl md:text-3xl lg:text-4xl font-black leading-tight text-black">
                            {currentQuestion.text}
                        </h1>
                    </div>

                    {/* Options Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                        {currentQuestion.options.map((option, idx) => {
                            const isSelected = selectedOption === idx;
                            const isCorrect = idx === currentQuestion.correctIndex;
                            let btnClass = "group relative flex items-center justify-center p-4 md:p-6 rounded-xl md:rounded-2xl transition-all shadow-sm border-2 text-left ";
                            let iconContent = null;
                            let textClass = "text-base md:text-lg font-bold transition-colors w-full pr-8 ";

                            if (!isAnswerRevealed) {
                                btnClass += "bg-white border-slate-200 hover:border-primary cursor-pointer hover:shadow-md";
                                textClass += "text-black group-hover:text-primary";
                                iconContent = <span className="material-symbols-outlined text-primary opacity-0 group-hover:opacity-100 transition-opacity">chevron_right</span>;
                            } else {
                                if (isCorrect) {
                                    btnClass += "bg-primary border-primary text-white shadow-md transform scale-[1.02] z-10";
                                    textClass += "text-white";
                                    iconContent = <span className="material-symbols-outlined text-white">check_circle</span>;
                                } else if (isSelected && !isCorrect) {
                                    btnClass += "bg-white border-red-500 opacity-80";
                                    textClass += "text-red-600 line-through";
                                    iconContent = <span className="material-symbols-outlined text-red-500">cancel</span>;
                                } else {
                                    btnClass += "bg-white border-slate-100 opacity-60 cursor-not-allowed";
                                    textClass += "text-slate-400";
                                }
                            }

                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleSelectOption(idx)}
                                    disabled={isAnswerRevealed}
                                    className={btnClass}
                                >
                                    <span className={textClass}>{option}</span>
                                    <div className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2">
                                        {iconContent}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Explanation Block (Appears after answer) */}
                    <div className={`p-6 md:p-8 bg-white rounded-2xl md:rounded-3xl border-2 border-primary space-y-4 shadow-md transition-all duration-500 ${isAnswerRevealed ? 'opacity-100 translate-y-0 relative' : 'opacity-0 translate-y-4 pointer-events-none hidden absolute -z-10'}`}>
                        <div className="flex items-center gap-2 text-primary border-b-2 border-primary/20 pb-3 mb-3">
                            <span className="material-symbols-outlined text-2xl">lightbulb</span>
                            <h3 className="font-black text-lg md:text-xl uppercase tracking-wider">Explication</h3>
                        </div>
                        <p className="text-black font-medium leading-relaxed text-sm md:text-lg" dangerouslySetInnerHTML={{ __html: currentQuestion.explanation || "Pas d'explication fournie." }} />

                        <div className="pt-6 flex justify-end">
                            <button onClick={handleNext} className="flex items-center justify-center w-full sm:w-auto gap-2 px-8 py-3 md:py-4 bg-primary text-white border-2 border-primary rounded-xl font-black uppercase text-sm md:text-base hover:bg-white hover:text-primary transition-colors shadow-sm">
                                <span>{currentQuestionIdx < totalQuestions - 1 ? "Question Suivante" : "Terminer le Quiz"}</span>
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </button>
                        </div>
                    </div>

                </div>
            </main>

            {/* Footer Decoration */}
            <footer className="hidden md:flex p-6 justify-center opacity-70 mt-auto border-t-2 border-slate-100">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-black">
                        <span className="px-2 py-1 rounded bg-slate-100 border border-slate-200">Entrée</span>
                        <span>Valider la réponse</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
