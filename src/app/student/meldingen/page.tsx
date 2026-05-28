import { PortalShell } from '@/components/portal/PortalShell';
import { NotificationsList } from '@/components/notifications/NotificationsList';
import { currentStudent } from '@/lib/mock/users';
import { studentNotifications } from '@/lib/mock/notifications';

export default function Page() {
  return (
    <PortalShell
      role="STUDENT"
      activeHref="/student/berichten"
      userName={currentStudent.name}
      userSubtitle="Student"
      greeting={{ title: 'Meldingen', subtitle: 'Updates en signalen die om aandacht vragen.' }}
    >
      <NotificationsList items={studentNotifications} />
    </PortalShell>
  );
}
