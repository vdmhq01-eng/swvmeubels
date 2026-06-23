import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Icon } from '@/components/ui/Icon';
import { currentAdmin } from '@/lib/mock/users';
import { db } from '@/lib/db';
import { marketingRegions } from '@/lib/mock/marketing';

export const dynamic = 'force-dynamic';

export default async function AdminRegioDetailPage({ params }: { params: { slug: string } }) {
  // Mapping van slug naar regio name (van marketing data) → DB regio code
  const marketingRegio = marketingRegions.find((r) => r.slug === params.slug);
  if (!marketingRegio) notFound();

  const [region, coordinators, companies, students] = await Promise.all([
    db.region.findFirst({
      where: { name: marketingRegio.name },
      include: { _count: { select: { students: true, companies: true } } },
    }).catch(() => null),
    db.coordinator.findMany({
      where: { region: { name: marketingRegio.name } },
      include: { user: true, _count: { select: { students: true } } },
    }).catch(() => []),
    db.company.findMany({
      where: { region: { name: marketingRegio.name } },
      include: { _count: { select: { students: true } }, contacts: { include: { user: true }, where: { primary: true }, take: 1 } },
      orderBy: { name: 'asc' },
    }).catch(() => []),
    db.student.findMany({
      where: { region: { name: marketingRegio.name } },
      include: { user: true, program: true, company: true, coordinator: { include: { user: true } } },
      take: 10,
    }).catch(() => []),
  ]);

  return (
    <PortalShell
      role="ADMIN"
      activeHref="/admin/regios"
      userName={currentAdmin.name}
      userSubtitle="Admin"
      greeting={{
        title: `Regio ${marketingRegio.name}`,
        subtitle: `${marketingRegio.companyCount} lidbedrijven · ${marketingRegio.studentCount} studenten`,
      }}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Link href="/admin/regios" className="btn-ghost">
          ← Terug naar regio&apos;s
        </Link>
        <div className="flex gap-2">
          <Link href={`/regios/${params.slug}`} target="_blank" className="btn-secondary">
            <Icon.ArrowRight className="h-4 w-4" />
            Publieke pagina
          </Link>
          <button className="btn-primary">
            <Icon.Check className="h-4 w-4" />
            Wijzigingen opslaan
          </button>
        </div>
      </div>

      {/* Edit form */}
      <Card>
        <CardHeader title="Regio gegevens" subtitle="Wordt getoond op de publieke /regios pagina" />
        <CardBody>
          <form className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="label mb-1.5 block">Naam</label>
              <input className="input" defaultValue={marketingRegio.name} />
            </div>
            <div>
              <label className="label mb-1.5 block">Code</label>
              <input className="input" defaultValue={region?.code ?? '-'} />
            </div>
            <div className="md:col-span-2">
              <label className="label mb-1.5 block">Beschrijving</label>
              <textarea rows={3} className="input" defaultValue={marketingRegio.description} />
            </div>
            <div>
              <label className="label mb-1.5 block">Provincies (komma-gescheiden)</label>
              <input className="input" defaultValue={marketingRegio.provinces.join(', ')} />
            </div>
            <div>
              <label className="label mb-1.5 block">Status</label>
              <select className="input" defaultValue={marketingRegio.belongsToSwv ? 'SWV' : 'BosMti'}>
                <option>SWV</option>
                <option>BosMti</option>
              </select>
            </div>
          </form>
        </CardBody>
      </Card>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatBox label="Lidbedrijven" value={`${companies.length}`} tone="primary" />
        <StatBox label="Studenten" value={`${region?._count.students ?? 0}`} tone="navy" />
        <StatBox label="Coördinatoren" value={`${coordinators.length}`} tone="emerald" />
        <StatBox label="Provincies" value={`${marketingRegio.provinces.length}`} tone="amber" />
      </div>

      {/* Coördinatoren */}
      <Card className="mt-6">
        <CardHeader title="Coördinatoren in deze regio" subtitle="Wijs studenten toe of pas contactgegevens aan" action={
          <button className="btn-secondary"><Icon.Plus className="h-4 w-4" /> Nieuwe coördinator</button>
        } />
        <CardBody>
          {coordinators.length === 0 ? (
            <div className="text-sm text-ink-500">Geen coördinator gekoppeld aan deze regio.</div>
          ) : (
            <ul className="divide-y divide-bone-100">
              {coordinators.map((c) => (
                <li key={c.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                  <Avatar name={c.user.name} tone="green" />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-ink-900">{c.user.name}</div>
                    <div className="text-xs text-ink-500">{c.user.email}</div>
                  </div>
                  <Badge variant="wood">{c._count.students} studenten</Badge>
                  <button className="btn-ghost">
                    <Icon.Settings className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>

      {/* Lidbedrijven */}
      <Card className="mt-6">
        <CardHeader title="Lidbedrijven" subtitle={`${companies.length} actieve bedrijven`} action={
          <button className="btn-secondary"><Icon.Plus className="h-4 w-4" /> Bedrijf toevoegen</button>
        } />
        <CardBody>
          {companies.length === 0 ? (
            <div className="text-sm text-ink-500">Geen lidbedrijven.</div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-bone-200">
              <table className="w-full min-w-[640px] border-collapse text-sm">
                <thead>
                  <tr>
                    <th className="table-head">Bedrijf</th>
                    <th className="table-head">Contactpersoon</th>
                    <th className="table-head text-right">Studenten</th>
                    <th className="table-head">Lidmaatschap</th>
                    <th className="table-head"></th>
                  </tr>
                </thead>
                <tbody>
                  {companies.map((c) => (
                    <tr key={c.id} className="table-row">
                      <td className="table-cell font-medium text-ink-900">{c.name}</td>
                      <td className="table-cell text-ink-600">{c.contacts[0]?.user.name ?? '-'}</td>
                      <td className="table-cell text-right">{c._count.students}</td>
                      <td className="table-cell">
                        <Badge variant={c.membership === 'CBM' ? 'success' : 'neutral'}>{c.membership}</Badge>
                      </td>
                      <td className="table-cell text-right">
                        <button className="btn-ghost">
                          <Icon.ArrowRight className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Studenten preview */}
      <Card className="mt-6">
        <CardHeader title="Studenten" subtitle={`${region?._count.students ?? 0} totaal · ${students.length} getoond`} action={
          <Link href="/admin/studenten" className="btn-ghost">
            Volledig overzicht <Icon.ArrowRight className="h-4 w-4" />
          </Link>
        } />
        <CardBody>
          {students.length === 0 ? (
            <div className="text-sm text-ink-500">Geen studenten.</div>
          ) : (
            <ul className="divide-y divide-bone-100">
              {students.map((s) => {
                const variant = s.signal === 'Goed' ? 'success' : s.signal === 'Aandacht' ? 'warning' : 'danger';
                return (
                  <li key={s.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                    <Avatar name={s.user.name} size="sm" tone="wood" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-ink-900">{s.user.name}</div>
                      <div className="truncate text-xs text-ink-500">
                        {s.program.name} {s.program.level.replace('BBL_', 'BBL ')} · {s.company.name} · {s.coordinator.user.name}
                      </div>
                    </div>
                    <Badge variant={variant}>{s.signal}</Badge>
                  </li>
                );
              })}
            </ul>
          )}
        </CardBody>
      </Card>
    </PortalShell>
  );
}

function StatBox({ label, value, tone }: { label: string; value: string; tone: 'primary' | 'navy' | 'emerald' | 'amber' }) {
  const cls = {
    primary: 'bg-primary-500 text-white',
    navy: 'bg-navy-600 text-white',
    emerald: 'bg-emerald-600 text-white',
    amber: 'bg-amber-500 text-white',
  }[tone];
  return (
    <div className={`rounded-2xl p-5 shadow-card ${cls}`}>
      <div className="font-display text-3xl font-bold">{value}</div>
      <div className="mt-1 text-xs font-semibold uppercase tracking-wider opacity-80">{label}</div>
    </div>
  );
}
