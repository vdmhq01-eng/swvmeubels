'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { loginAction } from '@/lib/actions/auth';

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await loginAction(fd);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      router.push(res.redirectTo);
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="label mb-1.5 block">E-mailadres</label>
        <input name="email" type="email" required className="input" placeholder="jij@swvmeubel.nl" />
      </div>
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label className="label">Wachtwoord</label>
          <Link href="/wachtwoord-vergeten" className="text-xs font-semibold text-primary-600 hover:text-primary-700">
            Vergeten?
          </Link>
        </div>
        <input name="password" type="password" required className="input" placeholder="••••••••" />
      </div>
      {error ? (
        <div className="rounded-xl border border-rose-100 bg-rose-50 p-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}
      <button type="submit" disabled={pending} className="btn-primary w-full disabled:opacity-60">
        {pending ? (
          <><Icon.Refresh className="h-4 w-4 animate-spin" /> Bezig…</>
        ) : (
          <><Icon.Lock className="h-4 w-4" /> Inloggen</>
        )}
      </button>
      <p className="text-center text-xs text-ink-500">
        Door in te loggen ga je akkoord met onze{' '}
        <Link href="/privacy" className="font-semibold text-primary-600">privacyverklaring</Link>.
      </p>
    </form>
  );
}
