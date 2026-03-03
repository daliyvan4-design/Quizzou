"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, query, getDocs, where } from "firebase/firestore";
import { firestore, app } from "@/lib/firebase/config";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';

export default function StatisticsPage() {
    const [stats, setStats] = useState<any>([]);
    const [totalQuizzes, setTotalQuizzes] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuizzes = async (uid: string) => {
            try {
                const q = query(
                    collection(firestore, "quizzes"),
                    where("userId", "==", uid)
                );
                const querySnapshot = await getDocs(q);

                let quizCount = 0;
                let questionsCount = 0;
                const daysMap: Record<string, number> = {};

                // Initialiser les 7 derniers jours à 0
                for (let i = 6; i >= 0; i--) {
                    const d = new Date();
                    d.setDate(d.getDate() - i);
                    const dayName = d.toLocaleDateString('fr-FR', { weekday: 'short' });
                    daysMap[dayName] = 0;
                }

                querySnapshot.forEach((doc) => {
                    quizCount++;
                    const data = doc.data();
                    if (data.questions) questionsCount += data.questions.length;

                    if (data.createdAt) {
                        const date = new Date(data.createdAt);
                        const dayName = date.toLocaleDateString('fr-FR', { weekday: 'short' });
                        if (daysMap[dayName] !== undefined) {
                            daysMap[dayName] += 1;
                        }
                    }
                });

                const formattedStats = Object.keys(daysMap).map(key => ({
                    name: key,
                    quizzes: daysMap[key]
                }));

                setTotalQuizzes(quizCount);
                setTotalQuestions(questionsCount);
                setStats(formattedStats);
            } catch (e) {
                console.error("Error fetching stats:", e);
            } finally {
                setLoading(false);
            }
        };

        const auth = getAuth(app);
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchQuizzes(user.uid);
            } else {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto px-6 py-20 flex flex-col items-center justify-center">
                <span className="material-symbols-outlined text-6xl text-primary animate-spin mb-4">progress_activity</span>
                <p className="font-bold text-lg text-slate-500">Calcul en cours...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-6 md:px-8 py-8 md:py-10 bg-white min-h-[80vh]">
            <h1 className="text-3xl font-black text-black mb-8 flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-4xl">monitoring</span>
                Vos Statistiques
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-primary/5 border-2 border-primary/20 p-6 rounded-2xl flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 font-bold text-sm uppercase tracking-wider mb-1">Quiz Générés</p>
                        <p className="text-4xl font-black text-primary">{totalQuizzes}</p>
                    </div>
                    <span className="material-symbols-outlined text-5xl text-primary/30">library_books</span>
                </div>
                <div className="bg-primary/5 border-2 border-primary/20 p-6 rounded-2xl flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 font-bold text-sm uppercase tracking-wider mb-1">Questions</p>
                        <p className="text-4xl font-black text-primary">{totalQuestions}</p>
                    </div>
                    <span className="material-symbols-outlined text-5xl text-primary/30">psychology_alt</span>
                </div>
                <div className="bg-primary border-2 border-primary p-6 rounded-2xl flex items-center justify-between text-white">
                    <div>
                        <p className="text-white/80 font-bold text-sm uppercase tracking-wider mb-1">Assiduité</p>
                        <p className="text-4xl font-black">{totalQuizzes > 0 ? "Top 10%" : "À débuter"}</p>
                    </div>
                    <span className="material-symbols-outlined text-5xl text-white/50">local_fire_department</span>
                </div>
            </div>

            <div className="bg-white border-2 border-slate-100 p-6 md:p-8 rounded-3xl shadow-sm">
                <h3 className="font-black text-xl mb-6">Activité des 7 derniers jours</h3>
                <div className="h-64 md:h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={stats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorQuizzes" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#e63746" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#e63746" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontWeight: 'bold' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontWeight: 'bold' }} allowDecimals={false} />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: '2px solid #e63746', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            <Area type="monotone" dataKey="quizzes" stroke="#e63746" strokeWidth={4} fillOpacity={1} fill="url(#colorQuizzes)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="mt-8">
                <Link href="/dashboard" className="text-primary font-bold hover:underline">
                    ← Revenir au tableau de bord
                </Link>
            </div>
        </div>
    );
}
