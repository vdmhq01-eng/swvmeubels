import { PortalShell } from '@/components/portal/PortalShell';
import { SettingsPage } from '@/components/settings/SettingsPage';
import { currentStudent } from '@/lib/mock/users';

export default function Page() {
  return (
    <PortalShell
      role="STUDENT"
      activeHref="/student/instellingen"
      userName={currentStudent.name}
      userSubtitle="Student"
      greeting={{ title: 'Instellingen', subtitle: 'Beheer je profiel, beveiliging en meldingen.' }}
    >
      <SettingsPage userName={currentStudent.name} userEmail={currentStudent.email} role="STUDENT" />
    </PortalShell>
  );
}
