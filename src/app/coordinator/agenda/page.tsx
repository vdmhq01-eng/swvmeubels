import { PortalShell } from '@/components/portal/PortalShell';
import { MonthAgenda } from '@/components/agenda/MonthAgenda';
import { getDemoSession } from '@/lib/data/session';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function CoordinatorAgendaPage() {
  const ctx = getDemoSession('COORDINATOR');
  const coordinator = await db.coordinator
    .findUnique({
      where: { id: ctx.coordinatorId! },
      include: { user: true, region: true },
    })
    .catch(() => null);

  const regionName = coordinator?.region.name;

  return (
    <PortalShell
      role="COORDINATOR"
      activeHref="/coordinator/agenda"
      userName={coordinator?.user.name ?? 'Coördinator'}
      userSubtitle={`Coördinator regio ${regionName ?? ''}`}
      greeting={{
        title: 'Mijn agenda',
        subtitle: `Algemene events + regio-specifiek (${regionName ?? 'jouw regio'}): bouwvak, opendagen, diploma's.`,
      }}
    >
      <MonthAgenda filterRegio={regionName} />
    </PortalShell>
  );
}
