import Link from 'next/link';
import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge, StatusDot } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { ResyncButton } from '@/components/admin/ResyncButton';
import { currentAdmin } from '@/lib/mock/users';
import { integrations, recentSyncLogs } from '@/lib/mock/integrations';
import { formatDate } from '@/lib/utils';
import type { IntegrationStatus, SyncLogEntry } from '@/lib/types';

const statusMap: Record<IntegrationStatus, { label: string; variant: 'success' | 'warning' | 'danger' | 'neutral' }> = {
  ACTIEF: { label: 'Actief', variant: 'success' },
  DEGRADED: { label: 'Degraded', variant: 'warning' },
  OFFLINE: { label: 'Offline', variant: 'danger' },
  INACTIEF: { label: 'Inactief', variant: 'neutral' },
};

const logStatusMap: Record<SyncLogEntry['status'], { label: string; variant: 'success' | 'danger' | 'neutral' }> = {
  OK: { label: 'OK', variant: 'success' },
  FOUT: { label: 'Fout', variant: 'danger' },
  GENEGEERD: { label: 'Genegeerd', variant: 'neutral' },
};

function formatDateTime(value?: string) {
  if (!value) return '-';
  const d = new Date(value);
  return new Intl.DateTimeFormat('nl-NL', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export default function IntegratiesPage() {
  return (
    <PortalShell
      role="ADMIN"
      activeHref="/admin/integraties"
      userName={currentAdmin.name}
      userSubtitle="Admin"
      greeting={{
        title: 'Integratiebeheer',
        subtitle: 'Status, mapping en sync van Exact Synergy en Cleverdesk.',
      }}
    >
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {integrations.map((integration) => {
          const meta = statusMap[integration.status];
          return (
            <Card key={integration.key}>
              <CardBody>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-wood-50 text-wood-700 ring-1 ring-wood-100">
                      <Icon.Link className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-display text-lg font-semibold text-ink-900">
                        {integration.name}
                      </div>
                      <div className="text-xs text-ink-500">{integration.key}</div>
                    </div>
                  </div>
                  <Badge variant={meta.variant}>
                    <StatusDot variant={meta.variant} /> {meta.label}
                  </Badge>
                </div>

                <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                  <Field label="Laatste sync" value={formatDateTime(integration.lastSyncAt)} />
                  <Field label="Volgende sync" value={formatDateTime(integration.nextSyncAt)} />
                  <Field
                    label="Webhooks"
                    value={
                      <Badge variant={integration.webhookEnabled ? 'success' : 'warning'}>
                        {integration.webhookEnabled ? 'Actief' : 'Polling fallback'}
                      </Badge>
                    }
                  />
                  <Field
                    label="Fouten 24u"
                    value={
                      <Badge variant={integration.errorCount24h === 0 ? 'success' : 'danger'}>
                        {integration.errorCount24h}
                      </Badge>
                    }
                  />
                </dl>

                <div className="mt-5">
                  <div className="text-xs font-semibold uppercase tracking-wider text-ink-500">Scope</div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {integration.scope.map((s) => (
                      <Badge key={s} variant="wood">{s}</Badge>
                    ))}
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <ResyncButton integration={integration.key} />
                  <button className="btn-secondary">
                    <Icon.Settings className="h-4 w-4" />
                    Configuratie
                  </button>
                  <Link href="/admin/sync-logs" className="btn-ghost ml-auto">
                    Bekijk logs
                    <Icon.ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card>
          <CardHeader title="Mapping Exact ↔ Cleverdesk" subtitle="Studenten en bedrijven" />
          <CardBody>
            <ul className="flex flex-col gap-2 text-sm">
              <li className="flex items-center justify-between rounded-xl border border-bone-200 px-3 py-2">
                <span className="text-ink-700">Studenten</span>
                <Badge variant="success">142 / 142</Badge>
              </li>
              <li className="flex items-center justify-between rounded-xl border border-bone-200 px-3 py-2">
                <span className="text-ink-700">Lidbedrijven</span>
                <Badge variant="success">48 / 48</Badge>
              </li>
              <li className="flex items-center justify-between rounded-xl border border-bone-200 px-3 py-2">
                <span className="text-ink-700">Coördinatoren</span>
                <Badge variant="warning">11 / 12</Badge>
              </li>
              <li className="flex items-center justify-between rounded-xl border border-bone-200 px-3 py-2">
                <span className="text-ink-700">Contracten</span>
                <Badge variant="success">139 / 142</Badge>
              </li>
            </ul>
            <button className="btn-secondary mt-4 w-full">
              Mapping beheren
            </button>
          </CardBody>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader
            title="Sync logs"
            subtitle="Laatste activiteit van beide integraties"
            action={
              <Link href="/admin/sync-logs" className="btn-ghost">
                Volledig logboek
                <Icon.ArrowRight className="h-4 w-4" />
              </Link>
            }
          />
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
                  {recentSyncLogs.map((l) => {
                    const s = logStatusMap[l.status];
                    return (
                      <tr key={l.id} className="table-row">
                        <td className="table-cell">{formatDateTime(l.startedAt)}</td>
                        <td className="table-cell text-ink-700">
                          {l.integration === 'EXACT_SYNERGY' ? 'Exact Synergy' : 'Cleverdesk'}
                          <span className="ml-2 text-xs text-ink-500">{l.direction === 'IN' ? '← in' : 'uit →'}</span>
                        </td>
                        <td className="table-cell">{l.object}</td>
                        <td className="table-cell text-xs text-ink-500">{l.externalId ?? '-'}</td>
                        <td className="table-cell text-right">{l.durationMs} ms</td>
                        <td className="table-cell">
                          <Badge variant={s.variant}>{s.label}</Badge>
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

      <Card className="mt-6">
        <CardHeader title="Architectuur" subtitle="Hoe data door het portaal stroomt" />
        <CardBody>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <FlowBox
              title="Exact Synergy"
              role="Source of truth"
              points={['Studenten', 'Lidbedrijven', 'Contracten', 'Vakantie / verzuim']}
            />
            <FlowBox
              title="Portaal"
              role="Middleware + UI"
              points={['Cache + RBAC/ABAC', 'Audit + Security log', 'Server actions']}
              accent
            />
            <FlowBox
              title="Cleverdesk"
              role="Source of truth voor uren"
              points={['Weekstaten', 'Goedkeuringen', 'Mapping per student']}
            />
          </div>
          <p className="mt-4 text-xs text-ink-500">
            Reads zijn altijd cached in PostgreSQL met een TTL. Writes gaan via idempotency keys naar het juiste
            bronsysteem, met retry en fallback naar polling als webhooks niet beschikbaar zijn. Conflicten worden
            gelogd en getoond op deze pagina.
          </p>
        </CardBody>
      </Card>
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

function FlowBox({
  title,
  role,
  points,
  accent,
}: {
  title: string;
  role: string;
  points: string[];
  accent?: boolean;
}) {
  return (
    <div className={`rounded-2xl border p-4 ${accent ? 'border-wood-200 bg-wood-50' : 'border-bone-200 bg-bone-50'}`}>
      <div className="text-xs font-semibold uppercase tracking-wider text-ink-500">{role}</div>
      <div className="mt-1 font-display text-lg font-semibold text-ink-900">{title}</div>
      <ul className="mt-3 space-y-1 text-sm text-ink-700">
        {points.map((p) => (
          <li key={p} className="flex items-start gap-2">
            <Icon.Check className={`mt-0.5 h-4 w-4 ${accent ? 'text-wood-700' : 'text-ink-500'}`} />
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
