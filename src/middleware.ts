import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const session = request.cookies.get('session');

    // Si l'utilisateur n'est pas connecté et qu'il essaye d'accéder à des pages protégées
    // Dashboard gère sa propre protection client-side pour plus de résilience sur mobile.
    const isProtectedRoute =
        request.nextUrl.pathname.startsWith('/quiz/') ||
        request.nextUrl.pathname.startsWith('/results');

    if (!session && isProtectedRoute) {
        const url = request.nextUrl.clone();
        url.pathname = '/';
        return NextResponse.redirect(url);
    }

    return NextResponse.next();

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|api|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
