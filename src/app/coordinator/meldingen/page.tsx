import { PortalShell } from '@/components/portal/PortalShell';
import { NotificationsList } from '@/components/notifications/NotificationsList';
import { currentCoordinator } from '@/lib/mock/users';
import { coordinatorNotifications } from '@/lib/mock/notifications';

export default function Page() {
  return (
    <PortalShell
      role="COORDINATOR"
      activeHref="/coordinator"
      userName={currentCoordinator.name}
      userSubtitle="Coördinator regio Noord"
      greeting={{ title: 'Meldingen', subtitle: 'Updates en signalen voor jouw regio.' }}
    >
      <NotificationsList items={coordinatorNotifications} />
    </PortalShell>
  );
}
