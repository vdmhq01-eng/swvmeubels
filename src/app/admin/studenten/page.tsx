import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Toolbar, FilterChip } from '@/components/ui/Toolbar';
import { Icon } from '@/components/ui/Icon';
import { currentAdmin } from '@/lib/mock/users';
import { students } from '@/lib/mock/students';
import { programs } from '@/lib/mock/programs';
import { companies } from '@/lib/mock/companies';

export default function AdminStudentenPage() {
  return (
    <PortalShell
      role="ADMIN"
      activeHref="/admin/studenten"
      userName={currentAdmin.name}
      userSubtitle="Admin"
      greeting={{ title: 'Studentenbeheer', subtitle: 'Alle studenten in het systeem.' }}
    >
      <Card>
        <CardBody>
          <Toolbar placeholder="Zoek student, externe ID of bedrijf…">
            <FilterChip label="Alle" active />
            <FilterChip label="Regio Noord" />
            <FilterChip label="Risico" />
            <FilterChip label="Legitimatie ontbreekt" />
          </Toolbar>
        </CardBody>
      </Card>

      <Card className="mt-6">
        <CardBody>
          <div className="overflow-x-auto rounded-xl border border-bone-200">
            <table className="w-full min-w-[840px] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="table-head">Student</th>
                  <th className="table-head">Externe ID</th>
                  <th className="table-head">Cleverdesk</th>
                  <th className="table-head">Opleiding</th>
                  <th className="table-head">Bedrijf</th>
                  <th className="table-head">Legitimatie</th>
                  <th className="table-head">Signaal</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => {
                  const p = programs.find((x) => x.id === s.programId)!;
                  const c = companies.find((x) => x.id === s.companyId)!;
                  return (
                    <tr key={s.id} className="table-row">
                      <td className="table-cell">
                        <div className="flex items-center gap-3">
                          <Avatar name={s.name} size="sm" tone="wood" />
                          <div>
                            <div className="font-medium text-ink-900">{s.name}</div>
                            <div className="text-xs text-ink-500">{s.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="table-cell text-xs text-ink-500">{s.externalId}</td>
                      <td className="table-cell text-xs text-ink-500">{s.cleverdeskId ?? <span className="text-rose-700">ontbreekt</span>}</td>
                      <td className="table-cell">{p.name} {p.level}</td>
                      <td className="table-cell">{c.name}</td>
                      <td className="table-cell">
                        {s.legitimationUploaded ? (
                          <Badge variant="success">Aanwezig</Badge>
                        ) : (
                          <Badge variant="danger">Ontbreekt</Badge>
                        )}
                      </td>
                      <td className="table-cell">
                        <Badge variant={s.signal === 'Goed' ? 'success' : s.signal === 'Aandacht' ? 'warning' : 'danger'}>
                          {s.signal}
                        </Badge>
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
