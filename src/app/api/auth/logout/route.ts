import { NextResponse } from 'next/server';

export async function POST() {
  // Productie: session uit DB verwijderen + cookie wissen
  const res = NextResponse.json({ ok: true });
  res.cookies.set('swv-session', '', { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 0, path: '/' });
  return res;
}
