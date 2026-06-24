import Link from 'next/link';
import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { currentAdmin } from '@/lib/mock/users';
import { isSynergyConfigured } from '@/lib/integrations/synergy/client';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

const fieldMappings = [
  { synergy: 'Person.ID', portal: 'Student.externalId', direction: '←→', description: 'Unieke koppeling' },
  { synergy: 'Person.FirstName + LastName', portal: 'User.name', direction: '←→', description: 'Volledige naam' },
  { synergy: 'Person.Email', portal: 'User.email', direction: '←→', description: 'E-mailadres' },
  { synergy: 'Person.Phone', portal: 'User.phone', direction: '←', description: 'Telefoon (read-only uit Synergy)' },
  { synergy: 'Person.StartDate', portal: 'Student.startDate', direction: '←→', description: 'Indiensttreding' },
  { synergy: 'Person.EndDate', portal: 'Student.expectedDiplomaDate', direction: '←→', description: 'Verwachte uitstroomdatum' },
  { synergy: 'EmploymentContract', portal: 'Contract', direction: '←→', description: 'Volledige contracten' },
  { synergy: 'EmployeeAbsence', portal: 'Absence', direction: '←', description: 'Ziekmeldingen uit Synergy (alleen ophalen)' },
  { synergy: 'Account', portal: 'Company', direction: '←→', description: 'Lidbedrijven' },
  { synergy: 'Document', portal: 'Document', direction: '→', description: 'Documenten naar Synergy archiveren' },
];

const entityCounts = [
  { entity: 'Persons (medewerkers)', count: 412, synced: 410, errors: 2 },
  { entity: 'EmploymentContracts', count: 487, synced: 485, errors: 2 },
  { entity: 'Accounts (lidbedrijven)', count: 318, synced: 318, errors: 0 },
  { entity: 'EmployeeAbsence', count: 23, synced: 23, errors: 0 },
];

