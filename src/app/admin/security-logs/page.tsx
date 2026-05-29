import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Toolbar, FilterChip } from '@/components/ui/Toolbar';
import { Icon } from '@/components/ui/Icon';
import { currentAdmin } from '@/lib/mock/users';
import { listSecurityLogs } from '@/lib/data/admin';

export const dynamic = 'force-dynamic';

function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat('nl-NL', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  }).format(value);
}

const sevVariant: Record<string, 'info' | 'warning' | 'danger'> = {
  INFO: 'info',
  WAARSCHUWING: 'warning',
  KRITIEK: 'danger',
};

export default async function AdminSecurityLogsPage() {
  const logs = await listSecurityLogs(100);
  const counts = {
    KRITIEK: logs.filter((s) => s.severity === 'KRITIEK').length,
    WAARSCHUWING: logs.filter((s) => s.severity === 'WAARSCHUWING').length,
    INFO: logs.filter((s) => s.severity === 'INFO').length,
  };

  return (
    <PortalShell
      role="ADMIN"
      activeHref="/admin/security-logs"
      userName={currentAdmin.name}
      userSubtitle="Admin"
      greeting={{ title: 'Security logs', subtitle: 'Inlogpogingen, rate limits en autorisatie-events.' }}
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <KPI tone="rose" label="Kritiek" value={`${counts.KRITIEK}`} icon={<Icon.AlertTriangle className="h-5 w-5" />} />
        <KPI tone="amber" label="Waarschuwing" value={`${counts.WAARSCHUWING}`} icon={<Icon.Shield className="h-5 w-5" />} />
        <KPI tone="wood" label="Info" value={`${counts.INFO}`} icon={<Icon.Activity className="h-5 w-5" />} />
      </div>

      <Card className="mt-6">
        <CardBody>
          <Toolbar placeholder="Zoek IP, gebruiker of event…">
            <FilterChip label="Alle" active />
            <FilterChip label="Kritiek" />
            <FilterChip label="2FA" />
            <FilterChip label="Rate limit" />
          </Toolbar>
        </CardBody>
      </Card>

      <Card className="mt-6">
        <CardHeader title="Events" subtitle={`${logs.length} regels`} />
        <CardBody>
          <ul className="divide-y divide-bone-100">
            {logs.map((s) => (
              <li key={s.id} className="flex items-start gap-4 py-4 first:pt-0 last:pb-0">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-bone-100 text-ink-700">
                  <Icon.Shield className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={sevVariant[s.severity] ?? 'neutral'}>{s.severity}</Badge>
                    <span className="font-mono text-xs text-ink-700">{s.event}</span>
                    <span className="text-xs text-ink-500">{formatDateTime(s.at)}</span>
                  </div>
                  <div className="mt-1 text-sm text-ink-800">{s.message}</div>
                  <div className="mt-1 text-xs text-ink-500">
                    {s.userId ? `User ${s.userId} · ` : ''}IP {s.ip ?? '-'}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>
    </PortalShell>
  );
}

function KPI({ tone, label, value, icon }: { tone: 'wood' | 'amber' | 'rose'; label: string; value: string; icon: React.ReactNode }) {
  const cls = {
    wood: 'bg-wood-50 text-wood-700 ring-wood-100',
    amber: 'bg-amber-50 text-amber-700 ring-amber-100',
    rose: 'bg-rose-50 text-rose-700 ring-rose-100',
  }[tone];
  return (
    <div className="card-padded">
      <div className={`grid h-10 w-10 place-items-center rounded-xl ring-1 ${cls}`}>{icon}</div>
      <div className="mt-3 text-xs font-medium uppercase tracking-wider text-ink-500">{label}</div>
      <div className="mt-1 font-display text-2xl font-semibold text-ink-900">{value}</div>
    </div>
  );
}
