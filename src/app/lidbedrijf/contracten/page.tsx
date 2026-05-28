import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { currentCompany } from '@/lib/mock/users';
import { contracts } from '@/lib/mock/misc';
import { students } from '@/lib/mock/students';
import { formatDate } from '@/lib/utils';

export default function LidbedrijfContractenPage() {
  const mine = contracts.filter((c) => ['comp-001', 'comp-002'].includes(c.companyId));
  return (
    <PortalShell
      role="COMPANY"
      activeHref="/lidbedrijf/contracten"
      userName={currentCompany.name}
      userSubtitle="Lidbedrijf"
      greeting={{ title: 'Contracten', subtitle: 'Praktijkovereenkomsten van jouw studenten.' }}
    >
      <Card>
        <CardHeader title="Lopende contracten" />
        <CardBody>
          <div className="overflow-x-auto rounded-xl border border-bone-200">
            <table className="w-full min-w-[600px] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="table-head">Student</th>
                  <th className="table-head">Startdatum</th>
                  <th className="table-head">Einddatum</th>
                  <th className="table-head text-right">Uren / week</th>
                  <th className="table-head">Status</th>
                </tr>
              </thead>
              <tbody>
                {mine.map((c) => {
                  const s = students.find((x) => x.id === c.studentId);
                  return (
                    <tr key={c.id} className="table-row">
                      <td className="table-cell font-medium text-ink-900">{s?.name ?? '-'}</td>
                      <td className="table-cell">{formatDate(c.startDate)}</td>
                      <td className="table-cell">{formatDate(c.endDate)}</td>
                      <td className="table-cell text-right">{c.hoursPerWeek} u</td>
                      <td className="table-cell">
                        <Badge variant={c.status === 'Actief' ? 'success' : c.status === 'Aflopend' ? 'warning' : 'neutral'}>
                          {c.status}
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
