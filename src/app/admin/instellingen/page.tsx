import { PortalShell } from '@/components/portal/PortalShell';
import { SettingsPage } from '@/components/settings/SettingsPage';
import { currentAdmin } from '@/lib/mock/users';

export default function Page() {
  return (
    <PortalShell
      role="ADMIN"
      activeHref="/admin/instellingen"
      userName={currentAdmin.name}
      userSubtitle="Admin"
      greeting={{ title: 'Instellingen', subtitle: 'Beheer je profiel, beveiliging en meldingen.' }}
    >
      <SettingsPage userName={currentAdmin.name} userEmail={currentAdmin.email} role="ADMIN" twoFactorEnabled={currentAdmin.twoFactorEnabled} />
    </PortalShell>
  );
}
