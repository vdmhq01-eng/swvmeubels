import Link from 'next/link';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import type { Notification } from '@/lib/mock/notifications';

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('nl-NL', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

const typeMeta = {
  INFO: { icon: <Icon.Activity className="h-4 w-4" />, tone: 'bg-sky-50 text-sky-700 ring-sky-100' },
  SUCCESS: { icon: <Icon.CheckCircle className="h-4 w-4" />, tone: 'bg-emerald-50 text-emerald-700 ring-emerald-100' },
  WARNING: { icon: <Icon.AlertTriangle className="h-4 w-4" />, tone: 'bg-amber-50 text-amber-700 ring-amber-100' },
  ACTION: { icon: <Icon.Bell className="h-4 w-4" />, tone: 'bg-wood-50 text-wood-700 ring-wood-100' },
} as const;

export function NotificationsList({ items }: { items: Notification[] }) {
  const unread = items.filter((i) => !i.read).length;
  return (
    <Card>
      <CardHeader
        title="Meldingen"
        subtitle={`${unread} ongelezen van ${items.length}`}
        action={
          <button className="btn-ghost">
            <Icon.Check className="h-4 w-4" /> Markeer alles als gelezen
          </button>
        }
      />
      <CardBody>
        <ul className="divide-y divide-bone-100">
          {items.map((n) => {
            const meta = typeMeta[n.type];
            return (
              <li key={n.id} className="flex items-start gap-4 py-4 first:pt-0 last:pb-0">
                <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ring-1 ${meta.tone}`}>
                  {meta.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-ink-900">{n.title}</span>
                    {!n.read ? <Badge variant="info">Nieuw</Badge> : null}
                  </div>
                  <p className="mt-0.5 text-sm text-ink-600">{n.body}</p>
                  <div className="mt-1 text-xs text-ink-500">{formatDateTime(n.at)}</div>
                </div>
                {n.href ? (
                  <Link href={n.href} className="btn-ghost">
                    Bekijk <Icon.ArrowRight className="h-4 w-4" />
                  </Link>
                ) : null}
              </li>
            );
          })}
        </ul>
      </CardBody>
    </Card>
  );
}
