import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Icon } from '@/components/ui/Icon';
import { currentCoordinator } from '@/lib/mock/users';
import { students } from '@/lib/mock/students';
import { companies } from '@/lib/mock/companies';
import { coordinators } from '@/lib/mock/users';
import { programs } from '@/lib/mock/programs';
import { contracts, absences, documents, tasks, holidayBalances } from '@/lib/mock/misc';
import { previousTimesheets } from '@/lib/mock/timesheets';
import { formatDate, formatHours, formatMoney } from '@/lib/utils';

export default function StudentDetailPage({ params }: { params: { id: string } }) {
  const student = students.find((s) => s.id === params.id);
  if (!student) notFound();
  const program = programs.find((p) => p.id === student.programId)!;
  const company = companies.find((c) => c.id === student.companyId)!;
  const coordinator = coordinators.find((c) => c.id === student.coordinatorId)!;
  const studentContracts = contracts.filter((c) => c.studentId === student.id);
  const studentAbsences = absences.filter((a) => a.studentId === student.id);
  const studentDocs = documents.filter((d) => d.studentId === student.id);
  const studentTasks = tasks.filter((t) => t.studentId === student.id);
  const balance = holidayBalances.find((h) => h.studentId === student.id);

  return (
    <PortalShell
      role="COORDINATOR"
      activeHref="/coordinator/studenten"
      userName={currentCoordinator.name}
      userSubtitle="Coördinator regio Noord"
      greeting={{
        title: student.name,
        subtitle: `${program.name} ${program.level} · ${company.name}`,
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
              <Avatar name={student.name} size="lg" tone="wood" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-display text-2xl font-semibold text-ink-900">{student.name}</h2>
                  <Badge variant={student.signal === 'Goed' ? 'success' : student.signal === 'Aandacht' ? 'warning' : 'danger'}>
                    {student.signal}
                  </Badge>
                  {student.legitimationUploaded ? (
                    <Badge variant="info">Legitimatie aanwezig</Badge>
                  ) : (
                    <Badge variant="danger">Legitimatie ontbreekt</Badge>
                  )}
                </div>
                <p className="mt-1 text-sm text-ink-600">
                  {program.name} {program.level} · jaar {student.yearOfStudy}
                </p>
                <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  <Info label="E-mail" value={student.email} />
                  <Info label="Telefoon" value={student.phone} />
                  <Info label="Externe ID (Exact)" value={student.externalId} />
                  <Info label="Cleverdesk ID" value={student.cleverdeskId ?? '-'} />
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
                Student gaf in laatste evaluatie aan moeite te hebben met theorie. Extra
                begeleiding ingepland voor week 24.
              </p>
              <div className="mt-2 text-[11px] text-amber-700">Sanne Bakker · 21 mei 2026</div>
            </div>
            <button className="btn-secondary mt-3 w-full">
              <Icon.Plus className="h-4 w-4" /> Nieuwe notitie
            </button>
          </CardBody>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-4">
        <KPI tone="wood" label="Uren laatste 4 weken" value={formatHours(152)} icon={<Icon.Clock className="h-5 w-5" />} />
        <KPI tone="green" label="Vakantiedagen" value={`${balance?.remainingDays ?? 0} dagen`} icon={<Icon.Palm className="h-5 w-5" />} />
        <KPI tone="rose" label="Open verzuim" value={`${studentAbsences.filter((a) => a.status === 'OPEN').length}`} icon={<Icon.Heart className="h-5 w-5" />} />
        <KPI tone="amber" label="Open taken" value={`${studentTasks.filter((t) => t.status === 'OPEN').length}`} icon={<Icon.Activity className="h-5 w-5" />} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Urenhistorie" subtitle="Laatste 3 weken" />
          <CardBody>
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
                  {previousTimesheets.map((t) => (
                    <tr key={t.id} className="table-row">
                      <td className="table-cell font-medium">W{t.weekNumber}</td>
                      <td className="table-cell text-right">{formatHours(t.totals.praktijk)}</td>
                      <td className="table-cell text-right">{formatHours(t.totals.school)}</td>
                      <td className="table-cell text-right">{formatHours(t.totals.ziekte + t.totals.verlof)}</td>
                      <td className="table-cell text-right font-semibold">{formatHours(t.totals.totaal)}</td>
                      <td className="table-cell">
                        <Badge
                          variant={
                            t.status === 'GOEDGEKEURD'
                              ? 'success'
                              : t.status === 'AFGEKEURD'
                              ? 'danger'
                              : 'warning'
                          }
                        >
                          {t.status === 'GOEDGEKEURD'
                            ? 'Goedgekeurd'
                            : t.status === 'AFGEKEURD'
                            ? 'Afgekeurd'
                            : 'Ingediend'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Leerbedrijf" subtitle={company.name} />
          <CardBody className="space-y-3">
            <Info label="Contactpersoon" value={company.contactName} />
            <Info label="E-mail" value={company.contactEmail} />
            <Info label="Telefoon" value={company.contactPhone} />
            <Info label="Regio" value={company.region} />
            <Link href={`/coordinator/lidbedrijven/${company.id}`} className="btn-secondary mt-2 w-full">
              Naar bedrijfspagina
            </Link>
          </CardBody>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card>
          <CardHeader title="Contract" subtitle="Status en geldigheid" />
          <CardBody>
            {studentContracts.map((c) => (
              <div key={c.id} className="rounded-xl border border-bone-200 p-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-ink-900">{c.startDate} – {c.endDate}</div>
                  <Badge variant={c.status === 'Actief' ? 'success' : c.status === 'Aflopend' ? 'warning' : 'neutral'}>
                    {c.status}
                  </Badge>
                </div>
                <div className="mt-1 text-xs text-ink-500">{c.hoursPerWeek} uur per week</div>
              </div>
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Vakantie & tegoed" />
          <CardBody>
            <Info label="Saldo dagen" value={`${balance?.remainingDays ?? 0} van ${balance?.totalDays ?? 0}`} />
            <Info label="Tegoed" value={formatMoney((balance?.holidayMoneyCents ?? 0) / 100)} />
            <Info label="Laatste update" value={balance ? formatDate(balance.lastUpdated) : '-'} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Documenten" subtitle="AVG-proof opslag" action={
            <button className="btn-ghost"><Icon.Upload className="h-4 w-4" /> Upload</button>
          } />
          <CardBody>
            <ul className="flex flex-col gap-2">
              {studentDocs.map((d) => (
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
          </CardBody>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader title="Tijdlijn" subtitle="Belangrijke momenten" />
        <CardBody>
          <ol className="relative ml-3 border-l border-bone-200">
            {[
              { label: 'Eerste BPV gestart', date: '15 nov 2023', done: true },
              { label: 'Praktijkbeoordeling – Goed', date: '12 jun 2024', done: true },
              { label: 'Niveau 2 afgerond', date: '1 feb 2025', done: true },
              { label: 'Praktijkbeoordeling niveau 3', date: '8 jun 2026', done: false },
              { label: 'Diploma uitreiking', date: '25 jun 2026', done: false },
            ].map((step, i) => (
              <li key={i} className="mb-4 pl-4 last:mb-0">
                <span className={`absolute -left-[7px] grid h-3.5 w-3.5 place-items-center rounded-full ring-2 ring-white ${step.done ? 'bg-wood-500' : 'bg-bone-200'}`} />
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-ink-900">{step.label}</div>
                  <div className="text-xs text-ink-500">{step.date}</div>
                </div>
              </li>
            ))}
          </ol>
        </CardBody>
      </Card>
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

function KPI({
  tone,
  label,
  value,
  icon,
}: {
  tone: 'wood' | 'green' | 'rose' | 'amber';
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
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
