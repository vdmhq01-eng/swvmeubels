import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Toolbar, FilterChip } from '@/components/ui/Toolbar';
import { Icon } from '@/components/ui/Icon';
import { currentAdmin } from '@/lib/mock/users';
import { listDocuments } from '@/lib/data/compliance';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function AdminDocumentenPage() {
  const documents = await listDocuments({});
  const now = Date.now();
  const soon = documents.filter((d) => d.retentionUntil.getTime() - now < 30 * 86400_000 && d.retentionUntil.getTime() > now).length;
  const expired = documents.filter((d) => d.retentionUntil.getTime() <= now).length;

  return (
    <PortalShell
      role="ADMIN"
      activeHref="/admin/documenten"
      userName={currentAdmin.name}
      userSubtitle="Admin"
      greeting={{ title: 'Documentbeheer', subtitle: 'AVG-proof opslag, bewaartermijnen en signaleringen.' }}
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
        <KPI tone="wood" label="Documenten" value={`${documents.length}`} />
        <KPI tone="green" label="Versleuteld" value={`${documents.length}/${documents.length}`} />
        <KPI tone="amber" label="< 30d retentie" value={`${soon}`} />
        <KPI tone="rose" label="Verlopen" value={`${expired}`} />
      </div>

      <Card className="mt-6">
        <CardBody>
          <Toolbar placeholder="Zoek bestand of student…">
            <FilterChip label="Alle" active />
            <FilterChip label="Legitimatie" />
            <FilterChip label="Contract" />
            <FilterChip label="Beoordeling" />
            <FilterChip label="BPV" />
          </Toolbar>
        </CardBody>
      </Card>

      <Card className="mt-6">
        <CardHeader title="Documenten" subtitle="Alle documentacties worden geaudit" />
        <CardBody>
          <div className="overflow-x-auto rounded-xl border border-bone-200">
            <table className="w-full min-w-[840px] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="table-head">Bestand</th>
                  <th className="table-head">Categorie</th>
                  <th className="table-head">Student</th>
                  <th className="table-head">Geüpload</th>
                  <th className="table-head">Bewaartermijn tot</th>
                  <th className="table-head">Beveiliging</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((d) => (
                  <tr key={d.id} className="table-row">
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <Icon.Doc className="h-4 w-4 text-wood-500" />
                        <span className="font-medium text-ink-900">{d.fileName}</span>
                      </div>
                      <div className="text-xs text-ink-500">{(d.sizeBytes / 1024).toFixed(0)} KB</div>
                    </td>
                    <td className="table-cell"><Badge variant="wood">{d.category}</Badge></td>
                    <td className="table-cell">{d.student?.user.name ?? '-'}</td>
                    <td className="table-cell text-xs text-ink-500">{formatDate(d.uploadedAt)}</td>
                    <td className="table-cell">{formatDate(d.retentionUntil)}</td>
                    <td className="table-cell">
                      <Badge variant="info"><Icon.Lock className="h-3 w-3" /> AES-256</Badge>
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

function KPI({ tone, label, value }: { tone: 'wood' | 'green' | 'amber' | 'rose'; label: string; value: string }) {
  const cls = {
    wood: 'bg-wood-50 text-wood-700 ring-wood-100',
    green: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    amber: 'bg-amber-50 text-amber-700 ring-amber-100',
    rose: 'bg-rose-50 text-rose-700 ring-rose-100',
  }[tone];
  return (
    <div className={`rounded-2xl px-4 py-4 ring-1 ${cls}`}>
      <div className="text-[11px] font-medium uppercase tracking-wider opacity-80">{label}</div>
      <div className="mt-1 font-display text-3xl font-semibold">{value}</div>
    </div>
  );
}
