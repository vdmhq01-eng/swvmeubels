import Link from 'next/link';
import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Icon } from '@/components/ui/Icon';
import { EmptyState } from '@/components/ui/EmptyState';
import { currentAdmin } from '@/lib/mock/users';
import { db } from '@/lib/db';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function KaartenbakPage() {
  const [applications, studentsWithoutSynergy, studentsWithoutCleverdesk, recentSync] = await Promise.all([
    db.application.findMany({
      orderBy: { createdAt: 'desc' },
      include: { assignedTo: true, region: true },
      take: 40,
    }).catch(() => []),
    db.student.findMany({
      where: { OR: [{ externalId: '' }, { externalId: { startsWith: 'temp-' } }] },
      include: { user: true, region: true, company: true },
    }).catch(() => []),
    db.student.findMany({
      where: { cleverdeskId: null },
      include: { user: true, company: true },
    }).catch(() => []),
    db.syncLog.findMany({
      where: { integration: 'EXACT_SYNERGY' },
      orderBy: { startedAt: 'desc' },
      take: 5,
    }).catch(() => []),
  ]);

  const nieuw = applications.filter((a) => a.status === 'NIEUW' || a.status === 'TOEGEWEZEN').length;
  const inBehandeling = applications.filter((a) => a.status === 'IN_BEHANDELING').length;
  const geaccepteerd = applications.filter((a) => a.status === 'GEACCEPTEERD').length;

  return (
    <PortalShell
      role="ADMIN"
      activeHref="/admin/kaartenbak"
      userName={currentAdmin.name}
      userSubtitle="Admin"
      greeting={{
        title: 'Synergy kaartenbak',
        subtitle: 'Sollicitaties, ID-toewijzing en koppelingen tussen Exact Synergy + Cleverdesk.',
      }}
    >
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat label="Open sollicitaties" value={`${nieuw}`} tone="primary" icon={<Icon.Bell className="h-5 w-5" />} />
        <Stat label="In behandeling" value={`${inBehandeling}`} tone="navy" icon={<Icon.Activity className="h-5 w-5" />} />
        <Stat label="Geaccepteerd" value={`${geaccepteerd}`} tone="emerald" icon={<Icon.CheckCircle className="h-5 w-5" />} />
        <Stat label="Te koppelen IDs" value={`${studentsWithoutSynergy.length + studentsWithoutCleverdesk.length}`} tone="amber" icon={<Icon.Link className="h-5 w-5" />} />
      </div>

      {/* Inbox sollicitaties */}
      <Card className="mt-6">
        <CardHeader
          title="Sollicitatie inbox"
          subtitle="Auto-routed op postcode → coördinator"
          action={
            <div className="flex items-center gap-2">
              <button className="btn-secondary">
                <Icon.Settings className="h-4 w-4" /> Filters
              </button>
              <button className="btn-primary">
                <Icon.Plus className="h-4 w-4" /> Handmatig toevoegen
              </button>
            </div>
          }
        />
        <CardBody>
          {applications.length === 0 ? (
            <EmptyState
              icon={<Icon.Bell className="h-5 w-5" />}
              title="Geen sollicitaties"
              description="Sollicitaties via /solliciteren komen hier binnen en worden automatisch toegewezen op postcode."
            />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-bone-200">
              <table className="w-full min-w-[840px] border-collapse text-sm">
                <thead>
                  <tr>
                    <th className="table-head">Sollicitant</th>
                    <th className="table-head">Type</th>
                    <th className="table-head">Postcode</th>
                    <th className="table-head">Toegewezen</th>
                    <th className="table-head">Datum</th>
                    <th className="table-head">Status</th>
                    <th className="table-head"></th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((a) => {
                    const status = a.status;
                    const variant =
                      status === 'NIEUW' ? 'warning' :
                      status === 'TOEGEWEZEN' ? 'info' :
                      status === 'IN_BEHANDELING' ? 'info' :
                      status === 'GEACCEPTEERD' ? 'success' :
                      'danger';
                    return (
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
                        <td className="table-cell">
                          <Badge variant="wood">{a.applicantType}</Badge>
                        </td>
                        <td className="table-cell font-mono text-xs">{a.postcode}</td>
                        <td className="table-cell text-ink-700">
                          {a.assignedTo?.name ?? <span className="text-ink-400">Geen match</span>}
                          {a.region ? <div className="text-xs text-ink-500">Regio {a.region.name}</div> : null}
                        </td>
                        <td className="table-cell text-ink-500">{formatDate(a.createdAt)}</td>
                        <td className="table-cell"><Badge variant={variant}>{status}</Badge></td>
                        <td className="table-cell text-right">
                          <Link href={`/admin/kaartenbak/${a.id}`} className="btn-ghost">
                            Open<Icon.ArrowRight className="h-4 w-4" />
                          </Link>
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

      {/* ID koppeling */}
      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Studenten zonder Synergy ID"
            subtitle="Vereisen handmatige koppeling aan Exact"
            action={
              <button className="btn-primary">
                <Icon.Refresh className="h-4 w-4" /> Auto-sync
              </button>
            }
          />
          <CardBody>
            {studentsWithoutSynergy.length === 0 ? (
              <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-sm text-emerald-700">
                ✓ Alle studenten hebben een Synergy ID.
              </div>
            ) : (
              <ul className="divide-y divide-bone-100">
                {studentsWithoutSynergy.map((s) => (
                  <li key={s.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <Avatar name={s.user.name} size="sm" tone="wood" />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-ink-900">{s.user.name}</div>
                      <div className="text-xs text-ink-500">{s.company?.name ?? 'Geen bedrijf'} · {s.region.name}</div>
                    </div>
                    <input
                      placeholder="SYN-XXXXX"
                      className="w-32 rounded-md border border-bone-300 px-2 py-1 text-xs font-mono"
                    />
                    <button className="btn-secondary">Koppel</button>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Studenten zonder Cleverdesk ID"
            subtitle="Uren-sync blijft hangen tot ID gevuld"
          />
          <CardBody>
            {studentsWithoutCleverdesk.length === 0 ? (
              <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-sm text-emerald-700">
                ✓ Alle studenten hebben een Cleverdesk ID.
              </div>
            ) : (
              <ul className="divide-y divide-bone-100">
                {studentsWithoutCleverdesk.map((s) => (
                  <li key={s.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <Avatar name={s.user.name} size="sm" tone="wood" />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-ink-900">{s.user.name}</div>
                      <div className="text-xs text-ink-500">{s.company?.name ?? '-'}</div>
                    </div>
                    <input
                      placeholder="CD-XXXXX"
                      className="w-32 rounded-md border border-bone-300 px-2 py-1 text-xs font-mono"
                    />
                    <button className="btn-secondary">Koppel</button>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Sync history */}
      <Card className="mt-6">
        <CardHeader
          title="Laatste Synergy sync"
          action={
            <Link href="/admin/sync-logs" className="btn-ghost">
              Volledig logboek<Icon.ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
        <CardBody>
          {recentSync.length === 0 ? (
            <div className="text-sm text-ink-500">Geen sync-activiteit.</div>
          ) : (
            <ul className="divide-y divide-bone-100">
              {recentSync.map((l) => (
                <li key={l.id} className="flex items-center justify-between py-2 first:pt-0 last:pb-0 text-sm">
                  <div>
                    <span className="font-medium text-ink-900">{l.objectType}</span>
                    <span className="ml-2 text-xs text-ink-500">{l.externalId ?? ''}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={l.status === 'OK' ? 'success' : 'danger'}>{l.status}</Badge>
                    <span className="text-xs text-ink-500">{formatDate(l.startedAt)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>
    </PortalShell>
  );
}

function Stat({ label, value, tone, icon }: { label: string; value: string; tone: 'primary' | 'navy' | 'emerald' | 'amber'; icon: React.ReactNode }) {
  const cls = {
    primary: 'bg-primary-500 text-white',
    navy: 'bg-navy-600 text-white',
    emerald: 'bg-emerald-600 text-white',
    amber: 'bg-amber-500 text-white',
  }[tone];
  return (
    <div className="card-padded">
      <div className={`grid h-10 w-10 place-items-center rounded-md ${cls}`}>{icon}</div>
      <div className="mt-3 font-display text-2xl font-bold text-ink-900">{value}</div>
      <div className="text-xs font-semibold uppercase tracking-wider text-ink-500">{label}</div>
    </div>
  );
}
