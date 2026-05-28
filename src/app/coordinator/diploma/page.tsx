import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Icon } from '@/components/ui/Icon';
import { currentCoordinator } from '@/lib/mock/users';
import { students } from '@/lib/mock/students';
import { programs } from '@/lib/mock/programs';
import { formatDate } from '@/lib/utils';

export default function CoordinatorDiplomaPage() {
  const kandidaten = students.filter((s) => s.yearOfStudy === 3);
  return (
    <PortalShell
      role="COORDINATOR"
      activeHref="/coordinator/diploma"
      userName={currentCoordinator.name}
      userSubtitle="Coördinator regio Noord"
      greeting={{ title: 'Diploma & uitstroom', subtitle: 'Kandidaten voor dit schooljaar.' }}
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <KPI tone="wood" label="Diploma kandidaten" value={kandidaten.length.toString()} icon={<Icon.BookOpen className="h-5 w-5" />} />
        <KPI tone="green" label="Klaar voor examen" value="9" icon={<Icon.CheckCircle className="h-5 w-5" />} />
        <KPI tone="amber" label="Aandachtspunten" value="3" icon={<Icon.AlertTriangle className="h-5 w-5" />} />
      </div>

      <Card className="mt-6">
        <CardHeader title="Diploma kandidaten 2026" subtitle="Status per student" />
        <CardBody>
          <div className="overflow-x-auto rounded-xl border border-bone-200">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="table-head">Student</th>
                  <th className="table-head">Opleiding</th>
                  <th className="table-head">Verwacht diploma</th>
                  <th className="table-head">Status</th>
                  <th className="table-head"></th>
                </tr>
              </thead>
              <tbody>
                {kandidaten.map((s) => {
                  const program = programs.find((p) => p.id === s.programId)!;
                  return (
                    <tr key={s.id} className="table-row">
                      <td className="table-cell">
                        <div className="flex items-center gap-3">
                          <Avatar name={s.name} size="sm" tone="wood" />
                          <span className="font-medium text-ink-900">{s.name}</span>
                        </div>
                      </td>
                      <td className="table-cell">{program.name} {program.level}</td>
                      <td className="table-cell">{s.expectedDiplomaDate ? formatDate(s.expectedDiplomaDate) : '-'}</td>
                      <td className="table-cell">
                        <Badge variant={s.signal === 'Goed' ? 'success' : s.signal === 'Aandacht' ? 'warning' : 'danger'}>
                          {s.signal}
                        </Badge>
                      </td>
                      <td className="table-cell text-right">
                        <button className="btn-ghost">
                          <Icon.ArrowRight className="h-4 w-4" />
                        </button>
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
