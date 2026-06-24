import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Icon } from '@/components/ui/Icon';
import { currentAdmin } from '@/lib/mock/users';
import { db } from '@/lib/db';
import { formatMoney, formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function EindafrekeningPage() {
  const eindigend = await db.contract
    .findMany({
      where: { status: { in: ['AFLOPEND', 'VERLOPEN'] } },
      include: {
        student: {
          include: {
            user: true,
            holidayBalance: true,
            company: true,
          },
        },
      },
      orderBy: { endDate: 'asc' },
    })
    .catch(() => []);

  const totaalUitTeBetalen = eindigend.reduce((s, c) => s + (c.student.holidayBalance?.holidayMoneyCents ?? 0), 0);

  return (
    <PortalShell
      role="ADMIN"
      activeHref="/admin/eindafrekening"
      userName={currentAdmin.name}
      userSubtitle="Binnendienst"
      greeting={{
        title: 'Eindafrekeningen',
        subtitle: 'Vervangt Excel-lijstjes: vakantie-uitbetaling, openstaande uren, contracten beëindigen.',
      }}
    >
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat label="Te verwerken" value={`${eindigend.length}`} tone="amber" icon={<Icon.Doc className="h-5 w-5" />} />
        <Stat label="Uit te betalen" value={formatMoney(totaalUitTeBetalen / 100)} tone="primary" icon={<Icon.Euro className="h-5 w-5" />} />
        <Stat label="Afgerond YTD" value="34" tone="emerald" icon={<Icon.Check className="h-5 w-5" />} />
        <Stat label="Vertraagd" value="0" tone="rose" icon={<Icon.AlertTriangle className="h-5 w-5" />} />
      </div>

      <Card className="mt-6">
        <CardHeader
          title="Aflopende contracten — eindafrekening pijplijn"
          subtitle="Automatisch gesignaleerd uit Exact Synergy"
          action={
            <button className="btn-primary">
              <Icon.Doc className="h-4 w-4" />
              Bulk eindafrekening genereren
            </button>
          }
        />
        <CardBody>
          {eindigend.length === 0 ? (
            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-700">
              ✓ Geen openstaande eindafrekeningen.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-bone-200">
              <table className="w-full min-w-[840px] border-collapse text-sm">
                <thead>
                  <tr>
                    <th className="table-head">Student</th>
                    <th className="table-head">Leerbedrijf</th>
                    <th className="table-head">Einddatum</th>
                    <th className="table-head text-right">Vakantiedagen open</th>
                    <th className="table-head text-right">Vakantiegeld</th>
                    <th className="table-head">Status</th>
                    <th className="table-head"></th>
                  </tr>
                </thead>
                <tbody>
                  {eindigend.map((c) => (
                    <tr key={c.id} className="table-row">
                      <td className="table-cell">
                        <div className="flex items-center gap-3">
                          <Avatar name={c.student.user.name} size="sm" tone="wood" />
                          <div>
                            <div className="font-medium text-ink-900">{c.student.user.name}</div>
                            <div className="text-xs text-ink-500 font-mono">{c.student.externalId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="table-cell">{c.student.company.name}</td>
                      <td className="table-cell text-xs">{formatDate(c.endDate)}</td>
                      <td className="table-cell text-right">{c.student.holidayBalance?.remainingDays ?? 0} dagen</td>
                      <td className="table-cell text-right font-semibold">
                        {formatMoney((c.student.holidayBalance?.holidayMoneyCents ?? 0) / 100)}
                      </td>
                      <td className="table-cell">
                        <Badge variant={c.status === 'AFLOPEND' ? 'warning' : 'danger'}>{c.status}</Badge>
                      </td>
                      <td className="table-cell text-right">
                        <button className="btn-ghost">
                          Verwerk<Icon.ArrowRight className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>

      <Card className="mt-6">
        <CardHeader title="Checklist eindafrekening" subtitle="Wat hoort erbij" />
        <CardBody>
          <ul className="space-y-3 text-sm">
            <CheckItem text="Open vakantiedagen uitbetalen (8% vakantiegeld + saldo)" />
            <CheckItem text="Laatste weekstaten goedgekeurd in Cleverdesk" />
            <CheckItem text="Eindbeoordeling van leerbedrijf ontvangen" />
            <CheckItem text="Documenten archiveren (contract, beoordelingen, BPV-verslag)" />
            <CheckItem text="Mutatie naar Exact Globe voor laatste salaris-cyclus" />
            <CheckItem text="School informeren over uitstroom" />
            <CheckItem text="Coördinator informeren" />
          </ul>
        </CardBody>
      </Card>
    </PortalShell>
  );
}

function Stat({ label, value, tone, icon }: { label: string; value: string; tone: 'primary' | 'emerald' | 'amber' | 'rose'; icon: React.ReactNode }) {
  const cls = {
    primary: 'bg-primary-500 text-white',
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

function CheckItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2">
      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md bg-emerald-100 text-emerald-700">
        <Icon.Check className="h-3 w-3" />
      </span>
      <span className="text-ink-700">{text}</span>
    </li>
  );
}
