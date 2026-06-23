import { NextResponse } from 'next/server';
import { listUnreadNotifications } from '@/lib/actions/application';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId') ?? '';
  if (!userId) return NextResponse.json({ notifications: [] });
  const notifications = await listUnreadNotifications(userId);
  return NextResponse.json({
    notifications: notifications.map((n) => ({
      id: n.id,
      title: n.title,
      body: n.body,
      href: n.href,
      type: n.type,
      createdAt: n.createdAt,
    })),
  });
}
