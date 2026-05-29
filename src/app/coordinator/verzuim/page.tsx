import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Icon } from '@/components/ui/Icon';
import { getDemoSession } from '@/lib/data/session';
import { listAbsences } from '@/lib/data/compliance';
import { db } from '@/lib/db';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function CoordinatorVerzuimPage() {
  const ctx = getDemoSession('COORDINATOR');
  const [absences, coordinator] = await Promise.all([
    listAbsences(ctx),
    db.coordinator.findUnique({ where: { id: ctx.coordinatorId! }, include: { user: true, region: true } }),
  ]);
  const open = absences.filter((a) => !a.closedAt).length;
  const gesloten = absences.length - open;

  return (
    <PortalShell
      role="COORDINATOR"
      activeHref="/coordinator/verzuim"
      userName={coordinator?.user.name ?? 'Coördinator'}
      userSubtitle={`Coördinator regio ${coordinator?.region.name ?? ''}`}
      greeting={{ title: 'Ziekteverzuim', subtitle: 'Open en gesloten meldingen in jouw regio.' }}
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
        <KPI tone="rose" label="Open meldingen" value={`${open}`} icon={<Icon.Heart className="h-5 w-5" />} />
        <KPI tone="amber" label="Gemiddelde duur" value="3,2 dagen" icon={<Icon.Clock className="h-5 w-5" />} />
        <KPI tone="wood" label="Totaal" value={`${absences.length}`} icon={<Icon.Activity className="h-5 w-5" />} />
        <KPI tone="green" label="Gesloten" value={`${gesloten}`} icon={<Icon.CheckCircle className="h-5 w-5" />} />
      </div>

      <Card className="mt-6">
        <CardHeader title="Alle meldingen" subtitle="Sorteer op datum" />
        <CardBody>
          {absences.length === 0 ? (
            <div className="text-sm text-ink-500">Geen verzuim meldingen.</div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-bone-200">
              <table className="w-full min-w-[640px] border-collapse text-sm">
                <thead>
                  <tr>
                    <th className="table-head">Student</th>
                    <th className="table-head">Type</th>
                    <th className="table-head">Periode</th>
                    <th className="table-head">Gemeld op</th>
                    <th className="table-head">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {absences.map((a) => (
                    <tr key={a.id} className="table-row">
                      <td className="table-cell">
                        <div className="flex items-center gap-3">
                          <Avatar name={a.student.user.name} size="sm" tone="wood" />
                          <span className="font-medium text-ink-900">{a.student.user.name}</span>
                        </div>
                      </td>
                      <td className="table-cell">{a.type === 'ZIEKTE' ? 'Ziekte' : 'Verlof'}</td>
                      <td className="table-cell">
                        {formatDate(a.startDate)}{a.endDate ? ` – ${formatDate(a.endDate)}` : ' – open'}
                      </td>
                      <td className="table-cell text-ink-500">{formatDate(a.reportedAt)}</td>
                      <td className="table-cell">
                        <Badge variant={a.closedAt ? 'success' : 'warning'}>
                          {a.closedAt ? 'Gesloten' : 'Open'}
                        </Badge>
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
