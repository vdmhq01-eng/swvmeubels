import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { ApprovalActions } from '@/components/uren/ApprovalActions';
import { EmptyState } from '@/components/ui/EmptyState';
import { Icon } from '@/components/ui/Icon';
import { getDemoSession } from '@/lib/data/session';
import { getPendingApprovals, sumEntries } from '@/lib/data/timesheets';
import { db } from '@/lib/db';
import { formatHours, weekRange } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function LidbedrijfGoedkeurenPage() {
  const ctx = getDemoSession('COMPANY');
  const [pending, contact] = await Promise.all([
    getPendingApprovals(ctx),
    db.companyContact.findFirst({ where: { companyId: ctx.companyId! }, include: { user: true, company: true } }),
  ]);

  return (
    <PortalShell
      role="COMPANY"
      activeHref="/lidbedrijf/goedkeuren"
      userName={contact?.user.name ?? 'Lidbedrijf'}
      userSubtitle={contact?.company.name ?? 'Lidbedrijf'}
      greeting={{ title: 'Weekstaten goedkeuren', subtitle: 'Snel beslissen met inzicht in afwijkingen.' }}
    >
      {pending.length === 0 ? (
        <Card>
          <CardBody>
            <EmptyState
              icon={<Icon.CheckCircle className="h-5 w-5" />}
              title="Niets te beoordelen"
              description="Alle weekstaten zijn behandeld."
            />
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-4">
          {pending.map((p) => {
            const totals = sumEntries(p.entries);
            return (
              <Card key={p.id}>
                <CardBody>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <Avatar name={p.student.user.name} tone="wood" />
                      <div>
                        <div className="font-display text-base font-semibold text-ink-900">{p.student.user.name}</div>
                        <div className="text-xs text-ink-500">
                          W{p.weekNumber} · {weekRange(p.weekStartDate.toISOString().slice(0, 10))}
                        </div>
                      </div>
                    </div>
                    <Badge variant="info">Ingediend</Badge>
                  </div>

                  <div className="mt-5 overflow-x-auto rounded-xl border border-bone-200">
                    <table className="w-full min-w-[480px] border-collapse text-sm">
                      <thead>
                        <tr>
                          <th className="table-head">Dag</th>
                          <th className="table-head">Type</th>
                          <th className="table-head text-right">Uren</th>
                          <th className="table-head">Notitie</th>
                        </tr>
                      </thead>
                      <tbody>
                        {p.entries.map((e) => (
                          <tr key={e.id} className="table-row">
                            <td className="table-cell">{e.date.toISOString().slice(0, 10)}</td>
                            <td className="table-cell">
                              <Badge variant={e.type === 'ZIEKTE' ? 'danger' : e.type === 'SCHOOL' ? 'info' : 'wood'}>{e.type}</Badge>
                            </td>
                            <td className="table-cell text-right">{formatHours(Number(e.hours))}</td>
                            <td className="table-cell text-xs text-ink-500">{e.note ?? '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-sm">
                      <span className="text-ink-600">Totaal </span>
                      <span className="font-semibold text-ink-900">{formatHours(totals.totaal)}</span>
                      <span className="text-ink-500"> · norm {formatHours(38)}</span>
                      {totals.ontbrekend > 0 ? (
                        <span className="ml-2"><Badge variant="warning">{formatHours(totals.ontbrekend)} ontbrekend</Badge></span>
                      ) : null}
                    </div>
                    <ApprovalActions timesheetId={p.id} studentName={p.student.user.name} withReasonInput />
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}
    </PortalShell>
  );
}
