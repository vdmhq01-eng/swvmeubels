import { PortalShell } from '@/components/portal/PortalShell';
import { SettingsPage } from '@/components/settings/SettingsPage';
import { currentCompany } from '@/lib/mock/users';

export default function Page() {
  return (
    <PortalShell
      role="COMPANY"
      activeHref="/lidbedrijf/instellingen"
      userName={currentCompany.name}
      userSubtitle="Lidbedrijf"
      greeting={{ title: 'Instellingen', subtitle: 'Beheer je profiel, beveiliging en meldingen.' }}
    >
      <SettingsPage userName={currentCompany.name} userEmail={currentCompany.email} role="COMPANY" />
    </PortalShell>
  );
}
