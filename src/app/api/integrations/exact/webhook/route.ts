import { NextResponse } from 'next/server';
import { verifyExactWebhook } from '@/lib/integrations/exact';
import { audit } from '@/lib/security/audit';

export async function POST(req: Request) {
  const raw = await req.text();
  const signature = req.headers.get('x-exact-signature') ?? '';
  const secret = process.env.EXACT_WEBHOOK_SECRET ?? '';

  if (!verifyExactWebhook(raw, signature, secret)) {
    return NextResponse.json({ error: 'Ongeldige signature' }, { status: 401 });
  }

  // Productie: queue event in background job en return 202
  await audit({
    actorUserId: 'system',
    actorName: 'Exact Webhook',
    actorRole: 'ADMIN',
    action: 'integratie.config_gewijzigd',
    objectType: 'Integration',
    objectId: 'EXACT_SYNERGY',
  });

  return NextResponse.json({ ok: true }, { status: 202 });
}
