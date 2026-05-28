import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware verantwoordelijk voor:
//  - Cookie-controle en doorzetten van sessie naar request headers
//  - Role-based access op portal-paden (smal; ABAC gebeurt in server actions)
//  - Security headers (aanvullend op next.config.mjs)
//  - Rate-limit hook (in productie: doorzet naar edge KV store)

const portalPrefix = {
  STUDENT: '/student',
  COORDINATOR: '/coordinator',
  COMPANY: '/lidbedrijf',
  ADMIN: '/admin',
} as const;

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Sta publieke routes toe (landing, static, api/auth)
  if (
    pathname === '/' ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static')
  ) {
    return withSecurityHeaders(NextResponse.next());
  }

  // In productie: lees session cookie en verifieer JWT/DB-session.
  // Voor de mockup laten we alles door, maar laten we wel zien hoe het zou werken.
  const sessionRole = readSessionRole(req);

  if (sessionRole) {
    const allowedPrefix = portalPrefix[sessionRole];
    const accessingAllowed =
      Object.values(portalPrefix).every((p) => !pathname.startsWith(p)) ||
      pathname.startsWith(allowedPrefix);
    if (!accessingAllowed) {
      return NextResponse.redirect(new URL(allowedPrefix, req.url));
    }
  }

  return withSecurityHeaders(NextResponse.next());
}

function readSessionRole(_req: NextRequest): keyof typeof portalPrefix | null {
  // Productie: lees auth cookie, verifieer signature, return role.
  return null;
}

function withSecurityHeaders(res: NextResponse) {
  res.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
