import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { getDemoSession } from '@/lib/data/session';
import { listContracts } from '@/lib/data/compliance';
import { db } from '@/lib/db';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function LidbedrijfContractenPage() {
  const ctx = getDemoSession('COMPANY');
  const [contracts, contact] = await Promise.all([
    listContracts(ctx),
    db.companyContact.findFirst({ where: { companyId: ctx.companyId! }, include: { user: true, company: true } }).catch(() => null),
  ]);
  return (
    <PortalShell
      role="COMPANY"
      activeHref="/lidbedrijf/contracten"
      userName={contact?.user.name ?? 'Lidbedrijf'}
      userSubtitle={contact?.company.name ?? 'Lidbedrijf'}
      greeting={{ title: 'Contracten', subtitle: 'Praktijkovereenkomsten van jouw studenten.' }}
    >
      <Card>
        <CardHeader title="Lopende contracten" />
        <CardBody>
          {contracts.length === 0 ? (
            <div className="text-sm text-ink-500">Geen contracten.</div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-bone-200">
              <table className="w-full min-w-[600px] border-collapse text-sm">
                <thead>
                  <tr>
                    <th className="table-head">Student</th>
                    <th className="table-head">Startdatum</th>
                    <th className="table-head">Einddatum</th>
                    <th className="table-head text-right">Uren / week</th>
                    <th className="table-head">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {contracts.map((c) => (
                    <tr key={c.id} className="table-row">
                      <td className="table-cell font-medium text-ink-900">{c.student.user.name}</td>
                      <td className="table-cell">{formatDate(c.startDate)}</td>
                      <td className="table-cell">{formatDate(c.endDate)}</td>
                      <td className="table-cell text-right">{c.hoursPerWeek} u</td>
                      <td className="table-cell">
                        <Badge variant={c.status === 'ACTIEF' ? 'success' : c.status === 'AFLOPEND' ? 'warning' : 'neutral'}>
                          {c.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>
    </PortalShell>
  );
}
