import Link from 'next/link';
import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Icon } from '@/components/ui/Icon';
import { EmptyState } from '@/components/ui/EmptyState';
import { ApplicationNotifier } from '@/components/coordinator/ApplicationNotifier';
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

const statusLabel = {
  NIEUW: 'Nieuw',
  IN_BEHANDELING: 'In behandeling',
  TOEGEWEZEN: 'Toegewezen',
  GEACCEPTEERD: 'Geaccepteerd',
  AFGEWEZEN: 'Afgewezen',
};

function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat('nl-NL', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(value);
}

export default async function CoordinatorSollicitatiesPage() {
  const ctx = getDemoSession('COORDINATOR');
  const [applications, coordinator] = await Promise.all([
    db.application.findMany({
      where: { assignedToId: ctx.userId },
      orderBy: { createdAt: 'desc' },
      include: { region: true },
    }).catch(() => []),
    db.coordinator.findUnique({
      where: { id: ctx.coordinatorId! },
      include: { user: true, region: true },
    }).catch(() => null),
  ]);

  const nieuw = applications.filter((a) => a.status === 'NIEUW' || a.status === 'TOEGEWEZEN').length;
  const inBehandeling = applications.filter((a) => a.status === 'IN_BEHANDELING').length;
  const afgerond = applications.filter((a) => a.status === 'GEACCEPTEERD' || a.status === 'AFGEWEZEN').length;

  return (
    <PortalShell
      role="COORDINATOR"
      activeHref="/coordinator/sollicitaties"
      userName={coordinator?.user.name ?? 'Coördinator'}
      userSubtitle={`Coördinator regio ${coordinator?.region.name ?? ''}`}
      greeting={{
        title: 'Sollicitaties',
        subtitle: `${applications.length} sollicitatie${applications.length === 1 ? '' : 's'} voor regio ${coordinator?.region.name ?? ''}.`,
      }}
    >
      <ApplicationNotifier userId={ctx.userId} />

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Stat tone="primary" label="Nieuw / toegewezen" value={`${nieuw}`} icon={<Icon.Bell className="h-5 w-5" />} />
        <Stat tone="navy" label="In behandeling" value={`${inBehandeling}`} icon={<Icon.Activity className="h-5 w-5" />} />
        <Stat tone="emerald" label="Afgerond" value={`${afgerond}`} icon={<Icon.CheckCircle className="h-5 w-5" />} />
      </div>

      <Card>
        <CardHeader title="Alle sollicitaties" subtitle="Komt direct binnen via het sollicitatieformulier" />
        <CardBody>
          {applications.length === 0 ? (
            <EmptyState
              icon={<Icon.Bell className="h-5 w-5" />}
              title="Nog geen sollicitaties"
              description="Zodra iemand solliciteert in jouw regio verschijnt deze hier direct."
            />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-bone-200">
              <table className="w-full min-w-[760px] border-collapse text-sm">
                <thead>
                  <tr>
                    <th className="table-head">Sollicitant</th>
                    <th className="table-head">Type</th>
                    <th className="table-head">Postcode</th>
                    <th className="table-head">Opleiding</th>
                    <th className="table-head">Ontvangen</th>
                    <th className="table-head">Status</th>
                    <th className="table-head"></th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((a) => (
                    <tr key={a.id} className="table-row">
                      <td className="table-cell">
                        <div className="flex items-center gap-3">
                          <Avatar name={`${a.firstName} ${a.lastName}`} size="sm" tone="wood" />
                          <div>
                            <div className="font-medium text-ink-900">{a.firstName} {a.lastName}</div>
                            <div className="text-xs text-ink-500">{a.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="table-cell">{a.applicantType}</td>
                      <td className="table-cell font-mono text-xs">{a.postcode}</td>
                      <td className="table-cell text-xs">{a.programInterest ?? '-'}</td>
                      <td className="table-cell text-xs text-ink-500">{formatDateTime(a.createdAt)}</td>
                      <td className="table-cell">
                        <Badge variant={statusVariant[a.status]}>{statusLabel[a.status]}</Badge>
                      </td>
                      <td className="table-cell text-right">
                        <Link href={`/coordinator/sollicitaties/${a.id}`} className="btn-ghost">
                          Bekijk <Icon.ArrowRight className="h-4 w-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>
    </PortalShell>
  );
}

function Stat({ tone, label, value, icon }: { tone: 'primary' | 'navy' | 'emerald'; label: string; value: string; icon: React.ReactNode }) {
  const cls = {
    primary: 'bg-primary-500 text-white',
    navy: 'bg-navy-600 text-white',
    emerald: 'bg-emerald-600 text-white',
  }[tone];
  return (
    <div className="card-padded">
      <div className={`grid h-10 w-10 place-items-center rounded-md ${cls}`}>{icon}</div>
      <div className="mt-3 font-display text-3xl font-bold text-ink-900">{value}</div>
      <div className="text-xs font-semibold uppercase tracking-wider text-ink-500">{label}</div>
    </div>
  );
}
