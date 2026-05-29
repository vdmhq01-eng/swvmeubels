import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Icon } from '@/components/ui/Icon';
import { ApprovalActions } from '@/components/uren/ApprovalActions';
import { EmptyState } from '@/components/ui/EmptyState';
import { getDemoSession } from '@/lib/data/session';
import { getPendingApprovals, sumEntries } from '@/lib/data/timesheets';
import { db } from '@/lib/db';
import { formatHours, weekRange } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function CoordinatorGoedkeuringenPage() {
  const ctx = getDemoSession('COORDINATOR');
  const [pending, coordinator] = await Promise.all([
    getPendingApprovals(ctx),
    db.coordinator.findUnique({ where: { id: ctx.coordinatorId! }, include: { user: true, region: true } }),
  ]);

  return (
    <PortalShell
      role="COORDINATOR"
      activeHref="/coordinator/goedkeuringen"
      userName={coordinator?.user.name ?? 'Coördinator'}
      userSubtitle={`Coördinator regio ${coordinator?.region.name ?? ''}`}
      greeting={{ title: 'Goedkeuringen', subtitle: 'Weekstaten die op jouw oordeel wachten.' }}
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
          {pending.map((t) => {
            const totals = sumEntries(t.entries);
            return (
              <Card key={t.id}>
                <CardBody>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <Avatar name={t.student.user.name} tone="wood" />
                      <div>
                        <div className="font-display text-base font-semibold text-ink-900">{t.student.user.name}</div>
                        <div className="text-xs text-ink-500">
                          {t.student.company.name} · W{t.weekNumber} · {weekRange(t.weekStartDate.toISOString().slice(0, 10))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {totals.ontbrekend > 0 ? (
                        <Badge variant="warning">
                          <Icon.AlertTriangle className="h-3 w-3" /> {formatHours(totals.ontbrekend)} ontbrekend
                        </Badge>
                      ) : (
                        <Badge variant="success">Compleet</Badge>
                      )}
                      <Badge variant="info">Ingediend</Badge>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-5">
                    {(['PRAKTIJK', 'SCHOOL', 'ZIEKTE', 'VERLOF', 'AFWEZIG'] as const).map((k) => (
                      <div key={k} className="rounded-xl border border-bone-200 bg-bone-50 px-3 py-2">
                        <div className="text-[11px] uppercase tracking-wider text-ink-500">{k.toLowerCase()}</div>
                        <div className="text-sm font-semibold text-ink-900">{formatHours(totals[k])}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 flex justify-end">
                    <ApprovalActions timesheetId={t.id} studentName={t.student.user.name} withReasonInput />
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
