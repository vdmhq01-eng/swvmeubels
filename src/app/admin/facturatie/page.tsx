import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { currentAdmin } from '@/lib/mock/users';
import { db } from '@/lib/db';
import { formatMoney } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const factuurStatusVar = {
  CONCEPT: 'warning' as const,
  VERSTUURD: 'info' as const,
  BETAALD: 'success' as const,
  TE_LAAT: 'danger' as const,
};

export default async function FacturatiePage() {
  const companies = await db.company
    .findMany({
      include: {
        _count: { select: { students: true } },
        students: { include: { user: true } },
      },
      orderBy: { name: 'asc' },
    })
    .catch(() => []);

  // Bereken mock factuurbedrag per bedrijf (in productie: gekoppeld aan timesheet/uur)
  type FactuurRow = {
    id: string;
    bedrijf: string;
    periode: string;
    students: number;
    uren: number;
    bedragCents: number;
    status: 'CONCEPT' | 'VERSTUURD' | 'BETAALD' | 'TE_LAAT';
    dueDate: string;
  };

  const facturen: FactuurRow[] = companies.flatMap((c, i) => {
    const uren = 32 * 4 * c._count.students; // mock: 32u × 4 weken × studenten
    const tarief = 22.5; // mock €/uur
    const bedragCents = Math.round(uren * tarief * 100);
    const status: FactuurRow['status'] = i % 3 === 0 ? 'TE_LAAT' : i % 2 === 0 ? 'VERSTUURD' : 'BETAALD';
    return [{
      id: `inv-${c.id}`,
      bedrijf: c.name,
      periode: 'Mei 2026',
      students: c._count.students,
      uren,
      bedragCents,
      status,
      dueDate: status === 'TE_LAAT' ? '2026-05-20' : '2026-06-30',
    }];
  });

  const totaalOpenstaand = facturen
    .filter((f) => f.status === 'VERSTUURD' || f.status === 'TE_LAAT')
    .reduce((s, f) => s + f.bedragCents, 0);
  const totaalTeLaat = facturen
    .filter((f) => f.status === 'TE_LAAT')
    .reduce((s, f) => s + f.bedragCents, 0);
  const totaalBetaald = facturen
    .filter((f) => f.status === 'BETAALD')
    .reduce((s, f) => s + f.bedragCents, 0);

  return (
    <PortalShell
      role="ADMIN"
      activeHref="/admin/facturatie"
      userName={currentAdmin.name}
      userSubtitle="Binnendienst"
      greeting={{
        title: 'Facturatie lidbedrijven',
        subtitle: 'Facturatie van gewerkte uren per bedrijf per maand.',
      }}
    >
      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat label="Openstaand" value={formatMoney(totaalOpenstaand / 100)} tone="amber" icon={<Icon.Euro className="h-5 w-5" />} />
        <Stat label="Te laat" value={formatMoney(totaalTeLaat / 100)} tone="rose" icon={<Icon.AlertTriangle className="h-5 w-5" />} />
        <Stat label="Betaald deze maand" value={formatMoney(totaalBetaald / 100)} tone="emerald" icon={<Icon.Check className="h-5 w-5" />} />
        <Stat label="Facturen open" value={`${facturen.filter((f) => f.status !== 'BETAALD').length}`} tone="navy" icon={<Icon.Doc className="h-5 w-5" />} />
      </div>

      {/* Acties */}
      <Card className="mt-6">
        <CardHeader
          title="Facturen mei 2026"
          subtitle="Automatisch gegenereerd uit goedgekeurde weekstaten in Cleverdesk"
          action={
            <div className="flex flex-wrap gap-2">
              <button className="btn-secondary">
                <Icon.Refresh className="h-4 w-4" /> Herbereken
              </button>
              <button className="btn-primary">
                <Icon.Doc className="h-4 w-4" /> Genereer concept
              </button>
              <button className="btn-primary">
                <Icon.Bell className="h-4 w-4" /> Verstuur alle concepten
              </button>
            </div>
          }
        />
        <CardBody>
          <div className="overflow-x-auto rounded-xl border border-bone-200">
            <table className="w-full min-w-[840px] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="table-head">Lidbedrijf</th>
                  <th className="table-head">Periode</th>
                  <th className="table-head text-right">Studenten</th>
                  <th className="table-head text-right">Uren</th>
                  <th className="table-head text-right">Bedrag</th>
                  <th className="table-head">Vervaldatum</th>
                  <th className="table-head">Status</th>
                  <th className="table-head"></th>
                </tr>
              </thead>
              <tbody>
                {facturen.map((f) => (
                  <tr key={f.id} className="table-row">
                    <td className="table-cell font-medium text-ink-900">{f.bedrijf}</td>
                    <td className="table-cell text-ink-600">{f.periode}</td>
                    <td className="table-cell text-right">{f.students}</td>
                    <td className="table-cell text-right font-mono">{f.uren}</td>
                    <td className="table-cell text-right font-semibold">{formatMoney(f.bedragCents / 100)}</td>
                    <td className="table-cell text-xs text-ink-500">{f.dueDate}</td>
                    <td className="table-cell"><Badge variant={factuurStatusVar[f.status]}>{f.status}</Badge></td>
                    <td className="table-cell text-right">
                      <button className="btn-ghost"><Icon.ArrowRight className="h-4 w-4" /></button>
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
          <div className="flex items-start gap-4">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-primary-500 text-white">
              <Icon.Activity className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-ink-900">Geen Excel meer</h3>
              <p className="mt-1 text-sm text-ink-700">
                Facturatie wordt automatisch berekend uit goedgekeurde weekstaten in Cleverdesk en gekoppeld
                aan het lidbedrijf in Exact Synergy. Eindafrekeningen, uitzonderingen en betaalafspraken
                staan centraal — geen lijstjes, geen P-schijf, geen kwijtraken.
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </PortalShell>
  );
}

function Stat({ label, value, tone, icon }: { label: string; value: string; tone: 'navy' | 'emerald' | 'amber' | 'rose'; icon: React.ReactNode }) {
  const cls = {
    navy: 'bg-navy-600 text-white',
    emerald: 'bg-emerald-600 text-white',
    amber: 'bg-amber-500 text-white',
    rose: 'bg-rose-500 text-white',
  }[tone];
  return (
    <div className="card-padded">
      <div className={`grid h-10 w-10 place-items-center rounded-md ${cls}`}>{icon}</div>
      <div className="mt-3 font-display text-xl font-bold text-ink-900">{value}</div>
      <div className="text-xs font-semibold uppercase tracking-wider text-ink-500">{label}</div>
    </div>
  );
}
