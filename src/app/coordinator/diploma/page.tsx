import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Icon } from '@/components/ui/Icon';
import { getDemoSession } from '@/lib/data/session';
import { db } from '@/lib/db';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function CoordinatorDiplomaPage() {
  const ctx = getDemoSession('COORDINATOR');
  const [kandidaten, coordinator] = await Promise.all([
    db.student.findMany({
      where: { coordinatorId: ctx.coordinatorId!, yearOfStudy: { gte: 3 } },
      include: { user: true, program: true },
      orderBy: { expectedDiplomaDate: 'asc' },
    }),
    db.coordinator.findUnique({ where: { id: ctx.coordinatorId! }, include: { user: true, region: true } }),
  ]);
  const goed = kandidaten.filter((k) => k.signal === 'Goed').length;
  const aandacht = kandidaten.filter((k) => k.signal !== 'Goed').length;

  return (
    <PortalShell
      role="COORDINATOR"
      activeHref="/coordinator/diploma"
      userName={coordinator?.user.name ?? 'Coördinator'}
      userSubtitle={`Coördinator regio ${coordinator?.region.name ?? ''}`}
      greeting={{ title: 'Diploma & uitstroom', subtitle: 'Kandidaten voor dit schooljaar.' }}
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <KPI tone="wood" label="Diploma kandidaten" value={`${kandidaten.length}`} icon={<Icon.BookOpen className="h-5 w-5" />} />
        <KPI tone="green" label="Klaar voor examen" value={`${goed}`} icon={<Icon.CheckCircle className="h-5 w-5" />} />
        <KPI tone="amber" label="Aandachtspunten" value={`${aandacht}`} icon={<Icon.AlertTriangle className="h-5 w-5" />} />
      </div>

      <Card className="mt-6">
        <CardHeader title="Diploma kandidaten" subtitle="Status per student" />
        <CardBody>
          <div className="overflow-x-auto rounded-xl border border-bone-200">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="table-head">Student</th>
                  <th className="table-head">Opleiding</th>
                  <th className="table-head">Verwacht diploma</th>
                  <th className="table-head">Status</th>
                </tr>
              </thead>
              <tbody>
                {kandidaten.map((s) => (
                  <tr key={s.id} className="table-row">
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <Avatar name={s.user.name} size="sm" tone="wood" />
                        <span className="font-medium text-ink-900">{s.user.name}</span>
                      </div>
                    </td>
                    <td className="table-cell">{s.program.name} {s.program.level.replace('BBL_', 'BBL ')}</td>
                    <td className="table-cell">{s.expectedDiplomaDate ? formatDate(s.expectedDiplomaDate) : '-'}</td>
                    <td className="table-cell">
                      <Badge variant={s.signal === 'Goed' ? 'success' : s.signal === 'Aandacht' ? 'warning' : 'danger'}>
                        {s.signal}
                      </Badge>
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
