import Link from 'next/link';
import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { Avatar } from '@/components/ui/Avatar';
import { Badge, StatusDot } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { EmptyState } from '@/components/ui/EmptyState';
import { AppInstallBanner } from '@/components/portal/AppInstallBanner';
import { getDemoSession } from '@/lib/data/session';
import { getStudentDashboard } from '@/lib/data/dashboard';
import { formatDate, formatHours, formatMoney } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function StudentDashboardPage() {
  const ctx = getDemoSession('STUDENT');
  const data = await getStudentDashboard(ctx);

  if (!data?.student) {
    return (
      <PortalShell role="STUDENT" activeHref="/student" userName="Demo" userSubtitle="Student">
        <EmptyState
          icon={<Icon.User className="h-5 w-5" />}
          title="Geen studentprofiel gevonden"
          description="Heb je de database al geseed? Run `npm run prisma:seed` in de projectmap."
        />
      </PortalShell>
    );
  }

  const { student, currentWeek, openTasks, recentMessages, planning } = data;
  const contract = student.contracts[0];
  const balance = student.holidayBalance;
  const openVerzuim = student.absences.length;
  const totals = computeTotals(currentWeek?.entries ?? []);

  return (
    <PortalShell
      role="STUDENT"
      activeHref="/student"
      userName={student.user.name}
      userSubtitle="Student"
      greeting={{
        title: `Goedemorgen, ${student.user.name.split(' ')[0]}`,
        subtitle: 'Welkom terug in jouw persoonlijke omgeving.',
      }}
    >
      <AppInstallBanner />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Vakantiedagen"
          value={balance ? `${balance.remainingDays} dagen` : '-'}
          hint={balance ? `van de ${balance.totalDays} dagen` : 'geen saldo'}
          icon={<Icon.Palm className="h-5 w-5" />}
          tone="green"
        />
        <StatCard
          label="Vakantietegoed"
          value={balance ? formatMoney(balance.holidayMoneyCents / 100) : '-'}
          hint={balance ? `Laatste update: ${formatDate(balance.lastUpdated)}` : 'geen tegoed'}
          icon={<Icon.Euro className="h-5 w-5" />}
          tone="amber"
        />
        <StatCard
          label="Ziekteverzuim"
          value={`${openVerzuim} melding${openVerzuim === 1 ? '' : 'en'}`}
          hint="Open meldingen"
          icon={<Icon.Heart className="h-5 w-5" />}
          tone="rose"
        />
        <StatCard
          label="Contract"
          value={
            contract ? (
              <span className={contract.status === 'AFLOPEND' ? 'text-amber-700' : 'text-emerald-700'}>
                {contract.status === 'ACTIEF' ? 'Actief' : 'Aflopend'}
              </span>
            ) : (
              '-'
            )
          }
          hint={contract ? `Geldig tot ${formatDate(contract.endDate)}` : 'Geen contract'}
          icon={<Icon.Doc className="h-5 w-5" />}
          tone="wood"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Mijn opleiding"
            subtitle={`${student.program.name} ${formatLevel(student.program.level)}`}
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
                <span className="font-semibold text-ink-900">{progressForYear(student.yearOfStudy)}%</span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-bone-100">
                <div
                  className="h-full rounded-full bg-wood-500"
                  style={{ width: `${progressForYear(student.yearOfStudy)}%` }}
                />
              </div>
            </div>
            <ol className="relative ml-3 border-l border-bone-200">
              {timelineFor(student).map((step) => (
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
                </li>
              ))}
            </ol>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title={currentWeek ? `Weekstaat W${currentWeek.weekNumber}` : 'Weekstaat'}
            subtitle={currentWeek ? formatDate(currentWeek.weekStartDate) : 'Geen actieve week'}
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
                {formatHours(totals.totaal)}
              </span>
              <span className="text-sm text-ink-500">van 38 u</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-bone-100">
              <div
                className="h-full rounded-full bg-emerald-500"
                style={{ width: `${Math.min(100, (totals.totaal / 38) * 100)}%` }}
              />
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <Stat label="Praktijk" value={formatHours(totals.PRAKTIJK)} />
              <Stat label="School" value={formatHours(totals.SCHOOL)} />
              <Stat label="Ziekte" value={formatHours(totals.ZIEKTE)} />
              <Stat label="Verlof" value={formatHours(totals.VERLOF)} />
            </dl>
            <div className="mt-5 flex items-center justify-between rounded-xl border border-bone-200 bg-bone-50 p-3">
              <div className="text-xs text-ink-600">Status</div>
              <Badge variant={statusVariant(currentWeek?.status)}>{statusLabel(currentWeek?.status)}</Badge>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card>
          <CardHeader title="Mijn leerbedrijf" subtitle={student.company.name} />
          <CardBody>
            {student.company.contacts[0] ? (
              <div className="flex items-center gap-3">
                <Avatar name={student.company.contacts[0].user.name} tone="wood" />
                <div>
                  <div className="text-sm font-medium text-ink-900">
                    {student.company.contacts[0].user.name}
                  </div>
                  <div className="text-xs text-ink-500">
                    {student.company.contacts[0].user.email}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-ink-500">Geen contactpersoon bekend</div>
            )}
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
          <CardHeader title="Mijn coördinator" subtitle={student.coordinator.user.name} />
          <CardBody>
            <div className="flex items-center gap-3">
              <Avatar name={student.coordinator.user.name} tone="green" />
              <div>
                <div className="text-sm font-medium text-ink-900">{student.coordinator.user.name}</div>
                <div className="text-xs text-ink-500">{student.coordinator.user.email}</div>
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
          <CardHeader
            title="Taken"
            subtitle={`${openTasks.length} open`}
            action={
              <Link href="/student/taken" className="btn-ghost">
                Alles
              </Link>
            }
          />
          <CardBody>
            {openTasks.length === 0 ? (
              <div className="text-sm text-ink-500">Geen openstaande taken.</div>
            ) : (
              <ul className="flex flex-col gap-2">
                {openTasks.slice(0, 3).map((t) => (
                  <li key={t.id} className="flex items-start gap-3 rounded-xl border border-bone-200 p-3">
                    <input type="checkbox" className="mt-0.5 h-4 w-4 rounded border-bone-300" />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-ink-900">{t.title}</div>
                      <div className="text-xs text-ink-500">
                        Voor {t.dueDate ? formatDate(t.dueDate) : '-'}
                      </div>
                    </div>
                    <Badge variant={t.priority === 'HOOG' ? 'danger' : 'neutral'}>
                      {t.priority === 'HOOG' ? 'Hoog' : 'Open'}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Berichten"
            subtitle="Laatste updates"
            action={
              <Link href="/student/berichten" className="btn-ghost">
                Bekijk alles
              </Link>
            }
          />
          <CardBody>
            {recentMessages.length === 0 ? (
              <div className="text-sm text-ink-500">Geen recente berichten.</div>
            ) : (
              <ul className="divide-y divide-bone-100">
                {recentMessages.map((m) => (
                  <li key={m.id} className="flex items-start gap-4 py-3 first:pt-0 last:pb-0">
                    <Avatar name={m.fromUser.name} tone="stone" size="sm" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="truncate text-sm font-medium text-ink-900">{m.fromUser.name}</div>
                        <div className="text-xs text-ink-500">{formatDate(m.sentAt)}</div>
                      </div>
                      <div className="truncate text-sm text-ink-600">{m.subject}</div>
                      <div className="truncate text-xs text-ink-500">{m.body}</div>
                    </div>
                    {!m.readAt ? <StatusDot variant="wood" /> : null}
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Volgende in planning" subtitle="Voor jou relevant" />
          <CardBody>
            {planning.length === 0 ? (
              <div className="text-sm text-ink-500">Niets gepland.</div>
            ) : (
              <ul className="flex flex-col gap-3">
                {planning.map((p) => (
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
            )}
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

function computeTotals(entries: { type: string; hours: unknown }[]) {
  const t = { PRAKTIJK: 0, SCHOOL: 0, ZIEKTE: 0, VERLOF: 0, AFWEZIG: 0, totaal: 0 };
  for (const e of entries) {
    const h =
      typeof e.hours === 'object' && e.hours !== null && 'toNumber' in e.hours
        ? (e.hours as { toNumber: () => number }).toNumber()
        : Number(e.hours);
    if (e.type in t) (t as Record<string, number>)[e.type] += h;
  }
  t.totaal = t.PRAKTIJK + t.SCHOOL + t.ZIEKTE + t.VERLOF + t.AFWEZIG;
  return t;
}

function formatLevel(level: string) {
  return level.replace('BBL_', 'BBL ');
}

function progressForYear(year: number) {
  return Math.min(100, year * 25 + 15);
}

function statusVariant(s?: string) {
  switch (s) {
    case 'GOEDGEKEURD':
      return 'success' as const;
    case 'AFGEKEURD':
      return 'danger' as const;
    case 'INGEDIEND':
      return 'info' as const;
    default:
      return 'warning' as const;
  }
}

function statusLabel(s?: string) {
  switch (s) {
    case 'GOEDGEKEURD':
      return 'Goedgekeurd';
    case 'AFGEKEURD':
      return 'Afgekeurd';
    case 'INGEDIEND':
      return 'Ingediend';
    case 'CORRECTIE_GEVRAAGD':
      return 'Correctie gevraagd';
    default:
      return 'Concept · niet ingediend';
  }
}

function timelineFor(student: { startDate: Date; expectedDiplomaDate: Date | null; yearOfStudy: number }) {
  const startYear = student.startDate.getFullYear();
  return [
    { label: 'Start opleiding', sub: 'Welkom bij je opleiding.', date: `${startYear}`, done: true },
    { label: 'Eerste praktijkbeoordeling', sub: 'Beoordeling: Goed', date: `${startYear + 1}`, done: student.yearOfStudy >= 2 },
    { label: 'Niveau 2 afgerond', sub: 'Gefeliciteerd!', date: `${startYear + 1}`, done: student.yearOfStudy >= 2 },
    { label: 'BPV periodes', sub: 'Met je leerbedrijf', date: 'Doorlopend', done: student.yearOfStudy >= 2 },
    { label: 'Niveau 3 examens', sub: 'Gepland', date: `${startYear + 2}`, done: student.yearOfStudy >= 4 },
    { label: 'Diploma', sub: 'Op naar je toekomst!', date: student.expectedDiplomaDate ? `${student.expectedDiplomaDate.getFullYear()}` : '-', done: false },
  ];
}
