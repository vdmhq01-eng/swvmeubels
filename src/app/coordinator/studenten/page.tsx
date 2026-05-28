import Link from 'next/link';
import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Icon } from '@/components/ui/Icon';
import { currentCoordinator } from '@/lib/mock/users';
import { students } from '@/lib/mock/students';
import { companies } from '@/lib/mock/companies';
import { programs } from '@/lib/mock/programs';

export default function StudentenListPage() {
  return (
    <PortalShell
      role="COORDINATOR"
      activeHref="/coordinator/studenten"
      userName={currentCoordinator.name}
      userSubtitle="Coördinator regio Noord"
      greeting={{
        title: 'Studenten',
        subtitle: 'Studenten toegewezen aan jou in regio Noord.',
      }}
    >
      <Card>
        <CardHeader
          title={`${students.length} studenten`}
          subtitle="Filter op opleiding, leerjaar, signaal of lidbedrijf"
          action={
            <div className="flex items-center gap-2">
              <div className="relative">
                <Icon.Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                <input className="input w-64 pl-9" placeholder="Zoek student" />
              </div>
              <button className="btn-secondary">
                <Icon.Settings className="h-4 w-4" /> Filters
              </button>
            </div>
          }
        />
        <CardBody>
          <div className="overflow-x-auto rounded-xl border border-bone-200">
            <table className="w-full min-w-[760px] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="table-head">Student</th>
                  <th className="table-head">Opleiding</th>
                  <th className="table-head">Lidbedrijf</th>
                  <th className="table-head">Jaar</th>
                  <th className="table-head">Signaal</th>
                  <th className="table-head"></th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => {
                  const program = programs.find((p) => p.id === s.programId)!;
                  const company = companies.find((c) => c.id === s.companyId)!;
                  const variant = s.signal === 'Goed' ? 'success' : s.signal === 'Aandacht' ? 'warning' : 'danger';
                  return (
                    <tr key={s.id} className="table-row">
                      <td className="table-cell">
                        <div className="flex items-center gap-3">
                          <Avatar name={s.name} size="sm" tone="wood" />
                          <div>
                            <div className="font-medium text-ink-900">{s.name}</div>
                            <div className="text-xs text-ink-500">{s.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="table-cell">
                        {program.name} <span className="text-ink-500">{program.level}</span>
                      </td>
                      <td className="table-cell">{company.name}</td>
                      <td className="table-cell">jaar {s.yearOfStudy}</td>
                      <td className="table-cell"><Badge variant={variant}>{s.signal}</Badge></td>
                      <td className="table-cell text-right">
                        <Link href={`/coordinator/studenten/${s.id}`} className="btn-ghost">
                          Bekijk
                          <Icon.ArrowRight className="h-4 w-4" />
                        </Link>
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
