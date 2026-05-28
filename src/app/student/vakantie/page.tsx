import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { currentStudent } from '@/lib/mock/users';
import { holidayBalances, absences } from '@/lib/mock/misc';
import { formatDate, formatMoney } from '@/lib/utils';

export default function StudentVakantiePage() {
  const balance = holidayBalances.find((h) => h.studentId === 'stu-001')!;
  const verlof = absences.filter((a) => a.type === 'VERLOF');

  return (
    <PortalShell
      role="STUDENT"
      activeHref="/student/vakantie"
      userName={currentStudent.name}
      userSubtitle="Student"
      greeting={{ title: 'Vakantiedagen', subtitle: 'Saldo, vakantietegoed en aanvragen.' }}
    >
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Saldo" subtitle="Bron: Exact Synergy" />
          <CardBody>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Box icon={<Icon.Palm className="h-5 w-5" />} label="Beschikbaar" value={`${balance.remainingDays} dagen`} tone="green" />
              <Box icon={<Icon.Calendar className="h-5 w-5" />} label="Opgenomen" value={`${balance.usedDays} dagen`} tone="wood" />
              <Box icon={<Icon.Euro className="h-5 w-5" />} label="Tegoed" value={formatMoney(balance.holidayMoneyCents / 100)} tone="amber" />
            </div>
            <div className="mt-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-600">Totaal aanwezig</span>
                <span className="font-semibold text-ink-900">{balance.usedDays} / {balance.totalDays}</span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-bone-100">
                <div className="h-full rounded-full bg-emerald-500" style={{ width: `${(balance.usedDays / balance.totalDays) * 100}%` }} />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Vakantie aanvragen" subtitle="Mockformulier" />
          <CardBody className="space-y-3">
            <div>
              <label className="label mb-1 block">Van</label>
              <input type="date" className="input" />
            </div>
            <div>
              <label className="label mb-1 block">Tot en met</label>
              <input type="date" className="input" />
            </div>
            <div>
              <label className="label mb-1 block">Toelichting</label>
              <textarea rows={3} className="input" placeholder="Optioneel" />
            </div>
            <button className="btn-primary w-full">
              <Icon.Check className="h-4 w-4" />
              Verstuur aanvraag
            </button>
          </CardBody>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader title="Historie" subtitle="Opgenomen en aangevraagd verlof" />
        <CardBody>
          <div className="overflow-x-auto rounded-xl border border-bone-200">
            <table className="w-full min-w-[480px] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="table-head">Periode</th>
                  <th className="table-head">Type</th>
                  <th className="table-head">Aangevraagd</th>
                  <th className="table-head">Status</th>
                </tr>
              </thead>
              <tbody>
                {verlof.map((a) => (
                  <tr key={a.id} className="table-row">
                    <td className="table-cell">
                      {formatDate(a.startDate)}{a.endDate ? ` – ${formatDate(a.endDate)}` : ''}
                    </td>
                    <td className="table-cell">Verlof</td>
                    <td className="table-cell">{formatDate(a.reportedAt)}</td>
                    <td className="table-cell">
                      <Badge variant={a.status === 'OPEN' ? 'warning' : 'success'}>
                        {a.status === 'OPEN' ? 'In behandeling' : 'Goedgekeurd'}
                      </Badge>
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

function Box({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: string; tone: 'wood' | 'green' | 'amber' }) {
  const cls = {
    wood: 'bg-wood-50 text-wood-700 ring-wood-100',
    green: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    amber: 'bg-amber-50 text-amber-700 ring-amber-100',
  }[tone];
  return (
    <div className={`rounded-2xl px-4 py-4 ring-1 ${cls}`}>
      <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/60">{icon}</div>
      <div className="mt-3 text-[11px] font-medium uppercase tracking-wider opacity-80">{label}</div>
      <div className="mt-0.5 font-display text-xl font-semibold">{value}</div>
    </div>
  );
}
