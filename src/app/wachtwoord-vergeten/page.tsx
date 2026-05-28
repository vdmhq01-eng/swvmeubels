import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { Icon } from '@/components/ui/Icon';

export default function WachtwoordVergetenPage() {
  return (
    <div className="bg-grain min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 py-10">
        <Link href="/" className="inline-flex">
          <Logo />
        </Link>

        <div className="card mt-12 p-8">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-wood-50 text-wood-700 ring-1 ring-wood-100">
            <Icon.Lock className="h-5 w-5" />
          </div>
          <h1 className="mt-4 font-display text-2xl font-semibold text-ink-900">Wachtwoord vergeten</h1>
          <p className="mt-1 text-sm text-ink-500">
            Vul je e-mailadres in. We sturen je een link om een nieuw wachtwoord in te stellen.
          </p>

          <form className="mt-6 space-y-4">
            <div>
              <label className="label mb-1.5 block">E-mailadres</label>
              <input type="email" className="input" placeholder="jij@swvmeubel.nl" />
            </div>
            <button type="submit" className="btn-primary w-full">
              <Icon.Bell className="h-4 w-4" />
              Verstuur reset-link
            </button>
          </form>

          <div className="mt-6 rounded-xl border border-bone-200 bg-bone-50 p-3 text-xs text-ink-600">
            We versturen geen melding als het e-mailadres niet bekend is. Zo voorkomen we dat
            iemand kan achterhalen welke accounts bestaan.
          </div>

          <Link href="/login" className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-wood-700 hover:text-wood-800">
            ← Terug naar inloggen
          </Link>
        </div>
      </div>
    </div>
  );
}
