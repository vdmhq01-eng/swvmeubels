import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'swv-session';
const MAX_AGE_SECONDS = 60 * 60 * 8; // 8 uur

export type SessionPayload = {
  userId: string;
  role: 'STUDENT' | 'COORDINATOR' | 'COMPANY' | 'ADMIN';
  email: string;
  name: string;
  twoFactorOk: boolean;
};

function getSecret(): string {
  return process.env.AUTH_SECRET || process.env.JWT_SECRET || 'dev-secret-rotate-in-production';
}

export function signSession(payload: SessionPayload): string {
  return jwt.sign(payload, getSecret(), {
    expiresIn: MAX_AGE_SECONDS,
    issuer: 'swv-portal',
  });
}

export function verifySession(token: string): SessionPayload | null {
  try {
    const decoded = jwt.verify(token, getSecret(), { issuer: 'swv-portal' });
    return decoded as SessionPayload;
  } catch {
    return null;
  }
}

export async function setSessionCookie(payload: SessionPayload) {
  const token = signSession(payload);
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: MAX_AGE_SECONDS,
    path: '/',
  });
}

export async function clearSessionCookie() {
  cookies().delete(COOKIE_NAME);
}

export async function getCurrentSession(): Promise<SessionPayload | null> {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySession(token);
}

export { COOKIE_NAME };
