import Link from 'next/link';
import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Toolbar, FilterChip } from '@/components/ui/Toolbar';
import { Icon } from '@/components/ui/Icon';
import { currentCoordinator } from '@/lib/mock/users';
import { contracts } from '@/lib/mock/misc';
import { students } from '@/lib/mock/students';
import { companies } from '@/lib/mock/companies';
import { formatDate } from '@/lib/utils';

export default function CoordinatorContractenPage() {
  return (
    <PortalShell
      role="COORDINATOR"
      activeHref="/coordinator/contracten"
      userName={currentCoordinator.name}
      userSubtitle="Coördinator regio Noord"
      greeting={{ title: 'Contracten', subtitle: 'Aflopende, actieve en verlopen contracten in jouw regio.' }}
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
        <KPI tone="green" label="Actief" value={contracts.filter((c) => c.status === 'Actief').length.toString()} />
        <KPI tone="amber" label="Aflopend" value={contracts.filter((c) => c.status === 'Aflopend').length.toString()} />
        <KPI tone="rose" label="Verlopen" value={contracts.filter((c) => c.status === 'Verlopen').length.toString()} />
        <KPI tone="wood" label="Concept" value={contracts.filter((c) => c.status === 'Concept').length.toString()} />
      </div>

      <Card className="mt-6">
        <CardHeader title="Overzicht" subtitle="Filter op status of einddatum" />
        <CardBody>
          <Toolbar placeholder="Zoek contract of student…">
            <FilterChip label="Alle" active />
            <FilterChip label="Aflopend < 4 wk" />
            <FilterChip label="Verlopen" />
          </Toolbar>

          <div className="mt-4 overflow-x-auto rounded-xl border border-bone-200">
            <table className="w-full min-w-[760px] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="table-head">Student</th>
                  <th className="table-head">Bedrijf</th>
                  <th className="table-head">Startdatum</th>
                  <th className="table-head">Einddatum</th>
                  <th className="table-head text-right">Uren / week</th>
                  <th className="table-head">Status</th>
                  <th className="table-head"></th>
                </tr>
              </thead>
              <tbody>
                {contracts.map((c) => {
                  const stu = students.find((s) => s.id === c.studentId);
                  const com = companies.find((x) => x.id === c.companyId);
                  return (
                    <tr key={c.id} className="table-row">
                      <td className="table-cell font-medium text-ink-900">{stu?.name ?? '-'}</td>
                      <td className="table-cell">{com?.name ?? '-'}</td>
                      <td className="table-cell">{formatDate(c.startDate)}</td>
                      <td className="table-cell">{formatDate(c.endDate)}</td>
                      <td className="table-cell text-right">{c.hoursPerWeek} u</td>
                      <td className="table-cell">
                        <Badge variant={c.status === 'Actief' ? 'success' : c.status === 'Aflopend' ? 'warning' : c.status === 'Verlopen' ? 'danger' : 'neutral'}>
                          {c.status}
                        </Badge>
                      </td>
                      <td className="table-cell text-right">
                        <Link href={stu ? `/coordinator/studenten/${stu.id}` : '#'} className="btn-ghost">
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

function KPI({ tone, label, value }: { tone: 'wood' | 'green' | 'amber' | 'rose'; label: string; value: string }) {
  const cls = {
    wood: 'bg-wood-50 text-wood-700 ring-wood-100',
    green: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    amber: 'bg-amber-50 text-amber-700 ring-amber-100',
    rose: 'bg-rose-50 text-rose-700 ring-rose-100',
  }[tone];
  return (
    <div className={`rounded-2xl px-4 py-4 ring-1 ${cls}`}>
      <div className="text-[11px] font-medium uppercase tracking-wider opacity-80">{label}</div>
      <div className="mt-1 font-display text-3xl font-semibold">{value}</div>
    </div>
  );
}
