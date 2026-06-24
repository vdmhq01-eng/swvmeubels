import { NextResponse } from 'next/server';
import { bootstrapDemoPasswords } from '@/lib/actions/auth';

export const dynamic = 'force-dynamic';

/**
 * Eenmalig: zet wachtwoord 'demo2026' op alle demo-users zonder hash.
 * GET /api/admin/bootstrap-passwords?key=<SEED_KEY>
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const key = url.searchParams.get('key') ?? '';
  try {
    const result = await bootstrapDemoPasswords(key);
    return NextResponse.json({ ok: true, ...result, defaultPassword: 'demo2026' });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 401 });
  }
}
