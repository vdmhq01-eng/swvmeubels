import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { Icon } from '@/components/ui/Icon';

const portals = [
  {
    title: 'Student',
    href: '/student',
    description: 'Uren invullen, planning, vakantiedagen, taken en documenten.',
    points: ['Weekstaat invullen', 'Vakantiesaldo en verzuim', 'Diploma en planning'],
  },
  {
    title: 'Coördinator',
    href: '/coordinator',
    description: 'Studenten in jouw regio, signalen, goedkeuringen en planning.',
    points: ['Risicosignalen per student', 'Aflopende contracten', 'Diploma kandidaten'],
  },
  {
    title: 'Lidbedrijf',
    href: '/lidbedrijf',
    description: 'Eigen studenten, weekstaten goedkeuren en verzuim.',
    points: ['Weekstaten ter goedkeuring', 'Studenten actief', 'Verzuim en planning'],
  },
  {
    title: 'Admin',
    href: '/admin',
    description: 'Integraties, sync logs, gebruikersbeheer en audit trail.',
    points: ['Exact Synergy + Cleverdesk', 'Sync- en auditlogs', 'Security signalen'],
  },
];

export default function HomePage() {
  return (
    <div className="bg-grain min-h-screen">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-10 lg:py-16">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <Logo />
          <div className="flex items-center gap-2">
            <span className="badge-neutral">Demo omgeving</span>
            <Link href="/help" className="btn-ghost">Help</Link>
            <Link href="/login" className="btn-primary">
              <Icon.Lock className="h-4 w-4" />
              Inloggen
            </Link>
          </div>
        </header>

        <section className="max-w-3xl">
          <div className="badge-wood mb-4">SWV Meubel portaal</div>
          <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight text-ink-900 sm:text-5xl">
            Een rustig, modern platform voor het meubelvakmanschap.
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-600">
            Onderwijs, begeleiding en urenregistratie voor studenten, coördinatoren en lidbedrijven.
            Verbonden met Exact Synergy en Cleverdesk, AVG-proof en gebouwd voor de praktijk van alledag.
          </p>
        </section>

        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {portals.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="group card-padded flex flex-col gap-4 transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <span className="badge-wood">{p.title}</span>
                <Icon.ArrowRight className="h-4 w-4 text-wood-500 transition group-hover:translate-x-1" />
              </div>
              <h3 className="font-display text-xl font-semibold text-ink-900">{p.title} portaal</h3>
              <p className="text-sm text-ink-600">{p.description}</p>
              <ul className="mt-auto flex flex-col gap-1.5 text-xs text-ink-500">
                {p.points.map((pt) => (
                  <li key={pt} className="flex items-start gap-2">
                    <Icon.Check className="mt-0.5 h-3.5 w-3.5 text-wood-500" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </Link>
          ))}
        </section>

        <section className="card-padded grid grid-cols-1 gap-6 md:grid-cols-3">
          <Capability icon={<Icon.Shield className="h-5 w-5" />} title="AVG-proof">
            Documenten versleuteld, signed URLs, bewaartermijnen automatisch bewaakt en uitgebreide auditlog.
          </Capability>
          <Capability icon={<Icon.Link className="h-5 w-5" />} title="Verbonden">
            Exact Synergy als bron voor studenten, contracten en lidbedrijven. Cleverdesk voor urenregistratie.
          </Capability>
          <Capability icon={<Icon.Activity className="h-5 w-5" />} title="Praktijkgericht">
            Weekstaten, signalen, planning en taken die direct laten zien wat aandacht nodig heeft.
          </Capability>
        </section>

        <footer className="flex flex-wrap items-center justify-between gap-4 text-xs text-ink-500">
          <div>© {new Date().getFullYear()} SWV Meubel · Demo build voor productconcept</div>
          <div className="flex items-center gap-3">
            <Link href="/privacy" className="hover:text-wood-700">Privacy</Link>
            <span>·</span>
            <Link href="/help" className="hover:text-wood-700">Help</Link>
            <span>·</span>
            <Link href="/login" className="hover:text-wood-700">Inloggen</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}

function Capability({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-wood-50 text-wood-700 ring-1 ring-wood-100">
        {icon}
      </div>
      <div>
        <div className="font-display text-base font-semibold text-ink-900">{title}</div>
        <p className="mt-1 text-sm text-ink-600">{children}</p>
      </div>
    </div>
  );
}
