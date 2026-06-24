import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Icon } from '@/components/ui/Icon';
import { currentAdmin } from '@/lib/mock/users';
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

export default async function AdminKaartenbakDetailPage({ params }: { params: { id: string } }) {
  const application = await db.application.findUnique({
    where: { id: params.id },
    include: { region: true, assignedTo: true },
  }).catch(() => null);

  if (!application) notFound();

  return (
    <PortalShell
      role="ADMIN"
      activeHref="/admin/kaartenbak"
      userName={currentAdmin.name}
      userSubtitle="Admin"
      greeting={{
        title: `${application.firstName} ${application.lastName}`,
        subtitle: `Sollicitatie · ${application.applicantType} · ${formatDateTime(application.createdAt)}`,
      }}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Link href="/admin/kaartenbak" className="btn-ghost">
          ← Terug naar kaartenbak
        </Link>
        <div className="flex gap-2">
          <button className="btn-secondary">
            <Icon.Settings className="h-4 w-4" /> Status wijzigen
          </button>
          <button className="btn-primary">
            <Icon.Plus className="h-4 w-4" /> Maak student aan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardBody>
            <div className="flex items-start gap-4">
              <Avatar name={`${application.firstName} ${application.lastName}`} size="lg" tone="wood" />
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-display text-2xl font-bold text-ink-900">
                    {application.firstName} {application.lastName}
                  </h2>
                  <Badge variant={statusVariant[application.status]}>{application.status}</Badge>
                  <Badge variant="wood">{application.applicantType}</Badge>
                </div>
                <dl className="mt-5 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                  <Field label="E-mail" value={application.email} />
                  <Field label="Telefoon" value={application.phone} />
                  <Field label="Postcode" value={application.postcode} />
                  <Field label="Type" value={application.applicantType} />
                  <Field label="Interesse" value={application.programInterest ?? '-'} />
                  <Field label="Ontvangen" value={formatDateTime(application.createdAt)} />
                </dl>
                {application.message ? (
                  <div className="mt-5 rounded-xl border border-bone-200 bg-bone-50 p-4">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">
                      Bericht van sollicitant
                    </div>
                    <p className="mt-2 whitespace-pre-wrap text-sm text-ink-700">{application.message}</p>
                  </div>
                ) : null}
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Toewijzing" />
          <CardBody>
            <div className="space-y-4 text-sm">
              <RowDef
                icon={<Icon.Activity className="h-4 w-4 text-ink-500" />}
                label="Regio"
                value={application.region?.name ?? <span className="text-amber-700">Niet gevonden</span>}
              />
              <RowDef
                icon={<Icon.User className="h-4 w-4 text-ink-500" />}
                label="Coördinator"
                value={
                  application.assignedTo?.name ?? <span className="text-amber-700">Niet toegewezen</span>
                }
              />
              <RowDef
                icon={<Icon.Lock className="h-4 w-4 text-ink-500" />}
                label="Application ID"
                value={application.id}
              />
            </div>
            <button className="btn-secondary mt-5 w-full">
              <Icon.Refresh className="h-4 w-4" /> Wijzig toewijzing
            </button>
          </CardBody>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader
          title="Maak student aan uit deze sollicitatie"
          subtitle="Genereert direct SWV-ID + Synergy ID. Vereist nog koppeling aan lidbedrijf."
        />
        <CardBody>
          <form className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="label mb-1.5 block">SWV ID (auto)</label>
              <input className="input font-mono" defaultValue={`SWV-${application.id.slice(-6).toUpperCase()}`} readOnly />
            </div>
            <div>
              <label className="label mb-1.5 block">Synergy ID (handmatig)</label>
              <input className="input font-mono" placeholder="SYN-12345" />
            </div>
            <div>
              <label className="label mb-1.5 block">Opleiding</label>
              <select className="input">
                <option>Meubelmaker BBL 2 (24m)</option>
                <option>Meubelmaker BBL 3 (36m)</option>
                <option>Interieurbouwer BBL 3 (36m)</option>
                <option>Houtbewerker BBL 2 (24m)</option>
              </select>
            </div>
            <div>
              <label className="label mb-1.5 block">Leerbedrijf</label>
              <select className="input">
                <option>Nog niet bekend — match later</option>
                <option>De Vries Interieurbouw (Groningen)</option>
                <option>Houtwerk Maatwerk (Enschede)</option>
                <option>Atelier Lindeboom (Almelo)</option>
              </select>
            </div>
            <div>
              <label className="label mb-1.5 block">Startdatum</label>
              <input type="date" className="input" />
            </div>
            <div>
              <label className="label mb-1.5 block">Coördinator</label>
              <select className="input" defaultValue={application.assignedTo?.id ?? ''}>
                <option value={application.assignedTo?.id ?? ''}>
                  {application.assignedTo?.name ?? 'Geen'}
                </option>
              </select>
            </div>
          </form>
          <div className="mt-5 flex flex-wrap gap-2">
            <button className="btn-primary">
              <Icon.Check className="h-4 w-4" /> Maak student aan
            </button>
            <button className="btn-secondary">
              <Icon.Bell className="h-4 w-4" /> Stuur bevestiging naar sollicitant
            </button>
            <button className="ml-auto btn-ghost text-rose-600 hover:bg-rose-50">
              <Icon.X className="h-4 w-4" /> Wijs sollicitatie af
            </button>
          </div>
        </CardBody>
      </Card>
    </PortalShell>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] font-medium uppercase tracking-wider text-ink-500">{label}</dt>
      <dd className="text-sm text-ink-900">{value}</dd>
    </div>
  );
}

function RowDef({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      {icon}
      <div className="flex-1">
        <div className="text-[11px] uppercase tracking-wider text-ink-500">{label}</div>
        <div className="text-ink-900">{value}</div>
      </div>
    </div>
  );
}
