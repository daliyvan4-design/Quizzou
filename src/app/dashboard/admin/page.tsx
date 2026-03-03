"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface UserInfo {
    email: string;
    name: string;
    createdAt: string;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<UserInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch('/api/admin/users');
                const data = await res.json();

                if (res.ok && data.users) {
                    setUsers(data.users);
                } else {
                    throw new Error(data.error || "Erreur de chargement");
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="max-w-6xl mx-auto px-6 md:px-8 py-8 md:py-10 bg-white min-h-[80vh]">
            <div className="flex flex-col md:flex-row items-center justify-between mb-8">
                <h1 className="text-3xl font-black text-black flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-4xl">admin_panel_settings</span>
                    Administration
                </h1>
                <div className="bg-primary/5 text-primary font-bold px-4 py-2 rounded-xl text-sm border border-primary/20">
                    Total: {users.length} Utilisateurs
                </div>
            </div>

            <p className="text-slate-500 mb-8 font-medium">Liste de l'ensemble des adresses mail enregistrées sur la plateforme.</p>

            {error && (
                <div className="bg-red-50 text-red-500 p-4 rounded-xl border border-red-200 mb-6 font-bold">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="flex flex-col items-center justify-center p-20 gap-4">
                    <span className="material-symbols-outlined text-4xl animate-spin text-primary">progress_activity</span>
                    <span className="font-bold text-slate-400">Récupération de la base de données...</span>
                </div>
            ) : (
                <div className="bg-white border-2 border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b-2 border-slate-100">
                                    <th className="p-4 font-black text-sm text-slate-500 uppercase">Nom Complet</th>
                                    <th className="p-4 font-black text-sm text-slate-500 uppercase">Adresse Mail</th>
                                    <th className="p-4 font-black text-sm text-slate-500 uppercase">Date d'inscription</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u, i) => (
                                    <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                        <td className="p-4 font-bold text-black flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-black uppercase">
                                                {u.name.charAt(0)}
                                            </div>
                                            {u.name}
                                        </td>
                                        <td className="p-4 text-slate-600 font-medium">{u.email}</td>
                                        <td className="p-4 text-primary text-sm font-bold">
                                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString("fr-FR", { year: 'numeric', month: 'long', day: 'numeric' }) : "Inconnue"}
                                        </td>
                                    </tr>
                                ))}
                                {users.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="p-8 text-center text-slate-400 font-medium">
                                            Aucun utilisateur trouvé.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
