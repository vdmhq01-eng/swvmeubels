import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Icon } from '@/components/ui/Icon';
import { ApprovalActions } from '@/components/uren/ApprovalActions';
import { EmptyState } from '@/components/ui/EmptyState';
import { getDemoSession } from '@/lib/data/session';
import { getCompanyDashboard } from '@/lib/data/dashboard';
import { db } from '@/lib/db';
import { sumEntries } from '@/lib/data/timesheets';
import { formatHours, weekRange } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function LidbedrijfDashboardPage() {
  const ctx = getDemoSession('COMPANY');
  const [data, contact] = await Promise.all([
    getCompanyDashboard(ctx),
    db.companyContact.findFirst({ where: { companyId: ctx.companyId! }, include: { user: true, company: true } }),
  ]);

  if (!data) {
    return (
      <PortalShell role="COMPANY" activeHref="/lidbedrijf" userName="Demo" userSubtitle="Lidbedrijf">
        <EmptyState icon={<Icon.Briefcase className="h-5 w-5" />} title="Geen bedrijfsdata gevonden" />
      </PortalShell>
    );
  }

  const { studentCount, pending, openVerzuim } = data;
  const openActions = pending.length;

  return (
    <PortalShell
      role="COMPANY"
      activeHref="/lidbedrijf"
      userName={contact?.user.name ?? 'Lidbedrijf'}
      userSubtitle={contact?.company.name ?? 'Lidbedrijf'}
      greeting={{ title: 'Dashboard', subtitle: 'Overzicht van jouw studenten en weekstaten.' }}
    >
      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        <StatCard label="Weekstaten" value={pending.length} hint="Wachten op goedkeuring" icon={<Icon.Activity className="h-5 w-5" />} tone="amber" />
        <StatCard label="Studenten actief" value={studentCount} hint="Bij jouw bedrijf" icon={<Icon.Users className="h-5 w-5" />} tone="wood" />
        <StatCard label="Open acties" value={openActions} hint="Vereisen reactie" icon={<Icon.Bell className="h-5 w-5" />} tone="rose" />
        <StatCard label="Verzuim" value={openVerzuim} hint="Open meldingen" icon={<Icon.Heart className="h-5 w-5" />} tone="green" />
      </div>

      <Card className="mt-6">
        <CardHeader title="Weekstaten ter goedkeuring" subtitle="Sorteer op meest recent ingediend" />
        <CardBody>
          {pending.length === 0 ? (
            <EmptyState icon={<Icon.CheckCircle className="h-5 w-5" />} title="Geen openstaande weekstaten" description="Alles is up-to-date." />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-bone-200">
              <table className="w-full min-w-[680px] border-collapse text-sm">
                <thead>
                  <tr>
                    <th className="table-head">Student</th>
                    <th className="table-head">Week</th>
                    <th className="table-head text-right">Totaal</th>
                    <th className="table-head text-right">Ontbrekend</th>
                    <th className="table-head"></th>
                  </tr>
                </thead>
                <tbody>
                  {pending.map((t) => {
                    const totals = sumEntries(t.entries);
                    return (
                      <tr key={t.id} className="table-row">
                        <td className="table-cell">
                          <div className="flex items-center gap-3">
                            <Avatar name={t.student.user.name} size="sm" tone="wood" />
                            <div>
                              <div className="font-medium text-ink-900">{t.student.user.name}</div>
                              <div className="text-xs text-ink-500">{t.student.company.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="table-cell">
                          W{t.weekNumber}
                          <div className="text-xs text-ink-500">{weekRange(t.weekStartDate.toISOString().slice(0, 10))}</div>
                        </td>
                        <td className="table-cell text-right font-semibold">{formatHours(totals.totaal)}</td>
                        <td className="table-cell text-right">
                          {totals.ontbrekend > 0 ? (
                            <Badge variant="warning">{formatHours(totals.ontbrekend)}</Badge>
                          ) : (
                            <Badge variant="success">Compleet</Badge>
                          )}
                        </td>
                        <td className="table-cell text-right">
                          <ApprovalActions timesheetId={t.id} studentName={t.student.user.name} withReasonInput />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>
    </PortalShell>
  );
}
