import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const { idToken } = await request.json();

        // Cookie expires in 5 days
        const expiresIn = 60 * 60 * 24 * 5 * 1000;

        const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
        const cookieStore = await cookies();
        cookieStore.set('session', sessionCookie, {
            maxAge: expiresIn / 1000,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/'
        });

        return NextResponse.json({ status: 'success' }, { status: 200 });
    } catch (error: any) {
        console.error("Erreur serveur auth/session:", error);

        const keyExists = !!process.env.FIREBASE_PRIVATE_KEY;
        const emailExists = !!process.env.FIREBASE_CLIENT_EMAIL;
        const projectExists = !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

        return NextResponse.json({
            error: error.message,
            debug: `Key=${keyExists}, Email=${emailExists}, Project=${projectExists}`
        }, { status: 401 });
    }
}
