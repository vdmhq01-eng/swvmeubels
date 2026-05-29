import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Toolbar, FilterChip } from '@/components/ui/Toolbar';
import { Icon } from '@/components/ui/Icon';
import { getDemoSession } from '@/lib/data/session';
import { listAllKnowledge } from '@/lib/data/content';
import { db } from '@/lib/db';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function CoordinatorKennisbankPage() {
  const ctx = getDemoSession('COORDINATOR');
  const [articles, coordinator] = await Promise.all([
    listAllKnowledge(),
    db.coordinator.findUnique({ where: { id: ctx.coordinatorId! }, include: { user: true, region: true } }),
  ]);
  return (
    <PortalShell
      role="COORDINATOR"
      activeHref="/coordinator/kennisbank"
      userName={coordinator?.user.name ?? 'Coördinator'}
      userSubtitle={`Coördinator regio ${coordinator?.region.name ?? ''}`}
      greeting={{ title: 'Kennisbank beheren', subtitle: 'Artikelen, categorieën, tags en versiebeheer.' }}
    >
      <Card>
        <CardBody>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Toolbar placeholder="Zoek artikel…">
              <FilterChip label="Alle" active />
              <FilterChip label="Gepubliceerd" />
              <FilterChip label="Concept" />
            </Toolbar>
            <button className="btn-primary">
              <Icon.Plus className="h-4 w-4" /> Nieuw artikel
            </button>
          </div>
        </CardBody>
      </Card>

      <Card className="mt-6">
        <CardBody>
          <div className="overflow-x-auto rounded-xl border border-bone-200">
            <table className="w-full min-w-[760px] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="table-head">Titel</th>
                  <th className="table-head">Categorie</th>
                  <th className="table-head">Zichtbaar voor</th>
                  <th className="table-head">Status</th>
                  <th className="table-head">Versie</th>
                  <th className="table-head">Bijgewerkt</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((a) => (
                  <tr key={a.id} className="table-row">
                    <td className="table-cell">
                      <div className="font-medium text-ink-900">{a.title}</div>
                      <div className="text-xs text-ink-500 line-clamp-1">{a.body}</div>
                    </td>
                    <td className="table-cell"><Badge variant="wood">{a.category}</Badge></td>
                    <td className="table-cell text-xs text-ink-500">{a.roles.map((r) => r.toLowerCase()).join(', ')}</td>
                    <td className="table-cell">
                      <Badge variant={a.status === 'GEPUBLICEERD' ? 'success' : 'warning'}>
                        {a.status === 'GEPUBLICEERD' ? 'Gepubliceerd' : 'Concept'}
                      </Badge>
                    </td>
                    <td className="table-cell">v{a.version}</td>
                    <td className="table-cell text-xs text-ink-500">{formatDate(a.updatedAt)} · {a.updatedBy}</td>
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
