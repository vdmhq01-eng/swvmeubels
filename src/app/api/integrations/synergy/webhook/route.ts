import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { handleSynergyWebhook } from '@/lib/integrations/synergy/sync';

export const dynamic = 'force-dynamic';

/**
 * Webhook endpoint waar Synergy events naartoe stuurt.
 * URL te configureren in Synergy admin: /api/integrations/synergy/webhook
 * Beveiligd via HMAC signature in 'X-Synergy-Signature' header.
 *
 * Vereist env var EXACT_SYNERGY_WEBHOOK_SECRET.
 */
export async function POST(req: Request) {
  const raw = await req.text();
  const signature = req.headers.get('x-synergy-signature') ?? '';
  const secret = process.env.EXACT_SYNERGY_WEBHOOK_SECRET ?? '';

  if (!secret) {
    console.warn('[synergy:webhook] EXACT_SYNERGY_WEBHOOK_SECRET niet gezet — dry-run accept');
    return NextResponse.json({ ok: true, mode: 'dry-run' });
  }

  // HMAC-SHA256 verificatie
  const expected = crypto.createHmac('sha256', secret).update(raw).digest('hex');
  const valid = signature.length > 0 && crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected),
  );

  if (!valid) {
    return NextResponse.json({ ok: false, error: 'Invalid signature' }, { status: 401 });
  }

  try {
    const event = JSON.parse(raw);
    await handleSynergyWebhook(event);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[synergy:webhook]', err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
