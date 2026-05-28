import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Toolbar, FilterChip } from '@/components/ui/Toolbar';
import { Icon } from '@/components/ui/Icon';
import { currentCoordinator } from '@/lib/mock/users';
import { faqItems } from '@/lib/mock/faq';
import { formatDate } from '@/lib/utils';

export default function CoordinatorFaqPage() {
  return (
    <PortalShell
      role="COORDINATOR"
      activeHref="/coordinator/faq"
      userName={currentCoordinator.name}
      userSubtitle="Coördinator regio Noord"
      greeting={{ title: 'FAQ beheren', subtitle: 'Vraag toevoegen, categoriseren en publiceren.' }}
    >
      <Card>
        <CardBody>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Toolbar placeholder="Zoek vraag…">
              <FilterChip label="Alle FAQ's" active />
              <FilterChip label="Categorieën" />
              <FilterChip label="Concepten" />
              <FilterChip label="Gearchiveerd" />
            </Toolbar>
            <button className="btn-primary">
              <Icon.Plus className="h-4 w-4" /> Nieuwe FAQ
            </button>
          </div>
        </CardBody>
      </Card>

      <Card className="mt-6">
        <CardHeader title="FAQ overzicht" subtitle="Beheer veelgestelde vragen" />
        <CardBody>
          <div className="overflow-x-auto rounded-xl border border-bone-200">
            <table className="w-full min-w-[760px] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="table-head">Vraag</th>
                  <th className="table-head">Categorie</th>
                  <th className="table-head">Status</th>
                  <th className="table-head">Laatst bijgewerkt</th>
                  <th className="table-head"></th>
                </tr>
              </thead>
              <tbody>
                {faqItems.map((f) => (
                  <tr key={f.id} className="table-row">
                    <td className="table-cell font-medium text-ink-900">{f.question}</td>
                    <td className="table-cell">
                      <Badge variant="wood">{f.category}</Badge>
                    </td>
                    <td className="table-cell">
                      <Badge variant={f.status === 'GEPUBLICEERD' ? 'success' : f.status === 'CONCEPT' ? 'warning' : 'neutral'}>
                        {f.status === 'GEPUBLICEERD' ? 'Gepubliceerd' : f.status === 'CONCEPT' ? 'Concept' : 'Gearchiveerd'}
                      </Badge>
                    </td>
                    <td className="table-cell text-ink-500">
                      {formatDate(f.updatedAt)} · {f.updatedByName}
                    </td>
                    <td className="table-cell text-right">
                      <button className="btn-ghost">
                        <Icon.Settings className="h-4 w-4" />
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
