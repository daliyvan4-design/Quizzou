import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

function getAdminApp() {
    if (getApps().length > 0) return getApp();

    const config = {
        projectId: projectId,
        clientEmail: clientEmail,
        privateKey: privateKey,
        // Certains validateurs firebase-admin exigent spécifiquement le format snake_case
        project_id: projectId,
        client_email: clientEmail,
        private_key: privateKey,
    };

    if (projectId && clientEmail && privateKey) {
        return initializeApp({
            credential: cert(config as any)
        });
    }

    // Fallback minimal pour éviter le crash fatal au moment du build (quand les env vars peuvent manquer)
    // On n'utilise pas cert() ici pour éviter l'erreur de validation "project_id"
    return initializeApp({
        projectId: projectId || 'quizzou-default'
    }, 'build-app');
}

const app = getAdminApp();
export const adminAuth = getAuth(app);
export const adminFirestore = getFirestore(app);
