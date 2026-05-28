import { PortalShell } from '@/components/portal/PortalShell';
import { SettingsPage } from '@/components/settings/SettingsPage';
import { currentCoordinator } from '@/lib/mock/users';

export default function Page() {
  return (
    <PortalShell
      role="COORDINATOR"
      activeHref="/coordinator/instellingen"
      userName={currentCoordinator.name}
      userSubtitle="Coördinator regio Noord"
      greeting={{ title: 'Instellingen', subtitle: 'Beheer je profiel, beveiliging en meldingen.' }}
    >
      <SettingsPage userName={currentCoordinator.name} userEmail={currentCoordinator.email} role="COORDINATOR" />
    </PortalShell>
  );
}
