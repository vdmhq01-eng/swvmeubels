import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Toolbar, FilterChip } from '@/components/ui/Toolbar';
import { Icon } from '@/components/ui/Icon';
import { currentAdmin } from '@/lib/mock/users';
import { knowledgeArticles } from '@/lib/mock/faq';
import { formatDate } from '@/lib/utils';

export default function AdminKennisbankPage() {
  return (
    <PortalShell
      role="ADMIN"
      activeHref="/admin/kennisbank"
      userName={currentAdmin.name}
      userSubtitle="Admin"
      greeting={{ title: 'Kennisbank', subtitle: 'Artikelen, versies, tags en zichtbaarheid.' }}
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
            <table className="w-full min-w-[820px] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="table-head">Titel</th>
                  <th className="table-head">Categorie</th>
                  <th className="table-head">Tags</th>
                  <th className="table-head">Zichtbaar voor</th>
                  <th className="table-head">Versie</th>
                  <th className="table-head">Status</th>
                  <th className="table-head">Bijgewerkt</th>
                </tr>
              </thead>
              <tbody>
                {knowledgeArticles.map((a) => (
                  <tr key={a.id} className="table-row">
                    <td className="table-cell font-medium text-ink-900">{a.title}</td>
                    <td className="table-cell"><Badge variant="wood">{a.category}</Badge></td>
                    <td className="table-cell">
                      <div className="flex flex-wrap gap-1">
                        {a.tags.slice(0, 3).map((t) => (
                          <span key={t} className="rounded-full bg-bone-100 px-2 py-0.5 text-[10px] text-ink-600">#{t}</span>
                        ))}
                      </div>
                    </td>
                    <td className="table-cell text-xs text-ink-500">{a.roles.map((r) => r.toLowerCase()).join(', ')}</td>
                    <td className="table-cell">v{a.version}</td>
                    <td className="table-cell">
                      <Badge variant={a.status === 'GEPUBLICEERD' ? 'success' : 'warning'}>
                        {a.status === 'GEPUBLICEERD' ? 'Gepubliceerd' : 'Concept'}
                      </Badge>
                    </td>
                    <td className="table-cell text-xs text-ink-500">{formatDate(a.updatedAt)} · {a.updatedByName}</td>
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
