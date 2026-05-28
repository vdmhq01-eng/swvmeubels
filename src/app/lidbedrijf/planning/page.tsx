import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { currentCompany } from '@/lib/mock/users';
import { students } from '@/lib/mock/students';

export default function LidbedrijfPlanningPage() {
  const days = ['Ma 27 mei', 'Di 28 mei', 'Wo 29 mei', 'Do 30 mei', 'Vr 31 mei'];
  const mine = students.filter((s) => ['comp-001', 'comp-002'].includes(s.companyId)).slice(0, 5);

  return (
    <PortalShell
      role="COMPANY"
      activeHref="/lidbedrijf/planning"
      userName={currentCompany.name}
      userSubtitle="Lidbedrijf"
      greeting={{ title: 'Planning schooldagen', subtitle: 'Weekplanning van jouw studenten.' }}
    >
      <Card>
        <CardBody>
          <div className="overflow-x-auto rounded-xl border border-bone-200">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="table-head">Student</th>
                  {days.map((d) => (
                    <th key={d} className="table-head text-center">{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mine.map((s, i) => (
                  <tr key={s.id} className="table-row">
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <Avatar name={s.name} size="sm" tone="wood" />
                        <span className="font-medium text-ink-900">{s.name}</span>
                      </div>
                    </td>
                    {days.map((_, di) => {
                      const isSchool = di === ((i + 2) % 5);
                      return (
                        <td key={di} className="table-cell text-center">
                          <span className={`inline-flex items-center justify-center rounded-lg px-3 py-1 text-xs font-medium ${
                            isSchool
                              ? 'bg-sky-50 text-sky-700 ring-1 ring-sky-100'
                              : 'bg-wood-50 text-wood-700 ring-1 ring-wood-100'
                          }`}>
                            {isSchool ? 'School' : 'Praktijk'}
                          </span>
                        </td>
                      );
                    })}
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
