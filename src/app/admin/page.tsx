import Link from 'next/link';
import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { Badge, StatusDot } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { currentAdmin } from '@/lib/mock/users';
import { getAdminDashboardData } from '@/lib/data/dashboard';
import { countAuditByAction, listSecurityLogs } from '@/lib/data/admin';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const [data, secLogs, docActions24h] = await Promise.all([
    getAdminDashboardData(),
    listSecurityLogs(5),
    countAuditByAction('document.bekeken', 24).catch(() => 0),
  ]);

  const exact = data.integrations.find((i) => i.key === 'EXACT_SYNERGY');
  const cd = data.integrations.find((i) => i.key === 'CLEVERDESK');
  const criticalSec = secLogs.filter((s) => s.severity === 'KRITIEK' || s.severity === 'WAARSCHUWING').length;

  return (
    <PortalShell
      role="ADMIN"
      activeHref="/admin"
      userName={currentAdmin.name}
      userSubtitle="Admin"
      greeting={{ title: 'Beheer', subtitle: 'Status, integraties en security signalen.' }}
    >
      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        <StatCard
          label="Sync Exact"
          value={<span className={exact?.status === 'ACTIEF' ? 'text-emerald-700' : 'text-amber-700'}>{exact?.status ?? '-'}</span>}
          hint={`${data.recentSyncErrors.filter((e) => e.integration === 'EXACT_SYNERGY').length} fouten recent`}
          icon={<Icon.Link className="h-5 w-5" />}
          tone="green"
        />
        <StatCard
          label="Sync Cleverdesk"
          value={<span className={cd?.status === 'ACTIEF' ? 'text-emerald-700' : 'text-amber-700'}>{cd?.status ?? '-'}</span>}
          hint={`${data.recentSyncErrors.filter((e) => e.integration === 'CLEVERDESK').length} fouten recent`}
          icon={<Icon.Refresh className="h-5 w-5" />}
          tone="amber"
        />
        <StatCard label="Security alerts" value={criticalSec} hint="Recent" icon={<Icon.Shield className="h-5 w-5" />} tone="rose" />
        <StatCard label="Documentacties" value={docActions24h} hint="Laatste 24u" icon={<Icon.Doc className="h-5 w-5" />} tone="wood" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Integratie status" subtitle="Realtime overzicht" action={
            <Link href="/admin/integraties" className="btn-ghost">Beheer<Icon.ArrowRight className="h-4 w-4" /></Link>
          } />
          <CardBody>
            <ul className="flex flex-col gap-3">
              {data.integrations.map((i) => (
                <li key={i.key} className="flex items-center justify-between rounded-xl border border-bone-200 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-wood-50 text-wood-700 ring-1 ring-wood-100">
                      <Icon.Link className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium text-ink-900">{i.name}</div>
                      <div className="text-xs text-ink-500">{i.scopes.join(' · ')}</div>
                    </div>
                  </div>
                  <Badge variant={i.status === 'ACTIEF' ? 'success' : i.status === 'DEGRADED' ? 'warning' : 'danger'}>
                    <StatusDot variant={i.status === 'ACTIEF' ? 'success' : i.status === 'DEGRADED' ? 'warning' : 'danger'} /> {i.status}
                  </Badge>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Audit log" subtitle="Laatste activiteiten" action={
            <Link href="/admin/audit-logs" className="btn-ghost">Alles</Link>
          } />
          <CardBody>
            <ul className="flex flex-col gap-3 text-sm">
              {data.recentAudit.map((a) => (
                <li key={a.id} className="flex items-start gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-bone-100 text-ink-700">
                    <Icon.Lock className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate font-medium text-ink-900">{a.action}</div>
                    <div className="text-xs text-ink-500">{a.actorRole} · {a.objectType} {a.objectId}</div>
                  </div>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader title="Foutmeldingen laatste 24u" subtitle="Vereist actie" />
        <CardBody>
          {data.recentSyncErrors.length === 0 ? (
            <div className="text-sm text-ink-500">Geen sync-fouten.</div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-bone-200">
              <table className="w-full min-w-[640px] border-collapse text-sm">
                <thead>
                  <tr>
                    <th className="table-head">Integratie</th>
                    <th className="table-head">Object</th>
                    <th className="table-head">Externe ID</th>
                    <th className="table-head">Bericht</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentSyncErrors.map((l) => (
                    <tr key={l.id} className="table-row">
                      <td className="table-cell">{l.integration === 'EXACT_SYNERGY' ? 'Exact Synergy' : 'Cleverdesk'}</td>
                      <td className="table-cell">{l.objectType}</td>
                      <td className="table-cell text-xs text-ink-500">{l.externalId}</td>
                      <td className="table-cell text-rose-700">{l.message}</td>
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
