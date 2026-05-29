import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Toolbar, FilterChip } from '@/components/ui/Toolbar';
import { currentAdmin } from '@/lib/mock/users';
import { getDemoSession } from '@/lib/data/session';
import { listStudents } from '@/lib/data/students';

export const dynamic = 'force-dynamic';

export default async function AdminStudentenPage() {
  const ctx = getDemoSession('ADMIN');
  const students = await listStudents(ctx);
  return (
    <PortalShell
      role="ADMIN"
      activeHref="/admin/studenten"
      userName={currentAdmin.name}
      userSubtitle="Admin"
      greeting={{ title: 'Studentenbeheer', subtitle: `${students.length} studenten in het systeem.` }}
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
                  <th className="table-head">Signaal</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id} className="table-row">
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <Avatar name={s.user.name} size="sm" tone="wood" />
                        <div>
                          <div className="font-medium text-ink-900">{s.user.name}</div>
                          <div className="text-xs text-ink-500">{s.user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell text-xs text-ink-500">{s.externalId}</td>
                    <td className="table-cell text-xs text-ink-500">
                      {s.cleverdeskId ?? <span className="text-rose-700">ontbreekt</span>}
                    </td>
                    <td className="table-cell">{s.program.name} {s.program.level.replace('BBL_', 'BBL ')}</td>
                    <td className="table-cell">{s.company.name}</td>
                    <td className="table-cell">
                      <Badge variant={s.signal === 'Goed' ? 'success' : s.signal === 'Aandacht' ? 'warning' : 'danger'}>
                        {s.signal}
                      </Badge>
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
