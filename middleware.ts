import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('vaabhi_token');
    const isAuthPage = request.nextUrl.pathname.startsWith('/login') ||
        request.nextUrl.pathname.startsWith('/register');
    const isProtectedPage = request.nextUrl.pathname.startsWith('/account') ||
        request.nextUrl.pathname.startsWith('/checkout');

    if (isProtectedPage && !token) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('from', request.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
    }

    if (isAuthPage && token) {
        return NextResponse.redirect(new URL('/account', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/account/:path*', '/checkout/:path*', '/login', '/register'],
};
