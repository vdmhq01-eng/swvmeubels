import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Toolbar, FilterChip } from '@/components/ui/Toolbar';
import { Icon } from '@/components/ui/Icon';
import { currentCoordinator } from '@/lib/mock/users';
import { knowledgeArticles } from '@/lib/mock/faq';
import { formatDate } from '@/lib/utils';

export default function CoordinatorKennisbankPage() {
  return (
    <PortalShell
      role="COORDINATOR"
      activeHref="/coordinator/kennisbank"
      userName={currentCoordinator.name}
      userSubtitle="Coördinator regio Noord"
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
                  <th className="table-head"></th>
                </tr>
              </thead>
              <tbody>
                {knowledgeArticles.map((a) => (
                  <tr key={a.id} className="table-row">
                    <td className="table-cell">
                      <div className="font-medium text-ink-900">{a.title}</div>
                      <div className="text-xs text-ink-500">{a.excerpt}</div>
                    </td>
                    <td className="table-cell"><Badge variant="wood">{a.category}</Badge></td>
                    <td className="table-cell text-xs text-ink-500">
                      {a.roles.map((r) => r.toLowerCase()).join(', ')}
                    </td>
                    <td className="table-cell">
                      <Badge variant={a.status === 'GEPUBLICEERD' ? 'success' : 'warning'}>
                        {a.status === 'GEPUBLICEERD' ? 'Gepubliceerd' : 'Concept'}
                      </Badge>
                    </td>
                    <td className="table-cell">v{a.version}</td>
                    <td className="table-cell text-xs text-ink-500">
                      {formatDate(a.updatedAt)} · {a.updatedByName}
                    </td>
                    <td className="table-cell text-right">
                      <button className="btn-ghost">
                        <Icon.ArrowRight className="h-4 w-4" />
                      </button>
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
