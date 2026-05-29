import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Toolbar, FilterChip } from '@/components/ui/Toolbar';
import { Icon } from '@/components/ui/Icon';
import { currentAdmin } from '@/lib/mock/users';
import { listAuditLogs } from '@/lib/data/admin';

export const dynamic = 'force-dynamic';

function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat('nl-NL', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  }).format(value);
}

export default async function AdminAuditLogsPage() {
  const logs = await listAuditLogs(200);
  return (
    <PortalShell
      role="ADMIN"
      activeHref="/admin/audit-logs"
      userName={currentAdmin.name}
      userSubtitle="Admin"
      greeting={{ title: 'Audit logs', subtitle: 'Append-only trail van gevoelige acties.' }}
    >
      <Card>
        <CardBody>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Toolbar placeholder="Zoek actor, actie of object…">
              <FilterChip label="Alle" active />
              <FilterChip label="Document" />
              <FilterChip label="Weekstaat" />
              <FilterChip label="Integratie" />
              <FilterChip label="Security" />
            </Toolbar>
            <button className="btn-secondary">
              <Icon.Doc className="h-4 w-4" /> Exporteer (CSV)
            </button>
          </div>
        </CardBody>
      </Card>

      <Card className="mt-6">
        <CardHeader title={`${logs.length} regels`} subtitle="Onveranderbaar; nieuwe regels worden alleen toegevoegd" />
        <CardBody>
          <div className="overflow-x-auto rounded-xl border border-bone-200">
            <table className="w-full min-w-[920px] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="table-head">Tijd</th>
                  <th className="table-head">Actor user</th>
                  <th className="table-head">Rol</th>
                  <th className="table-head">Actie</th>
                  <th className="table-head">Object</th>
                  <th className="table-head">IP</th>
                  <th className="table-head">Context</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((a) => (
                  <tr key={a.id} className="table-row">
                    <td className="table-cell text-xs text-ink-500">{formatDateTime(a.at)}</td>
                    <td className="table-cell text-xs">{a.actorUserId}</td>
                    <td className="table-cell"><Badge variant="neutral">{a.actorRole}</Badge></td>
                    <td className="table-cell font-mono text-xs">{a.action}</td>
                    <td className="table-cell text-xs">{a.objectType} <span className="text-ink-500">{a.objectId}</span></td>
                    <td className="table-cell font-mono text-xs text-ink-500">{a.ip ?? '-'}</td>
                    <td className="table-cell text-xs text-ink-500">
                      {a.context && typeof a.context === 'object'
                        ? Object.entries(a.context as Record<string, unknown>).map(([k, v]) => (
                            <span key={k} className="mr-2">{k}=<span className="text-ink-700">{String(v)}</span></span>
                          ))
                        : '-'}
                    </td>
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
