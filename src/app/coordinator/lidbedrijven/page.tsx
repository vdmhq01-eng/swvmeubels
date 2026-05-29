import Link from 'next/link';
import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Toolbar, FilterChip } from '@/components/ui/Toolbar';
import { Icon } from '@/components/ui/Icon';
import { getDemoSession } from '@/lib/data/session';
import { listCompanies } from '@/lib/data/companies';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function CoordinatorLidbedrijvenPage() {
  const ctx = getDemoSession('COORDINATOR');
  const [companies, coordinator] = await Promise.all([
    listCompanies(ctx.regionId),
    db.coordinator.findUnique({ where: { id: ctx.coordinatorId! }, include: { user: true, region: true } }),
  ]);

  return (
    <PortalShell
      role="COORDINATOR"
      activeHref="/coordinator/lidbedrijven"
      userName={coordinator?.user.name ?? 'Coördinator'}
      userSubtitle={`Coördinator regio ${coordinator?.region.name ?? ''}`}
      greeting={{ title: 'Lidbedrijven', subtitle: `CBM-lidbedrijven in regio ${coordinator?.region.name ?? ''}.` }}
    >
      <Card>
        <CardBody>
          <Toolbar placeholder="Zoek lidbedrijf…">
            <FilterChip label="Alle" active />
            <FilterChip label="CBM" />
          </Toolbar>
        </CardBody>
      </Card>

      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {companies.map((c) => {
          const contact = c.contacts[0];
          return (
            <Card key={c.id}>
              <CardBody>
                <div className="flex items-start justify-between gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-wood-50 text-wood-700 ring-1 ring-wood-100">
                    <Icon.Briefcase className="h-5 w-5" />
                  </div>
                  <Badge variant="wood">{c._count.students} studenten</Badge>
                </div>
                <h3 className="mt-3 font-display text-lg font-semibold text-ink-900">{c.name}</h3>
                <div className="mt-1 text-xs text-ink-500">Regio {c.region.name} · {c.membership}-lid</div>
                {contact ? (
                  <div className="mt-4 space-y-1 text-sm text-ink-700">
                    <div>{contact.user.name}</div>
                    <div className="text-xs text-ink-500">{contact.user.email}</div>
                  </div>
                ) : null}
                <Link href={`/coordinator/lidbedrijven/${c.id}`} className="btn-secondary mt-4 w-full">
                  Naar bedrijf <Icon.ArrowRight className="h-4 w-4" />
                </Link>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </PortalShell>
  );
}
