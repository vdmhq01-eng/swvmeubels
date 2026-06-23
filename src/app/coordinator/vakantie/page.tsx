import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { getDemoSession } from '@/lib/data/session';
import { listStudents } from '@/lib/data/students';
import { listHolidayBalances } from '@/lib/data/compliance';
import { db } from '@/lib/db';
import { formatMoney } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function CoordinatorVakantiePage() {
  const ctx = getDemoSession('COORDINATOR');
  const [students, balances, coordinator] = await Promise.all([
    listStudents(ctx),
    listHolidayBalances(ctx),
    db.coordinator.findUnique({ where: { id: ctx.coordinatorId! }, include: { user: true, region: true } }).catch(() => null),
  ]);
  const balanceByStudent = new Map(balances.map((b) => [b.studentId, b]));

  return (
    <PortalShell
      role="COORDINATOR"
      activeHref="/coordinator/vakantie"
      userName={coordinator?.user.name ?? 'Coördinator'}
      userSubtitle={`Coördinator regio ${coordinator?.region.name ?? ''}`}
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
                  const b = balanceByStudent.get(s.id);
                  return (
                    <tr key={s.id} className="table-row">
                      <td className="table-cell">
                        <div className="flex items-center gap-3">
                          <Avatar name={s.user.name} size="sm" tone="wood" />
                          <span className="font-medium text-ink-900">{s.user.name}</span>
                        </div>
                      </td>
                      <td className="table-cell text-right font-semibold">{b?.remainingDays ?? '-'} dagen</td>
                      <td className="table-cell text-right">{b?.usedDays ?? '-'} dagen</td>
                      <td className="table-cell text-right">{b?.totalDays ?? '-'} dagen</td>
                      <td className="table-cell text-right">{b ? formatMoney(b.holidayMoneyCents / 100) : '-'}</td>
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
