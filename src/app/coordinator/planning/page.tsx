import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Toolbar, FilterChip } from '@/components/ui/Toolbar';
import { Icon } from '@/components/ui/Icon';
import { getDemoSession } from '@/lib/data/session';
import { listPlanning } from '@/lib/data/content';
import { db } from '@/lib/db';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const typeLabel: Record<string, string> = {
  SCHOOLDAG: 'Schooldag',
  BPV: 'BPV',
  EVALUATIE: 'Evaluatie',
  PRAKTIJKBEOORDELING: 'Praktijkbeoordeling',
  EXAMEN: 'Examen',
  DIPLOMA: 'Diploma',
  UITSTROOM: 'Uitstroom',
  NIEUWE_OPLEIDING: 'Nieuwe opleiding',
};

export default async function CoordinatorPlanningPage() {
  const ctx = getDemoSession('COORDINATOR');
  const [items, coordinator] = await Promise.all([
    listPlanning(),
    db.coordinator.findUnique({ where: { id: ctx.coordinatorId! }, include: { user: true, region: true } }),
  ]);

  return (
    <PortalShell
      role="COORDINATOR"
      activeHref="/coordinator/planning"
      userName={coordinator?.user.name ?? 'Coördinator'}
      userSubtitle={`Coördinator regio ${coordinator?.region.name ?? ''}`}
      greeting={{ title: 'Schooljaarplanning', subtitle: 'Filter op type, regio of opleiding.' }}
    >
      <Card>
        <CardBody>
          <Toolbar placeholder="Zoek planningsitem…">
            <FilterChip label="Alle" active />
            <FilterChip label="BPV" />
            <FilterChip label="Examens" />
            <FilterChip label="Diploma" />
            <FilterChip label="Evaluatie" />
          </Toolbar>
        </CardBody>
      </Card>

      <Card className="mt-6">
        <CardHeader title="Alle items" subtitle="Komende maanden" action={
          <button className="btn-primary">
            <Icon.Plus className="h-4 w-4" /> Nieuw item
          </button>
        } />
        <CardBody>
          <div className="overflow-x-auto rounded-xl border border-bone-200">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="table-head">Titel</th>
                  <th className="table-head">Type</th>
                  <th className="table-head">Periode</th>
                  <th className="table-head">Status</th>
                  <th className="table-head"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((p) => (
                  <tr key={p.id} className="table-row">
                    <td className="table-cell font-medium text-ink-900">{p.title}</td>
                    <td className="table-cell"><Badge variant="wood">{typeLabel[p.type] ?? p.type}</Badge></td>
                    <td className="table-cell">
                      {p.endDate ? `${formatDate(p.startDate)} – ${formatDate(p.endDate)}` : formatDate(p.startDate)}
                    </td>
                    <td className="table-cell">
                      <Badge variant={p.status === 'BEVESTIGD' ? 'success' : p.status === 'AFGEROND' ? 'neutral' : 'info'}>
                        {p.status === 'BEVESTIGD' ? 'Bevestigd' : p.status === 'AFGEROND' ? 'Afgerond' : p.status === 'GEANNULEERD' ? 'Geannuleerd' : 'Gepland'}
                      </Badge>
                    </td>
                    <td className="table-cell text-right">
                      <button className="btn-ghost"><Icon.ArrowRight className="h-4 w-4" /></button>
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
