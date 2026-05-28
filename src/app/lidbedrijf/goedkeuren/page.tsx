import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { ApprovalActions } from '@/components/uren/ApprovalActions';
import { currentCompany } from '@/lib/mock/users';
import { pendingApprovals } from '@/lib/mock/timesheets';
import { formatHours, weekRange } from '@/lib/utils';

export default function LidbedrijfGoedkeurenPage() {
  return (
    <PortalShell
      role="COMPANY"
      activeHref="/lidbedrijf/goedkeuren"
      userName={currentCompany.name}
      userSubtitle="Lidbedrijf"
      greeting={{ title: 'Weekstaten goedkeuren', subtitle: 'Snel beslissen met inzicht in afwijkingen.' }}
    >
      <div className="space-y-4">
        {pendingApprovals.map((p) => (
          <Card key={p.timesheet.id}>
            <CardBody>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <Avatar name={p.studentName} tone="wood" />
                  <div>
                    <div className="font-display text-base font-semibold text-ink-900">{p.studentName}</div>
                    <div className="text-xs text-ink-500">
                      W{p.timesheet.weekNumber} · {weekRange(p.timesheet.weekStartDate)}
                    </div>
                  </div>
                </div>
                <Badge variant="info">Ingediend</Badge>
              </div>

              <div className="mt-5 overflow-x-auto rounded-xl border border-bone-200">
                <table className="w-full min-w-[480px] border-collapse text-sm">
                  <thead>
                    <tr>
                      <th className="table-head">Dag</th>
                      <th className="table-head">Type</th>
                      <th className="table-head text-right">Uren</th>
                      <th className="table-head">Notitie</th>
                    </tr>
                  </thead>
                  <tbody>
                    {p.timesheet.entries.map((e) => (
                      <tr key={e.id} className="table-row">
                        <td className="table-cell">{e.date}</td>
                        <td className="table-cell">
                          <Badge variant={e.type === 'ZIEKTE' ? 'danger' : e.type === 'SCHOOL' ? 'info' : 'wood'}>
                            {e.type}
                          </Badge>
                        </td>
                        <td className="table-cell text-right">{formatHours(e.hours)}</td>
                        <td className="table-cell text-xs text-ink-500">{e.note ?? '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm">
                  <span className="text-ink-600">Totaal </span>
                  <span className="font-semibold text-ink-900">{formatHours(p.timesheet.totals.totaal)}</span>
                  <span className="text-ink-500"> · norm {formatHours(p.timesheet.totals.norm)}</span>
                  {p.timesheet.totals.ontbrekend > 0 ? (
                    <span className="ml-2"><Badge variant="warning">{formatHours(p.timesheet.totals.ontbrekend)} ontbrekend</Badge></span>
                  ) : null}
                </div>
                <ApprovalActions
                  timesheetId={p.timesheet.id}
                  studentName={p.studentName}
                  withReasonInput
                />
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </PortalShell>
  );
}
