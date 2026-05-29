import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { currentAdmin } from '@/lib/mock/users';
import { listRegions, listCoordinators } from '@/lib/data/admin';

export const dynamic = 'force-dynamic';

export default async function AdminRegiosPage() {
  const [regions, coords] = await Promise.all([listRegions(), listCoordinators()]);
  return (
    <PortalShell
      role="ADMIN"
      activeHref="/admin/regios"
      userName={currentAdmin.name}
      userSubtitle="Admin"
      greeting={{ title: 'Regiobeheer', subtitle: `${regions.length} regio's` }}
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {regions.map((r) => {
          const coord = r.coordinators[0];
          return (
            <Card key={r.id}>
              <CardBody>
                <div className="flex items-start justify-between gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-wood-50 text-wood-700 ring-1 ring-wood-100">
                    <Icon.Activity className="h-4 w-4" />
                  </div>
                  <Badge variant="wood">{r.code}</Badge>
                </div>
                <h3 className="mt-3 font-display text-lg font-semibold text-ink-900">Regio {r.name}</h3>
                <div className="mt-1 text-xs text-ink-500">{coord ? `Coördinator ${coord.user.name}` : 'Geen coördinator'}</div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl border border-bone-200 bg-bone-50 px-3 py-2">
                    <div className="text-[11px] uppercase tracking-wider text-ink-500">Studenten</div>
                    <div className="text-base font-semibold text-ink-900">{r._count.students}</div>
                  </div>
                  <div className="rounded-xl border border-bone-200 bg-bone-50 px-3 py-2">
                    <div className="text-[11px] uppercase tracking-wider text-ink-500">Lidbedrijven</div>
                    <div className="text-base font-semibold text-ink-900">{r._count.companies}</div>
                  </div>
                </div>
                <button className="btn-secondary mt-4 w-full">Beheren</button>
              </CardBody>
            </Card>
          );
        })}
      </div>

      <Card className="mt-6">
        <CardHeader title="Coördinatoren" />
        <CardBody>
          <ul className="divide-y divide-bone-100">
            {coords.map((c) => (
              <li key={c.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div>
                  <div className="text-sm font-medium text-ink-900">{c.user.name}</div>
                  <div className="text-xs text-ink-500">{c.user.email} · {c._count.students} studenten</div>
                </div>
                <Badge variant="wood">{c.region.name}</Badge>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>
    </PortalShell>
  );
}
