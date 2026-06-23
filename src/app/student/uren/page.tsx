import Link from 'next/link';
import { PortalShell } from '@/components/portal/PortalShell';
import { StudentNotLoaded } from '@/components/portal/StudentNotLoaded';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { EmptyState } from '@/components/ui/EmptyState';
import { WeeksheetEditor } from '@/components/uren/WeeksheetEditor';
import { getDemoSession } from '@/lib/data/session';
import { getCurrentWeekTimesheet, getTimesheetsForStudent, sumEntries, decimalToNumber } from '@/lib/data/timesheets';
import { db } from '@/lib/db';
import { formatDate, formatHours, weekRange } from '@/lib/utils';
import type { Timesheet, TimeEntry, TimesheetStatus } from '@/lib/types';

export const dynamic = 'force-dynamic';

const statusBadge: Record<TimesheetStatus, { label: string; variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral' }> = {
  CONCEPT: { label: 'Concept', variant: 'warning' },
  INGEDIEND: { label: 'Ingediend', variant: 'info' },
  GOEDGEKEURD: { label: 'Goedgekeurd', variant: 'success' },
  AFGEKEURD: { label: 'Afgekeurd', variant: 'danger' },
  CORRECTIE_GEVRAAGD: { label: 'Correctie gevraagd', variant: 'warning' },
};

type PrismaTimesheet = NonNullable<Awaited<ReturnType<typeof getCurrentWeekTimesheet>>>;

function adaptTimesheet(ts: PrismaTimesheet): Timesheet {
  const totals = sumEntries(ts.entries);
  const entries: TimeEntry[] = ts.entries.map((e) => ({
    id: e.id,
    date: e.date.toISOString().slice(0, 10),
    type: e.type,
    hours: decimalToNumber(e.hours),
    note: e.note ?? undefined,
  }));
  return {
    id: ts.id,
    studentId: ts.studentId,
    weekNumber: ts.weekNumber,
    year: ts.year,
    weekStartDate: ts.weekStartDate.toISOString().slice(0, 10),
    status: ts.status,
    submittedAt: ts.submittedAt?.toISOString(),
    rejectionReason: ts.rejectionReason ?? undefined,
    entries,
    totals: {
      praktijk: totals.PRAKTIJK,
      school: totals.SCHOOL,
      ziekte: totals.ZIEKTE,
      verlof: totals.VERLOF,
      afwezig: totals.AFWEZIG,
      totaal: totals.totaal,
      norm: 38,
      ontbrekend: totals.ontbrekend,
    },
  };
}

export default async function StudentUrenPage() {
  const ctx = getDemoSession('STUDENT');
  const [currentWeek, history, s] = await Promise.all([
    getCurrentWeekTimesheet(ctx.studentId!),
    getTimesheetsForStudent(ctx.studentId!, 10),
    db.student.findUnique({ where: { id: ctx.studentId! }, include: { user: true } }).catch(() => null),
  ]);
  if (!s) return <StudentNotLoaded activeHref="/student/uren" />;

  // sluit huidige week uit historie
  const previous = history.filter((t) => t.id !== currentWeek?.id);
  const goedgekeurd = history.filter((t) => t.status === 'GOEDGEKEURD');
  const afgekeurd = history.filter((t) => t.status === 'AFGEKEURD');
  const concepten = history.filter((t) => t.status === 'CONCEPT');

  const goedgekeurdUren = goedgekeurd.reduce((sum, t) => sum + sumEntries(t.entries).totaal, 0);

  return (
    <PortalShell
      role="STUDENT"
      activeHref="/student/uren"
      userName={s.user.name}
      userSubtitle="Student"
      greeting={{ title: 'Urenregistratie', subtitle: 'Vul je uren per dag in en dien je weekstaat in.' }}
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
        <Summary
          tone="wood"
          label="Deze week"
          value={currentWeek ? formatHours(sumEntries(currentWeek.entries).totaal) : '-'}
          hint="norm 38 u"
          icon={<Icon.Clock className="h-5 w-5" />}
        />
        <Summary
          tone="green"
          label="Goedgekeurd"
          value={formatHours(goedgekeurdUren)}
          hint={`${goedgekeurd.length} weken`}
          icon={<Icon.CheckCircle className="h-5 w-5" />}
        />
        <Summary
          tone="amber"
          label="Concepten"
          value={`${concepten.length} weken`}
          hint="Nog niet ingediend"
          icon={<Icon.AlertTriangle className="h-5 w-5" />}
        />
        <Summary
          tone="rose"
          label="Afgekeurd"
          value={`${afgekeurd.length} weken`}
          hint="Vereisen aandacht"
          icon={<Icon.X className="h-5 w-5" />}
        />
      </div>

      <div className="mt-6">
        {currentWeek ? (
          <WeeksheetEditor timesheet={adaptTimesheet(currentWeek)} />
        ) : (
          <Card>
            <CardBody>
              <EmptyState icon={<Icon.Clock className="h-5 w-5" />} title="Geen actieve weekstaat" description="Er is nog geen weekstaat aangemaakt voor deze week." />
            </CardBody>
          </Card>
        )}
      </div>

      <Card className="mt-6">
        <CardHeader title="Historie" subtitle="Eerder ingediende weekstaten" action={
          <Link href="#" className="btn-ghost">Exporteer</Link>
        } />
        <CardBody>
          {previous.length === 0 ? (
            <div className="text-sm text-ink-500">Geen historie beschikbaar.</div>
          ) : (
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
                  {previous.map((t) => {
                    const totals = sumEntries(t.entries);
                    const b = statusBadge[t.status];
                    return (
                      <tr key={t.id} className="table-row">
                        <td className="table-cell font-medium">W{t.weekNumber}</td>
                        <td className="table-cell text-ink-600">{weekRange(t.weekStartDate.toISOString().slice(0, 10))}</td>
                        <td className="table-cell text-right">{formatHours(totals.PRAKTIJK)}</td>
                        <td className="table-cell text-right">{formatHours(totals.SCHOOL)}</td>
                        <td className="table-cell text-right font-semibold">{formatHours(totals.totaal)}</td>
                        <td className="table-cell"><Badge variant={b.variant}>{b.label}</Badge></td>
                        <td className="table-cell text-xs text-ink-500">
                          {t.rejectionReason ? t.rejectionReason : t.submittedAt ? `Ingediend ${formatDate(t.submittedAt)}` : '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>
    </PortalShell>
  );
}

function Summary({ tone, label, value, hint, icon }: { tone: 'wood' | 'green' | 'amber' | 'rose'; label: string; value: string; hint: string; icon: React.ReactNode }) {
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
