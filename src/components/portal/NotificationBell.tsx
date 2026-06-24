'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';

type Notification = {
  id: string;
  type: string;
  title: string;
  body: string;
  href: string | null;
  read: boolean;
  createdAt: string;
};

export function NotificationBell({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchNotifications() {
    setLoading(true);
    try {
      const res = await fetch(`/api/notifications?userId=${encodeURIComponent(userId)}`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as { items: Notification[] };
      setItems(data.items ?? []);
    } catch (err) {
      console.error('Notification fetch failed', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchNotifications();
    // Poll every 30s
    const id = setInterval(fetchNotifications, 30_000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const unread = items.filter((n) => !n.read).length;

  async function markRead(id: string) {
    try {
      await fetch('/api/notifications/read', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      setItems((curr) => curr.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch {}
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative grid h-10 w-10 place-items-center rounded-xl bg-bone-100 text-ink-700 transition hover:bg-bone-200"
        aria-label={`${unread} ongelezen meldingen`}
      >
        <Icon.Bell className="h-5 w-5" />
        {unread > 0 ? (
          <span className="absolute -right-1 -top-1 grid h-5 min-w-[20px] place-items-center rounded-full bg-primary-500 px-1 text-[10px] font-bold text-white">
            {unread > 9 ? '9+' : unread}
          </span>
        ) : null}
      </button>

      {open ? (
        <>
          <button
            className="fixed inset-0 z-30 cursor-default"
            aria-label="Sluit"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-12 z-40 w-[360px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-bone-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-bone-100 px-4 py-3">
              <div>
                <div className="font-display text-sm font-bold text-ink-900">Meldingen</div>
                <div className="text-[11px] text-ink-500">
                  {unread > 0 ? `${unread} ongelezen` : 'Alles bijgewerkt'}
                </div>
              </div>
              <button
                onClick={fetchNotifications}
                className="grid h-8 w-8 place-items-center rounded-lg text-ink-500 hover:bg-bone-100"
                aria-label="Vernieuwen"
              >
                <Icon.Refresh className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <ul className="max-h-[420px] overflow-y-auto divide-y divide-bone-100">
              {items.length === 0 ? (
                <li className="p-6 text-center text-sm text-ink-500">Geen meldingen.</li>
              ) : (
                items.map((n) => (
                  <li key={n.id}>
                    <Link
                      href={n.href ?? '#'}
                      onClick={() => markRead(n.id)}
                      className={`block p-3 transition hover:bg-bone-50 ${
                        n.read ? 'opacity-70' : 'bg-primary-50/40'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-md ${
                          n.read ? 'bg-bone-100 text-ink-500' : 'bg-primary-500 text-white'
                        }`}>
                          {n.type === 'APPLICATION' ? <Icon.Users className="h-4 w-4" /> :
                            n.type === 'TIMESHEET' ? <Icon.Clock className="h-4 w-4" /> :
                            n.type === 'ABSENCE' ? <Icon.Heart className="h-4 w-4" /> :
                            n.type === 'TASK' ? <Icon.Activity className="h-4 w-4" /> :
                            n.type === 'MESSAGE' ? <Icon.Bell className="h-4 w-4" /> :
                            <Icon.Activity className="h-4 w-4" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-semibold text-ink-900">{n.title}</div>
                          <div className="mt-0.5 line-clamp-2 text-xs text-ink-600">{n.body}</div>
                          <div className="mt-1 text-[10px] uppercase tracking-wider text-ink-400">
                            {timeAgo(n.createdAt)}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))
              )}
            </ul>

            <Link
              href="/coordinator/meldingen"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 border-t border-bone-100 bg-bone-50 px-4 py-3 text-xs font-bold uppercase tracking-wider text-primary-600 hover:bg-bone-100"
            >
              Alle meldingen <Icon.ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </>
      ) : null}
    </div>
  );
}

function timeAgo(iso: string): string {
  const d = new Date(iso);
  const sec = (Date.now() - d.getTime()) / 1000;
  if (sec < 60) return 'net';
  if (sec < 3600) return `${Math.floor(sec / 60)} min geleden`;
  if (sec < 86400) return `${Math.floor(sec / 3600)} uur geleden`;
  return `${Math.floor(sec / 86400)} dagen geleden`;
}
