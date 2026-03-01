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
            path: '/'
        });

        return NextResponse.json({ status: 'success' }, { status: 200 });
    } catch (error: any) {
        console.error("Erreur serveur auth/session:", error);
        return NextResponse.json({ error: error.message }, { status: 401 });
    }
}
