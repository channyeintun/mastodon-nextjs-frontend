import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const protectedRoutes = [
  '/compose',
  '/bookmarks',
  '/settings',
];

// Routes that should redirect to home if authenticated
const authRoutes = ['/auth/signin'];

// Next.js 16 proxy API (replaces middleware)
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get auth state from localStorage (via cookie or header in production)
  // For now, we'll let client-side handle it since MobX stores are client-side
  // In a production app, you'd want to use cookies or server-side sessions

  // Check if accessing protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if accessing auth route
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Note: Since we're using MobX with localStorage, and Next.js proxy
  // runs on the server, we can't directly access the auth state here.
  // For a production app, you'd want to:
  // 1. Use HTTP-only cookies to store auth tokens
  // 2. Check those cookies in this proxy
  // 3. Redirect accordingly
  //
  // For this implementation, we'll handle route protection client-side
  // and this proxy is here as a placeholder for future improvements.

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
