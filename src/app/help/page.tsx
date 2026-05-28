import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { Icon } from '@/components/ui/Icon';

const topics = [
  { icon: <Icon.Clock className="h-5 w-5" />, title: 'Urenregistratie', desc: 'Hoe vul je een weekstaat in en wanneer dien je in?' },
  { icon: <Icon.Heart className="h-5 w-5" />, title: 'Ziekmelden', desc: 'Stappen om je ziek te melden bij leerbedrijf en SWV.' },
  { icon: <Icon.Doc className="h-5 w-5" />, title: 'Documenten', desc: 'Wat moet je uploaden en waar staan je documenten?' },
  { icon: <Icon.Palm className="h-5 w-5" />, title: 'Vakantiedagen', desc: 'Saldo, aanvragen en tegoed berekenen.' },
  { icon: <Icon.BookOpen className="h-5 w-5" />, title: 'Opleiding & diploma', desc: 'Voortgang, examens en diplomering.' },
  { icon: <Icon.Shield className="h-5 w-5" />, title: 'Beveiliging', desc: 'Inloggen, 2FA en accountherstel.' },
];

export default function HelpPage() {
  return (
    <div className="bg-grain min-h-screen">
      <div className="mx-auto max-w-5xl px-6 py-10 lg:py-16">
        <div className="mb-10 flex items-center justify-between">
          <Link href="/"><Logo /></Link>
          <Link href="/" className="btn-ghost">Terug</Link>
        </div>

        <div className="badge-wood mb-3">Help</div>
        <h1 className="font-display text-4xl font-semibold text-ink-900">Hoe kunnen we helpen?</h1>
        <p className="mt-3 max-w-xl text-ink-600">
          Doorzoek de helpcentrum-onderwerpen of neem contact op met je coördinator. We helpen
          studenten, lidbedrijven en coördinatoren graag verder.
        </p>

        <div className="relative mt-8 max-w-xl">
          <Icon.Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input className="input pl-9" placeholder="Bijvoorbeeld: weekstaat indienen" />
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {topics.map((t) => (
            <div key={t.title} className="card-padded">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-wood-50 text-wood-700 ring-1 ring-wood-100">
                {t.icon}
              </div>
              <h3 className="mt-3 font-display text-base font-semibold text-ink-900">{t.title}</h3>
              <p className="mt-1 text-sm text-ink-600">{t.desc}</p>
            </div>
          ))}
        </div>

        <div className="card-padded mt-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="font-display text-lg font-semibold text-ink-900">Heb je nog hulp nodig?</div>
            <p className="mt-1 text-sm text-ink-600">
              Bel ons op werkdagen tussen 09:00 en 17:00 of mail naar{' '}
              <a href="mailto:hulp@swvmeubel.nl" className="font-medium text-wood-700">hulp@swvmeubel.nl</a>.
            </p>
          </div>
          <Link href="/login" className="btn-primary">
            <Icon.Lock className="h-4 w-4" /> Inloggen
          </Link>
        </div>
      </div>
    </div>
  );
}
