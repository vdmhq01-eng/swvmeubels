import Link from 'next/link';
import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Icon } from '@/components/ui/Icon';
import { currentCompany } from '@/lib/mock/users';
import { pendingApprovals } from '@/lib/mock/timesheets';
import { students } from '@/lib/mock/students';
import { formatHours, weekRange } from '@/lib/utils';

export default function LidbedrijfDashboardPage() {
  const mine = students.filter((s) => s.companyId === 'comp-001' || s.companyId === 'comp-002');
  return (
    <PortalShell
      role="COMPANY"
      activeHref="/lidbedrijf"
      userName={currentCompany.name}
      userSubtitle="Lidbedrijf"
      greeting={{
        title: 'Dashboard',
        subtitle: 'Overzicht van jouw studenten en weekstaten.',
      }}
    >
      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        <StatCard label="Weekstaten" value={pendingApprovals.length} hint="Wachten op goedkeuring" icon={<Icon.Activity className="h-5 w-5" />} tone="amber" />
        <StatCard label="Studenten actief" value={mine.length} hint="Bij jouw bedrijf" icon={<Icon.Users className="h-5 w-5" />} tone="wood" />
        <StatCard label="Open acties" value={2} hint="Vereisen reactie" icon={<Icon.Bell className="h-5 w-5" />} tone="rose" />
        <StatCard label="Verzuim" value={1} hint="Open meldingen" icon={<Icon.Heart className="h-5 w-5" />} tone="green" />
      </div>

      <Card className="mt-6">
        <CardHeader title="Weekstaten ter goedkeuring" subtitle="Sorteer op meest recent ingediend" />
        <CardBody>
          <div className="overflow-x-auto rounded-xl border border-bone-200">
            <table className="w-full min-w-[680px] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="table-head">Student</th>
                  <th className="table-head">Week</th>
                  <th className="table-head text-right">Totaal</th>
                  <th className="table-head text-right">Ontbrekend</th>
                  <th className="table-head"></th>
                </tr>
              </thead>
              <tbody>
                {pendingApprovals.map((p) => (
                  <tr key={p.timesheet.id} className="table-row">
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <Avatar name={p.studentName} size="sm" tone="wood" />
                        <div>
                          <div className="font-medium text-ink-900">{p.studentName}</div>
                          <div className="text-xs text-ink-500">{p.companyName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      W{p.timesheet.weekNumber}
                      <div className="text-xs text-ink-500">{weekRange(p.timesheet.weekStartDate)}</div>
                    </td>
                    <td className="table-cell text-right font-semibold">{formatHours(p.timesheet.totals.totaal)}</td>
                    <td className="table-cell text-right">
                      {p.timesheet.totals.ontbrekend > 0 ? (
                        <Badge variant="warning">{formatHours(p.timesheet.totals.ontbrekend)}</Badge>
                      ) : (
                        <Badge variant="success">Compleet</Badge>
                      )}
                    </td>
                    <td className="table-cell text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="btn-secondary">
                          <Icon.X className="h-4 w-4" /> Afkeuren
                        </button>
                        <button className="btn-primary">
                          <Icon.Check className="h-4 w-4" /> Goedkeuren
                        </button>
                      </div>
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
