import Link from 'next/link';
import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Icon } from '@/components/ui/Icon';
import { EmptyState } from '@/components/ui/EmptyState';
import { getDemoSession } from '@/lib/data/session';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function CoordinatorRegioPage() {
  const ctx = getDemoSession('COORDINATOR');
  const [coordinator, companies, students] = await Promise.all([
    db.coordinator.findUnique({
      where: { id: ctx.coordinatorId! },
      include: { user: true, region: true, _count: { select: { students: true } } },
    }).catch(() => null),
    ctx.regionId
      ? db.company.findMany({
          where: { regionId: ctx.regionId },
          include: { _count: { select: { students: true } }, contacts: { include: { user: true }, where: { primary: true }, take: 1 } },
          orderBy: { name: 'asc' },
        }).catch(() => [])
      : Promise.resolve([]),
    db.student.findMany({
      where: { coordinatorId: ctx.coordinatorId! },
      include: { user: true, program: true, company: true },
      orderBy: { user: { name: 'asc' } },
    }).catch(() => []),
  ]);

  if (!coordinator) {
    return (
      <PortalShell role="COORDINATOR" activeHref="/coordinator/regio" userName="Coördinator" userSubtitle="Coördinator">
        <EmptyState icon={<Icon.Activity className="h-5 w-5" />} title="Geen regio gevonden" />
      </PortalShell>
    );
  }

  return (
    <PortalShell
      role="COORDINATOR"
      activeHref="/coordinator/regio"
      userName={coordinator.user.name}
      userSubtitle={`Coördinator regio ${coordinator.region.name}`}
      greeting={{
        title: `Regio ${coordinator.region.name}`,
        subtitle: `${coordinator._count.students} studenten · ${companies.length} lidbedrijven`,
      }}
    >
      {/* Coordinator info + public-page link */}
      <Card>
        <CardBody>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar name={coordinator.user.name} size="lg" tone="green" />
              <div>
                <h2 className="font-display text-2xl font-bold text-ink-900">{coordinator.user.name}</h2>
                <p className="text-sm text-ink-500">Coördinator · {coordinator.user.email}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/regios/regio-${coordinator.region.name.toLowerCase()}`}
                className="btn-secondary"
                target="_blank"
              >
                <Icon.ArrowRight className="h-4 w-4" />
                Bekijk publieke pagina
              </Link>
              <Link href="/coordinator/instellingen" className="btn-primary">
                <Icon.Settings className="h-4 w-4" />
                Bewerk profiel
              </Link>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat icon={<Icon.Users className="h-5 w-5" />} label="Studenten" value={`${coordinator._count.students}`} tone="primary" />
        <Stat icon={<Icon.Briefcase className="h-5 w-5" />} label="Lidbedrijven" value={`${companies.length}`} tone="navy" />
        <Stat icon={<Icon.BookOpen className="h-5 w-5" />} label="Diploma kandidaten" value={`${students.filter((s) => s.yearOfStudy === 3).length}`} tone="emerald" />
        <Stat icon={<Icon.AlertTriangle className="h-5 w-5" />} label="Risico signaal" value={`${students.filter((s) => s.signal === 'Risico').length}`} tone="rose" />
      </div>

      {/* Lidbedrijven */}
      <Card className="mt-6">
        <CardHeader
          title="Lidbedrijven"
          subtitle={`${companies.length} actieve bedrijven in deze regio`}
          action={
            <Link href="/coordinator/lidbedrijven" className="btn-ghost">
              Alle bedrijven<Icon.ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
        <CardBody>
          {companies.length === 0 ? (
            <div className="text-sm text-ink-500">Geen lidbedrijven in deze regio.</div>
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {companies.map((c) => (
                <Link
                  key={c.id}
                  href={`/coordinator/lidbedrijven/${c.id}`}
                  className="group flex items-center justify-between gap-3 rounded-xl border border-bone-200 p-3 transition hover:border-primary-200 hover:bg-primary-50/30"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-primary-50 text-primary-700">
                      <Icon.Briefcase className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-ink-900">{c.name}</div>
                      <div className="truncate text-xs text-ink-500">
                        {c.contacts[0]?.user.name ?? 'Geen contactpersoon'}
                      </div>
                    </div>
                  </div>
                  <Badge variant="wood">{c._count.students}</Badge>
                </Link>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Studenten in regio */}
      <Card className="mt-6">
        <CardHeader
          title="Studenten"
          subtitle={`${students.length} actieve studenten`}
          action={
            <Link href="/coordinator/studenten" className="btn-ghost">
              Volledig overzicht<Icon.ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
        <CardBody>
          {students.length === 0 ? (
            <div className="text-sm text-ink-500">Geen studenten toegewezen.</div>
          ) : (
            <ul className="divide-y divide-bone-100">
              {students.slice(0, 6).map((s) => {
                const variant = s.signal === 'Goed' ? 'success' : s.signal === 'Aandacht' ? 'warning' : 'danger';
                return (
                  <li key={s.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                    <Avatar name={s.user.name} size="sm" tone="wood" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-ink-900">{s.user.name}</div>
                      <div className="truncate text-xs text-ink-500">
                        {s.program.name} {s.program.level.replace('BBL_', 'BBL ')} · {s.company.name}
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

      {/* Acties */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Action href="/coordinator/goedkeuringen" icon={<Icon.Activity className="h-5 w-5" />} title="Weekstaten" body="Goedkeuren of afkeuren" />
        <Action href="/coordinator/verzuim" icon={<Icon.Heart className="h-5 w-5" />} title="Verzuim" body="Open meldingen" />
        <Action href="/coordinator/diploma" icon={<Icon.BookOpen className="h-5 w-5" />} title="Diploma" body="Kandidaten dit jaar" />
      </div>
    </PortalShell>
  );
}

function Stat({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: string; tone: 'primary' | 'navy' | 'emerald' | 'rose' }) {
  const cls = {
    primary: 'bg-primary-500 text-white',
    navy: 'bg-navy-600 text-white',
    emerald: 'bg-emerald-600 text-white',
    rose: 'bg-rose-500 text-white',
  }[tone];
  return (
    <div className="card-padded">
      <div className={`grid h-10 w-10 place-items-center rounded-md ${cls}`}>{icon}</div>
      <div className="mt-3 font-display text-2xl font-bold text-ink-900">{value}</div>
      <div className="text-xs font-semibold uppercase tracking-wider text-ink-500">{label}</div>
    </div>
  );
}

function Action({ href, icon, title, body }: { href: string; icon: React.ReactNode; title: string; body: string }) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-4 rounded-2xl border border-bone-200 bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:border-primary-200"
    >
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-primary-500 text-white">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-display text-base font-bold text-ink-900">{title}</div>
        <div className="text-xs text-ink-500">{body}</div>
      </div>
      <Icon.ArrowRight className="h-4 w-4 text-primary-500 transition group-hover:translate-x-1" />
    </Link>
  );
}
