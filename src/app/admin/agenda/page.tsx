import { PortalShell } from '@/components/portal/PortalShell';
import { MonthAgenda } from '@/components/agenda/MonthAgenda';
import { currentAdmin } from '@/lib/mock/users';

export const dynamic = 'force-dynamic';

export default function AdminAgendaPage() {
  return (
    <PortalShell
      role="ADMIN"
      activeHref="/admin/agenda"
      userName={currentAdmin.name}
      userSubtitle="Binnendienst"
      greeting={{
        title: 'Agenda',
        subtitle: 'Algeheel overzicht: feestdagen, salaris, facturatie, trainingen, vakanties, bouwvak per regio.',
      }}
    >
      <MonthAgenda />
    </PortalShell>
  );
}
