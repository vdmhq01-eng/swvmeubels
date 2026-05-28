import { PortalShell } from '@/components/portal/PortalShell';
import { NotificationsList } from '@/components/notifications/NotificationsList';
import { currentAdmin } from '@/lib/mock/users';
import { adminNotifications } from '@/lib/mock/notifications';

export default function Page() {
  return (
    <PortalShell
      role="ADMIN"
      activeHref="/admin"
      userName={currentAdmin.name}
      userSubtitle="Admin"
      greeting={{ title: 'Meldingen', subtitle: 'Systeem- en security-meldingen.' }}
    >
      <NotificationsList items={adminNotifications} />
    </PortalShell>
  );
}
