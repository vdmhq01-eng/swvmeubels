import { NextResponse } from 'next/server';
import { z } from 'zod';
import { audit } from '@/lib/security/audit';

// Login endpoint - stub. Productie:
// 1. Hash-vergelijking via Argon2id
// 2. 2FA-challenge starten als 2FA staat aan
// 3. Session aanmaken (HttpOnly secure cookie + DB-record)
// 4. Rate limiten per IP en per account

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  rememberMe: z.boolean().optional(),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Ongeldige invoer' }, { status: 400 });
  }

  // Mock: accepteer altijd (in echt: bcrypt/argon vergelijking + lockout-check)
  await audit({
    actorUserId: 'unknown',
    actorName: parsed.data.email,
    actorRole: 'STUDENT',
    action: 'login.gelukt',
    objectType: 'Session',
    objectId: 'mock-session',
  });

  return NextResponse.json({ ok: true, requires2fa: false });
}
