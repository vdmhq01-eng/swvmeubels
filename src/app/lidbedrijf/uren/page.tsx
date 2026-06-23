import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Toolbar, FilterChip } from '@/components/ui/Toolbar';
import { getDemoSession } from '@/lib/data/session';
import { listStudentsForCompany } from '@/lib/data/students';
import { getTimesheetsForStudent, sumEntries } from '@/lib/data/timesheets';
import { db } from '@/lib/db';
import { formatHours } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const statusVariant: Record<string, 'success' | 'info' | 'warning' | 'danger' | 'neutral'> = {
  GOEDGEKEURD: 'success',
  INGEDIEND: 'info',
  CONCEPT: 'warning',
  AFGEKEURD: 'danger',
  CORRECTIE_GEVRAAGD: 'warning',
};

export default async function LidbedrijfUrenPage() {
  const ctx = getDemoSession('COMPANY');
  const [students, contact] = await Promise.all([
    listStudentsForCompany(ctx.companyId!),
    db.companyContact.findFirst({ where: { companyId: ctx.companyId! }, include: { user: true, company: true } }).catch(() => null),
  ]);
  const data = await Promise.all(
    students.map(async (s) => ({
      student: s,
      weeks: await getTimesheetsForStudent(s.id, 4),
    })),
  );

  return (
    <PortalShell
      role="COMPANY"
      activeHref="/lidbedrijf/uren"
      userName={contact?.user.name ?? 'Lidbedrijf'}
      userSubtitle={contact?.company.name ?? 'Lidbedrijf'}
      greeting={{ title: 'Urenoverzicht', subtitle: 'Per student over de laatste weken.' }}
    >
      <Card>
        <CardBody>
          <Toolbar placeholder="Zoek student…">
            <FilterChip label="Alle" active />
          </Toolbar>
        </CardBody>
      </Card>

      {data.map(({ student, weeks }) => (
        <Card key={student.id} className="mt-5">
          <CardHeader
            title={
              <div className="flex items-center gap-3">
                <Avatar name={student.user.name} size="sm" tone="wood" />
                <span>{student.user.name}</span>
              </div>
            }
          />
          <CardBody>
            {weeks.length === 0 ? (
              <div className="text-sm text-ink-500">Nog geen weekstaten.</div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-bone-200">
                <table className="w-full min-w-[480px] border-collapse text-sm">
                  <thead>
                    <tr>
                      <th className="table-head">Week</th>
                      <th className="table-head text-right">Praktijk</th>
                      <th className="table-head text-right">School</th>
                      <th className="table-head text-right">Totaal</th>
                      <th className="table-head">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weeks.map((w) => {
                      const totals = sumEntries(w.entries);
                      return (
                        <tr key={w.id} className="table-row">
                          <td className="table-cell font-medium">W{w.weekNumber}</td>
                          <td className="table-cell text-right">{formatHours(totals.PRAKTIJK)}</td>
                          <td className="table-cell text-right">{formatHours(totals.SCHOOL)}</td>
                          <td className="table-cell text-right font-semibold">{formatHours(totals.totaal)}</td>
                          <td className="table-cell">
                            <Badge variant={statusVariant[w.status] ?? 'neutral'}>{w.status}</Badge>
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
      ))}
    </PortalShell>
  );
}
