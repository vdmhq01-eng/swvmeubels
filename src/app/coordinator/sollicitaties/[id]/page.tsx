import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Icon } from '@/components/ui/Icon';
import { getDemoSession } from '@/lib/data/session';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

const statusVariant = {
  NIEUW: 'warning' as const,
  IN_BEHANDELING: 'info' as const,
  TOEGEWEZEN: 'wood' as const,
  GEACCEPTEERD: 'success' as const,
  AFGEWEZEN: 'danger' as const,
};

function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat('nl-NL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(value);
}

export default async function SollicitatieDetail({ params }: { params: { id: string } }) {
  const ctx = getDemoSession('COORDINATOR');
  const [application, coordinator] = await Promise.all([
    db.application.findUnique({
      where: { id: params.id },
      include: { region: true, assignedTo: true },
    }).catch(() => null),
    db.coordinator.findUnique({
      where: { id: ctx.coordinatorId! },
      include: { user: true, region: true },
    }).catch(() => null),
  ]);

  if (!application) notFound();

  return (
    <PortalShell
      role="COORDINATOR"
      activeHref="/coordinator/sollicitaties"
      userName={coordinator?.user.name ?? 'Coördinator'}
      userSubtitle={`Coördinator regio ${coordinator?.region.name ?? ''}`}
      greeting={{
        title: `${application.firstName} ${application.lastName}`,
        subtitle: `${application.applicantType} · ${application.region?.name ?? 'Onbekende regio'}`,
      }}
    >
      <div className="mb-4">
        <Link href="/coordinator/sollicitaties" className="btn-ghost">
          ← Terug naar sollicitaties
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardBody>
            <div className="flex items-start gap-4">
              <Avatar name={`${application.firstName} ${application.lastName}`} size="lg" tone="wood" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-display text-2xl font-bold">
                    {application.firstName} {application.lastName}
                  </h2>
                  <Badge variant={statusVariant[application.status]}>{application.status}</Badge>
                </div>
                <p className="mt-1 text-sm text-ink-500">
                  Ontvangen op {formatDateTime(application.createdAt)}
                </p>
                <dl className="mt-5 grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
                  <Field label="E-mail" value={<a href={`mailto:${application.email}`} className="text-primary-700 hover:underline">{application.email}</a>} />
                  <Field label="Telefoon" value={<a href={`tel:${application.phone}`} className="text-primary-700 hover:underline">{application.phone}</a>} />
                  <Field label="Postcode" value={application.postcode} />
                  <Field label="Type" value={application.applicantType} />
                  <Field label="Opleiding" value={application.programInterest ?? '-'} />
                  <Field label="Regio" value={application.region?.name ?? '-'} />
                </dl>

                {application.message ? (
                  <div className="mt-5 rounded-xl border border-bone-200 bg-bone-50 p-4">
                    <div className="text-xs font-bold uppercase tracking-wider text-ink-500">Bericht</div>
                    <p className="mt-2 whitespace-pre-line text-sm text-ink-800">{application.message}</p>
                  </div>
                ) : null}
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Acties" />
          <CardBody className="space-y-3">
            <button className="btn-primary w-full">
              <Icon.Check className="h-4 w-4" />
              In behandeling nemen
            </button>
            <a href={`mailto:${application.email}?subject=Sollicitatie SWV Meubel`} className="btn-secondary w-full">
              <Icon.Bell className="h-4 w-4" />
              E-mail sollicitant
            </a>
            <a href={`tel:${application.phone}`} className="btn-secondary w-full">
              <Icon.Activity className="h-4 w-4" />
              Bellen
            </a>
            <button className="w-full rounded-md border-2 border-rose-200 px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-rose-700 hover:bg-rose-50">
              <Icon.X className="mr-1 inline h-4 w-4" />
              Afwijzen
            </button>
          </CardBody>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader title="Volgende stap" />
        <CardBody>
          <ol className="list-decimal space-y-3 pl-5 text-sm text-ink-700">
            <li>Neem binnen 3 werkdagen contact op met de sollicitant.</li>
            <li>Plan een kennismakingsgesprek (telefoon of fysiek).</li>
            <li>Bespreek opleiding, motivatie en regio-mogelijkheden.</li>
            <li>Match met een geschikt lidbedrijf in jouw regio.</li>
            <li>Start administratieve afhandeling (contract via SWV).</li>
          </ol>
        </CardBody>
      </Card>
    </PortalShell>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[11px] font-bold uppercase tracking-wider text-ink-500">{label}</dt>
      <dd className="mt-0.5 text-sm text-ink-900">{value}</dd>
    </div>
  );
}
