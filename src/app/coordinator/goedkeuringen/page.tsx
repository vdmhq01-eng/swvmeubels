import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Icon } from '@/components/ui/Icon';
import { ApprovalActions } from '@/components/uren/ApprovalActions';
import { currentCoordinator } from '@/lib/mock/users';
import { pendingApprovals } from '@/lib/mock/timesheets';
import { formatHours, weekRange } from '@/lib/utils';

export default function CoordinatorGoedkeuringenPage() {
  return (
    <PortalShell
      role="COORDINATOR"
      activeHref="/coordinator/goedkeuringen"
      userName={currentCoordinator.name}
      userSubtitle="Coördinator regio Noord"
      greeting={{ title: 'Goedkeuringen', subtitle: 'Weekstaten die op jouw oordeel wachten.' }}
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
                      {p.companyName} · W{p.timesheet.weekNumber} · {weekRange(p.timesheet.weekStartDate)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {p.timesheet.totals.ontbrekend > 0 ? (
                    <Badge variant="warning">
                      <Icon.AlertTriangle className="h-3 w-3" /> {formatHours(p.timesheet.totals.ontbrekend)} ontbrekend
                    </Badge>
                  ) : (
                    <Badge variant="success">Compleet</Badge>
                  )}
                  <Badge variant="info">Ingediend</Badge>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-5">
                {(['praktijk', 'school', 'ziekte', 'verlof', 'afwezig'] as const).map((k) => (
                  <div key={k} className="rounded-xl border border-bone-200 bg-bone-50 px-3 py-2">
                    <div className="text-[11px] uppercase tracking-wider text-ink-500">{k}</div>
                    <div className="text-sm font-semibold text-ink-900">{formatHours(p.timesheet.totals[k])}</div>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex justify-end">
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
