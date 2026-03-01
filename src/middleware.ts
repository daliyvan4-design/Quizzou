import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const session = request.cookies.get('session');

    // Si l'utilisateur n'est pas connecté et qu'il essaye d'accéder à des pages protégées
    const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard') ||
        request.nextUrl.pathname.startsWith('/quiz') ||
        request.nextUrl.pathname.startsWith('/processing') ||
        request.nextUrl.pathname.startsWith('/results');

    if (!session && isProtectedRoute) {
        const url = request.nextUrl.clone();
        url.pathname = '/';
        return NextResponse.redirect(url);
    }

    // Si on est connecté et qu'on essaie d'aller sur la page d'accueil (ou auth)
    const isAuthRoute = request.nextUrl.pathname === '/' || request.nextUrl.pathname.startsWith('/auth');
    if (session && isAuthRoute) {
        if (request.nextUrl.pathname === '/auth/callback') {
            // on laisse le callback passer
            return NextResponse.next();
        }
        const url = request.nextUrl.clone();
        url.pathname = '/dashboard';
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|api|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
