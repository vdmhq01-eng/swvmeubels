import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Icon } from '@/components/ui/Icon';
import { getDemoSession } from '@/lib/data/session';
import { listAbsences } from '@/lib/data/compliance';
import { db } from '@/lib/db';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function LidbedrijfVerzuimPage() {
  const ctx = getDemoSession('COMPANY');
  const [absences, contact] = await Promise.all([
    listAbsences(ctx),
    db.companyContact.findFirst({ where: { companyId: ctx.companyId! }, include: { user: true, company: true } }),
  ]);

  return (
    <PortalShell
      role="COMPANY"
      activeHref="/lidbedrijf/verzuim"
      userName={contact?.user.name ?? 'Lidbedrijf'}
      userSubtitle={contact?.company.name ?? 'Lidbedrijf'}
      greeting={{ title: 'Verzuim', subtitle: 'Ziekte en verlof bij jouw studenten.' }}
    >
      <Card>
        <CardHeader title="Meldingen" subtitle="Houd contact met je student" />
        <CardBody>
          {absences.length === 0 ? (
            <div className="text-sm text-ink-500">Geen verzuim meldingen.</div>
          ) : (
            <ul className="divide-y divide-bone-100">
              {absences.map((a) => (
                <li key={a.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <Avatar name={a.student.user.name} size="sm" tone="rose" />
                    <div>
                      <div className="text-sm font-medium text-ink-900">{a.student.user.name}</div>
                      <div className="text-xs text-ink-500">
                        {a.type === 'ZIEKTE' ? 'Ziek' : 'Verlof'} · {formatDate(a.startDate)}
                        {a.endDate ? ` – ${formatDate(a.endDate)}` : ' – open'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={a.closedAt ? 'success' : 'warning'}>
                      {a.closedAt ? 'Gesloten' : 'Open'}
                    </Badge>
                    <button className="btn-ghost">
                      <Icon.Bell className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>
    </PortalShell>
  );
}
