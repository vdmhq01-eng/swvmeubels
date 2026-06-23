import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Icon } from '@/components/ui/Icon';
import { EmptyState } from '@/components/ui/EmptyState';
import { getDemoSession } from '@/lib/data/session';
import { getStudentBasic } from '@/lib/data/student-pages';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function StudentProfielPage() {
  const ctx = getDemoSession('STUDENT');
  const s = await getStudentBasic(ctx.studentId!);

  if (!s) {
    return (
      <PortalShell role="STUDENT" activeHref="/student/profiel" userName="Demo" userSubtitle="Student">
        <EmptyState
          icon={<Icon.User className="h-5 w-5" />}
          title="Geen student-profiel gevonden"
          description="Geen DB-verbinding of seed nog niet uitgevoerd."
        />
      </PortalShell>
    );
  }

  return (
    <PortalShell
      role="STUDENT"
      activeHref="/student/profiel"
      userName={s.user.name}
      userSubtitle="Student"
      greeting={{ title: 'Mijn gegevens', subtitle: 'Persoonlijke gegevens en contactinformatie.' }}
    >
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardBody>
            <div className="flex items-start gap-4">
              <Avatar name={s.user.name} size="lg" tone="wood" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-display text-2xl font-bold text-ink-900">{s.user.name}</h2>
                  <Badge variant="success">{s.signal}</Badge>
                </div>
                <p className="mt-1 text-sm text-ink-600">
                  {s.program.name} {s.program.level.replace('BBL_', 'BBL ')} · jaar {s.yearOfStudy}
                </p>
                <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                  <Field label="E-mail" value={s.user.email} />
                  <Field label="Regio" value={s.region.name} />
                  <Field label="Startdatum" value={formatDate(s.startDate)} />
                  <Field label="Verwacht diploma" value={s.expectedDiplomaDate ? formatDate(s.expectedDiplomaDate) : '-'} />
                  <Field label="Externe ID (Exact)" value={s.externalId} />
                  <Field label="Cleverdesk ID" value={s.cleverdeskId ?? '-'} />
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Privacy" subtitle="Wat zien anderen?" />
          <CardBody className="space-y-3 text-sm">
            <PrivacyRow label="Coördinator" value="Volledig profiel" />
            <PrivacyRow label="Lidbedrijf" value="Naam, contact, opleiding" />
            <PrivacyRow label="Admin" value="Volledig profiel" />
            <div className="mt-3 rounded-xl border border-bone-200 bg-bone-50 p-3 text-xs text-ink-600">
              Je BSN wordt nergens getoond. Je geboortedatum is alleen intern bekend.
            </div>
          </CardBody>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader title="Mijn rechten (AVG)" subtitle="Inzage, correctie en bezwaar" action={
          <button className="btn-secondary">
            <Icon.Doc className="h-4 w-4" /> Vraag dataexport
          </button>
        } />
        <CardBody>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <RightCard title="Inzage" body="Vraag een overzicht van alle persoonsgegevens die SWV Meubel over jou bewaart." />
            <RightCard title="Correctie" body="Klopt iets niet? Vraag een correctie aan via je coördinator of admin." />
            <RightCard title="Bezwaar" body="Bezwaar maken tegen verwerking? Neem contact op met de privacy officer." />
          </div>
        </CardBody>
      </Card>
    </PortalShell>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] font-medium uppercase tracking-wider text-ink-500">{label}</div>
      <div className="text-sm text-ink-900">{value}</div>
    </div>
  );
}

function PrivacyRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-bone-200 px-3 py-2">
      <span className="text-ink-700">{label}</span>
      <span className="text-xs text-ink-500">{value}</span>
    </div>
  );
}

function RightCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-bone-200 bg-bone-50 p-4">
      <div className="text-xs font-semibold uppercase tracking-wider text-primary-700">{title}</div>
      <p className="mt-1 text-sm text-ink-700">{body}</p>
    </div>
  );
}
