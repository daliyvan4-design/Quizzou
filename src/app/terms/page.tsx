import Link from "next/link";
export default function TermsPage() {
    return (
        <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center text-center p-6">
            <h1 className="text-4xl font-black text-primary mb-4">Conditions Légales</h1>
            <p className="text-lg font-medium max-w-lg mb-8">Conditions d'utilisation de Quizzou.</p>
            <Link href="/" className="font-bold border-2 border-primary text-primary hover:bg-primary hover:text-white px-6 py-3 rounded-lg transition-colors">Retour à l'accueil</Link>
        </div>
    );
}
