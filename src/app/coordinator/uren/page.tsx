import Link from 'next/link';
import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Toolbar, FilterChip } from '@/components/ui/Toolbar';
import { Icon } from '@/components/ui/Icon';
import { getDemoSession } from '@/lib/data/session';
import { listStudents } from '@/lib/data/students';
import { sumEntries } from '@/lib/data/timesheets';
import { db } from '@/lib/db';
import { formatHours, weekRange } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const statusVariant: Record<string, 'success' | 'info' | 'warning' | 'danger' | 'neutral'> = {
  GOEDGEKEURD: 'success',
  INGEDIEND: 'info',
  CONCEPT: 'warning',
  AFGEKEURD: 'danger',
  CORRECTIE_GEVRAAGD: 'warning',
};

export default async function CoordinatorUrenPage() {
  const ctx = getDemoSession('COORDINATOR');
  const [students, coordinator] = await Promise.all([
    listStudents(ctx),
    db.coordinator.findUnique({ where: { id: ctx.coordinatorId! }, include: { user: true, region: true } }),
  ]);

  // Voor elke student: meest recente weekstaat (Promise.all voor snelheid)
  const sheets = await Promise.all(
    students.map((s) =>
      db.timesheet.findFirst({
        where: { studentId: s.id },
        orderBy: [{ year: 'desc' }, { weekNumber: 'desc' }],
        include: { entries: true },
      }),
    ),
  );

  let compleet = 0, ontbrekend = 0, afgekeurd = 0;
  const rows = students.map((s, i) => {
    const t = sheets[i];
    const totals = t ? sumEntries(t.entries) : { PRAKTIJK: 0, SCHOOL: 0, ZIEKTE: 0, VERLOF: 0, AFWEZIG: 0, totaal: 0, ontbrekend: 38 };
    if (t?.status === 'AFGEKEURD') afgekeurd++;
    else if (totals.ontbrekend > 0) ontbrekend++;
    else compleet++;
    return { student: s, timesheet: t, totals };
  });

  return (
    <PortalShell
      role="COORDINATOR"
      activeHref="/coordinator/uren"
      userName={coordinator?.user.name ?? 'Coördinator'}
      userSubtitle={`Coördinator regio ${coordinator?.region.name ?? ''}`}
      greeting={{ title: 'Urenoverzicht', subtitle: 'Per student per week.' }}
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
        <KPI tone="wood" label="Studenten" value={`${students.length}`} icon={<Icon.Users className="h-5 w-5" />} />
        <KPI tone="green" label="Compleet" value={`${compleet}`} icon={<Icon.CheckCircle className="h-5 w-5" />} />
        <KPI tone="amber" label="Ontbrekend" value={`${ontbrekend}`} icon={<Icon.AlertTriangle className="h-5 w-5" />} />
        <KPI tone="rose" label="Afgekeurd" value={`${afgekeurd}`} icon={<Icon.X className="h-5 w-5" />} />
      </div>

      <Card className="mt-6">
        <CardHeader title="Meest recente weekstaten" subtitle="Per student" />
        <CardBody>
          <Toolbar placeholder="Zoek student…">
            <FilterChip label="Alle" active />
            <FilterChip label="Ontbrekend" />
            <FilterChip label="Ingediend" />
            <FilterChip label="Concept" />
            <FilterChip label="Afgekeurd" />
          </Toolbar>

          <div className="mt-4 overflow-x-auto rounded-xl border border-bone-200">
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="table-head">Student</th>
                  <th className="table-head">Periode</th>
                  <th className="table-head text-right">Praktijk</th>
                  <th className="table-head text-right">School</th>
                  <th className="table-head text-right">Ontbrekend</th>
                  <th className="table-head">Status</th>
                  <th className="table-head"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.student.id} className="table-row">
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <Avatar name={r.student.user.name} size="sm" tone="wood" />
                        <span className="font-medium text-ink-900">{r.student.user.name}</span>
                      </div>
                    </td>
                    <td className="table-cell text-ink-600">
                      {r.timesheet ? `W${r.timesheet.weekNumber} · ${weekRange(r.timesheet.weekStartDate.toISOString().slice(0, 10))}` : '-'}
                    </td>
                    <td className="table-cell text-right">{formatHours(r.totals.PRAKTIJK)}</td>
                    <td className="table-cell text-right">{formatHours(r.totals.SCHOOL)}</td>
                    <td className="table-cell text-right">
                      {r.totals.ontbrekend > 0 ? (
                        <Badge variant="warning">{formatHours(r.totals.ontbrekend)}</Badge>
                      ) : (
                        <Badge variant="success">Compleet</Badge>
                      )}
                    </td>
                    <td className="table-cell">
                      {r.timesheet ? <Badge variant={statusVariant[r.timesheet.status] ?? 'neutral'}>{r.timesheet.status}</Badge> : <Badge variant="neutral">Geen</Badge>}
                    </td>
                    <td className="table-cell text-right">
                      <Link href={`/coordinator/studenten/${r.student.id}`} className="btn-ghost">
                        Bekijk <Icon.ArrowRight className="h-4 w-4" />
                      </Link>
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

function KPI({ tone, label, value, icon }: { tone: 'wood' | 'green' | 'amber' | 'rose'; label: string; value: string; icon: React.ReactNode }) {
  const cls = {
    wood: 'bg-wood-50 text-wood-700 ring-wood-100',
    green: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    amber: 'bg-amber-50 text-amber-700 ring-amber-100',
    rose: 'bg-rose-50 text-rose-700 ring-rose-100',
  }[tone];
  return (
    <div className="card-padded">
      <div className={`grid h-10 w-10 place-items-center rounded-xl ring-1 ${cls}`}>{icon}</div>
      <div className="mt-3 text-xs font-medium uppercase tracking-wider text-ink-500">{label}</div>
      <div className="mt-1 font-display text-2xl font-semibold text-ink-900">{value}</div>
    </div>
  );
}
