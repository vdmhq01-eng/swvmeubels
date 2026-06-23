import Link from 'next/link';
import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge, StatusDot } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { ResyncButton } from '@/components/admin/ResyncButton';
import { currentAdmin } from '@/lib/mock/users';
import { listIntegrations, listSyncLogs } from '@/lib/data/admin';
import { db } from '@/lib/db';
import type { IntegrationKey } from '@prisma/client';

export const dynamic = 'force-dynamic';

function formatDateTime(value?: Date | null) {
  if (!value) return '-';
  return new Intl.DateTimeFormat('nl-NL', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  }).format(value);
}

export default async function IntegratiesPage() {
  const [integrations, recentLogs, studentMappings, contractCount, companyCount, coordCount] = await Promise.all([
    listIntegrations(),
    listSyncLogs(8),
    db.student.count().catch(() => 0),
    db.contract.count().catch(() => 0),
    db.company.count().catch(() => 0),
    db.coordinator.count().catch(() => 0),
  ]);

  return (
    <PortalShell
      role="ADMIN"
      activeHref="/admin/integraties"
      userName={currentAdmin.name}
      userSubtitle="Admin"
      greeting={{ title: 'Integratiebeheer', subtitle: 'Status, mapping en sync van Exact Synergy en Cleverdesk.' }}
    >
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {integrations.map((integration) => {
          const meta = integration.status === 'ACTIEF' ? ('success' as const) :
            integration.status === 'DEGRADED' ? ('warning' as const) : ('danger' as const);
          const errors24h = recentLogs.filter((l) => l.integration === integration.key && l.status === 'FOUT').length;
          return (
            <Card key={integration.key}>
              <CardBody>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-wood-50 text-wood-700 ring-1 ring-wood-100">
                      <Icon.Link className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-display text-lg font-semibold text-ink-900">{integration.name}</div>
                      <div className="text-xs text-ink-500">{integration.key}</div>
                    </div>
                  </div>
                  <Badge variant={meta}>
                    <StatusDot variant={meta} /> {integration.status}
                  </Badge>
                </div>

                <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                  <Field label="Laatste sync" value={formatDateTime(integration.lastSyncAt)} />
                  <Field label="Volgende sync" value={formatDateTime(integration.nextSyncAt)} />
                  <Field label="Webhooks" value={
                    <Badge variant={integration.webhookEnabled ? 'success' : 'warning'}>
                      {integration.webhookEnabled ? 'Actief' : 'Polling fallback'}
                    </Badge>
                  } />
                  <Field label="Fouten recent" value={
                    <Badge variant={errors24h === 0 ? 'success' : 'danger'}>{errors24h}</Badge>
                  } />
                </dl>

                <div className="mt-5">
                  <div className="text-xs font-semibold uppercase tracking-wider text-ink-500">Scope</div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {integration.scopes.map((s) => (
                      <Badge key={s} variant="wood">{s}</Badge>
                    ))}
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <ResyncButton integration={integration.key as IntegrationKey} />
                  <button className="btn-secondary">
                    <Icon.Settings className="h-4 w-4" /> Configuratie
                  </button>
                  <Link href="/admin/sync-logs" className="btn-ghost ml-auto">
                    Bekijk logs<Icon.ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card>
          <CardHeader title="Mapping Exact ↔ Cleverdesk" subtitle="Live counts uit de DB" />
          <CardBody>
            <ul className="flex flex-col gap-2 text-sm">
              <li className="flex items-center justify-between rounded-xl border border-bone-200 px-3 py-2">
                <span className="text-ink-700">Studenten</span>
                <Badge variant="success">{studentMappings}</Badge>
              </li>
              <li className="flex items-center justify-between rounded-xl border border-bone-200 px-3 py-2">
                <span className="text-ink-700">Lidbedrijven</span>
                <Badge variant="success">{companyCount}</Badge>
              </li>
              <li className="flex items-center justify-between rounded-xl border border-bone-200 px-3 py-2">
                <span className="text-ink-700">Coördinatoren</span>
                <Badge variant="success">{coordCount}</Badge>
              </li>
              <li className="flex items-center justify-between rounded-xl border border-bone-200 px-3 py-2">
                <span className="text-ink-700">Contracten</span>
                <Badge variant="success">{contractCount}</Badge>
              </li>
            </ul>
            <button className="btn-secondary mt-4 w-full">Mapping beheren</button>
          </CardBody>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader title="Sync logs" subtitle="Laatste activiteit" action={
            <Link href="/admin/sync-logs" className="btn-ghost">Volledig logboek<Icon.ArrowRight className="h-4 w-4" /></Link>
          } />
          <CardBody>
            <div className="overflow-x-auto rounded-xl border border-bone-200">
              <table className="w-full min-w-[720px] border-collapse text-sm">
                <thead>
                  <tr>
                    <th className="table-head">Tijd</th>
                    <th className="table-head">Integratie</th>
                    <th className="table-head">Object</th>
                    <th className="table-head">Externe ID</th>
                    <th className="table-head text-right">Duur</th>
                    <th className="table-head">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLogs.map((l) => {
                    const variant = l.status === 'OK' ? 'success' : l.status === 'FOUT' ? 'danger' : 'neutral';
                    return (
                      <tr key={l.id} className="table-row">
                        <td className="table-cell">{formatDateTime(l.startedAt)}</td>
                        <td className="table-cell text-ink-700">
                          {l.integration === 'EXACT_SYNERGY' ? 'Exact Synergy' : 'Cleverdesk'}
                          <span className="ml-2 text-xs text-ink-500">{l.direction === 'IN' ? '← in' : 'uit →'}</span>
                        </td>
                        <td className="table-cell">{l.objectType}</td>
                        <td className="table-cell text-xs text-ink-500">{l.externalId ?? '-'}</td>
                        <td className="table-cell text-right">{l.durationMs} ms</td>
                        <td className="table-cell">
                          <Badge variant={variant}>{l.status}</Badge>
                          {l.message ? <div className="mt-0.5 text-xs text-ink-500">{l.message}</div> : null}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      </div>
    </PortalShell>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[11px] font-medium uppercase tracking-wider text-ink-500">{label}</dt>
      <dd className="text-sm text-ink-900">{value}</dd>
    </div>
  );
}
