import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Toolbar, FilterChip } from '@/components/ui/Toolbar';
import { Icon } from '@/components/ui/Icon';
import { currentAdmin } from '@/lib/mock/users';
import { companies } from '@/lib/mock/companies';

export default function AdminLidbedrijvenPage() {
  return (
    <PortalShell
      role="ADMIN"
      activeHref="/admin/lidbedrijven"
      userName={currentAdmin.name}
      userSubtitle="Admin"
      greeting={{ title: 'Lidbedrijven', subtitle: 'Alle bedrijven, contactpersonen en lidmaatschappen.' }}
    >
      <Card>
        <CardBody>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Toolbar placeholder="Zoek bedrijf, e-mail of regio…">
              <FilterChip label="Alle" active />
              <FilterChip label="CBM" />
              <FilterChip label="Geen lid" />
            </Toolbar>
            <button className="btn-primary">
              <Icon.Plus className="h-4 w-4" /> Nieuw bedrijf
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
                  <th className="table-head">Bedrijf</th>
                  <th className="table-head">Contactpersoon</th>
                  <th className="table-head">Regio</th>
                  <th className="table-head text-right">Studenten</th>
                  <th className="table-head">Lidmaatschap</th>
                  <th className="table-head"></th>
                </tr>
              </thead>
              <tbody>
                {companies.map((c) => (
                  <tr key={c.id} className="table-row">
                    <td className="table-cell">
                      <div className="font-medium text-ink-900">{c.name}</div>
                      <div className="text-xs text-ink-500">{c.contactEmail}</div>
                    </td>
                    <td className="table-cell">{c.contactName}</td>
                    <td className="table-cell">{c.region}</td>
                    <td className="table-cell text-right font-semibold">{c.activeStudents}</td>
                    <td className="table-cell">
                      <Badge variant={c.membership === 'CBM' ? 'success' : 'neutral'}>{c.membership}</Badge>
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
