import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Icon } from '@/components/ui/Icon';
import { currentCoordinator } from '@/lib/mock/users';
import { companies } from '@/lib/mock/companies';
import { students } from '@/lib/mock/students';
import { contracts } from '@/lib/mock/misc';
import { formatDate } from '@/lib/utils';

export default function CompanyDetailPage({ params }: { params: { id: string } }) {
  const c = companies.find((co) => co.id === params.id);
  if (!c) notFound();
  const compStudents = students.filter((s) => s.companyId === c.id);

  return (
    <PortalShell
      role="COORDINATOR"
      activeHref="/coordinator/lidbedrijven"
      userName={currentCoordinator.name}
      userSubtitle="Coördinator regio Noord"
      greeting={{ title: c.name, subtitle: `Regio ${c.region} · ${c.membership}-lid` }}
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
                <h2 className="font-display text-2xl font-semibold text-ink-900">{c.name}</h2>
                <p className="text-sm text-ink-500">{c.contactName}</p>
                <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                  <Field label="E-mail" value={c.contactEmail} />
                  <Field label="Telefoon" value={c.contactPhone} />
                  <Field label="Regio" value={c.region} />
                  <Field label="Lidmaatschap" value={c.membership} />
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
              <div className="font-display text-4xl font-semibold text-ink-900">{compStudents.length}</div>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader title="Studenten" />
        <CardBody>
          <ul className="divide-y divide-bone-100">
            {compStudents.map((s) => (
              <li key={s.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <Avatar name={s.name} size="sm" tone="wood" />
                  <div>
                    <div className="text-sm font-medium text-ink-900">{s.name}</div>
                    <div className="text-xs text-ink-500">jaar {s.yearOfStudy}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={s.signal === 'Goed' ? 'success' : s.signal === 'Aandacht' ? 'warning' : 'danger'}>
                    {s.signal}
                  </Badge>
                  <Link href={`/coordinator/studenten/${s.id}`} className="btn-ghost">
                    <Icon.ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>

      <Card className="mt-6">
        <CardHeader title="Lopende contracten" />
        <CardBody>
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
                {contracts
                  .filter((co) => co.companyId === c.id)
                  .map((co) => {
                    const stu = students.find((s) => s.id === co.studentId);
                    return (
                      <tr key={co.id} className="table-row">
                        <td className="table-cell">{stu?.name ?? '-'}</td>
                        <td className="table-cell">{formatDate(co.startDate)} – {formatDate(co.endDate)}</td>
                        <td className="table-cell text-right">{co.hoursPerWeek} u</td>
                        <td className="table-cell">
                          <Badge variant={co.status === 'Actief' ? 'success' : co.status === 'Aflopend' ? 'warning' : 'neutral'}>
                            {co.status}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
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
