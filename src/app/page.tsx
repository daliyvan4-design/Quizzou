"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithPopup, signInWithRedirect, getRedirectResult, browserPopupRedirectResolver, onAuthStateChanged } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase/config";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);

  const logDebug = (msg: string) => {
    console.log(`[DEBUG] ${msg}`);
    setDebugLogs(prev => [...prev.slice(-9), `${new Date().toLocaleTimeString()} - ${msg}`]);
  };

  const createSession = async (user: any) => {
    try {
      logDebug("Création session pour: " + user.email);
      const idToken = await user.getIdToken();
      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (res.ok) {
        logDebug("Session créée ! Redirection...");
        window.location.href = "/dashboard";
      } else {
        const errorData = await res.json();
        console.error("Session creation failed", errorData);
        alert(`Erreur création session: ${errorData.error || "Inconnue"}`);
        setIsLoggingIn(false);
      }
    } catch (err) {
      console.error("Session Error", err);
      setIsLoggingIn(false);
    }
  };

  useEffect(() => {
    // Detect In-App browsers (Instagram, Facebook, etc.)
    const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
    const isFacebook = ua.indexOf("FBAN") > -1 || ua.indexOf("FBAV") > -1;
    const isInstagram = ua.indexOf("Instagram") > -1;
    const isThreads = ua.indexOf("Threads") > -1;
    if (isFacebook || isInstagram || isThreads) {
      setIsInAppBrowser(true);
    }

    // Check if we have an auth_hint cookie
    const hasAuthHint = typeof document !== 'undefined' && document.cookie.includes('auth_hint=true');

    // Persistence listener: bridge Firebase auth with server session
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        logDebug("Auth détecté: " + user.email);

        // If we have a Firebase user but NO auth_hint cookie, bridge the session!
        if (!hasAuthHint && !isLoggingIn) {
          logDebug("Pontage de session auto...");
          setIsLoggingIn(true);
          await createSession(user);
        } else if (hasAuthHint) {
          logDebug("Hint trouvé, redirection forcée...");
          setTimeout(() => {
            window.location.replace("/dashboard");
          }, 800);
        }
      } else {
        logDebug("Aucun utilisateur Firebase détecté.");
        if (hasAuthHint) {
          logDebug("Nettoyage hint expiré.");
          document.cookie = "auth_hint=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        }
      }
    });

    const handleRedirect = async () => {
      try {
        console.log("Checking for redirect result...");
        const result = await getRedirectResult(auth);
        if (result?.user) {
          console.log("Redirect result found user:", result.user.email);
          setIsLoggingIn(true);
          await createSession(result.user);
        }
      } catch (error: any) {
        console.error("Error with redirect login:", error);
        if (error.code !== "auth/popup-closed-by-user") {
          alert("Erreur de redirection: " + error.message);
          setIsLoggingIn(false);
        }
      }
    };

    handleRedirect();
    return () => unsubscribe();
  }, [isLoggingIn]);

  const handleLogin = async () => {
    try {
      setIsLoggingIn(true);
      logDebug("Début du flux de connexion...");
      const apiKey = auth.app.options.apiKey;

      if (!apiKey || apiKey.includes("Placeholder")) {
        alert("⚠️ Erreur de configuration : Le site utilise une clé de secours.");
        setIsLoggingIn(false);
        return;
      }

      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      try {
        logDebug("Tentative de Popup...");
        const result = await signInWithPopup(auth, googleProvider, browserPopupRedirectResolver);
        logDebug("Succès Popup !");
        await createSession(result.user);
      } catch (popupError: any) {
        logDebug("Popup échoué ou bloqué: " + (popupError.code || "erreur unknown"));
        if (popupError.code === "auth/popup-blocked" || isMobile || popupError.code === "auth/cancelled-popup-request" || popupError.code === "auth/popup-closed-by-user") {
          logDebug("Fallback vers Redirect...");
          await signInWithRedirect(auth, googleProvider);
        } else {
          throw popupError;
        }
      }
    } catch (error: any) {
      logDebug("Erreur Finale: " + error.code);
      if (error?.code === "auth/unauthorized-domain") {
        const currentDomain = typeof window !== "undefined" ? window.location.hostname : "Inconnu";
        alert(`Erreur de domaine non autorisé.\n\n👉 Allez dans Firebase > Authentication > Settings > Authorized Domains et ajoutez : \n${currentDomain}`);
      } else if (error?.code !== "auth/popup-closed-by-user" && error?.code !== "auth/cancelled-popup-request") {
        alert(`Erreur de connexion: ${error?.message || "Une erreur inconnue est survenue."}`);
      }
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-white text-black">
      {/* Page Loader */}
      {isLoggingIn && (
        <div className="fixed inset-0 z-[100] bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="font-black text-primary animate-pulse tracking-widest uppercase text-sm">Quizzou vous connecte...</p>
        </div>
      )}

      {/* In-App Browser Warning */}
      {isInAppBrowser && (
        <div className="fixed top-0 left-0 w-full z-[110] bg-amber-500 text-white px-6 py-4 flex flex-col items-center justify-center text-center gap-2 shadow-xl border-b-2 border-amber-600">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined font-black">warning</span>
            <p className="font-black uppercase tracking-tight">Navigateur non-sécurisé détecté</p>
          </div>
          <p className="text-sm font-bold">
            Google bloque la connexion depuis Instagram/Facebook/WhatsApp. <br />
            Cliquez sur les <span className="underline">...</span> en haut à droite et choisissez
            <span className="bg-white text-amber-500 px-2 py-0.5 rounded-md mx-1">Ouvrir dans Safari</span> ou Chrome.
          </p>
        </div>
      )}

      <header className="fixed top-0 w-full z-50 glass-header">
        <div className="max-w-7xl mx-auto px-6 h-20 md:h-24 flex items-center justify-between">
          <div className="flex items-center">
            <img src="/logo.png" alt="Quizzou Logo" className="h-16 md:h-20 w-auto object-contain" />
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link className="text-sm font-bold hover:text-primary transition-colors" href="/features">Fonctionnalités</Link>
            <Link className="text-sm font-bold hover:text-primary transition-colors" href="/pricing">Tarifs</Link>
            <Link className="text-sm font-bold hover:text-primary transition-colors" href="/contact">Contact</Link>
          </nav>
          <div className="flex items-center gap-4">
            <button onClick={handleLogin} disabled={isLoggingIn} className="hidden md:flex items-center gap-2 bg-primary text-white border-2 border-primary px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-white hover:text-primary transition-all hover:scale-105 active:scale-95 disabled:opacity-50">
              {isLoggingIn ? "Patientez..." : "Se connecter"}
            </button>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-primary p-2">
              <span className="material-symbols-outlined text-3xl">menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-white flex flex-col pt-24 px-6 md:hidden">
          <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-6 right-6 text-primary p-2">
            <span className="material-symbols-outlined text-3xl">close</span>
          </button>
          <nav className="flex flex-col gap-6 items-center text-center w-full mb-8">
            <Link onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-black text-black hover:text-primary transition-colors" href="/features">Fonctionnalités</Link>
            <Link onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-black text-black hover:text-primary transition-colors" href="/pricing">Tarifs</Link>
            <Link onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-black text-black hover:text-primary transition-colors" href="/contact">Contact</Link>
          </nav>
          <button onClick={() => { setIsMobileMenuOpen(false); handleLogin(); }} disabled={isLoggingIn} className="flex justify-center items-center gap-2 bg-primary text-white border-2 border-primary px-8 py-4 rounded-xl text-lg font-bold shadow-lg w-full transition-all active:scale-95 disabled:opacity-50">
            {isLoggingIn ? "Patientez..." : "Se connecter avec Google"}
          </button>
        </div>
      )}

      <main className="flex-grow pt-32">
        <section className="opacity-0 animate-fade-in-up max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-32">
          <div className="flex flex-col gap-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-primary text-white px-3 py-1 rounded-full w-fit mx-auto lg:mx-0">
              <span className="material-symbols-outlined text-sm">bolt</span>
              <span className="text-xs font-bold uppercase tracking-wider">Propulsé par Gemini 3.1 Pro</span>
            </div>
            <div className="flex flex-col gap-4">
              <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight text-black">
                Ne lisez plus. <br className="hidden md:block" /><span className="text-primary">Maîtrisez.</span>
              </h1>
              <p className="text-lg lg:text-xl text-black leading-relaxed max-w-lg mx-auto lg:mx-0">
                Transformez instantanément n'importe quel cours, PDF ou DOCX en un quiz interactif conçu pour l'apprentissage profond.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button onClick={handleLogin} disabled={isLoggingIn} className="flex items-center justify-center gap-3 bg-primary text-white border-2 border-primary px-8 py-4 rounded-xl text-lg font-bold shadow-xl shadow-primary/20 hover:bg-white hover:text-primary transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50">
                {isLoggingIn ? "Connexion..." : "Continuer avec Google"}
              </button>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-sm lg:max-w-full animate-float">
            <div className="relative glass-card bg-white border-2 border-primary rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-4 aspect-video flex items-center justify-center">
                <div className="w-full h-full border-2 border-dashed border-primary rounded-2xl flex flex-col items-center justify-center gap-4">
                  <span className="material-symbols-outlined text-primary text-6xl">document_scanner</span>
                  <div className="flex flex-col items-center w-3/4">
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="w-2/3 h-full bg-primary rounded-full"></div>
                    </div>
                    <span className="text-xs text-black mt-2 font-medium">Analyse du document en cours...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="opacity-0 animate-fade-in-up max-w-7xl mx-auto px-6 py-24 border-t-2 border-primary" style={{ animationDelay: '200ms' }}>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-black mb-4">L'apprentissage réinventé</h2>
            <p className="text-black max-w-2xl mx-auto italic font-medium">Une approche scientifique pour une mémorisation durable et sans effort.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col gap-6 p-8 rounded-3xl border-2 border-primary hover:bg-primary/5 transition-colors">
              <span className="material-symbols-outlined text-primary text-5xl">quiz</span>
              <h3 className="text-xl font-black text-black">Rappel Actif</h3>
              <p className="text-sm text-black leading-relaxed font-medium">Forcer votre cerveau à récupérer l'information renforce les connexions neuronales bien plus que la simple relecture.</p>
            </div>
            <div className="flex flex-col gap-6 p-8 rounded-3xl border-2 border-primary hover:bg-primary/5 transition-colors">
              <span className="material-symbols-outlined text-primary text-5xl">psychology</span>
              <h3 className="text-xl font-black text-black">Correction Instantanée</h3>
              <p className="text-sm text-black leading-relaxed font-medium">Savoir immédiatement pourquoi vous avez tort permet d'ajuster votre compréhension en temps réel.</p>
            </div>
            <div className="flex flex-col gap-6 p-8 rounded-3xl border-2 border-primary hover:bg-primary/5 transition-colors">
              <span className="material-symbols-outlined text-primary text-5xl">history_edu</span>
              <h3 className="text-xl font-black text-black">Synthèse IA</h3>
              <p className="text-sm text-black leading-relaxed font-medium">L'IA extrait les concepts clés de vos documents pour vous concentrer uniquement sur l'essentiel.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-auto py-12 border-t-2 border-primary">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center">
            <img src="/logo.png" alt="Quizzou Logo" className="h-12 w-auto object-contain" />
          </div>
          <div className="flex gap-8 text-sm font-bold">
            <Link href="/privacy" className="hover:text-primary transition-colors">Confidentialité</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">C.G.U</Link>
          </div>
          <p className="text-sm font-bold text-slate-500">© 2026 Xcompany all right reserved.</p>
        </div>
      </footer>

      {/* Debug Journal Layer */}
      <div className="fixed bottom-4 right-4 z-[200] max-w-xs w-full pointer-events-none">
        <div className="bg-black/90 text-[10px] text-green-400 font-mono p-3 rounded-lg border border-green-500/30 shadow-2xl overflow-hidden opacity-60">
          <p className="border-b border-green-500/20 pb-1 mb-1 font-bold uppercase">Journal de Connexion</p>
          {debugLogs.map((log, i) => (
            <p key={i} className="leading-tight mb-0.5">{log}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
