import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Icon } from '@/components/ui/Icon';
import { getDemoSession } from '@/lib/data/session';
import { getCompanyById } from '@/lib/data/companies';
import { db } from '@/lib/db';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function CompanyDetailPage({ params }: { params: { id: string } }) {
  const ctx = getDemoSession('COORDINATOR');
  const [company, coordinator] = await Promise.all([
    getCompanyById(params.id),
    db.coordinator.findUnique({ where: { id: ctx.coordinatorId! }, include: { user: true, region: true } }).catch(() => null),
  ]);
  if (!company) notFound();
  const contact = company.contacts[0];

  return (
    <PortalShell
      role="COORDINATOR"
      activeHref="/coordinator/lidbedrijven"
      userName={coordinator?.user.name ?? 'Coördinator'}
      userSubtitle={`Coördinator regio ${coordinator?.region.name ?? ''}`}
      greeting={{ title: company.name, subtitle: `Regio ${company.region.name} · ${company.membership}-lid` }}
    >
      <div className="mb-4">
        <Link href="/coordinator/lidbedrijven" className="btn-ghost">
          ← Terug naar lidbedrijven
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardBody>
            <div className="flex items-start gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-wood-50 text-wood-700 ring-1 ring-wood-100">
                <Icon.Briefcase className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h2 className="font-display text-2xl font-semibold text-ink-900">{company.name}</h2>
                <p className="text-sm text-ink-500">{contact?.user.name ?? 'Geen primaire contactpersoon'}</p>
                <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                  <Field label="E-mail" value={contact?.user.email ?? '-'} />
                  <Field label="Regio" value={company.region.name} />
                  <Field label="Lidmaatschap" value={company.membership} />
                  <Field label="Contacten" value={`${company.contacts.length}`} />
                </dl>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Studenten actief" />
          <CardBody>
            <div className="grid place-items-center rounded-2xl border border-wood-100 bg-wood-50 p-6 text-center">
              <div className="text-xs font-semibold uppercase tracking-wider text-wood-700">Bij dit bedrijf</div>
              <div className="font-display text-4xl font-semibold text-ink-900">{company.students.length}</div>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader title="Studenten" />
        <CardBody>
          {company.students.length === 0 ? (
            <div className="text-sm text-ink-500">Geen studenten.</div>
          ) : (
            <ul className="divide-y divide-bone-100">
              {company.students.map((s) => (
                <li key={s.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <Avatar name={s.user.name} size="sm" tone="wood" />
                    <div>
                      <div className="text-sm font-medium text-ink-900">{s.user.name}</div>
                      <div className="text-xs text-ink-500">{s.program.name} {s.program.level.replace('BBL_', 'BBL ')} · jaar {s.yearOfStudy}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={s.signal === 'Goed' ? 'success' : s.signal === 'Aandacht' ? 'warning' : 'danger'}>{s.signal}</Badge>
                    <Link href={`/coordinator/studenten/${s.id}`} className="btn-ghost">
                      <Icon.ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>

      <Card className="mt-6">
        <CardHeader title="Lopende contracten" />
        <CardBody>
          {company.contracts.length === 0 ? (
            <div className="text-sm text-ink-500">Geen contracten.</div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-bone-200">
              <table className="w-full min-w-[560px] border-collapse text-sm">
                <thead>
                  <tr>
                    <th className="table-head">Student</th>
                    <th className="table-head">Periode</th>
                    <th className="table-head text-right">Uren / week</th>
                    <th className="table-head">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {company.contracts.map((c) => (
                    <tr key={c.id} className="table-row">
                      <td className="table-cell">{c.student.user.name}</td>
                      <td className="table-cell">{formatDate(c.startDate)} – {formatDate(c.endDate)}</td>
                      <td className="table-cell text-right">{c.hoursPerWeek} u</td>
                      <td className="table-cell">
                        <Badge variant={c.status === 'ACTIEF' ? 'success' : c.status === 'AFLOPEND' ? 'warning' : 'neutral'}>{c.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>
    </PortalShell>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] font-medium uppercase tracking-wider text-ink-500">{label}</dt>
      <dd className="text-sm text-ink-900">{value}</dd>
    </div>
  );
}
