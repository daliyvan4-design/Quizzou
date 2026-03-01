"use client";

import Link from "next/link";
import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { firestore } from "@/lib/firebase/config";

interface RecentQuiz {
    id: string;
    title: string;
    createdAt: number | Date;
}

export default function DashboardPage() {
    return (
        <Suspense fallback={<div>Chargement...</div>}>
            <DashboardContent />
        </Suspense>
    );
}

function DashboardContent() {
    const [isHovering, setIsHovering] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [recentQuizzes, setRecentQuizzes] = useState<RecentQuiz[]>([]);
    const [loadingQuizzes, setLoadingQuizzes] = useState(true);
    const router = useRouter();
    const searchParams = useSearchParams();
    const filterQuery = searchParams.get('q')?.toLowerCase() || "";

    useEffect(() => {
        const fetchRecentQuizzes = async () => {
            try {
                const q = query(collection(firestore, "quizzes"), orderBy("createdAt", "desc"), limit(6));
                const querySnapshot = await getDocs(q);
                const quizzes: RecentQuiz[] = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    quizzes.push({
                        id: doc.id,
                        title: data.title || "Quiz Sans Titre",
                        createdAt: data.createdAt ? new Date(data.createdAt).getTime() : Date.now(),
                    });
                });
                setRecentQuizzes(quizzes);
            } catch (e) {
                console.error("Erreur de chargement des récents:", e);
            } finally {
                setLoadingQuizzes(false);
            }
        };
        fetchRecentQuizzes();
    }, []);

    const handleDrop = async (e: any) => {
        e.preventDefault();
        setIsHovering(false);
        setErrorMsg("");

        const file = e.dataTransfer?.files?.[0];
        if (!file) return;

        await processFile(file);
    };

    const handleFileSelect = async (e: any) => {
        setErrorMsg("");
        const file = e.target.files?.[0];
        if (!file) return;
        await processFile(file);
    };

    const processFile = async (file: File) => {
        setIsProcessing(true);
        // On redirige d'abord vers la page processing (visuel) avec un id temporaire
        // router.push("/processing/doc-1234");
        // Mais idéalement, on le traite ici et on redirige vers /quiz/[id]

        const formData = new FormData();
        formData.append("document", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();

            if (res.ok && data.quizId) {
                router.push(`/quiz/${data.quizId}`);
            } else {
                setErrorMsg(data.error || "Une erreur est survenue lors de l'analyse.");
                setIsProcessing(false);
            }
        } catch (error) {
            console.error("Upload failed", error);
            setErrorMsg("Impossible de joindre le serveur.");
            setIsProcessing(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-6 md:px-8 py-8 md:py-10 bg-white">
            {/* Drag and Drop Section */}
            <section className="mb-12">
                <div className="relative group">
                    {isProcessing ? (
                        <div className="relative bg-white rounded-3xl border-4 border-dashed border-primary/50 p-8 md:p-12 flex flex-col items-center text-center shadow-md">
                            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                                <span className="material-symbols-outlined text-4xl text-primary animate-spin">sync</span>
                            </div>
                            <h3 className="text-xl md:text-2xl font-black text-black mb-2">Analyse en cours...</h3>
                            <p className="text-black font-medium mb-8 max-w-md">L'IA Gemini Pro lit votre document et extrait les concepts clés pour générer un quiz interactif.</p>
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-primary rounded-full w-2/3 animate-pulse"></div>
                            </div>
                        </div>
                    ) : (
                        <div
                            className={`relative bg-white rounded-3xl border-4 border-dashed ${isHovering ? 'border-primary bg-primary/5' : 'border-primary/50'} p-8 md:p-12 flex flex-col items-center text-center cursor-pointer transition-all shadow-md`}
                            onDragOver={(e) => { e.preventDefault(); setIsHovering(true); }}
                            onDragLeave={(e) => { e.preventDefault(); setIsHovering(false); }}
                            onDrop={handleDrop}
                        >
                            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mb-6 shadow-inner">
                                <span className="material-symbols-outlined text-4xl text-white animate-bounce">cloud_upload</span>
                            </div>
                            <h3 className="text-xl md:text-2xl font-black text-black mb-2">Déposez votre document ici</h3>
                            <p className="text-black font-medium mb-4 max-w-md">Format PDF, DOCX supportés. Notre IA analysera le contenu pour générer votre session d'étude personnalisée.</p>

                            {errorMsg && (
                                <p className="text-red-500 font-bold mb-4 bg-red-50 px-4 py-2 rounded-lg border border-red-200">{errorMsg}</p>
                            )}

                            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto relative">
                                <label className="w-full sm:w-auto text-center bg-primary hover:bg-white text-white hover:text-primary border-2 border-primary px-8 py-3 rounded-xl font-black transition-colors shadow-sm cursor-pointer">
                                    Parcourir les fichiers
                                    <input type="file" className="hidden" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={handleFileSelect} />
                                </label>
                                <button className="w-full sm:w-auto text-center bg-white border-2 border-primary text-primary px-8 py-3 rounded-xl font-black transition-colors hover:bg-primary hover:text-white shadow-sm">
                                    Lien URL
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Recent Documents Section */}
            <section>
                <div className="flex items-center justify-between mb-6 border-b-2 border-primary pb-2">
                    <h3 className="text-xl md:text-2xl font-black text-black flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary font-bold">history</span>
                        Documents Récents
                    </h3>
                    <Link className="text-primary font-black text-sm uppercase hover:underline" href="#">Voir tout</Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loadingQuizzes ? (
                        <div className="col-span-full py-10 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
                            <span className="material-symbols-outlined text-4xl animate-spin mb-2 text-primary">progress_activity</span>
                            <p className="font-bold">Chargement de votre bibliothèque...</p>
                        </div>
                    ) : recentQuizzes.length === 0 ? (
                        <div className="col-span-full py-10 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400">
                            <span className="material-symbols-outlined text-4xl mb-2 text-primary">history_toggle_off</span>
                            <p className="font-bold">Vous n'avez pas encore de quiz.</p>
                            <p className="text-sm">Uploadez votre premier document ci-dessus !</p>
                        </div>
                    ) : (
                        recentQuizzes.filter(q => q.title.toLowerCase().includes(filterQuery)).map((quiz: RecentQuiz, idx: number) => {
                            const fakeProgress = [0, 25, 50, 75, 100][idx % 5];
                            const dateStr = new Date(quiz.createdAt).toLocaleDateString("fr-FR", { day: 'numeric', month: 'short', year: 'numeric' });

                            return (
                                <Link key={quiz.id} href={`/quiz/${quiz.id}`} className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-[0_0_15px_rgba(0,0,0,0.05)] transition-shadow group border-2 border-primary block cursor-pointer">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center border-2 border-primary shadow-sm">
                                            <span className="material-symbols-outlined text-3xl">description</span>
                                        </div>
                                        <div className="relative w-16 h-16">
                                            <svg className="w-full h-full" viewBox="0 0 36 36">
                                                <path className="stroke-slate-100 fill-none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" strokeWidth="3"></path>
                                                <path className="stroke-primary fill-none transition-all duration-300" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" strokeDasharray={`${fakeProgress}, 100`} strokeLinecap="round" strokeWidth="3"></path>
                                                <text className="text-[8px] font-black fill-black" textAnchor="middle" x="18" y="20.35">{fakeProgress}%</text>
                                            </svg>
                                        </div>
                                    </div>
                                    <h4 className="font-black text-lg text-black mb-1 group-hover:text-primary transition-colors line-clamp-1" title={quiz.title}>{quiz.title}</h4>
                                    <p className="text-black/60 font-medium text-xs mb-4">Créé le {dateStr}</p>
                                    <div className="flex items-center justify-between pt-4 border-t-2 border-primary/10">
                                        <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${fakeProgress === 100 ? 'bg-primary text-white' : 'bg-slate-100 text-primary border border-slate-200'}`}>
                                            {fakeProgress === 100 ? 'Maîtrisé' : 'En cours'}
                                        </span>
                                        <button className="text-primary hover:text-black hover:scale-110 transition-transform">
                                            <span className="material-symbols-outlined font-bold">play_arrow</span>
                                        </button>
                                    </div>
                                </Link>
                            );
                        })
                    )}
                </div>
            </section>

            {/* Quick Actions Section */}
            <section className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white">
                <div className="bg-white border-2 border-primary rounded-2xl p-6 md:p-8 text-black shadow-md overflow-hidden relative">
                    <div className="relative z-10 w-full flex flex-col items-start gap-3">
                        <h4 className="text-xl font-black mb-1">Prêt pour un test ?</h4>
                        <p className="font-medium text-sm mb-2 max-w-sm">Générez un quiz basé sur vos documents récents pour valider vos acquis.</p>
                        <button
                            onClick={() => recentQuizzes[0] && router.push(`/quiz/${recentQuizzes[0].id}`)}
                            className="bg-primary text-white hover:bg-white hover:text-primary px-6 py-3 rounded-xl border-2 border-primary font-black text-sm uppercase self-stretch transition-colors"
                        >
                            Lancer un Quiz
                        </button>
                    </div>
                    <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-9xl text-primary/10 rotate-12 pointer-events-none">assignment_turned_in</span>
                </div>

                <div className="bg-primary border-2 border-primary rounded-2xl p-6 md:p-8 text-white shadow-md overflow-hidden relative">
                    <div className="relative z-10 w-full flex flex-col items-start gap-3">
                        <h4 className="text-xl font-black mb-1 text-white">Résumé IA</h4>
                        <p className="font-medium text-sm mb-2 max-w-sm text-white">
                            Obtenez un résumé concis des points clés de l'ensemble de {recentQuizzes.length > 0 ? "votre contenu : " + recentQuizzes[0].title : "vos documents"}.
                        </p>
                        <button
                            onClick={() => recentQuizzes[0] && router.push(`/dashboard/summary/${recentQuizzes[0].id}`)}
                            className="bg-white text-primary hover:bg-transparent hover:text-white px-6 py-3 rounded-xl border-2 border-white font-black text-sm uppercase self-stretch transition-colors shadow-lg"
                        >
                            Générer le résumé
                        </button>
                    </div>
                    <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-9xl text-white/20 -rotate-12 pointer-events-none">auto_awesome</span>
                </div>
            </section>
        </div>
    );
}
