import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Check if the request is for the admin page
    if (request.nextUrl.pathname.startsWith('/admin')) {
        // Check for the auth_token cookie
        const token = request.cookies.get('auth_token');

        // If no token exists, redirect to the login page
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/admin/:path*',
};
