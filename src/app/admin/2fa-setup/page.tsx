'use client';

import { useState, useTransition, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { setup2faAction, confirm2faAction } from '@/lib/actions/auth';

export default function TwoFactorSetupPage() {
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const res = await setup2faAction();
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setQrUrl(res.qrDataUrl);
      setSecret(res.secret);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onConfirm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await confirm2faAction(fd);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setDone(true);
    });
  }

  if (done) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-700">
          <Icon.Check className="h-8 w-8" />
        </div>
        <h1 className="mt-4 font-display text-2xl font-bold">2FA geactiveerd</h1>
        <p className="mt-2 text-sm text-ink-600">
          Vanaf nu vraagt SWV bij elke login om je 6-cijferige code.
        </p>
        <Link href="/admin" className="btn-primary mt-6 inline-flex">
          Naar admin dashboard <Icon.ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl py-10">
      <div className="mb-6">
        <Link href="/admin" className="btn-ghost">← Terug</Link>
      </div>
      <div className="rounded-2xl border border-bone-200 bg-white p-8 shadow-card">
        <div className="grid h-12 w-12 place-items-center rounded-md bg-primary-500 text-white">
          <Icon.Shield className="h-6 w-6" />
        </div>
        <h1 className="mt-4 font-display text-2xl font-bold">Tweestaps-verificatie instellen</h1>
        <p className="mt-2 text-sm text-ink-600">
          Verplicht voor admin-accounts. Scan onderstaande QR-code met je authenticator-app
          (Google Authenticator, Authy of 1Password) en voer de gegenereerde code in.
        </p>

        {error ? (
          <div className="mt-4 rounded-xl border border-rose-100 bg-rose-50 p-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-ink-500">
              Stap 1: scan QR
            </div>
            <div className="mt-3 grid place-items-center rounded-2xl border-2 border-bone-200 bg-white p-4">
              {qrUrl ? (
                <Image src={qrUrl} alt="QR code 2FA" width={240} height={240} unoptimized />
              ) : (
                <div className="grid h-60 w-60 place-items-center text-ink-400">
                  <Icon.Refresh className="h-8 w-8 animate-spin" />
                </div>
              )}
            </div>
            {secret ? (
              <div className="mt-3 rounded-xl border border-bone-200 bg-bone-50 p-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-ink-500">
                  Of voer handmatig in
                </div>
                <code className="mt-1 block break-all font-mono text-xs text-ink-700">{secret}</code>
              </div>
            ) : null}
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-ink-500">
              Stap 2: bevestig met code
            </div>
            <form onSubmit={onConfirm} className="mt-3 space-y-3">
              <input
                name="code"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                required
                className="input text-center font-mono text-2xl tracking-[0.5em]"
                placeholder="000000"
              />
              <button type="submit" disabled={pending || !qrUrl} className="btn-primary w-full disabled:opacity-50">
                {pending ? <Icon.Refresh className="h-4 w-4 animate-spin" /> : <Icon.Check className="h-4 w-4" />}
                Activeer 2FA
              </button>
            </form>
            <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
              <Icon.AlertTriangle className="mr-1 inline h-3.5 w-3.5" />
              Bewaar je back-up codes. Verlies je je telefoon, dan heb je deze nodig om weer in te loggen.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
