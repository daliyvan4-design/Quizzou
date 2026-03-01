import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Sécurité pour le build : n'initialiser que si la clé API est présente
const getClientApp = () => {
    if (getApps().length > 0) return getApps()[0];

    // Les clés Firebase commencent par AIzaSy. Si on ne met pas ce préfixe, 
    // le SDK jette une erreur "invalid-api-key" au moment de l'initialisation.
    if (!firebaseConfig.apiKey || firebaseConfig.apiKey === "undefined" || firebaseConfig.apiKey === "") {
        console.warn("Firebase Client: Clé API manquante ou invalide au build.");
        return initializeApp({
            apiKey: "AIzaSyBuildPlaceholderKey_0000",
            projectId: "quizzou-build-only",
            authDomain: "quizzou.firebaseapp.com",
            appId: "1:000000000000:web:000000000000"
        });
    }

    return initializeApp(firebaseConfig);
};

export const app = getClientApp();
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
