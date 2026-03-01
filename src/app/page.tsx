"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithPopup, browserPopupRedirectResolver } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase/config";

export default function Home() {
  const router = useRouter();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    try {
      setIsLoggingIn(true);

      const apiKey = auth.app.options.apiKey;
      console.log("Auto-diagnostic Auth...");

      if (!apiKey || apiKey.includes("Placeholder")) {
        alert("⚠️ Erreur de configuration : Le site utilise une clé de secours. Vérifiez vos variables d'environnement NEXT_PUBLIC_ sur Vercel !");
        setIsLoggingIn(false);
        return;
      }

      // Log pour vérifier que les variables sont bien chargées côté client
      console.log("Tentative de connexion...");
      console.log("Firebase App Name:", auth.app.name);

      const result = await signInWithPopup(auth, googleProvider, browserPopupRedirectResolver);
      const idToken = await result.user.getIdToken();

      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (res.ok) {
        router.push("/dashboard");
      } else {
        console.error("Session creation failed");
        setIsLoggingIn(false);
      }
    } catch (error) {
      console.error("Firebase Login Error", error);
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-white text-black">
      <header className="fixed top-0 w-full z-50 glass-header">
        <div className="max-w-7xl mx-auto px-6 h-20 md:h-24 flex items-center justify-between">
          <div className="flex items-center">
            <img src="/logo.png" alt="Quizzou Logo" className="h-16 md:h-20 w-auto object-contain" />
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link className="text-sm font-medium hover:text-primary transition-colors" href="/features">Fonctionnalités</Link>
            <Link className="text-sm font-medium hover:text-primary transition-colors" href="/pricing">Tarifs</Link>
            <Link className="text-sm font-medium hover:text-primary transition-colors" href="/contact">Contact</Link>
          </nav>
          <button onClick={handleLogin} disabled={isLoggingIn} className="flex items-center gap-2 bg-primary text-white border-2 border-primary px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-white hover:text-primary transition-colors disabled:opacity-50">
            <img alt="Google logo icon" className="w-5 h-5 bg-white rounded-full p-0.5 border border-slate-200" src="https://lh3.googleusercontent.com/aida-public/AB6AXuACqGchdvjAlDkVxSp_XsSrjhyWZNkEsV7oMMcyP9gw3ZcxOXt9GRGS09u0AuydzmNejXMTsxHhbpbUsIOboZbunId3afpI2rw_N2lXssSdyNVs624sAvyT-qP_6uDGXRbnu8taVOjnukyVge5BAvmWJAqA2TVOaFqQe8Yn2BHdFBYq37KBc03n-tX5jj27ENJrN1DSCph1jtVN_strPYHhLq1CIWSzkigBFQYFHElv4drjqpS0j1uzqkI86LsfuPFxGYon-ZuutDQ5" />
            {isLoggingIn ? "Patientez..." : "Se connecter"}
          </button>
        </div>
      </header>

      <main className="flex-grow pt-32">
        <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-32">
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
              <button onClick={handleLogin} disabled={isLoggingIn} className="flex items-center justify-center gap-3 bg-primary text-white border-2 border-primary px-8 py-4 rounded-xl text-lg font-bold shadow-xl shadow-primary/20 hover:bg-white hover:text-primary transition-colors cursor-pointer disabled:opacity-50">
                <img alt="Google logo icon" className="w-6 h-6 bg-white rounded-full p-1 border border-slate-200" src="https://lh3.googleusercontent.com/aida-public/AB6AXuACqGchdvjAlDkVxSp_XsSrjhyWZNkEsV7oMMcyP9gw3ZcxOXt9GRGS09u0AuydzmNejXMTsxHhbpbUsIOboZbunId3afpI2rw_N2lXssSdyNVs624sAvyT-qP_6uDGXRbnu8taVOjnukyVge5BAvmWJAqA2TVOaFqQe8Yn2BHdFBYq37KBc03n-tX5jj27ENJrN1DSCph1jtVN_strPYHhLq1CIWSzkigBFQYFHElv4drjqpS0j1uzqkI86LsfuPFxGYon-ZuutDQ5" />
                {isLoggingIn ? "Connexion..." : "Continuer avec Google"}
              </button>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-sm lg:max-w-full">
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

        <section className="max-w-7xl mx-auto px-6 py-24 border-t-2 border-primary">
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
    </div>
  );
}
