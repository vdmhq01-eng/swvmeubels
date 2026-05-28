import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { Icon } from '@/components/ui/Icon';

export default function NotFound() {
  return (
    <div className="bg-grain min-h-screen">
      <div className="mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center">
        <Logo className="mb-12" />
        <div className="badge-wood mb-4">404</div>
        <h1 className="font-display text-4xl font-semibold text-ink-900">Pagina niet gevonden</h1>
        <p className="mt-3 max-w-md text-ink-600">
          De pagina die je zoekt bestaat niet of is verplaatst. Ga terug naar de startpagina en kies
          een portaal.
        </p>
        <Link href="/" className="btn-primary mt-6">
          <Icon.Home className="h-4 w-4" />
          Terug naar start
        </Link>
      </div>
    </div>
  );
}
