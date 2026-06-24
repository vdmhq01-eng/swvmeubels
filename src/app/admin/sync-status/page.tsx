import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Icon } from '@/components/ui/Icon';
import { currentAdmin } from '@/lib/mock/users';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

type SystemStatus = 'OK' | 'WARNING' | 'ERROR' | 'PENDING';

const sysMeta: Record<SystemStatus, { color: string; label: string; icon: React.ReactNode }> = {
  OK: { color: 'bg-emerald-100 text-emerald-700 ring-emerald-200', label: 'Sync', icon: <Icon.Check className="h-4 w-4" /> },
  WARNING: { color: 'bg-amber-100 text-amber-700 ring-amber-200', label: 'Verouderd', icon: <Icon.AlertTriangle className="h-4 w-4" /> },
  ERROR: { color: 'bg-rose-100 text-rose-700 ring-rose-200', label: 'Mismatch', icon: <Icon.X className="h-4 w-4" /> },
  PENDING: { color: 'bg-bone-100 text-ink-600 ring-bone-200', label: 'Onbekend', icon: <Icon.Refresh className="h-4 w-4" /> },
};

export default async function SyncStatusPage() {
  const students = await db.student
    .findMany({
      include: {
        user: true,
        company: { select: { name: true } },
        coordinator: { include: { user: { select: { name: true } } } },
        contracts: { where: { status: { in: ['ACTIEF', 'AFLOPEND'] } }, take: 1 },
      },
      orderBy: { user: { name: 'asc' } },
    })
    .catch(() => []);

  // Mock sync-status per student per systeem
  type Row = {
    student: typeof students[number];
    synergy: SystemStatus;
    cleverdesk: SystemStatus;
    docusign: SystemStatus;
    exact_globe: SystemStatus;
  };

  const rows: Row[] = students.map((s, i) => ({
    student: s,
    synergy: s.externalId && s.externalId !== '' && !s.externalId.startsWith('temp-') ? 'OK' : 'ERROR',
    cleverdesk: s.cleverdeskId ? 'OK' : 'ERROR',
    docusign: s.contracts.length > 0 ? (i % 4 === 0 ? 'WARNING' : 'OK') : 'PENDING',
    exact_globe: s.cleverdeskId && s.contracts.length > 0 ? 'OK' : 'WARNING',
  }));

  const totaal = rows.length;
  const counts = {
    synergy_ok: rows.filter((r) => r.synergy === 'OK').length,
    cleverdesk_ok: rows.filter((r) => r.cleverdesk === 'OK').length,
    docusign_ok: rows.filter((r) => r.docusign === 'OK').length,
    exact_ok: rows.filter((r) => r.exact_globe === 'OK').length,
  };

  return (
    <PortalShell
      role="ADMIN"
      activeHref="/admin/sync-status"
      userName={currentAdmin.name}
      userSubtitle="Binnendienst"
      greeting={{
        title: 'Cross-system sync status',
        subtitle: 'Eén overzicht: hoe staat elke student in Synergy + Cleverdesk + DocuSign + Exact Globe.',
      }}
    >
      {/* System cards bovenaan */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <SystemCard
          name="Exact Synergy"
          desc="Stamgegevens, contracten"
          ok={counts.synergy_ok}
          total={totaal}
          color="bg-blue-500"
        />
        <SystemCard
          name="Cleverdesk"
          desc="Urenregistratie"
          ok={counts.cleverdesk_ok}
          total={totaal}
          color="bg-emerald-500"
        />
        <SystemCard
          name="DocuSign"
          desc="Getekende contracten"
          ok={counts.docusign_ok}
          total={totaal}
          color="bg-amber-500"
        />
        <SystemCard
          name="Exact Globe"
          desc="Verloning"
          ok={counts.exact_ok}
          total={totaal}
          color="bg-navy-600"
        />
      </div>

      {/* Per-student matrix */}
      <Card className="mt-6">
        <CardHeader
          title="Student sync matrix"
          subtitle="Eén regel per student — direct zien waar mismatches zitten"
          action={
            <div className="flex gap-2">
              <button className="btn-secondary">
                <Icon.Refresh className="h-4 w-4" /> Sync alle systemen
              </button>
              <button className="btn-primary">
                <Icon.Doc className="h-4 w-4" /> Export rapport
              </button>
            </div>
          }
        />
        <CardBody>
          <div className="overflow-x-auto rounded-xl border border-bone-200">
            <table className="w-full min-w-[840px] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="table-head">Student</th>
                  <th className="table-head">Coördinator</th>
                  <th className="table-head text-center">Synergy</th>
                  <th className="table-head text-center">Cleverdesk</th>
                  <th className="table-head text-center">DocuSign</th>
                  <th className="table-head text-center">Exact Globe</th>
                  <th className="table-head"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map(({ student, synergy, cleverdesk, docusign, exact_globe }) => (
                  <tr key={student.id} className="table-row">
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <Avatar name={student.user.name} size="sm" tone="wood" />
                        <div>
                          <div className="font-medium text-ink-900">{student.user.name}</div>
                          <div className="text-xs text-ink-500 font-mono">{student.externalId || '—'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell text-ink-600">{student.coordinator.user.name}</td>
                    <td className="table-cell text-center"><SysBadge status={synergy} /></td>
                    <td className="table-cell text-center"><SysBadge status={cleverdesk} /></td>
                    <td className="table-cell text-center"><SysBadge status={docusign} /></td>
                    <td className="table-cell text-center"><SysBadge status={exact_globe} /></td>
                    <td className="table-cell text-right">
                      <button className="btn-ghost">
                        Open<Icon.ArrowRight className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {/* Knelpunt-uitleg */}
      <Card className="mt-6">
        <CardBody>
          <div className="grid items-start gap-4 md:grid-cols-[auto_1fr]">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-primary-500 text-white">
              <Icon.Link className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-ink-900">
                Eén waarheid over 4 systemen
              </h3>
              <p className="mt-1 text-sm text-ink-700">
                In plaats van schakelen tussen Exact Synergy, Cleverdesk, DocuSign en Exact Globe — hier zie je
                in één matrix waar gegevens kloppen en waar discrepanties zitten. Klik door per
                student om de mismatch direct te corrigeren.
              </p>
              <ul className="mt-3 grid grid-cols-1 gap-2 text-xs text-ink-600 md:grid-cols-2">
                <li className="flex items-center gap-2">
                  <span className="grid h-5 w-5 place-items-center rounded bg-emerald-100 text-emerald-700"><Icon.Check className="h-3 w-3" /></span>
                  <span><strong>Sync</strong>: gegevens kloppen tussen systemen</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="grid h-5 w-5 place-items-center rounded bg-amber-100 text-amber-700"><Icon.AlertTriangle className="h-3 w-3" /></span>
                  <span><strong>Verouderd</strong>: laatste sync &gt; 24u oud</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="grid h-5 w-5 place-items-center rounded bg-rose-100 text-rose-700"><Icon.X className="h-3 w-3" /></span>
                  <span><strong>Mismatch</strong>: ID of veld klopt niet</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="grid h-5 w-5 place-items-center rounded bg-bone-100 text-ink-600"><Icon.Refresh className="h-3 w-3" /></span>
                  <span><strong>Onbekend</strong>: nog geen koppeling</span>
                </li>
              </ul>
            </div>
          </div>
        </CardBody>
      </Card>
    </PortalShell>
  );
}

function SystemCard({ name, desc, ok, total, color }: { name: string; desc: string; ok: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((ok / total) * 100) : 0;
  return (
    <div className="card-padded">
      <div className={`grid h-10 w-10 place-items-center rounded-md text-white ${color}`}>
        <Icon.Link className="h-5 w-5" />
      </div>
      <h3 className="mt-3 font-display text-base font-bold text-ink-900">{name}</h3>
      <p className="text-xs text-ink-500">{desc}</p>
      <div className="mt-3">
        <div className="flex items-baseline justify-between">
          <span className="font-display text-xl font-bold text-ink-900">{ok}/{total}</span>
          <span className={`text-xs font-bold ${pct >= 90 ? 'text-emerald-600' : pct >= 70 ? 'text-amber-600' : 'text-rose-600'}`}>{pct}%</span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-bone-100">
          <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}

function SysBadge({ status }: { status: SystemStatus }) {
  const m = sysMeta[status];
  return (
    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider ring-1 ${m.color}`}>
      {m.icon}
      {m.label}
    </span>
  );
}
