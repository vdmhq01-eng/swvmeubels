import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Toolbar, FilterChip } from '@/components/ui/Toolbar';
import { Icon } from '@/components/ui/Icon';
import { currentAdmin } from '@/lib/mock/users';
import { listCompanies } from '@/lib/data/companies';

export const dynamic = 'force-dynamic';

export default async function AdminLidbedrijvenPage() {
  const companies = await listCompanies();
  return (
    <PortalShell
      role="ADMIN"
      activeHref="/admin/lidbedrijven"
      userName={currentAdmin.name}
      userSubtitle="Admin"
      greeting={{ title: 'Lidbedrijven', subtitle: `${companies.length} bedrijven in totaal` }}
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
                </tr>
              </thead>
              <tbody>
                {companies.map((c) => {
                  const contact = c.contacts[0];
                  return (
                    <tr key={c.id} className="table-row">
                      <td className="table-cell">
                        <div className="font-medium text-ink-900">{c.name}</div>
                        <div className="text-xs text-ink-500">{contact?.user.email ?? '-'}</div>
                      </td>
                      <td className="table-cell">{contact?.user.name ?? '-'}</td>
                      <td className="table-cell">{c.region.name}</td>
                      <td className="table-cell text-right font-semibold">{c._count.students}</td>
                      <td className="table-cell">
                        <Badge variant={c.membership === 'CBM' ? 'success' : 'neutral'}>{c.membership}</Badge>
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
