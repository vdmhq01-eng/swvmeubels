'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { Icon } from '@/components/ui/Icon';
import { verify2faAction } from '@/lib/actions/auth';

export default function TwoFactorPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await verify2faAction(fd);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      router.push(res.redirectTo);
      router.refresh();
    });
  }

  return (
    <div className="min-h-screen bg-bone-50">
      <div className="mx-auto grid min-h-screen max-w-md place-items-center px-6 py-10">
        <div className="w-full">
          <div className="mb-8 text-center">
            <Link href="/" className="inline-flex"><Logo /></Link>
          </div>
          <div className="rounded-2xl border border-bone-200 bg-white p-8 shadow-card">
            <div className="grid h-12 w-12 place-items-center rounded-md bg-primary-500 text-white">
              <Icon.Shield className="h-6 w-6" />
            </div>
            <h1 className="mt-4 font-display text-2xl font-bold text-ink-900">Tweestaps-verificatie</h1>
            <p className="mt-2 text-sm text-ink-600">
              Open je authenticator-app (Google Authenticator, Authy, 1Password) en vul de 6-cijferige code in.
            </p>
            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div>
                <label className="label mb-1.5 block">Verificatiecode</label>
                <input
                  name="code"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  required
                  autoFocus
                  className="input text-center font-mono text-2xl tracking-[0.5em]"
                  placeholder="000000"
                />
              </div>
              {error ? (
                <div className="rounded-xl border border-rose-100 bg-rose-50 p-3 text-sm text-rose-700">
                  {error}
                </div>
              ) : null}
              <button type="submit" disabled={pending} className="btn-primary w-full disabled:opacity-60">
                {pending ? <Icon.Refresh className="h-4 w-4 animate-spin" /> : <Icon.Check className="h-4 w-4" />}
                Verifiëren
              </button>
            </form>
            <div className="mt-4 text-center">
              <Link href="/login" className="text-xs font-semibold text-ink-500 hover:text-primary-600">
                ← Terug naar inloggen
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
