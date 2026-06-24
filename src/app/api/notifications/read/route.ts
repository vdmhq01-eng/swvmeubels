import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { id?: string };
    if (!body.id) return NextResponse.json({ ok: false, error: 'id required' }, { status: 400 });
    await db.notification.update({ where: { id: body.id }, data: { read: true } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[notifications/read]', err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
