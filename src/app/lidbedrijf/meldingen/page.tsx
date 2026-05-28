import { PortalShell } from '@/components/portal/PortalShell';
import { NotificationsList } from '@/components/notifications/NotificationsList';
import { currentCompany } from '@/lib/mock/users';
import { companyNotifications } from '@/lib/mock/notifications';

export default function Page() {
  return (
    <PortalShell
      role="COMPANY"
      activeHref="/lidbedrijf"
      userName={currentCompany.name}
      userSubtitle="Lidbedrijf"
      greeting={{ title: 'Meldingen', subtitle: 'Updates en signalen voor jouw bedrijf.' }}
    >
      <NotificationsList items={companyNotifications} />
    </PortalShell>
  );
}
