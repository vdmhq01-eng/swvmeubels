'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { useToast } from '@/components/ui/Toast';

/**
 * Polled live notifier voor coördinator dashboard.
 * - Vraagt browser-permissie voor notifications
 * - Pollt elke 30 seconden /api/coordinator/unread-applications
 * - Toont browser push + in-app toast bij nieuwe sollicitatie
 * - Geluidsfeedback en visuele update
 */
export function ApplicationNotifier({ userId }: { userId: string }) {
  const { toast } = useToast();
  const router = useRouter();
  const lastSeenIds = useRef<Set<string>>(new Set());
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    setPermission(Notification.permission);
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    async function poll() {
      try {
        const res = await fetch(`/api/coordinator/notifications?userId=${userId}`, { cache: 'no-store' });
        if (!res.ok) return;
        const data: { notifications: { id: string; title: string; body: string; href: string | null }[] } = await res.json();
        setUnreadCount(data.notifications.length);

        const newOnes = data.notifications.filter((n) => !lastSeenIds.current.has(n.id));
        for (const n of newOnes) {
          lastSeenIds.current.add(n.id);
          // Skip initial load
          if (lastSeenIds.current.size === data.notifications.length && newOnes.length === data.notifications.length) {
            continue;
          }
          // Browser push
          if (permission === 'granted') {
            const notif = new Notification(n.title, { body: n.body, icon: '/icon.svg', tag: n.id });
            notif.onclick = () => {
              window.focus();
              if (n.href) router.push(n.href);
            };
          }
          // In-app toast
          toast({ variant: 'info', title: n.title, description: n.body });
        }
        // On initial load just register IDs
        if (lastSeenIds.current.size === 0) {
          data.notifications.forEach((n) => lastSeenIds.current.add(n.id));
        }
      } catch (err) {
        console.error('[notifier]', err);
      }
    }
    poll();
    timer = setInterval(poll, 30_000);
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [userId, permission, toast, router]);

  async function enable() {
    if (!('Notification' in window)) return;
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === 'granted') {
      new Notification('Push-meldingen aan', {
        body: 'Je krijgt nu een melding bij iedere nieuwe sollicitatie.',
        icon: '/icon.svg',
      });
      toast({ variant: 'success', title: 'Meldingen aan', description: 'Sollicitaties komen nu live binnen.' });
    }
  }

  if (permission === 'granted') {
    return (
      <div className="mb-5 flex items-center justify-between rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm">
        <div className="flex items-center gap-2 text-emerald-700">
          <Icon.CheckCircle className="h-4 w-4" />
          <span><strong>Push-meldingen aan.</strong> {unreadCount > 0 ? `${unreadCount} ongelezen meldingen.` : 'Geen nieuwe meldingen.'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-primary-200 bg-primary-50 px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-md bg-primary-500 text-white">
          <Icon.Bell className="h-4 w-4" />
        </div>
        <div>
          <div className="text-sm font-bold text-ink-900">Direct melding bij nieuwe sollicitatie</div>
          <div className="text-xs text-ink-600">Zet meldingen aan om geen sollicitatie te missen.</div>
        </div>
      </div>
      <button onClick={enable} className="btn-primary">
        <Icon.Bell className="h-4 w-4" />
        Meldingen aanzetten
      </button>
    </div>
  );
}
