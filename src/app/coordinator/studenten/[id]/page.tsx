import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Icon } from '@/components/ui/Icon';
import { getDemoSession } from '@/lib/data/session';
import { getStudentByIdScoped } from '@/lib/data/students';
import { getTimesheetsForStudent, sumEntries } from '@/lib/data/timesheets';
import { db } from '@/lib/db';
import { formatDate, formatHours, formatMoney } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function StudentDetailPage({ params }: { params: { id: string } }) {
  const ctx = getDemoSession('COORDINATOR');
  const [student, coordinator, timesheets] = await Promise.all([
    getStudentByIdScoped(ctx, params.id),
    db.coordinator.findUnique({ where: { id: ctx.coordinatorId! }, include: { user: true, region: true } }),
    getTimesheetsForStudent(params.id, 4),
  ]);
  if (!student) notFound();

  const totalRecentHours = timesheets.reduce((sum, t) => sum + sumEntries(t.entries).totaal, 0);

  return (
    <PortalShell
      role="COORDINATOR"
      activeHref="/coordinator/studenten"
      userName={coordinator?.user.name ?? 'Coördinator'}
      userSubtitle={`Coördinator regio ${coordinator?.region.name ?? ''}`}
      greeting={{
        title: student.user.name,
        subtitle: `${student.program.name} ${student.program.level.replace('BBL_', 'BBL ')} · ${student.company.name}`,
      }}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Link href="/coordinator/studenten" className="btn-ghost">
          ← Terug naar studenten
        </Link>
        <div className="flex gap-2">
          <button className="btn-secondary">
            <Icon.Doc className="h-4 w-4" /> Notitie toevoegen
          </button>
          <button className="btn-primary">
            <Icon.Bell className="h-4 w-4" /> Bericht sturen
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardBody>
            <div className="flex items-start gap-4">
              <Avatar name={student.user.name} size="lg" tone="wood" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-display text-2xl font-semibold text-ink-900">{student.user.name}</h2>
                  <Badge variant={student.signal === 'Goed' ? 'success' : student.signal === 'Aandacht' ? 'warning' : 'danger'}>
                    {student.signal}
                  </Badge>
                  {student.legitimationDocId ? (
                    <Badge variant="info">Legitimatie aanwezig</Badge>
                  ) : (
                    <Badge variant="danger">Legitimatie ontbreekt</Badge>
                  )}
                </div>
                <p className="mt-1 text-sm text-ink-600">
                  {student.program.name} {student.program.level.replace('BBL_', 'BBL ')} · jaar {student.yearOfStudy}
                </p>
                <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  <Info label="E-mail" value={student.user.email} />
                  <Info label="Externe ID (Exact)" value={student.externalId} />
                  <Info label="Cleverdesk ID" value={student.cleverdeskId ?? '-'} />
                  <Info label="Regio" value={student.region.name} />
                  <Info label="Startdatum" value={formatDate(student.startDate)} />
                  <Info label="Verwacht diploma" value={student.expectedDiplomaDate ? formatDate(student.expectedDiplomaDate) : '-'} />
                </dl>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Notities" subtitle="Alleen zichtbaar voor coördinator en admin" />
          <CardBody>
            <div className="rounded-xl border border-amber-100 bg-amber-50 p-3 text-sm text-amber-900">
              <div className="text-xs font-semibold uppercase tracking-wider">Vertrouwelijk</div>
              <p className="mt-1">
                Notities zijn een interne functie en komen later via een Notitie-tabel in de DB.
              </p>
            </div>
            <button className="btn-secondary mt-3 w-full">
              <Icon.Plus className="h-4 w-4" /> Nieuwe notitie
            </button>
          </CardBody>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-4">
        <KPI tone="wood" label="Uren laatste 4 weken" value={formatHours(totalRecentHours)} icon={<Icon.Clock className="h-5 w-5" />} />
        <KPI tone="green" label="Vakantiedagen" value={`${student.holidayBalance?.remainingDays ?? 0} dagen`} icon={<Icon.Palm className="h-5 w-5" />} />
        <KPI tone="rose" label="Open verzuim" value={`${student.absences.filter((a) => !a.closedAt).length}`} icon={<Icon.Heart className="h-5 w-5" />} />
        <KPI tone="amber" label="Open taken" value={`${student.tasks.filter((t) => t.status === 'OPEN').length}`} icon={<Icon.Activity className="h-5 w-5" />} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Urenhistorie" subtitle="Laatste weken" />
          <CardBody>
            {timesheets.length === 0 ? (
              <div className="text-sm text-ink-500">Geen weekstaten gevonden.</div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-bone-200">
                <table className="w-full min-w-[560px] border-collapse text-sm">
                  <thead>
                    <tr>
                      <th className="table-head">Week</th>
                      <th className="table-head text-right">Praktijk</th>
                      <th className="table-head text-right">School</th>
                      <th className="table-head text-right">Verzuim</th>
                      <th className="table-head text-right">Totaal</th>
                      <th className="table-head">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {timesheets.map((t) => {
                      const totals = sumEntries(t.entries);
                      return (
                        <tr key={t.id} className="table-row">
                          <td className="table-cell font-medium">W{t.weekNumber}</td>
                          <td className="table-cell text-right">{formatHours(totals.PRAKTIJK)}</td>
                          <td className="table-cell text-right">{formatHours(totals.SCHOOL)}</td>
                          <td className="table-cell text-right">{formatHours(totals.ZIEKTE + totals.VERLOF)}</td>
                          <td className="table-cell text-right font-semibold">{formatHours(totals.totaal)}</td>
                          <td className="table-cell">
                            <Badge variant={t.status === 'GOEDGEKEURD' ? 'success' : t.status === 'AFGEKEURD' ? 'danger' : 'warning'}>
                              {t.status}
                            </Badge>
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

        <Card>
          <CardHeader title="Leerbedrijf" subtitle={student.company.name} />
          <CardBody className="space-y-3">
            <Info label="Naam" value={student.company.name} />
            <Info label="Lidmaatschap" value={student.company.membership} />
            <Link href={`/coordinator/lidbedrijven/${student.company.id}`} className="btn-secondary mt-2 w-full">
              Naar bedrijfspagina
            </Link>
          </CardBody>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card>
          <CardHeader title="Contracten" />
          <CardBody>
            {student.contracts.length === 0 ? (
              <div className="text-sm text-ink-500">Geen contracten.</div>
            ) : (
              student.contracts.map((c) => (
                <div key={c.id} className="rounded-xl border border-bone-200 p-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-ink-900">{formatDate(c.startDate)} – {formatDate(c.endDate)}</div>
                    <Badge variant={c.status === 'ACTIEF' ? 'success' : c.status === 'AFLOPEND' ? 'warning' : 'neutral'}>
                      {c.status}
                    </Badge>
                  </div>
                  <div className="mt-1 text-xs text-ink-500">{c.hoursPerWeek} uur per week</div>
                </div>
              ))
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Vakantie & tegoed" />
          <CardBody>
            <Info label="Saldo dagen" value={`${student.holidayBalance?.remainingDays ?? 0} van ${student.holidayBalance?.totalDays ?? 0}`} />
            <Info label="Tegoed" value={formatMoney((student.holidayBalance?.holidayMoneyCents ?? 0) / 100)} />
            <Info label="Laatste update" value={student.holidayBalance ? formatDate(student.holidayBalance.lastUpdated) : '-'} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Documenten" subtitle="AVG-proof opslag" action={
            <button className="btn-ghost"><Icon.Upload className="h-4 w-4" /> Upload</button>
          } />
          <CardBody>
            {student.documents.length === 0 ? (
              <div className="text-sm text-ink-500">Geen documenten.</div>
            ) : (
              <ul className="flex flex-col gap-2">
                {student.documents.map((d) => (
                  <li key={d.id} className="flex items-center justify-between rounded-xl border border-bone-200 px-3 py-2 text-sm">
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon.Doc className="h-4 w-4 text-wood-500" />
                      <div className="min-w-0">
                        <div className="truncate font-medium text-ink-900">{d.fileName}</div>
                        <div className="text-xs text-ink-500">{d.category} · bewaartermijn tot {formatDate(d.retentionUntil)}</div>
                      </div>
                    </div>
                    <Icon.Lock className="h-4 w-4 text-ink-400" />
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>
      </div>
    </PortalShell>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] font-medium uppercase tracking-wider text-ink-500">{label}</dt>
      <dd className="text-sm text-ink-900">{value}</dd>
    </div>
  );
}

function KPI({ tone, label, value, icon }: { tone: 'wood' | 'green' | 'rose' | 'amber'; label: string; value: string; icon: React.ReactNode }) {
  const cls = {
    wood: 'bg-wood-50 text-wood-700 ring-wood-100',
    green: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    rose: 'bg-rose-50 text-rose-700 ring-rose-100',
    amber: 'bg-amber-50 text-amber-700 ring-amber-100',
  }[tone];
  return (
    <div className="card-padded">
      <div className={`mb-3 grid h-10 w-10 place-items-center rounded-xl ring-1 ${cls}`}>{icon}</div>
      <div className="text-xs font-medium uppercase tracking-wider text-ink-500">{label}</div>
      <div className="mt-1 font-display text-2xl font-semibold text-ink-900">{value}</div>
    </div>
  );
}
