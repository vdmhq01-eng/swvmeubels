import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Toolbar, FilterChip } from '@/components/ui/Toolbar';
import { Icon } from '@/components/ui/Icon';
import { currentAdmin } from '@/lib/mock/users';
import { listAllFaq } from '@/lib/data/content';

export const dynamic = 'force-dynamic';

export default async function AdminFaqPage() {
  const faqItems = await listAllFaq();
  return (
    <PortalShell
      role="ADMIN"
      activeHref="/admin/faq"
      userName={currentAdmin.name}
      userSubtitle="Admin"
      greeting={{ title: 'FAQ beheer', subtitle: 'Categorieën, volgorde, rolgebaseerde zichtbaarheid.' }}
    >
      <Card>
        <CardBody>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Toolbar placeholder="Zoek vraag…">
              <FilterChip label="Alle" active />
              <FilterChip label="Gepubliceerd" />
              <FilterChip label="Concept" />
              <FilterChip label="Gearchiveerd" />
            </Toolbar>
            <button className="btn-primary">
              <Icon.Plus className="h-4 w-4" /> Nieuwe FAQ
            </button>
          </div>
        </CardBody>
      </Card>

      <Card className="mt-6">
        <CardBody>
          <div className="overflow-x-auto rounded-xl border border-bone-200">
            <table className="w-full min-w-[840px] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="table-head w-12">#</th>
                  <th className="table-head">Vraag</th>
                  <th className="table-head">Categorie</th>
                  <th className="table-head">Rollen</th>
                  <th className="table-head">Status</th>
                  <th className="table-head">Bijgewerkt door</th>
                </tr>
              </thead>
              <tbody>
                {faqItems.map((f) => (
                  <tr key={f.id} className="table-row">
                    <td className="table-cell text-ink-500">{f.order}</td>
                    <td className="table-cell font-medium text-ink-900">{f.question}</td>
                    <td className="table-cell"><Badge variant="wood">{f.category}</Badge></td>
                    <td className="table-cell text-xs text-ink-500">{f.roles.map((r) => r.toLowerCase()).join(', ')}</td>
                    <td className="table-cell">
                      <Badge variant={f.status === 'GEPUBLICEERD' ? 'success' : f.status === 'CONCEPT' ? 'warning' : 'neutral'}>
                        {f.status === 'GEPUBLICEERD' ? 'Gepubliceerd' : f.status === 'CONCEPT' ? 'Concept' : 'Gearchiveerd'}
                      </Badge>
                    </td>
                    <td className="table-cell text-xs text-ink-500">{f.updatedBy}</td>
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
