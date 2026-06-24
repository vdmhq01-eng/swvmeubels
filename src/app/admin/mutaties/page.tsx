import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Icon } from '@/components/ui/Icon';
import { currentAdmin } from '@/lib/mock/users';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

type Mutatie = {
  id: string;
  type: 'INDIENST' | 'UITDIENST' | 'CONTRACTWIJZIGING' | 'OVERPLAATSING';
  studentName: string;
  studentId: string;
  effectiveDate: string;
  status: 'OPEN' | 'IN_BEHANDELING' | 'AFGEROND';
  notes?: string;
};

const mockMutaties: Mutatie[] = [
  { id: 'mut-1', type: 'INDIENST', studentName: 'Nieuwe sollicitant', studentId: '-', effectiveDate: '2026-09-01', status: 'OPEN', notes: 'Sollicitatie geaccepteerd, contract aanmaken' },
  { id: 'mut-2', type: 'UITDIENST', studentName: 'Bas Kuipers', studentId: 'stu-006', effectiveDate: '2026-07-31', status: 'IN_BEHANDELING', notes: 'Contract loopt af, eindafrekening berekenen' },
  { id: 'mut-3', type: 'CONTRACTWIJZIGING', studentName: 'Jamie van Dijk', studentId: 'stu-001', effectiveDate: '2026-08-01', status: 'OPEN', notes: 'Verlenging na BBL 3 jaar 1' },
  { id: 'mut-4', type: 'OVERPLAATSING', studentName: 'Lisa Bakker', studentId: 'stu-002', effectiveDate: '2026-06-15', status: 'AFGEROND', notes: 'Overgeplaatst van Twente naar Noord' },
];

const typeMeta = {
  INDIENST: { label: 'In dienst', color: 'bg-emerald-500', icon: <Icon.Plus className="h-4 w-4" /> },
  UITDIENST: { label: 'Uit dienst', color: 'bg-rose-500', icon: <Icon.X className="h-4 w-4" /> },
  CONTRACTWIJZIGING: { label: 'Contract', color: 'bg-amber-500', icon: <Icon.Doc className="h-4 w-4" /> },
  OVERPLAATSING: { label: 'Overplaatsing', color: 'bg-navy-600', icon: <Icon.Refresh className="h-4 w-4" /> },
};

const statusVar = {
  OPEN: 'warning' as const,
  IN_BEHANDELING: 'info' as const,
  AFGEROND: 'success' as const,
};

