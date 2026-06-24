import Link from 'next/link';
import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Icon } from '@/components/ui/Icon';
import { EmptyState } from '@/components/ui/EmptyState';
import { getDemoSession } from '@/lib/data/session';
import { db } from '@/lib/db';
import { detectSignals, signalTone } from '@/lib/signals/engine';

export const dynamic = 'force-dynamic';

function timeAgo(d: Date): string {
  const sec = (Date.now() - d.getTime()) / 1000;
  if (sec < 60) return 'net';
  if (sec < 3600) return `${Math.floor(sec / 60)} min`;
  if (sec < 86400) return `${Math.floor(sec / 3600)} uur`;
  return `${Math.floor(sec / 86400)}d`;
}

export default async function CoordinatorInboxPage() {
  const ctx = getDemoSession('COORDINATOR');
  const [coordinator, notifications, applications, messages, openVerzuim, openTimesheets, signals] = await Promise.all([
    db.coordinator.findUnique({
      where: { id: ctx.coordinatorId! },
      include: { user: true, region: true },
    }).catch(() => null),
    db.notification.findMany({
      where: { userId: ctx.userId, read: false },
      orderBy: { createdAt: 'desc' },
      take: 30,
    }).catch(() => []),
    db.application.findMany({
      where: { assignedToId: ctx.userId, status: { in: ['NIEUW', 'TOEGEWEZEN', 'IN_BEHANDELING'] } },
      orderBy: { createdAt: 'desc' },
      take: 20,
    }).catch(() => []),
    db.message.findMany({
      where: { toUserId: ctx.userId },
      include: { fromUser: { select: { name: true } } },
      orderBy: { sentAt: 'desc' },
      take: 30,
    }).catch(() => []),
    db.absence.findMany({
      where: { closedAt: null, student: { coordinatorId: ctx.coordinatorId! } },
      include: { student: { include: { user: true } } },
      orderBy: { startDate: 'desc' },
    }).catch(() => []),
    db.timesheet.findMany({
      where: { status: 'INGEDIEND', student: { coordinatorId: ctx.coordinatorId! } },
      include: { student: { include: { user: true, company: true } } },
      orderBy: { submittedAt: 'desc' },
      take: 20,
    }).catch(() => []),
    detectSignals({ coordinatorId: ctx.coordinatorId }),
  ]);

  // Combine everything into one unified list, sorted by date
  type InboxItem = {
    id: string;
    kind: 'NOTIFICATION' | 'APPLICATION' | 'MESSAGE' | 'ABSENCE' | 'TIMESHEET' | 'SIGNAL';
    title: string;
    body: string;
    icon: React.ReactNode;
    badgeText: string;
    badgeVariant: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'wood';
    href: string;
    when: Date;
    unread?: boolean;
    severity?: 'CRITICAL' | 'WARNING' | 'INFO';
  };

  const items: InboxItem[] = [
    ...applications.map((a) => ({
      id: `app-${a.id}`,
      kind: 'APPLICATION' as const,
      title: `Sollicitatie: ${a.firstName} ${a.lastName}`,
      body: `${a.applicantType} · ${a.postcode} · ${a.programInterest ?? 'Geen voorkeur'}`,
      icon: <Icon.Bell className="h-4 w-4" />,
      badgeText: 'Sollicitatie',
      badgeVariant: 'warning' as const,
      href: `/coordinator/sollicitaties/${a.id}`,
      when: a.createdAt,
      unread: true,
    })),
    ...messages.map((m) => ({
      id: `msg-${m.id}`,
      kind: 'MESSAGE' as const,
      title: m.subject,
      body: `Van ${m.fromUser.name}: ${m.body.slice(0, 80)}${m.body.length > 80 ? '…' : ''}`,
      icon: <Icon.Bell className="h-4 w-4" />,
      badgeText: 'Bericht',
      badgeVariant: 'info' as const,
      href: '/coordinator/berichten',
      when: m.sentAt,
      unread: !m.readAt,
    })),
    ...openVerzuim.map((v) => ({
      id: `abs-${v.id}`,
      kind: 'ABSENCE' as const,
      title: `${v.student.user.name} — ${v.type === 'ZIEKTE' ? 'ziekmelding' : 'verlof'}`,
      body: `Sinds ${v.startDate.toLocaleDateString('nl-NL')} — geen beter-melding ontvangen.`,
      icon: <Icon.Heart className="h-4 w-4" />,
      badgeText: v.type === 'ZIEKTE' ? 'Verzuim' : 'Verlof',
      badgeVariant: 'danger' as const,
      href: '/coordinator/verzuim',
      when: v.startDate,
    })),
    ...openTimesheets.map((t) => ({
      id: `ts-${t.id}`,
      kind: 'TIMESHEET' as const,
      title: `Weekstaat W${t.weekNumber} — ${t.student.user.name}`,
      body: `${t.student.company.name} moet nog goedkeuren.`,
      icon: <Icon.Clock className="h-4 w-4" />,
      badgeText: 'Weekstaat',
      badgeVariant: 'neutral' as const,
      href: '/coordinator/goedkeuringen',
      when: t.submittedAt ?? new Date(),
    })),
    ...signals.map((s) => ({
      id: s.id,
      kind: 'SIGNAL' as const,
      title: s.title,
      body: s.body,
      icon: <Icon.AlertTriangle className="h-4 w-4" />,
      badgeText: signalTone(s.severity).label,
      badgeVariant: (s.severity === 'CRITICAL' ? 'danger' : s.severity === 'WARNING' ? 'warning' : 'info') as 'danger' | 'warning' | 'info',
      href: s.href,
      when: new Date(s.detectedAt),
      severity: s.severity,
    })),
    ...notifications.map((n) => ({
      id: `not-${n.id}`,
      kind: 'NOTIFICATION' as const,
      title: n.title,
      body: n.body,
      icon: <Icon.Bell className="h-4 w-4" />,
      badgeText: 'Melding',
      badgeVariant: 'wood' as const,
      href: n.href ?? '#',
      when: n.createdAt,
      unread: !n.read,
    })),
  ].sort((a, b) => b.when.getTime() - a.when.getTime());

  const counts = {
    all: items.length,
    sollicitatie: items.filter((i) => i.kind === 'APPLICATION').length,
    verzuim: items.filter((i) => i.kind === 'ABSENCE').length,
    weekstaat: items.filter((i) => i.kind === 'TIMESHEET').length,
    bericht: items.filter((i) => i.kind === 'MESSAGE').length,
    signaal: items.filter((i) => i.kind === 'SIGNAL').length,
    kritiek: items.filter((i) => i.severity === 'CRITICAL').length,
  };

  return (
    <PortalShell
      role="COORDINATOR"
      activeHref="/coordinator/inbox"
      userName={coordinator?.user.name ?? 'Coördinator'}
      userSubtitle={`Coördinator regio ${coordinator?.region.name ?? ''}`}
      greeting={{
        title: 'Unified Inbox',
        subtitle: 'Vervangt je Outlook regiomap. Alle berichten, sollicitaties, verzuim, weekstaten en signaleringen op één plek.',
      }}
    >
      {/* Filter tabs */}
      <Card className="mb-6">
        <CardBody>
          <div className="flex flex-wrap gap-2">
            <FilterChip label="Alles" count={counts.all} active />
            <FilterChip label="Sollicitaties" count={counts.sollicitatie} />
            <FilterChip label="Verzuim" count={counts.verzuim} />
            <FilterChip label="Weekstaten" count={counts.weekstaat} />
            <FilterChip label="Berichten" count={counts.bericht} />
            <FilterChip label="Signalen" count={counts.signaal} tone="amber" />
            {counts.kritiek > 0 ? (
              <FilterChip label="Kritiek" count={counts.kritiek} tone="rose" />
            ) : null}
          </div>
        </CardBody>
      </Card>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat label="Open items" value={`${counts.all}`} tone="primary" icon={<Icon.Activity className="h-5 w-5" />} />
        <Stat label="Kritieke signalen" value={`${counts.kritiek}`} tone="rose" icon={<Icon.AlertTriangle className="h-5 w-5" />} />
        <Stat label="Sollicitaties" value={`${counts.sollicitatie}`} tone="amber" icon={<Icon.Bell className="h-5 w-5" />} />
        <Stat label="Te goedkeuren" value={`${counts.weekstaat}`} tone="navy" icon={<Icon.Clock className="h-5 w-5" />} />
      </div>

      {/* Unified inbox */}
      <Card>
        <CardHeader
          title="Alle items"
          subtitle="Outlook-style: chronologisch, met filters en quick-actions"
          action={
            <div className="flex gap-2">
              <button className="btn-secondary"><Icon.Refresh className="h-4 w-4" />Vernieuw</button>
              <button className="btn-secondary"><Icon.Check className="h-4 w-4" />Alles als gelezen</button>
            </div>
          }
        />
        <CardBody>
          {items.length === 0 ? (
            <EmptyState
              icon={<Icon.Check className="h-5 w-5" />}
              title="Inbox is leeg"
              description="Alle items zijn afgehandeld. Goed bezig."
            />
          ) : (
            <ul className="divide-y divide-bone-100">
              {items.slice(0, 30).map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className={`flex items-start gap-3 p-3 transition hover:bg-bone-50 ${item.unread ? 'bg-primary-50/40' : ''}`}
                  >
                    <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-md ${
                      item.kind === 'APPLICATION' ? 'bg-amber-100 text-amber-700' :
                      item.kind === 'ABSENCE' ? 'bg-rose-100 text-rose-700' :
                      item.kind === 'TIMESHEET' ? 'bg-sky-100 text-sky-700' :
                      item.kind === 'MESSAGE' ? 'bg-bone-100 text-ink-700' :
                      item.kind === 'SIGNAL' ? 'bg-rose-50 text-rose-700' :
                      'bg-primary-100 text-primary-700'
                    }`}>
                      {item.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`font-display text-sm ${item.unread ? 'font-bold text-ink-900' : 'font-semibold text-ink-800'}`}>
                          {item.title}
                        </span>
                        <Badge variant={item.badgeVariant}>{item.badgeText}</Badge>
                      </div>
                      <div className="mt-0.5 line-clamp-1 text-xs text-ink-600">{item.body}</div>
                    </div>
                    <div className="shrink-0 text-[11px] text-ink-400">{timeAgo(item.when)}</div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>

      {/* Help row */}
      <Card className="mt-6">
        <CardBody>
          <div className="flex items-start gap-4">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-primary-500 text-white">
              <Icon.Activity className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-ink-900">
                Eén overzicht ipv 8 mailboxen
              </h3>
              <p className="mt-1 text-sm text-ink-700">
                Sollicitaties, ziekmeldingen, weekstaten ter goedkeuring, berichten, system-signalen
                en geautomatiseerde acties — allemaal in deze inbox. Geen regio-mapjes meer in
                Outlook, geen losse Excel-lijsten, geen verloren signalen.
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </PortalShell>
  );
}

function Stat({ label, value, tone, icon }: { label: string; value: string; tone: 'primary' | 'navy' | 'rose' | 'amber'; icon: React.ReactNode }) {
  const cls = {
    primary: 'bg-primary-500 text-white',
    navy: 'bg-navy-600 text-white',
    rose: 'bg-rose-500 text-white',
    amber: 'bg-amber-500 text-white',
  }[tone];
  return (
    <div className="card-padded">
      <div className={`grid h-10 w-10 place-items-center rounded-md ${cls}`}>{icon}</div>
      <div className="mt-3 font-display text-2xl font-bold text-ink-900">{value}</div>
      <div className="text-xs font-semibold uppercase tracking-wider text-ink-500">{label}</div>
    </div>
  );
}

function FilterChip({ label, count, active, tone }: { label: string; count: number; active?: boolean; tone?: 'amber' | 'rose' }) {
  const cls = active
    ? 'bg-primary-500 text-white'
    : tone === 'amber'
    ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
    : tone === 'rose'
    ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
    : 'bg-bone-100 text-ink-700 hover:bg-bone-200';
  return (
    <button className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition ${cls}`}>
      {label}
      <span className={`inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
        active ? 'bg-white text-primary-600' : 'bg-white text-ink-700'
      }`}>{count}</span>
    </button>
  );
}
