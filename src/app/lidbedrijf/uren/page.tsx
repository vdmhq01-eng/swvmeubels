import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Toolbar, FilterChip } from '@/components/ui/Toolbar';
import { currentCompany } from '@/lib/mock/users';
import { students } from '@/lib/mock/students';
import { formatHours } from '@/lib/utils';

const data = students
  .filter((s) => ['comp-001', 'comp-002'].includes(s.companyId))
  .map((s, i) => ({
    student: s,
    weeks: [22, 21, 20, 19].map((w) => ({
      week: w,
      praktijk: 28 + ((i + w) % 4) * 2,
      school: 7,
      totaal: 35 + ((i + w) % 4) * 2,
      status: ['Goedgekeurd', 'Ingediend', 'Concept', 'Goedgekeurd'][w % 4],
    })),
  }));

export default function LidbedrijfUrenPage() {
  return (
    <PortalShell
      role="COMPANY"
      activeHref="/lidbedrijf/uren"
      userName={currentCompany.name}
      userSubtitle="Lidbedrijf"
      greeting={{ title: 'Urenoverzicht', subtitle: 'Per student over de laatste 4 weken.' }}
    >
      <Card>
        <CardBody>
          <Toolbar placeholder="Zoek student…">
            <FilterChip label="W22" active />
            <FilterChip label="W21" />
            <FilterChip label="W20" />
            <FilterChip label="W19" />
          </Toolbar>
        </CardBody>
      </Card>

      {data.map(({ student, weeks }) => (
        <Card key={student.id} className="mt-5">
          <CardHeader
            title={
              <div className="flex items-center gap-3">
                <Avatar name={student.name} size="sm" tone="wood" />
                <span>{student.name}</span>
              </div>
            }
          />
          <CardBody>
            <div className="overflow-x-auto rounded-xl border border-bone-200">
              <table className="w-full min-w-[480px] border-collapse text-sm">
                <thead>
                  <tr>
                    <th className="table-head">Week</th>
                    <th className="table-head text-right">Praktijk</th>
                    <th className="table-head text-right">School</th>
                    <th className="table-head text-right">Totaal</th>
                    <th className="table-head">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {weeks.map((w) => (
                    <tr key={w.week} className="table-row">
                      <td className="table-cell font-medium">W{w.week}</td>
                      <td className="table-cell text-right">{formatHours(w.praktijk)}</td>
                      <td className="table-cell text-right">{formatHours(w.school)}</td>
                      <td className="table-cell text-right font-semibold">{formatHours(w.totaal)}</td>
                      <td className="table-cell">
                        <Badge
                          variant={
                            w.status === 'Goedgekeurd'
                              ? 'success'
                              : w.status === 'Ingediend'
                              ? 'info'
                              : 'warning'
                          }
                        >
                          {w.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      ))}
    </PortalShell>
  );
}
