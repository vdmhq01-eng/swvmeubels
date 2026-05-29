import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Toolbar, FilterChip } from '@/components/ui/Toolbar';
import { Icon } from '@/components/ui/Icon';
import { currentAdmin } from '@/lib/mock/users';
import { listSyncLogs } from '@/lib/data/admin';

export const dynamic = 'force-dynamic';

const statusVariant = {
  OK: 'success' as const,
  FOUT: 'danger' as const,
  GENEGEERD: 'neutral' as const,
};

function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat('nl-NL', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit',
  }).format(value);
}

export default async function AdminSyncLogsPage() {
  const logs = await listSyncLogs(100);
  return (
    <PortalShell
      role="ADMIN"
      activeHref="/admin/sync-logs"
      userName={currentAdmin.name}
      userSubtitle="Admin"
      greeting={{ title: 'Sync logs', subtitle: 'Inkomende en uitgaande integratie-acties.' }}
    >
      <Card>
        <CardBody>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Toolbar placeholder="Zoek object, ID of foutmelding…">
              <FilterChip label="Alle" active />
              <FilterChip label="Exact" />
              <FilterChip label="Cleverdesk" />
              <FilterChip label="Fouten" />
            </Toolbar>
            <button className="btn-secondary">
              <Icon.Refresh className="h-4 w-4" /> Nu vernieuwen
            </button>
          </div>
        </CardBody>
      </Card>

      <Card className="mt-6">
        <CardHeader title="Activiteit" subtitle={`${logs.length} regels`} />
        <CardBody>
          <div className="overflow-x-auto rounded-xl border border-bone-200">
            <table className="w-full min-w-[840px] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="table-head">Tijd</th>
                  <th className="table-head">Integratie</th>
                  <th className="table-head">Richting</th>
                  <th className="table-head">Object</th>
                  <th className="table-head">Externe ID</th>
                  <th className="table-head text-right">Duur</th>
                  <th className="table-head">Status</th>
                  <th className="table-head">Bericht</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((l) => (
                  <tr key={l.id} className="table-row">
                    <td className="table-cell text-xs text-ink-500">{formatDateTime(l.startedAt)}</td>
                    <td className="table-cell">{l.integration === 'EXACT_SYNERGY' ? 'Exact' : 'Cleverdesk'}</td>
                    <td className="table-cell"><Badge variant="neutral">{l.direction === 'IN' ? '← in' : 'uit →'}</Badge></td>
                    <td className="table-cell">{l.objectType}</td>
                    <td className="table-cell font-mono text-xs text-ink-500">{l.externalId ?? '-'}</td>
                    <td className="table-cell text-right">{l.durationMs} ms</td>
                    <td className="table-cell"><Badge variant={statusVariant[l.status]}>{l.status}</Badge></td>
                    <td className="table-cell text-xs text-ink-500">{l.message ?? '-'}</td>
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
