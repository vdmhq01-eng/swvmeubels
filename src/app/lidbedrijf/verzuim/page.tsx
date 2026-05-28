import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Icon } from '@/components/ui/Icon';
import { currentCompany } from '@/lib/mock/users';
import { absences } from '@/lib/mock/misc';
import { students } from '@/lib/mock/students';
import { formatDate } from '@/lib/utils';

export default function LidbedrijfVerzuimPage() {
  return (
    <PortalShell
      role="COMPANY"
      activeHref="/lidbedrijf/verzuim"
      userName={currentCompany.name}
      userSubtitle="Lidbedrijf"
      greeting={{ title: 'Verzuim', subtitle: 'Ziekte en verlof bij jouw studenten.' }}
    >
      <Card>
        <CardHeader title="Open meldingen" subtitle="Houd contact met je student" />
        <CardBody>
          <ul className="divide-y divide-bone-100">
            {absences.map((a) => {
              const s = students.find((x) => x.id === a.studentId);
              return (
                <li key={a.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <Avatar name={s?.name ?? '??'} size="sm" tone="rose" />
                    <div>
                      <div className="text-sm font-medium text-ink-900">{s?.name ?? '-'}</div>
                      <div className="text-xs text-ink-500">
                        {a.type === 'ZIEKTE' ? 'Ziek' : 'Verlof'} · {formatDate(a.startDate)}
                        {a.endDate ? ` – ${formatDate(a.endDate)}` : ' – open'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={a.status === 'OPEN' ? 'warning' : 'success'}>
                      {a.status === 'OPEN' ? 'Open' : 'Gesloten'}
                    </Badge>
                    <button className="btn-ghost">
                      <Icon.Bell className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </CardBody>
      </Card>
    </PortalShell>
  );
}
