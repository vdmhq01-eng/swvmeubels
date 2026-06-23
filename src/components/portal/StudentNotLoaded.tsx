import { PortalShell } from './PortalShell';
import { EmptyState } from '@/components/ui/EmptyState';
import { Icon } from '@/components/ui/Icon';

/**
 * Fallback UI voor student-pagina's wanneer de DB geen student
 * kan vinden (geen verbinding, niet geseed, of student bestaat niet).
 * Toont nette message ipv blanco pagina.
 */
export function StudentNotLoaded({ activeHref }: { activeHref: string }) {
  return (
    <PortalShell role="STUDENT" activeHref={activeHref} userName="Student" userSubtitle="Student">
      <EmptyState
        icon={<Icon.User className="h-5 w-5" />}
        title="Studentprofiel niet gevonden"
        description="We konden je gegevens niet ophalen. Probeer het opnieuw of neem contact op met je coördinator."
      />
    </PortalShell>
  );
}
