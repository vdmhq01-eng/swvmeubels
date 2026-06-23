'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { Logo } from '@/components/ui/Logo';
import { Icon } from '@/components/ui/Icon';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Page error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-bone-50">
      <div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-24 text-center">
        <Logo className="mb-12" />
        <div className="badge-primary mb-4">Er ging iets mis</div>
        <h1 className="font-display text-3xl font-bold text-ink-900 sm:text-4xl">
          Deze pagina kon niet worden geladen
        </h1>
        <p className="mt-3 max-w-md text-ink-600">
          Probeer het opnieuw, of ga terug naar de startpagina. Heb je deze melding vaker?
          Neem contact met ons op.
        </p>
        {error.digest ? (
          <p className="mt-2 text-xs text-ink-400">Foutcode: {error.digest}</p>
        ) : null}
        <div className="mt-6 flex flex-wrap gap-3">
          <button onClick={reset} className="btn-primary">
            <Icon.Refresh className="h-4 w-4" /> Opnieuw proberen
          </button>
          <Link href="/" className="btn-secondary">
            <Icon.Home className="h-4 w-4" /> Naar startpagina
          </Link>
        </div>
      </div>
    </div>
  );
}
