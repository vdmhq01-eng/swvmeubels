import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { Icon } from '@/components/ui/Icon';

const demoAccounts = [
  { role: 'STUDENT', label: 'Student', email: 'jamie.vandijk@swvmeubel.nl', href: '/student', tone: 'wood' },
  { role: 'COORDINATOR', label: 'Coördinator', email: 'sanne.bakker@swvmeubel.nl', href: '/coordinator', tone: 'green' },
  { role: 'COMPANY', label: 'Lidbedrijf', email: 'jan@devriesinterieurbouw.nl', href: '/lidbedrijf', tone: 'amber' },
  { role: 'ADMIN', label: 'Admin', email: 'eva.hoogeveen@swvmeubel.nl', href: '/admin', tone: 'rose' },
] as const;

const toneClass = {
  wood: 'bg-wood-50 text-wood-700 ring-wood-100',
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  amber: 'bg-amber-50 text-amber-700 ring-amber-100',
  rose: 'bg-rose-50 text-rose-700 ring-rose-100',
};

export default function LoginPage() {
  return (
    <div className="bg-grain min-h-screen">
      <div className="mx-auto grid min-h-screen max-w-6xl grid-cols-1 gap-10 px-6 py-10 lg:grid-cols-2 lg:items-center">
        <div className="hidden lg:block">
          <Link href="/" className="inline-flex">
            <Logo />
          </Link>
          <h1 className="mt-12 font-display text-4xl font-semibold leading-tight tracking-tight text-ink-900">
            Welkom terug.
          </h1>
          <p className="mt-3 max-w-md text-lg leading-relaxed text-ink-600">
            Log in op je SWV Meubel portaal. Een rustige, professionele plek voor uren,
            begeleiding en documenten.
          </p>

          <div className="mt-12 grid grid-cols-2 gap-4">
            <Capability icon={<Icon.Shield className="h-4 w-4" />} label="2FA voor admins" />
            <Capability icon={<Icon.Lock className="h-4 w-4" />} label="HTTPS only" />
            <Capability icon={<Icon.Activity className="h-4 w-4" />} label="Audit logging" />
            <Capability icon={<Icon.Doc className="h-4 w-4" />} label="AVG-proof opslag" />
          </div>
        </div>

        <div className="flex justify-center">
          <div className="card w-full max-w-md p-8">
            <div className="mb-8 flex items-center justify-between lg:hidden">
              <Link href="/"><Logo /></Link>
            </div>

            <h2 className="font-display text-2xl font-semibold text-ink-900">Inloggen</h2>
            <p className="mt-1 text-sm text-ink-500">Gebruik je SWV-account.</p>

            <form className="mt-6 space-y-4">
              <div>
                <label className="label mb-1.5 block">E-mailadres</label>
                <input type="email" className="input" placeholder="jij@swvmeubel.nl" />
              </div>
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="label">Wachtwoord</label>
                  <Link href="/wachtwoord-vergeten" className="text-xs font-medium text-wood-700 hover:text-wood-800">
                    Vergeten?
                  </Link>
                </div>
                <input type="password" className="input" placeholder="••••••••" />
              </div>
              <label className="flex items-center gap-2 text-xs text-ink-600">
                <input type="checkbox" className="h-4 w-4 rounded border-bone-300" />
                <span>30 dagen ingelogd blijven op dit apparaat</span>
              </label>
              <button type="submit" className="btn-primary w-full">
                <Icon.Lock className="h-4 w-4" />
                Inloggen
              </button>
            </form>

            <div className="my-6 flex items-center gap-3 text-xs text-ink-400">
              <div className="h-px flex-1 bg-bone-200" />
              <span>of probeer een demo-account</span>
              <div className="h-px flex-1 bg-bone-200" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              {demoAccounts.map((d) => (
                <Link
                  key={d.role}
                  href={d.href}
                  className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium ring-1 transition hover:shadow-soft ${toneClass[d.tone]}`}
                >
                  <span>{d.label}</span>
                  <Icon.ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </Link>
              ))}
            </div>

            <p className="mt-6 text-center text-xs text-ink-500">
              Door in te loggen ga je akkoord met onze{' '}
              <Link href="/privacy" className="font-medium text-wood-700 hover:text-wood-800">privacyverklaring</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Capability({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-ink-700">
      <span className="grid h-7 w-7 place-items-center rounded-lg bg-white text-wood-700 ring-1 ring-bone-200">
        {icon}
      </span>
      {label}
    </div>
  );
}
