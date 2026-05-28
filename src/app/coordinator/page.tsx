import Link from 'next/link';
import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Icon } from '@/components/ui/Icon';
import { EmptyState } from '@/components/ui/EmptyState';
import { getDemoSession } from '@/lib/data/session';
import { getCoordinatorDashboard } from '@/lib/data/dashboard';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function CoordinatorDashboardPage() {
  const ctx = getDemoSession('COORDINATOR');
  const data = await getCoordinatorDashboard(ctx);

  if (!data) {
    return (
      <PortalShell role="COORDINATOR" activeHref="/coordinator" userName="Demo" userSubtitle="Coördinator">
        <EmptyState
          icon={<Icon.User className="h-5 w-5" />}
          title="Geen coördinator-profiel gevonden"
          description="Heb je de database al geseed?"
        />
      </PortalShell>
    );
  }

  const coordinator = await db.coordinator.findUnique({
    where: { id: ctx.coordinatorId! },
    include: { user: true, region: true },
  });

  const { students, aflopend, diplomaKandidaten, planning, companies, openVerzuim, totalStudents } = data;

  return (
    <PortalShell
      role="COORDINATOR"
      activeHref="/coordinator"
      userName={coordinator?.user.name ?? 'Coördinator'}
      userSubtitle={`Coördinator regio ${coordinator?.region.name ?? ''}`}
      greeting={{
        title: 'Dashboard',
        subtitle: `Overzicht van jouw regio ${coordinator?.region.name ?? ''}.`,
      }}
    >
      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        <StatCard label="Studenten" value={totalStudents} hint="Actief" icon={<Icon.Users className="h-5 w-5" />} tone="wood" />
        <StatCard label="Ziekteverzuim" value={openVerzuim} hint="Open meldingen" icon={<Icon.Heart className="h-5 w-5" />} tone="rose" />
        <StatCard label="Aflopende contracten" value={aflopend} hint="Binnen 4 weken" icon={<Icon.Doc className="h-5 w-5" />} tone="amber" />
        <StatCard label="Diploma kandidaten" value={diplomaKandidaten} hint="Dit jaar" icon={<Icon.BookOpen className="h-5 w-5" />} tone="green" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Studentenoverzicht"
            subtitle="Signalen op basis van uren, contract en verzuim"
            action={
              <Link href="/coordinator/studenten" className="btn-ghost">
                Bekijk alles
                <Icon.ArrowRight className="h-4 w-4" />
              </Link>
            }
          />
          <CardBody>
            {students.length === 0 ? (
              <div className="text-sm text-ink-500">Geen studenten toegewezen.</div>
            ) : (
              <ul className="divide-y divide-bone-100">
                {students.map((s) => {
                  const variant = s.signal === 'Goed' ? 'success' : s.signal === 'Aandacht' ? 'warning' : 'danger';
                  return (
                    <li key={s.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                      <Avatar name={s.user.name} tone="wood" />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium text-ink-900">{s.user.name}</div>
                        <div className="truncate text-xs text-ink-500">
                          {s.program.name} {s.program.level.replace('BBL_', 'BBL ')}
                        </div>
                      </div>
                      <Badge variant={variant}>{s.signal}</Badge>
                      <Link href={`/coordinator/studenten/${s.id}`} className="btn-ghost">
                        <Icon.ArrowRight className="h-4 w-4" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Verzuim deze maand" subtitle="Verdeling" action={
            <Link href="/coordinator/verzuim" className="btn-ghost">Alles</Link>
          } />
          <CardBody>
            <div className="flex items-center gap-5">
              <Donut total={openVerzuim || 1} parts={[
                { value: Math.max(1, Math.floor(openVerzuim * 0.6)), color: '#B6605A', label: 'Ziek' },
                { value: Math.max(1, Math.floor(openVerzuim * 0.25)), color: '#5C7A4E', label: 'Beter gemeld' },
                { value: Math.max(1, openVerzuim - Math.floor(openVerzuim * 0.85)), color: '#C99146', label: 'Ongeoorloofd' },
              ]} />
              <ul className="flex flex-col gap-2 text-sm">
                <Legend color="#B6605A" label="Ziek" value={`${Math.max(1, Math.floor(openVerzuim * 0.6))}`} />
                <Legend color="#5C7A4E" label="Beter gemeld" value={`${Math.max(1, Math.floor(openVerzuim * 0.25))}`} />
                <Legend color="#C99146" label="Ongeoorloofd" value={`${Math.max(1, openVerzuim - Math.floor(openVerzuim * 0.85))}`} />
              </ul>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Plannings" subtitle="Komende periode" action={
            <Link href="/coordinator/planning" className="btn-ghost">Jaaroverzicht</Link>
          } />
          <CardBody>
            {planning.length === 0 ? (
              <div className="text-sm text-ink-500">Niets gepland.</div>
            ) : (
              <ul className="divide-y divide-bone-100">
                {planning.map((p) => (
                  <li key={p.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-wood-50 text-wood-700 ring-1 ring-wood-100">
                      <Icon.Calendar className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-ink-900">{p.title}</div>
                      <div className="text-xs text-ink-500">
                        {new Intl.DateTimeFormat('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' }).format(p.startDate)}
                      </div>
                    </div>
                    <Badge variant={p.status === 'BEVESTIGD' ? 'success' : 'neutral'}>
                      {p.status === 'BEVESTIGD' ? 'Bevestigd' : 'Gepland'}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Lidbedrijven in regio" subtitle={`${companies.length} actieve bedrijven`} action={
            <Link href="/coordinator/lidbedrijven" className="btn-ghost">Bekijk alles</Link>
          } />
          <CardBody>
            <ul className="flex flex-col gap-2">
              {companies.map((c) => (
                <li key={c.id} className="flex items-center justify-between rounded-xl border border-bone-200 px-3 py-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-bone-100 text-ink-700">
                      <Icon.Briefcase className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-ink-900">{c.name}</div>
                      <div className="truncate text-xs text-ink-500">{c.membership}</div>
                    </div>
                  </div>
                  <Badge variant="wood">{c._count.students}</Badge>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader title="Signalen" subtitle="Acties die aandacht vragen" />
        <CardBody>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <Signal tone="rose" title={`${openVerzuim} open verzuim`} hint="Volg actief op met student en lidbedrijf" href="/coordinator/verzuim" />
            <Signal tone="amber" title={`${aflopend} aflopende contracten`} hint="Binnen 4 weken aflopend" href="/coordinator/contracten" />
            <Signal tone="wood" title={`${diplomaKandidaten} diploma kandidaten`} hint="Plan diploma-uitreiking in" href="/coordinator/diploma" />
          </div>
        </CardBody>
      </Card>
    </PortalShell>
  );
}

function Legend({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <li className="flex items-center gap-2 text-ink-700">
      <span className="inline-block h-2 w-2 rounded-full" style={{ background: color }} />
      <span className="flex-1">{label}</span>
      <span className="font-semibold text-ink-900">{value}</span>
    </li>
  );
}

function Donut({
  total,
  parts,
}: {
  total: number;
  parts: { value: number; color: string; label: string }[];
}) {
  const radius = 36;
  const stroke = 14;
  const c = 2 * Math.PI * radius;
  let cumulative = 0;
  const sum = parts.reduce((a, p) => a + p.value, 0) || 1;
  return (
    <svg viewBox="0 0 100 100" className="h-32 w-32 -rotate-90">
      <circle cx="50" cy="50" r={radius} stroke="#F6F0E5" strokeWidth={stroke} fill="none" />
      {parts.map((p, i) => {
        const len = (p.value / sum) * c;
        const offset = -cumulative;
        cumulative += len;
        return (
          <circle
            key={i}
            cx="50"
            cy="50"
            r={radius}
            stroke={p.color}
            strokeWidth={stroke}
            fill="none"
            strokeDasharray={`${len} ${c - len}`}
            strokeDashoffset={offset}
            strokeLinecap="butt"
          />
        );
      })}
      <text
        x="50"
        y="55"
        textAnchor="middle"
        className="rotate-90 fill-ink-900 font-display text-[18px] font-semibold"
        transform="rotate(90 50 50)"
      >
        {total}
      </text>
    </svg>
  );
}

function Signal({
  tone,
  title,
  hint,
  href,
}: {
  tone: 'wood' | 'rose' | 'amber';
  title: string;
  hint: string;
  href: string;
}) {
  const cls = {
    wood: 'bg-wood-50 ring-wood-100 text-wood-700',
    rose: 'bg-rose-50 ring-rose-100 text-rose-700',
    amber: 'bg-amber-50 ring-amber-100 text-amber-700',
  }[tone];
  return (
    <Link
      href={href}
      className={`flex items-start justify-between gap-3 rounded-2xl px-4 py-3 ring-1 transition hover:shadow-soft ${cls}`}
    >
      <div>
        <div className="font-medium">{title}</div>
        <div className="mt-1 text-xs opacity-80">{hint}</div>
      </div>
      <Icon.ArrowRight className="mt-0.5 h-4 w-4 opacity-70" />
    </Link>
  );
}
