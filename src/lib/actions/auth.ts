'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { audit } from '@/lib/security/audit';
import { verifyPassword, hashPassword } from '@/lib/auth/password';
import {
  setSessionCookie,
  clearSessionCookie,
  getCurrentSession,
  signSession,
} from '@/lib/auth/session';
import { generateSecret, verifyToken, buildQrDataUrl } from '@/lib/auth/totp';
import type { Role } from '@prisma/client';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function loginAction(
  formData: FormData,
): Promise<{ ok: true; redirectTo: string; needs2fa?: boolean } | { ok: false; error: string }> {
  const parsed = loginSchema.safeParse({
    email: String(formData.get('email') ?? '').trim(),
    password: String(formData.get('password') ?? ''),
  });
  if (!parsed.success) return { ok: false, error: 'E-mail of wachtwoord ongeldig formaat' };

  try {
    const user = await db.user.findUnique({
      where: { email: parsed.data.email.toLowerCase() },
    });

    if (!user || !user.passwordHash) {
      // Geen timing-attack: do dummy hash compare
      await verifyPassword(parsed.data.password, '$2a$12$dummyhashtopreventtimingattack....');
      return { ok: false, error: 'E-mail of wachtwoord onjuist' };
    }

    const valid = await verifyPassword(parsed.data.password, user.passwordHash);
    if (!valid) {
      await db.securityLog.create({
        data: {
          severity: 'WARNING',
          event: 'login.mislukt',
          userId: user.id,
          message: 'Onjuist wachtwoord',
        },
      }).catch(() => {});
      return { ok: false, error: 'E-mail of wachtwoord onjuist' };
    }

    const needs2fa = !!user.twoFactorSecret;
    const redirectTo = needs2fa ? '/login/2fa' : portalHomeFor(user.role);

    await setSessionCookie({
      userId: user.id,
      role: user.role,
      email: user.email,
      name: user.name,
      twoFactorOk: !needs2fa,
    });

    await db.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } }).catch(() => {});
    await audit({
      actorUserId: user.id,
      actorName: user.name,
      actorRole: user.role,
      action: 'login.gelukt',
      objectType: 'User',
      objectId: user.id,
      context: { needs2fa },
    }).catch(() => {});

    return { ok: true, redirectTo, needs2fa };
  } catch (err) {
    console.error('[loginAction]', err);
    return { ok: false, error: 'Er ging iets mis bij inloggen' };
  }
}

export async function verify2faAction(
  formData: FormData,
): Promise<{ ok: true; redirectTo: string } | { ok: false; error: string }> {
  const token = String(formData.get('code') ?? '').replace(/\s/g, '');
  if (!token || token.length < 6) return { ok: false, error: 'Vul 6-cijferige code in' };

  const session = await getCurrentSession();
  if (!session) return { ok: false, error: 'Geen actieve sessie — log opnieuw in' };

  try {
    const user = await db.user.findUnique({ where: { id: session.userId } });
    if (!user?.twoFactorSecret) return { ok: false, error: '2FA niet ingesteld' };

    const valid = verifyToken(token, user.twoFactorSecret);
    if (!valid) {
      await db.securityLog.create({
        data: {
          severity: 'WARNING',
          event: '2fa.mislukt',
          userId: user.id,
          message: 'Verkeerde 2FA-code',
        },
      }).catch(() => {});
      return { ok: false, error: 'Onjuiste code' };
    }

    await setSessionCookie({ ...session, twoFactorOk: true });
    await audit({
      actorUserId: user.id,
      actorName: user.name,
      actorRole: user.role,
      action: 'login.gelukt',
      objectType: 'User',
      objectId: user.id,
      context: { method: '2fa' },
    }).catch(() => {});

    return { ok: true, redirectTo: portalHomeFor(session.role) };
  } catch (err) {
    console.error('[verify2faAction]', err);
    return { ok: false, error: '2FA verificatie mislukt' };
  }
}

export async function setup2faAction(): Promise<
  { ok: true; qrDataUrl: string; secret: string } | { ok: false; error: string }
> {
  const session = await getCurrentSession();
  if (!session) return { ok: false, error: 'Niet ingelogd' };

  try {
    const secret = generateSecret();
    await db.user.update({
      where: { id: session.userId },
      data: { totpPendingSecret: secret },
    });
    const qr = await buildQrDataUrl(session.email, secret);
    return { ok: true, qrDataUrl: qr, secret };
  } catch (err) {
    console.error('[setup2faAction]', err);
    return { ok: false, error: '2FA setup mislukt' };
  }
}

export async function confirm2faAction(
  formData: FormData,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const code = String(formData.get('code') ?? '').replace(/\s/g, '');
  const session = await getCurrentSession();
  if (!session) return { ok: false, error: 'Niet ingelogd' };

  try {
    const user = await db.user.findUnique({ where: { id: session.userId } });
    if (!user?.totpPendingSecret) return { ok: false, error: 'Geen 2FA setup actief' };

    const valid = verifyToken(code, user.totpPendingSecret);
    if (!valid) return { ok: false, error: 'Onjuiste code — probeer opnieuw' };

    await db.user.update({
      where: { id: session.userId },
      data: {
        twoFactorSecret: user.totpPendingSecret,
        totpPendingSecret: null,
        twoFactorEnabled: true,
      },
    });

    await setSessionCookie({ ...session, twoFactorOk: true });
    await audit({
      actorUserId: user.id,
      actorName: user.name,
      actorRole: user.role,
      action: 'login.gelukt',
      objectType: 'User',
      objectId: user.id,
      context: { event: '2fa_enabled' },
    }).catch(() => {});

    return { ok: true };
  } catch (err) {
    console.error('[confirm2faAction]', err);
    return { ok: false, error: '2FA inschakelen mislukt' };
  }
}

export async function logoutAction(): Promise<void> {
  const session = await getCurrentSession();
  if (session) {
    await audit({
      actorUserId: session.userId,
      actorName: session.name,
      actorRole: session.role,
      action: 'login.gelukt',
      objectType: 'User',
      objectId: session.userId,
      context: { event: 'logout' },
    }).catch(() => {});
  }
  await clearSessionCookie();
  redirect('/login');
}

function portalHomeFor(role: Role): string {
  switch (role) {
    case 'STUDENT': return '/student';
    case 'COORDINATOR': return '/coordinator';
    case 'COMPANY': return '/lidbedrijf';
    case 'ADMIN': return '/admin';
  }
}

/**
 * Helper voor server components: bootstrap een wachtwoord voor demo-users
 * zodat ze met 'wachtwoord' kunnen inloggen. Eenmalig uit te voeren.
 */
export async function bootstrapDemoPasswords(adminKey: string): Promise<{ count: number }> {
  const expected = process.env.SEED_KEY ?? '';
  if (!expected || adminKey !== expected) throw new Error('Ongeldige key');

  const demoPassword = await hashPassword('demo2026');
  const users = await db.user.findMany({ where: { passwordHash: null } });
  for (const u of users) {
    await db.user.update({ where: { id: u.id }, data: { passwordHash: demoPassword } });
  }
  return { count: users.length };
}
