import Link from 'next/link';
import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { Badge, StatusDot } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { currentAdmin } from '@/lib/mock/users';
import { integrations, recentAuditLogs, recentSyncLogs } from '@/lib/mock/integrations';

export default function AdminDashboardPage() {
  const exact = integrations.find((i) => i.key === 'EXACT_SYNERGY')!;
  const cd = integrations.find((i) => i.key === 'CLEVERDESK')!;
  return (
    <PortalShell
      role="ADMIN"
      activeHref="/admin"
      userName={currentAdmin.name}
      userSubtitle="Admin"
      greeting={{
        title: 'Beheer',
        subtitle: 'Status, integraties en security signalen.',
      }}
    >
      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        <StatCard
          label="Sync Exact"
          value={<span className="text-emerald-700">Actief</span>}
          hint={`${exact.errorCount24h} fouten / 24u`}
          icon={<Icon.Link className="h-5 w-5" />}
          tone="green"
        />
        <StatCard
          label="Sync Cleverdesk"
          value={<span className="text-amber-700">Degraded</span>}
          hint={`${cd.errorCount24h} fouten / 24u`}
          icon={<Icon.Refresh className="h-5 w-5" />}
          tone="amber"
        />
        <StatCard
          label="Security alerts"
          value={1}
          hint="Vandaag · 1 inlogpoging buiten land"
          icon={<Icon.Shield className="h-5 w-5" />}
          tone="rose"
        />
        <StatCard
          label="Documentacties"
          value={42}
          hint="Laatste 24u in auditlog"
          icon={<Icon.Doc className="h-5 w-5" />}
          tone="wood"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Integratie status"
            subtitle="Realtime overzicht"
            action={
              <Link href="/admin/integraties" className="btn-ghost">
                Beheer
                <Icon.ArrowRight className="h-4 w-4" />
              </Link>
            }
          />
          <CardBody>
            <ul className="flex flex-col gap-3">
              {integrations.map((i) => (
                <li key={i.key} className="flex items-center justify-between rounded-xl border border-bone-200 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-wood-50 text-wood-700 ring-1 ring-wood-100">
                      <Icon.Link className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium text-ink-900">{i.name}</div>
                      <div className="text-xs text-ink-500">{i.scope.join(' · ')}</div>
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
              {recentAuditLogs.map((a) => (
                <li key={a.id} className="flex items-start gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-bone-100 text-ink-700">
                    <Icon.Lock className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate font-medium text-ink-900">{a.action}</div>
                    <div className="text-xs text-ink-500">
                      {a.actorName} ({a.actorRole}) · {a.objectType} {a.objectId}
                    </div>
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
                {recentSyncLogs.filter((l) => l.status === 'FOUT').map((l) => (
                  <tr key={l.id} className="table-row">
                    <td className="table-cell">{l.integration === 'EXACT_SYNERGY' ? 'Exact Synergy' : 'Cleverdesk'}</td>
                    <td className="table-cell">{l.object}</td>
                    <td className="table-cell text-xs text-ink-500">{l.externalId}</td>
                    <td className="table-cell text-rose-700">{l.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </PortalShell>
  );
}
