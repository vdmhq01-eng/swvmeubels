import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { Icon } from '@/components/ui/Icon';

const navLinks = [
  { href: '/bedrijven', label: 'Bedrijven' },
  { href: '/studenten', label: 'Studenten' },
  { href: '/solliciteren', label: 'Solliciteren' },
  { href: '/nieuws', label: 'Nieuws & events' },
  { href: '/regios', label: "Regio's" },
];

export function MarketingShell({
  children,
  activeHref,
}: {
  children: React.ReactNode;
  activeHref?: string;
}) {
  return (
    <div className="min-h-screen bg-white">
      <div className="sticky-contact hidden lg:flex">
        <strong>Meer weten?</strong>
        <a href="tel:0235158830"><Icon.Bell className="h-4 w-4" /> Bel ons</a>
        <a href="mailto:samenwerkingsverband@cbm.nl"><Icon.Doc className="h-4 w-4" /> Mail ons</a>
      </div>

      <header className="border-b border-bone-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <Link href="/" className="block">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-semibold uppercase tracking-wide text-ink-700 lg:flex">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={l.href === activeHref ? 'text-primary-600' : 'hover:text-primary-600'}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <Link href="/login" className="btn-primary">
            <Icon.Lock className="h-4 w-4" /> Inloggen
          </Link>
        </div>
      </header>

      <main>{children}</main>

      <footer className="bg-ink-900 py-12 text-white/85">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 md:grid-cols-4">
          <div>
            <Logo variant="dark" />
            <p className="mt-4 text-sm leading-relaxed">
              Koninklijke CBM, branchevereniging voor interieurbouw en meubelindustrie,
              investeert in opleiden, eigen kwaliteit en vakmanschap.
            </p>
          </div>
          <div>
            <p className="text-sm leading-relaxed">
              Volg via het SWV een opleiding tot meubelmaker, interieurbouwer of houtbewerker.
            </p>
            <Link href="/solliciteren" className="btn-blue mt-4">
              Solliciteren
            </Link>
          </div>
          <div>
            <p className="text-sm leading-relaxed">
              In de SWV-nieuwsbrief voor bedrijven vind je alles over het opleiden van jonge
              vakmensen.
            </p>
            <a
              href="https://nl.surveymonkey.com/r/KPDTKDQ"
              target="_blank"
              rel="noopener"
              className="btn-primary mt-4"
            >
              Inschrijven
            </a>
          </div>
          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white">
              Contact
            </h4>
            <address className="mt-4 not-italic text-sm leading-relaxed">
              Westerhoutpark 10<br />
              2012 JM Haarlem<br />
              T <a href="tel:0235158830" className="hover:text-primary-400">023 515 88 30</a><br />
              <a href="mailto:samenwerkingsverband@cbm.nl" className="hover:text-primary-400">
                samenwerkingsverband@cbm.nl
              </a>
            </address>
            <h4 className="mt-6 font-display text-sm font-bold uppercase tracking-wider text-white">
              Volg ons
            </h4>
            <div className="mt-3 flex gap-3">
              <a href="https://www.instagram.com/swvmeubel" target="_blank" rel="noopener" aria-label="Instagram" className="grid h-9 w-9 place-items-center rounded-full bg-white/10 hover:bg-primary-500 transition">
                <Icon.Activity className="h-4 w-4" />
              </a>
              <a href="https://nl.linkedin.com/company/samenwerkingsverband-swvmeubel" target="_blank" rel="noopener" aria-label="LinkedIn" className="grid h-9 w-9 place-items-center rounded-full bg-white/10 hover:bg-primary-500 transition">
                <Icon.Link className="h-4 w-4" />
              </a>
              <a href="https://www.tiktok.com/@swvmeubel" target="_blank" rel="noopener" aria-label="TikTok" className="grid h-9 w-9 place-items-center rounded-full bg-white/10 hover:bg-primary-500 transition">
                <Icon.BookOpen className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-6xl border-t border-white/10 px-6 pt-6 text-xs text-white/50">
          © {new Date().getFullYear()} CBM, Haarlem
        </div>
      </footer>
    </div>
  );
}
