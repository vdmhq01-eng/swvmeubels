import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { currentCoordinator } from '@/lib/mock/users';
import { students } from '@/lib/mock/students';
import { holidayBalances } from '@/lib/mock/misc';
import { formatMoney } from '@/lib/utils';

export default function CoordinatorVakantiePage() {
  return (
    <PortalShell
      role="COORDINATOR"
      activeHref="/coordinator/vakantie"
      userName={currentCoordinator.name}
      userSubtitle="Coördinator regio Noord"
      greeting={{ title: 'Vakantiedagen', subtitle: 'Saldo per student.' }}
    >
      <Card>
        <CardHeader title="Saldi" subtitle="Bron: Exact Synergy" />
        <CardBody>
          <div className="overflow-x-auto rounded-xl border border-bone-200">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="table-head">Student</th>
                  <th className="table-head text-right">Saldo</th>
                  <th className="table-head text-right">Opgenomen</th>
                  <th className="table-head text-right">Totaal</th>
                  <th className="table-head text-right">Tegoed</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => {
                  const b = holidayBalances.find((h) => h.studentId === s.id) ?? {
                    studentId: s.id,
                    totalDays: 20,
                    usedDays: Math.floor(Math.random() * 12),
                    remainingDays: 0,
                    holidayMoneyCents: 30000 + Math.floor(Math.random() * 40000),
                    lastUpdated: '2024-05-01',
                  };
                  const remaining = b.remainingDays || (b.totalDays - b.usedDays);
                  return (
                    <tr key={s.id} className="table-row">
                      <td className="table-cell">
                        <div className="flex items-center gap-3">
                          <Avatar name={s.name} size="sm" tone="wood" />
                          <span className="font-medium text-ink-900">{s.name}</span>
                        </div>
                      </td>
                      <td className="table-cell text-right font-semibold">{remaining} dagen</td>
                      <td className="table-cell text-right">{b.usedDays} dagen</td>
                      <td className="table-cell text-right">{b.totalDays} dagen</td>
                      <td className="table-cell text-right">{formatMoney(b.holidayMoneyCents / 100)}</td>
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
