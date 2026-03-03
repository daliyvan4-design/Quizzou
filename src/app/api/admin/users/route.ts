import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get('session')?.value;

        if (!sessionCookie) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        let decodedClaims;
        try {
            decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
        } catch (e) {
            return NextResponse.json({ error: 'Session invalide' }, { status: 401 });
        }

        // Récupérer la liste des utilisateurs depuis Firebase Auth
        const listUsersResult = await adminAuth.listUsers(1000);
        const users = listUsersResult.users.map(u => ({
            email: u.email,
            name: u.displayName || 'Sans nom',
            createdAt: u.metadata.creationTime
        }));

        // Trier par date d'inscription (les plus récents en premier)
        users.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

        return NextResponse.json({ users });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
