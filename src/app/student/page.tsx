import Link from 'next/link';
import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { Avatar } from '@/components/ui/Avatar';
import { Badge, StatusDot } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { currentStudent } from '@/lib/mock/users';
import { students } from '@/lib/mock/students';
import { companies } from '@/lib/mock/companies';
import { coordinators } from '@/lib/mock/users';
import { programs } from '@/lib/mock/programs';
import { holidayBalances, tasks, messages, planningItems } from '@/lib/mock/misc';
import { currentWeekTimesheet } from '@/lib/mock/timesheets';
import { formatDate, formatHours, formatMoney } from '@/lib/utils';

export default function StudentDashboardPage() {
  const student = students[0];
  const program = programs.find((p) => p.id === student.programId)!;
  const company = companies.find((c) => c.id === student.companyId)!;
  const coordinator = coordinators.find((c) => c.id === student.coordinatorId)!;
  const balance = holidayBalances.find((h) => h.studentId === student.id)!;
  const myTasks = tasks.filter((t) => t.studentId === student.id);
  const myMessages = messages.slice(0, 3);
  const week = currentWeekTimesheet;

  return (
    <PortalShell
      role="STUDENT"
      activeHref="/student"
      userName={currentStudent.name}
      userSubtitle="Student"
      greeting={{
        title: 'Goedemorgen, Jamie',
        subtitle: 'Welkom terug in jouw persoonlijke omgeving.',
      }}
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Vakantiedagen"
          value={`${balance.remainingDays} dagen`}
          hint={`van de ${balance.totalDays} dagen`}
          icon={<Icon.Palm className="h-5 w-5" />}
          tone="green"
        />
        <StatCard
          label="Vakantietegoed"
          value={formatMoney(balance.holidayMoneyCents / 100)}
          hint={`Laatste update: ${formatDate(balance.lastUpdated)}`}
          icon={<Icon.Euro className="h-5 w-5" />}
          tone="amber"
        />
        <StatCard
          label="Ziekteverzuim"
          value="1 melding"
          hint="Open meldingen"
          icon={<Icon.Heart className="h-5 w-5" />}
          tone="rose"
        />
        <StatCard
          label="Contract"
          value={<span className="text-emerald-700">Actief</span>}
          hint="Geldig tot 31-07-2025"
          icon={<Icon.Doc className="h-5 w-5" />}
          tone="wood"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title={`Mijn opleiding`}
            subtitle={`${program.name} ${program.level}`}
            action={
              <Link href="/student/opleiding" className="btn-ghost">
                Bekijk
                <Icon.ArrowRight className="h-4 w-4" />
              </Link>
            }
          />
          <CardBody>
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-600">Voortgang opleiding</span>
                <span className="font-semibold text-ink-900">65%</span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-bone-100">
                <div className="h-full rounded-full bg-wood-500" style={{ width: '65%' }} />
              </div>
            </div>
            <ol className="relative ml-3 border-l border-bone-200">
              {timeline.map((step, i) => (
                <li key={step.label} className="mb-4 pl-4 last:mb-0">
                  <span
                    className={`absolute -left-[7px] grid h-3.5 w-3.5 place-items-center rounded-full ring-2 ring-white ${
                      step.done ? 'bg-wood-500' : 'bg-bone-200'
                    }`}
                  />
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-medium text-ink-900">{step.label}</div>
                      <div className="text-xs text-ink-500">{step.sub}</div>
                    </div>
                    <span className="whitespace-nowrap text-xs text-ink-500">{step.date}</span>
                  </div>
                  {i === 0 ? <Badge variant="success" className="mt-2">Goed</Badge> : null}
                </li>
              ))}
            </ol>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Weekstaat W22"
            subtitle="25 – 31 mei 2026"
            action={
              <Link href="/student/uren" className="btn-primary">
                <Icon.Clock className="h-4 w-4" />
                Invullen
              </Link>
            }
          />
          <CardBody>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl font-semibold text-ink-900">
                {formatHours(week.totals.totaal)}
              </span>
              <span className="text-sm text-ink-500">van {week.totals.norm} u</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-bone-100">
              <div
                className="h-full rounded-full bg-emerald-500"
                style={{ width: `${Math.min(100, (week.totals.totaal / week.totals.norm) * 100)}%` }}
              />
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <Stat label="Praktijk" value={formatHours(week.totals.praktijk)} />
              <Stat label="School" value={formatHours(week.totals.school)} />
              <Stat label="Ziekte" value={formatHours(week.totals.ziekte)} />
              <Stat label="Verlof" value={formatHours(week.totals.verlof)} />
            </dl>
            <div className="mt-5 flex items-center justify-between rounded-xl border border-bone-200 bg-bone-50 p-3">
              <div className="text-xs text-ink-600">Status</div>
              <Badge variant="warning">Concept · niet ingediend</Badge>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card>
          <CardHeader title="Mijn leerbedrijf" subtitle={company.name} />
          <CardBody>
            <div className="flex items-center gap-3">
              <Avatar name={company.contactName} tone="wood" />
              <div>
                <div className="text-sm font-medium text-ink-900">{company.contactName}</div>
                <div className="text-xs text-ink-500">{company.contactPhone}</div>
              </div>
            </div>
            <Link
              href="/student/leerbedrijf"
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-wood-700 hover:text-wood-800"
            >
              Naar bedrijfsinformatie
              <Icon.ArrowRight className="h-4 w-4" />
            </Link>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Mijn coördinator" subtitle={coordinator.name} />
          <CardBody>
            <div className="flex items-center gap-3">
              <Avatar name={coordinator.name} tone="green" />
              <div>
                <div className="text-sm font-medium text-ink-900">{coordinator.name}</div>
                <div className="text-xs text-ink-500">{coordinator.phone}</div>
              </div>
            </div>
            <Link
              href="/student/berichten"
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-wood-700 hover:text-wood-800"
            >
              Neem contact op
              <Icon.ArrowRight className="h-4 w-4" />
            </Link>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Taken" subtitle={`${myTasks.filter((t) => t.status === 'OPEN').length} open`} action={
            <Link href="/student/taken" className="btn-ghost">Alles</Link>
          } />
          <CardBody>
            <ul className="flex flex-col gap-2">
              {myTasks.slice(0, 3).map((t) => (
                <li key={t.id} className="flex items-start gap-3 rounded-xl border border-bone-200 p-3">
                  <input type="checkbox" className="mt-0.5 h-4 w-4 rounded border-bone-300" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-ink-900">{t.title}</div>
                    <div className="text-xs text-ink-500">Voor {t.dueDate ? formatDate(t.dueDate) : '-'}</div>
                  </div>
                  {t.priority === 'HOOG' ? (
                    <Badge variant="danger">Te laat</Badge>
                  ) : (
                    <Badge variant="neutral">Open</Badge>
                  )}
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Berichten" subtitle="Laatste updates" action={
            <Link href="/student/berichten" className="btn-ghost">Bekijk alles</Link>
          } />
          <CardBody>
            <ul className="divide-y divide-bone-100">
              {myMessages.map((m) => (
                <li key={m.id} className="flex items-start gap-4 py-3 first:pt-0 last:pb-0">
                  <Avatar name={m.fromName} tone="stone" size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="truncate text-sm font-medium text-ink-900">{m.fromName}</div>
                      <div className="text-xs text-ink-500">{formatDate(m.sentAt)}</div>
                    </div>
                    <div className="truncate text-sm text-ink-600">{m.subject}</div>
                    <div className="truncate text-xs text-ink-500">{m.preview}</div>
                  </div>
                  {!m.read ? <StatusDot variant="wood" /> : null}
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Volgende in planning" subtitle="Voor jou relevant" />
          <CardBody>
            <ul className="flex flex-col gap-3">
              {planningItems.slice(0, 4).map((p) => (
                <li key={p.id} className="flex items-start gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-wood-50 text-wood-700 ring-1 ring-wood-100">
                    <Icon.Calendar className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-ink-900">{p.title}</div>
                    <div className="text-xs text-ink-500">{formatDate(p.startDate)}</div>
                  </div>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </div>
    </PortalShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-bone-200 bg-bone-50 px-3 py-2">
      <div className="text-[11px] uppercase tracking-wider text-ink-500">{label}</div>
      <div className="text-sm font-semibold text-ink-900">{value}</div>
    </div>
  );
}

const timeline = [
  { label: 'Start opleiding', sub: 'Welkom bij je opleiding! Veel succes!', date: '1 aug 2023', done: true },
  { label: 'Eerste praktijkbeoordeling', sub: 'Beoordeling: Goed', date: '15 nov 2023', done: true },
  { label: 'Niveau 2 afgerond', sub: 'Gefeliciteerd! Niveau 2 behaald.', date: '1 feb 2024', done: true },
  { label: 'BPV periode 2', sub: 'Net gestart met BPV periode 2.', date: '1 mei 2024', done: true },
  { label: 'Niveau 3 examens', sub: 'De examens staan gepland.', date: 'Feb 2025', done: false },
  { label: 'Diploma', sub: 'Op naar je toekomst!', date: 'Juni 2025', done: false },
];