export default async function MutatiesPage() {
  // In productie hier echte mutaties uit DB. Voor demo mock.
  const [contractsAflopend, applicationsNew] = await Promise.all([
    db.contract.count({ where: { status: 'AFLOPEND' } }).catch(() => 0),
    db.application.count({ where: { status: { in: ['NIEUW', 'TOEGEWEZEN', 'GEACCEPTEERD'] } } }).catch(() => 0),
  ]);

  return (
    <PortalShell
      role="ADMIN"
      activeHref="/admin/mutaties"
      userName={currentAdmin.name}
      userSubtitle="Binnendienst"
      greeting={{
        title: 'Personeelsmutaties',
        subtitle: 'In dienst, uit dienst, contractwijzigingen en overplaatsingen.',
      }}
    >
      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat label="Nieuwe sollicitaties" value={`${applicationsNew}`} tone="primary" icon={<Icon.Bell className="h-5 w-5" />} />
        <Stat label="Contracten aflopend" value={`${contractsAflopend}`} tone="amber" icon={<Icon.Doc className="h-5 w-5" />} />
        <Stat label="Open mutaties" value={`${mockMutaties.filter((m) => m.status === 'OPEN').length}`} tone="rose" icon={<Icon.AlertTriangle className="h-5 w-5" />} />
        <Stat label="Afgerond deze maand" value="12" tone="emerald" icon={<Icon.Check className="h-5 w-5" />} />
      </div>

      {/* Acties uit andere systemen */}
      <Card className="mt-6">
        <CardHeader title="Automatische signaleringen" subtitle="Op basis van data uit Synergy + Cleverdesk + sollicitaties" />
        <CardBody>
          <div className="space-y-3">
            <Signal
              icon={<Icon.Bell className="h-5 w-5" />}
              tone="primary"
              title={`${applicationsNew} sollicitaties wachten op indiensttreding`}
              body="Geaccepteerde sollicitanten zonder contract — start de in-dienst-flow."
              href="/admin/kaartenbak"
            />
            <Signal
              icon={<Icon.Doc className="h-5 w-5" />}
              tone="amber"
              title={`${contractsAflopend} contracten lopen binnen 3 maanden af`}
              body="Bepaal of je verlengt, en stuur tijdig contract."
              href="/admin/lidbedrijven"
            />
            <Signal
              icon={<Icon.X className="h-5 w-5" />}
              tone="rose"
              title="Eindafrekeningen pending"
              body="2 uit dienst getreden studenten met openstaande eindafrekening."
              href="/admin/eindafrekening"
            />
          </div>
        </CardBody>
      </Card>

      {/* Mutaties tabel */}
      <Card className="mt-6">
        <CardHeader
          title="Mutaties pijplijn"
          action={
            <button className="btn-primary">
              <Icon.Plus className="h-4 w-4" /> Nieuwe mutatie
            </button>
          }
        />
        <CardBody>
          <div className="overflow-x-auto rounded-xl border border-bone-200">
            <table className="w-full min-w-[760px] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="table-head">Student</th>
                  <th className="table-head">Type</th>
                  <th className="table-head">Per datum</th>
                  <th className="table-head">Toelichting</th>
                  <th className="table-head">Status</th>
                  <th className="table-head"></th>
                </tr>
              </thead>
              <tbody>
                {mockMutaties.map((m) => {
                  const t = typeMeta[m.type];
                  return (
                    <tr key={m.id} className="table-row">
                      <td className="table-cell">
                        <div className="flex items-center gap-3">
                          <Avatar name={m.studentName} size="sm" tone="wood" />
                          <div>
                            <div className="font-medium text-ink-900">{m.studentName}</div>
                            <div className="text-xs text-ink-500 font-mono">{m.studentId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="table-cell">
                        <span className="inline-flex items-center gap-2">
                          <span className={`grid h-7 w-7 place-items-center rounded-md text-white ${t.color}`}>
                            {t.icon}
                          </span>
                          <span className="text-xs font-semibold uppercase tracking-wider">{t.label}</span>
                        </span>
                      </td>
                      <td className="table-cell font-mono text-xs">{m.effectiveDate}</td>
                      <td className="table-cell text-ink-700">{m.notes ?? '-'}</td>
                      <td className="table-cell">
                        <Badge variant={statusVar[m.status]}>{m.status}</Badge>
                      </td>
                      <td className="table-cell text-right">
                        <button className="btn-ghost">
                          Open<Icon.ArrowRight className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </PortalShell>
  );
}

function Stat({ label, value, tone, icon }: { label: string; value: string; tone: 'primary' | 'navy' | 'emerald' | 'amber' | 'rose'; icon: React.ReactNode }) {
  const cls = {
    primary: 'bg-primary-500 text-white',
    navy: 'bg-navy-600 text-white',
    emerald: 'bg-emerald-600 text-white',
    amber: 'bg-amber-500 text-white',
    rose: 'bg-rose-500 text-white',
  }[tone];
  return (
    <div className="card-padded">
      <div className={`grid h-10 w-10 place-items-center rounded-md ${cls}`}>{icon}</div>
      <div className="mt-3 font-display text-2xl font-bold text-ink-900">{value}</div>
      <div className="text-xs font-semibold uppercase tracking-wider text-ink-500">{label}</div>
    </div>
  );
}

function Signal({ icon, tone, title, body, href }: { icon: React.ReactNode; tone: 'primary' | 'amber' | 'rose'; title: string; body: string; href: string }) {
  const cls = {
    primary: 'bg-primary-50 text-primary-700 ring-primary-200',
    amber: 'bg-amber-50 text-amber-700 ring-amber-200',
    rose: 'bg-rose-50 text-rose-700 ring-rose-200',
  }[tone];
  return (
    <a
      href={href}
      className="group flex items-start gap-3 rounded-xl border border-bone-200 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-soft"
    >
      <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-md ring-1 ${cls}`}>{icon}</div>
      <div className="min-w-0 flex-1">
        <div className="font-display text-sm font-bold text-ink-900">{title}</div>
        <div className="text-xs text-ink-600">{body}</div>
      </div>
      <Icon.ArrowRight className="h-4 w-4 text-ink-400 transition group-hover:translate-x-1" />
    </a>
  );
}
