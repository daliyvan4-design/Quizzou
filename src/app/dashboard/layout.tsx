"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { app } from "@/lib/firebase/config";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isHealing, setIsHealing] = useState(false);
    const [isAuthSlow, setIsAuthSlow] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const auth = getAuth(app);

        let redirectTimeout: NodeJS.Timeout;
        let slowAuthTimeout: NodeJS.Timeout;

        const createSession = async (firebaseUser: any) => {
            setIsHealing(true);
            try {
                const idToken = await firebaseUser.getIdToken();
                await fetch("/api/auth/session", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ idToken }),
                });
                console.log("Session healed/synced from dashboard.");
            } catch (err) {
                console.error("Dashboard session sync error", err);
            } finally {
                setIsHealing(false);
            }
        };

        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                setIsAuthSlow(false);
                if (redirectTimeout) clearTimeout(redirectTimeout);
                if (slowAuthTimeout) clearTimeout(slowAuthTimeout);

                // Session Bridging / Rescue
                const hasAuthHint = typeof document !== 'undefined' && document.cookie.includes('auth_hint=true');
                if (!hasAuthHint) {
                    console.log("Dashboard: No auth hint found, healing session...");
                    await createSession(currentUser);
                }
            } else {
                // Patience logic for mobile
                slowAuthTimeout = setTimeout(() => {
                    setIsAuthSlow(true);
                }, 4000);

                const hasAuthHint = typeof document !== 'undefined' && document.cookie.includes('auth_hint=true');
                if (!hasAuthHint) {
                    redirectTimeout = setTimeout(() => {
                        console.log("No user detected after 12s, redirecting.");
                        window.location.href = "/";
                    }, 12000);
                }
            }
        });
        return () => {
            unsubscribe();
            if (redirectTimeout) clearTimeout(redirectTimeout);
            if (slowAuthTimeout) clearTimeout(slowAuthTimeout);
        };
    }, []);

    const handleSignOut = async () => {
        try {
            const auth = getAuth(app);
            await signOut(auth);
            // On appelle l'API pour supprimer le cookie HTTPOnly de session serveur
            await fetch("/api/auth/signout", { method: "POST" });
            window.location.href = "/";
        } catch (error) {
            console.error("Erreur de déconnexion", error);
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-white text-black">
            {/* Authentication Recovery Overlay */}
            {(isAuthSlow || isHealing) && (
                <div className="fixed inset-0 z-[100] bg-white/90 backdrop-blur-md flex flex-col items-center justify-center gap-6 p-8 text-center animate-fade-in">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-primary/20 rounded-full"></div>
                        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <div className="flex flex-col gap-2 max-w-sm">
                        <h2 className="text-2xl font-black text-black">
                            {isHealing ? "Connexion sécurisée..." : "Récupération de session..."}
                        </h2>
                        <p className="text-primary font-bold animate-pulse text-sm uppercase tracking-widest">
                            {isHealing ? "Synchronisation avec le serveur" : "Connexion à vos données"}
                        </p>
                        <p className="text-black/50 text-xs mt-4">
                            Les navigateurs mobiles (Safari) peuvent ralentir la connexion. Patientez quelques secondes.
                        </p>
                    </div>
                </div>
            )}

            {/* Mobile Header (Hamburger) */}
            <div className="md:hidden fixed top-0 w-full bg-white border-b-2 border-primary z-50 flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                    <img src="/logo.png" alt="Quizzou Logo" className="h-10 w-auto object-contain" />
                </div>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-primary hover:text-black">
                    <span className="material-symbols-outlined text-3xl">menu</span>
                </button>
            </div>

            {/* Sidebar Navigation */}
            <aside className={`${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:relative z-40 w-64 h-full border-r-2 border-primary bg-white flex flex-col transition-transform duration-300 pt-20 md:pt-0`}>
                <div className="hidden md:flex p-6 items-center justify-center border-b-2 border-primary">
                    <img src="/logo.png" alt="Quizzou Logo" className="h-14 w-auto object-contain" />
                </div>

                <nav className="flex-1 px-4 space-y-3 mt-6">
                    <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary text-white font-bold shadow-md shadow-primary/20 hover:scale-105 transition-transform">
                        <span className="material-symbols-outlined">dashboard</span>
                        <span>Tableau de bord</span>
                    </Link>
                    <Link href="/dashboard/statistics" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-black font-bold border-2 border-transparent hover:border-primary transition-colors hover:text-primary">
                        <span className="material-symbols-outlined text-primary">analytics</span>
                        <span>Statistiques</span>
                    </Link>
                    <Link href="/dashboard/quiz-flash" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-black font-bold border-2 border-transparent hover:border-primary transition-colors hover:text-primary">
                        <span className="material-symbols-outlined text-primary">quiz</span>
                        <span>Quiz Flash</span>
                    </Link>
                </nav>

                <div className="p-4 mt-auto border-t-2 border-primary">

                    <div className="mt-6 flex items-center gap-3 px-2">
                        <img
                            className="w-10 h-10 rounded-full border-2 border-primary object-cover bg-slate-100"
                            alt="Photo de profil utilisateur"
                            src={user?.photoURL || "https://api.dicebear.com/9.x/initials/svg?seed=" + (user?.displayName || 'User')}
                        />
                        <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                            <p className="text-sm font-black text-black text-ellipsis overflow-hidden">{user?.displayName || 'Utilisateur'}</p>
                            <Link href="/dashboard/admin" className="text-xs font-bold text-primary hover:underline">Étudiant</Link>
                        </div>
                        <button onClick={handleSignOut} className="text-primary hover:text-black transition-colors" title="Déconnexion">
                            <span className="material-symbols-outlined text-2xl">logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile overlay */}
            {
                isMobileMenuOpen && (
                    <div onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"></div>
                )
            }

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto bg-white scroll-smooth w-full pt-16 md:pt-0">
                {/* Top Header */}
                <header className="sticky top-0 z-10 glass-header px-6 md:px-8 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-black text-black">Bonjour {user?.displayName?.split(' ')[0] || ''}, prêt à étudier ?</h2>
                        <p className="text-primary font-bold text-sm">Transformez vos documents en sessions d'étude intelligentes.</p>
                    </div>
                    <div className="flex w-full md:w-auto items-center gap-4">
                        <div className="relative w-full md:w-64">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary font-bold">search</span>
                            <input
                                className="w-full pl-10 pr-4 py-2 bg-white border-2 border-primary rounded-xl focus:ring-0 focus:outline-none focus:border-black text-black text-sm font-medium placeholder:text-black/50"
                                placeholder="Rechercher un document..."
                                type="text"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    if (e.target.value) router.replace('/dashboard?q=' + e.target.value);
                                    else router.replace('/dashboard');
                                }}
                            />
                        </div>
                    </div>
                </header>

                <div className="relative z-0">
                    {children}
                </div>
            </main>
        </div >
    );
}
