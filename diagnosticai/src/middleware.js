import { NextResponse } from "next/server";

export function middleware(request) {
    // const token = request.cookies.get('token')?.value;
    // const { pathname } = request.nextUrl;
    // // Public routes that don't need authentication

    // const publicRoutes = ['/login', '/api/auth/login', '/api/auth/register', '/api/auth/logout'];

    // // API routes that need authentication (excluding auth routes)
    // const protectedApiRoutes = pathname.startsWith('/api/') && !pathname.startsWith('/api/auth/');

    // // Protected pages (excluding login and api routes)
    // const protectedPageRoutes = !pathname.startsWith('/api/') && !publicRoutes.includes(pathname);

    // // Allow public routes without token
    // if (publicRoutes.includes(pathname)) {
    //     // Redirect to dashboard if user is already logged in
    //     if (token && pathname === '/login') {
    //         return NextResponse.redirect(new URL('/dashboard', request.url));
    //     }
    //     return NextResponse.next();
    // }

    // // Check authentication for protected pages
    // if (protectedPageRoutes) {
    //     if (!token) {
    //         return NextResponse.redirect(new URL('/login', request.url));
    //     }
    //     if (pathname === '/') {
    //         return NextResponse.redirect(new URL('/dashboard', request.url));
    //     }
    //     return NextResponse.next();
    // }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|public/).*)'],
};
