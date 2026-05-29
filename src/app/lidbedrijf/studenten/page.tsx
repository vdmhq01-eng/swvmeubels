import Link from 'next/link';
import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Toolbar, FilterChip } from '@/components/ui/Toolbar';
import { Icon } from '@/components/ui/Icon';
import { getDemoSession } from '@/lib/data/session';
import { listStudentsForCompany } from '@/lib/data/students';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function LidbedrijfStudentenPage() {
  const ctx = getDemoSession('COMPANY');
  const [students, contact] = await Promise.all([
    listStudentsForCompany(ctx.companyId!),
    db.companyContact.findFirst({ where: { companyId: ctx.companyId! }, include: { user: true, company: true } }),
  ]);
  return (
    <PortalShell
      role="COMPANY"
      activeHref="/lidbedrijf/studenten"
      userName={contact?.user.name ?? 'Lidbedrijf'}
      userSubtitle={contact?.company.name ?? 'Lidbedrijf'}
      greeting={{ title: 'Mijn studenten', subtitle: 'Studenten die bij ons in de leer zijn.' }}
    >
      <Card>
        <CardBody>
          <Toolbar placeholder="Zoek student…">
            <FilterChip label="Alle" active />
            <FilterChip label="Aandacht" />
            <FilterChip label="Risico" />
          </Toolbar>
        </CardBody>
      </Card>

      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
        {students.map((s) => (
          <Card key={s.id}>
            <CardBody>
              <div className="flex items-start gap-3">
                <Avatar name={s.user.name} tone="wood" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-display text-lg font-semibold text-ink-900">{s.user.name}</div>
                    <Badge variant={s.signal === 'Goed' ? 'success' : s.signal === 'Aandacht' ? 'warning' : 'danger'}>
                      {s.signal}
                    </Badge>
                  </div>
                  <div className="text-sm text-ink-500">{s.program.name} {s.program.level.replace('BBL_', 'BBL ')} · jaar {s.yearOfStudy}</div>
                  <div className="mt-3 flex justify-end">
                    <Link href="/lidbedrijf/uren" className="btn-ghost">
                      Bekijk uren <Icon.ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </PortalShell>
  );
}
