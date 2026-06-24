import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const userId = url.searchParams.get('userId');
  if (!userId) return NextResponse.json({ items: [] });

  try {
    const items = await db.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    return NextResponse.json({ items });
  } catch (err) {
    console.error('[notifications GET]', err);
    return NextResponse.json({ items: [], error: String(err) }, { status: 500 });
  }
}
