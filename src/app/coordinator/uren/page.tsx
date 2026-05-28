import Link from 'next/link';
import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Toolbar, FilterChip } from '@/components/ui/Toolbar';
import { Icon } from '@/components/ui/Icon';
import { currentCoordinator } from '@/lib/mock/users';
import { students } from '@/lib/mock/students';
import { formatHours, weekRange } from '@/lib/utils';

const rows = students.map((s, i) => ({
  studentId: s.id,
  name: s.name,
  week: 22,
  weekStart: '2026-05-25',
  praktijk: 28 + (i % 4) * 2,
  school: 7,
  ontbrekend: i % 3 === 1 ? 3 : 0,
  status: ['Goedgekeurd', 'Ingediend', 'Concept', 'Goedgekeurd', 'Ingediend', 'Goedgekeurd', 'Concept'][i] as
    | 'Goedgekeurd'
    | 'Ingediend'
    | 'Concept'
    | 'Afgekeurd',
}));

const statusVariant: Record<string, 'success' | 'info' | 'warning' | 'danger'> = {
  Goedgekeurd: 'success',
  Ingediend: 'info',
  Concept: 'warning',
  Afgekeurd: 'danger',
};

export default function CoordinatorUrenPage() {
  return (
    <PortalShell
      role="COORDINATOR"
      activeHref="/coordinator/uren"
      userName={currentCoordinator.name}
      userSubtitle="Coördinator regio Noord"
      greeting={{ title: 'Urenoverzicht', subtitle: 'Per student per week.' }}
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
        <KPI tone="wood" label="Studenten" value={students.length.toString()} icon={<Icon.Users className="h-5 w-5" />} />
        <KPI tone="green" label="Compleet" value="4" icon={<Icon.CheckCircle className="h-5 w-5" />} />
        <KPI tone="amber" label="Ontbrekend" value="2" icon={<Icon.AlertTriangle className="h-5 w-5" />} />
        <KPI tone="rose" label="Afgekeurd" value="1" icon={<Icon.X className="h-5 w-5" />} />
      </div>

      <Card className="mt-6">
        <CardHeader title="Week 22 · 25 – 31 mei 2026" subtitle="Filter op status of student" />
        <CardBody>
          <Toolbar placeholder="Zoek student…">
            <FilterChip label="Alle" active />
            <FilterChip label="Ontbrekend" />
            <FilterChip label="Ingediend" />
            <FilterChip label="Concept" />
            <FilterChip label="Afgekeurd" />
          </Toolbar>

          <div className="mt-4 overflow-x-auto rounded-xl border border-bone-200">
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="table-head">Student</th>
                  <th className="table-head">Periode</th>
                  <th className="table-head text-right">Praktijk</th>
                  <th className="table-head text-right">School</th>
                  <th className="table-head text-right">Ontbrekend</th>
                  <th className="table-head">Status</th>
                  <th className="table-head"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.studentId} className="table-row">
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <Avatar name={r.name} size="sm" tone="wood" />
                        <span className="font-medium text-ink-900">{r.name}</span>
                      </div>
                    </td>
                    <td className="table-cell text-ink-600">W{r.week} · {weekRange(r.weekStart)}</td>
                    <td className="table-cell text-right">{formatHours(r.praktijk)}</td>
                    <td className="table-cell text-right">{formatHours(r.school)}</td>
                    <td className="table-cell text-right">
                      {r.ontbrekend > 0 ? (
                        <Badge variant="warning">{formatHours(r.ontbrekend)}</Badge>
                      ) : (
                        <Badge variant="success">Compleet</Badge>
                      )}
                    </td>
                    <td className="table-cell">
                      <Badge variant={statusVariant[r.status]}>{r.status}</Badge>
                    </td>
                    <td className="table-cell text-right">
                      <Link href={`/coordinator/studenten/${r.studentId}`} className="btn-ghost">
                        Bekijk <Icon.ArrowRight className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </PortalShell>
  );
}

function KPI({ tone, label, value, icon }: { tone: 'wood' | 'green' | 'amber' | 'rose'; label: string; value: string; icon: React.ReactNode }) {
  const cls = {
    wood: 'bg-wood-50 text-wood-700 ring-wood-100',
    green: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    amber: 'bg-amber-50 text-amber-700 ring-amber-100',
    rose: 'bg-rose-50 text-rose-700 ring-rose-100',
  }[tone];
  return (
    <div className="card-padded">
      <div className={`grid h-10 w-10 place-items-center rounded-xl ring-1 ${cls}`}>{icon}</div>
      <div className="mt-3 text-xs font-medium uppercase tracking-wider text-ink-500">{label}</div>
      <div className="mt-1 font-display text-2xl font-semibold text-ink-900">{value}</div>
    </div>
  );
}
