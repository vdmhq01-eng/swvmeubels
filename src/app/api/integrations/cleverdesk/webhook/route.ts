import { NextResponse } from 'next/server';
import { audit } from '@/lib/security/audit';

export async function POST(req: Request) {
  const raw = await req.text();
  const signature = req.headers.get('x-cleverdesk-signature') ?? '';
  const secret = process.env.CLEVERDESK_WEBHOOK_SECRET ?? '';

  if (!signature || !secret) {
    return NextResponse.json({ error: 'Ongeldige signature' }, { status: 401 });
  }

  // Productie: HMAC verify + idempotency op event-id
  await audit({
    actorUserId: 'system',
    actorName: 'Cleverdesk Webhook',
    actorRole: 'ADMIN',
    action: 'integratie.config_gewijzigd',
    objectType: 'Integration',
    objectId: 'CLEVERDESK',
    context: { payloadSize: raw.length },
  });

  return NextResponse.json({ ok: true }, { status: 202 });
}
