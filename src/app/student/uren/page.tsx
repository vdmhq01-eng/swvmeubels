import Link from 'next/link';
import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { WeeksheetEditor } from '@/components/uren/WeeksheetEditor';
import { currentStudent } from '@/lib/mock/users';
import { currentWeekTimesheet, previousTimesheets } from '@/lib/mock/timesheets';
import { formatDate, formatHours, weekRange } from '@/lib/utils';
import type { TimesheetStatus } from '@/lib/types';

const statusBadge: Record<TimesheetStatus, { label: string; variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral' }> = {
  CONCEPT: { label: 'Concept', variant: 'warning' },
  INGEDIEND: { label: 'Ingediend', variant: 'info' },
  GOEDGEKEURD: { label: 'Goedgekeurd', variant: 'success' },
  AFGEKEURD: { label: 'Afgekeurd', variant: 'danger' },
  CORRECTIE_GEVRAAGD: { label: 'Correctie gevraagd', variant: 'warning' },
};

export default function StudentUrenPage() {
  return (
    <PortalShell
      role="STUDENT"
      activeHref="/student/uren"
      userName={currentStudent.name}
      userSubtitle="Student"
      greeting={{
        title: 'Urenregistratie',
        subtitle: 'Vul je uren per dag in en dien je weekstaat in.',
      }}
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
        <Summary tone="wood" label="Deze week" value={formatHours(currentWeekTimesheet.totals.totaal)} hint={`norm ${formatHours(currentWeekTimesheet.totals.norm)}`} icon={<Icon.Clock className="h-5 w-5" />} />
        <Summary tone="green" label="Goedgekeurd" value="142,5 u" hint="laatste 4 weken" icon={<Icon.CheckCircle className="h-5 w-5" />} />
        <Summary tone="amber" label="Open / concept" value="1 weekstaat" hint="W22" icon={<Icon.AlertTriangle className="h-5 w-5" />} />
        <Summary tone="rose" label="Afgekeurd" value="1 weekstaat" hint="W20" icon={<Icon.X className="h-5 w-5" />} />
      </div>

      <div className="mt-6">
        <WeeksheetEditor timesheet={currentWeekTimesheet} />
      </div>

      <Card className="mt-6">
        <CardHeader title="Historie" subtitle="Eerder ingediende weekstaten" action={
          <Link href="#" className="btn-ghost">Exporteer</Link>
        } />
        <CardBody>
          <div className="overflow-x-auto rounded-xl border border-bone-200">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="table-head">Week</th>
                  <th className="table-head">Periode</th>
                  <th className="table-head text-right">Praktijk</th>
                  <th className="table-head text-right">School</th>
                  <th className="table-head text-right">Totaal</th>
                  <th className="table-head">Status</th>
                  <th className="table-head">Reden</th>
                </tr>
              </thead>
              <tbody>
                {previousTimesheets.map((t) => {
                  const b = statusBadge[t.status];
                  return (
                    <tr key={t.id} className="table-row">
                      <td className="table-cell font-medium">W{t.weekNumber}</td>
                      <td className="table-cell text-ink-600">{weekRange(t.weekStartDate)}</td>
                      <td className="table-cell text-right">{formatHours(t.totals.praktijk)}</td>
                      <td className="table-cell text-right">{formatHours(t.totals.school)}</td>
                      <td className="table-cell text-right font-semibold">{formatHours(t.totals.totaal)}</td>
                      <td className="table-cell">
                        <Badge variant={b.variant}>{b.label}</Badge>
                      </td>
                      <td className="table-cell text-xs text-ink-500">
                        {t.rejectionReason ? t.rejectionReason : t.approvedAt ? `Goedgekeurd ${formatDate(t.approvedAt)}` : '-'}
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

function Summary({
  tone,
  label,
  value,
  hint,
  icon,
}: {
  tone: 'wood' | 'green' | 'amber' | 'rose';
  label: string;
  value: string;
  hint: string;
  icon: React.ReactNode;
}) {
  const cls = {
    wood: 'bg-wood-50 text-wood-700 ring-wood-100',
    green: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    amber: 'bg-amber-50 text-amber-700 ring-amber-100',
    rose: 'bg-rose-50 text-rose-700 ring-rose-100',
  }[tone];
  return (
    <div className="card-padded">
      <div className={`mb-3 grid h-10 w-10 place-items-center rounded-xl ring-1 ${cls}`}>{icon}</div>
      <div className="text-xs font-medium uppercase tracking-wider text-ink-500">{label}</div>
      <div className="mt-1 font-display text-2xl font-semibold text-ink-900">{value}</div>
      <div className="text-xs text-ink-500">{hint}</div>
    </div>
  );
}