export default async function SynergyIntegrationPage() {
  const configured = isSynergyConfigured();
  const integration = await db.integration.findUnique({ where: { key: 'EXACT_SYNERGY' } }).catch(() => null);
  const recentLogs = await db.syncLog
    .findMany({ where: { integration: 'EXACT_SYNERGY' }, orderBy: { startedAt: 'desc' }, take: 10 })
    .catch(() => []);

  return (
    <PortalShell
      role="ADMIN"
      activeHref="/admin/integraties"
      userName={currentAdmin.name}
      userSubtitle="Binnendienst"
      greeting={{
        title: 'Exact Synergy koppeling',
        subtitle: 'OAuth2 + REST API + webhooks voor bi-directionele sync.',
      }}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Link href="/admin/integraties" className="btn-ghost">← Terug</Link>
        <div className="flex gap-2">
          <a
            href="https://www.exactsoftware.com/docs/DocView.aspx?DocumentID=%7Bd2dcb5be-d6cc-4e95-9bb4-b3333bc73dde%7D"
            target="_blank"
            rel="noopener"
            className="btn-secondary"
          >
            <Icon.BookOpen className="h-4 w-4" />
            API documentatie
          </a>
          <button className="btn-primary">
            <Icon.Refresh className="h-4 w-4" />
            Sync nu
          </button>
        </div>
      </div>

      {/* Status */}
      <Card>
        <CardBody>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className={`grid h-12 w-12 place-items-center rounded-md text-white ${configured ? 'bg-emerald-500' : 'bg-amber-500'}`}>
                {configured ? <Icon.Check className="h-6 w-6" /> : <Icon.AlertTriangle className="h-6 w-6" />}
              </div>
              <div>
                <h2 className="font-display text-xl font-bold">Exact Synergy Enterprise</h2>
                <p className="text-sm text-ink-600">
                  {configured
                    ? 'Verbonden met productie-omgeving. Sync draait elke 15 minuten.'
                    : 'Niet verbonden — credentials ontbreken. Mock-mode actief.'}
                </p>
              </div>
            </div>
            <Badge variant={configured ? 'success' : 'warning'}>
              {configured ? 'Verbonden' : 'Mock-mode'}
            </Badge>
          </div>
        </CardBody>
      </Card>

      {/* Configuratie */}
      <Card className="mt-6">
        <CardHeader title="Configuratie" subtitle="Env vars op Vercel" />
        <CardBody>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <ConfigItem
              label="EXACT_SYNERGY_URL"
              value={process.env.EXACT_SYNERGY_URL ? '••• gezet' : 'NIET gezet'}
              ok={!!process.env.EXACT_SYNERGY_URL}
              hint="Bv. https://swv.exactsynergy.eu"
            />
            <ConfigItem
              label="EXACT_SYNERGY_CLIENT_ID"
              value={process.env.EXACT_SYNERGY_CLIENT_ID ? '••• gezet' : 'NIET gezet'}
              ok={!!process.env.EXACT_SYNERGY_CLIENT_ID}
              hint="OAuth2 client ID uit Synergy admin → API"
            />
            <ConfigItem
              label="EXACT_SYNERGY_CLIENT_SECRET"
              value={process.env.EXACT_SYNERGY_CLIENT_SECRET ? '••• gezet' : 'NIET gezet'}
              ok={!!process.env.EXACT_SYNERGY_CLIENT_SECRET}
              hint="OAuth2 client secret"
            />
            <ConfigItem
              label="EXACT_SYNERGY_WEBHOOK_SECRET"
              value={process.env.EXACT_SYNERGY_WEBHOOK_SECRET ? '••• gezet' : 'NIET gezet'}
              ok={!!process.env.EXACT_SYNERGY_WEBHOOK_SECRET}
              hint="HMAC secret voor inkomende webhooks"
            />
          </div>
          <div className="mt-4 rounded-xl border border-bone-200 bg-bone-50 p-4 text-xs text-ink-600">
            <strong>Webhook URL voor Synergy admin:</strong>{' '}
            <code className="rounded bg-white px-2 py-0.5 font-mono text-[11px]">
              https://swvmeubels.vercel.app/api/integrations/synergy/webhook
            </code>
          </div>
        </CardBody>
      </Card>

      {/* Veld mapping */}
      <Card className="mt-6">
        <CardHeader title="Veld-mapping" subtitle="Welke Synergy velden synchroniseren met welk portal-veld" />
        <CardBody>
          <div className="overflow-x-auto rounded-xl border border-bone-200">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="table-head">Synergy entity</th>
                  <th className="table-head text-center">Richting</th>
                  <th className="table-head">SWV portal</th>
                  <th className="table-head">Toelichting</th>
                </tr>
              </thead>
              <tbody>
                {fieldMappings.map((m) => (
                  <tr key={m.synergy} className="table-row">
                    <td className="table-cell font-mono text-xs">{m.synergy}</td>
                    <td className="table-cell text-center">
                      <span className="rounded-md bg-primary-50 px-2 py-1 text-xs font-bold text-primary-700">{m.direction}</span>
                    </td>
                    <td className="table-cell font-mono text-xs">{m.portal}</td>
                    <td className="table-cell text-xs text-ink-600">{m.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {/* Entity sync status */}
      <Card className="mt-6">
        <CardHeader title="Entity sync status" subtitle="Per type record" />
        <CardBody>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {entityCounts.map((e) => (
              <div key={e.entity} className="rounded-2xl border border-bone-200 bg-white p-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-ink-500">{e.entity}</div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-display text-2xl font-bold text-ink-900">{e.synced}</span>
                  <span className="text-sm text-ink-500">/ {e.count}</span>
                </div>
                {e.errors > 0 ? (
                  <Badge variant="danger">{e.errors} fout{e.errors === 1 ? '' : 'en'}</Badge>
                ) : (
                  <Badge variant="success">In sync</Badge>
                )}
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Recent sync logs */}
      <Card className="mt-6">
        <CardHeader title="Recente sync activiteit" />
        <CardBody>
          {recentLogs.length === 0 ? (
            <div className="text-sm text-ink-500">Nog geen sync-activiteit.</div>
          ) : (
            <ul className="divide-y divide-bone-100">
              {recentLogs.map((l) => (
                <li key={l.id} className="flex items-center justify-between py-2 text-sm">
                  <div>
                    <span className="font-mono text-xs text-ink-500">{l.direction}</span>
                    <span className="ml-2 font-medium">{l.objectType}</span>
                    <span className="ml-2 text-xs text-ink-500">{l.externalId ?? ''}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={l.status === 'OK' ? 'success' : l.status === 'FOUT' ? 'danger' : 'neutral'}>
                      {l.status}
                    </Badge>
                    <span className="text-xs text-ink-500">{l.durationMs}ms</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>

      {/* Setup instructies */}
      <Card className="mt-6">
        <CardHeader title="Setup checklist" subtitle="Wat heb je nodig van Exact om te activeren" />
        <CardBody>
          <ol className="list-decimal space-y-2 pl-5 text-sm text-ink-700">
            <li>Login bij Synergy admin → <strong>Configuratie → API</strong></li>
            <li>Registreer nieuwe app: <code className="rounded bg-bone-100 px-1.5 py-0.5">SWV Portal</code></li>
            <li>Kopieer <strong>Client ID + Client Secret</strong></li>
            <li>Stel <strong>OAuth2 scopes</strong> in: HRM, CRM, Documents (read+write)</li>
            <li>Zet <strong>Webhook URL</strong> op: <code className="rounded bg-bone-100 px-1.5 py-0.5 text-xs">https://swvmeubels.vercel.app/api/integrations/synergy/webhook</code></li>
            <li>Kies <strong>Events</strong>: Person.*, EmploymentContract.*, EmployeeAbsence.created</li>
            <li>Genereer <strong>HMAC secret</strong> voor webhook verificatie</li>
            <li>Voeg alle 4 env vars toe in Vercel + redeploy</li>
            <li>Klik &lsquo;Sync nu&rsquo; bovenaan deze pagina om initial sync te starten</li>
          </ol>
        </CardBody>
      </Card>
    </PortalShell>
  );
}

function ConfigItem({ label, value, ok, hint }: { label: string; value: string; ok: boolean; hint: string }) {
  return (
    <div className="rounded-xl border border-bone-200 bg-bone-50 p-3">
      <div className="flex items-center justify-between gap-2">
        <code className="text-xs font-mono font-bold text-ink-900">{label}</code>
        <Badge variant={ok ? 'success' : 'warning'}>{value}</Badge>
      </div>
      <p className="mt-1 text-[11px] text-ink-500">{hint}</p>
    </div>
  );
}
