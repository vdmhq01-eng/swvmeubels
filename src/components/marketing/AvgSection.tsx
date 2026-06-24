import { Icon } from '@/components/ui/Icon';

const pillars = [
  {
    icon: <Icon.Lock className="h-5 w-5" />,
    title: 'Versleuteling end-to-end',
    points: [
      'Alle verbindingen via HTTPS/TLS 1.3',
      'Documenten encrypted at rest (AES-256)',
      'Wachtwoorden gehashed met bcrypt (cost 12)',
      'Database encrypted at rest (Neon)',
    ],
  },
  {
    icon: <Icon.Activity className="h-5 w-5" />,
    title: 'Volledig audit logboek',
    points: [
      'Iedere wijziging gelogd (wie, wat, wanneer, IP)',
      '7 jaar bewaartermijn voor compliance',
      'Onveranderlijke append-only log',
      'Inzichtelijk per gebruiker via /admin/audit-logs',
    ],
  },
  {
    icon: <Icon.Shield className="h-5 w-5" />,
    title: 'Toegangscontrole (RBAC)',
    points: [
      '4 rollen met strikt gescheiden rechten',
      'Coördinator ziet alleen eigen regio',
      'Lidbedrijf ziet alleen eigen studenten',
      '2FA verplicht voor admin (in productie)',
    ],
  },
  {
    icon: <Icon.User className="h-5 w-5" />,
    title: 'Rechten van betrokkenen',
    points: [
      'Recht op inzage: data-export in 1 klik',
      'Recht op correctie: via portaal of binnendienst',
      'Recht op vergetelheid: bewaartermijn + delete-flow',
      'Recht op bezwaar: link naar privacy officer',
    ],
  },
  {
    icon: <Icon.Doc className="h-5 w-5" />,
    title: 'Data minimalisatie',
    points: [
      'Alleen velden die nodig zijn voor het doel',
      'BSN niet zichtbaar in portaal (alleen Synergy)',
      'Medische ziektegegevens NIET opgeslagen',
      'Geboortedatum alleen voor cao-loonschalen',
    ],
  },
  {
    icon: <Icon.Heart className="h-5 w-5" />,
    title: 'Bewaartermijnen',
    points: [
      'Contracten: 7 jaar (wettelijk fiscaal)',
      'Identificatie: 5 jaar na uitdienst',
      'Beoordelingen: 7 jaar',
      'Inactieve accounts: auto-anonimisering na 2 jaar',
    ],
  },
];

const hosting = [
  { label: 'Database', value: 'Neon Postgres — EU (Frankfurt)' },
  { label: 'Webhosting', value: 'Vercel — EU edge network' },
  { label: 'Email', value: 'Resend — EU region' },
  { label: 'Documenten', value: 'Vercel Blob — EU regio' },
];

export function AvgSection() {
  return (
    <section className="bg-ink-900 py-16 text-white md:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider">
              <span className="grid h-4 w-4 place-items-center rounded-full bg-emerald-500">
                <Icon.Check className="h-2.5 w-2.5" />
              </span>
              AVG / GDPR compliant
            </div>
            <h2 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl">
              Privacy is{' '}
              <span className="relative inline-block">
                <span className="relative z-10">geen bijzaak</span>
                <span className="absolute inset-x-0 -bottom-1 h-1.5 bg-primary-500/80" />
              </span>
              .
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/85 md:text-lg">
              Jullie verwerken gegevens van ~400 jongeren, hun ouders, lidbedrijven en scholen.
              Wij hebben de AVG-vereisten al ingebouwd — niet als bijlage, maar als fundament.
            </p>
          </div>
          <div className="hidden lg:block">
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4 text-center backdrop-blur-sm">
              <div className="font-display text-4xl font-bold text-emerald-400">100%</div>
              <div className="text-xs uppercase tracking-wider text-white/70">in EU gehost</div>
            </div>
          </div>
        </div>

        {/* 6 pijlers */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pillars.map((p) => (
            <article key={p.title} className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
              <div className="grid h-10 w-10 place-items-center rounded-md bg-primary-500 text-white">
                {p.icon}
              </div>
              <h3 className="mt-3 font-display text-base font-bold">{p.title}</h3>
              <ul className="mt-3 space-y-1.5">
                {p.points.map((pt) => (
                  <li key={pt} className="flex items-start gap-2 text-xs text-white/85">
                    <Icon.Check className="mt-0.5 h-3 w-3 shrink-0 text-emerald-400" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        {/* Hosting + subprocessors */}
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-400">
              Waar staat de data
            </div>
            <h3 className="mt-2 font-display text-xl font-bold">Alles in de EU</h3>
            <p className="mt-2 text-sm text-white/75">
              Geen data naar de VS, geen Schrems II issues. Alle subprocessors hebben DPA.
            </p>
            <ul className="mt-4 space-y-2">
              {hosting.map((h) => (
                <li key={h.label} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm">
                  <span className="text-white/70">{h.label}</span>
                  <span className="font-mono text-xs text-white">{h.value}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-400">
              Operationeel
            </div>
            <h3 className="mt-2 font-display text-xl font-bold">Klaar voor DPIA &amp; audit</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <Pl text="Verwerkersovereenkomst (DPA) beschikbaar met SWV" />
              <Pl text="Verwerkingsregister volgens art. 30 AVG bijgehouden" />
              <Pl text="DPIA (Data Protection Impact Assessment) template aanwezig" />
              <Pl text="Privacy officer contact via samenwerkingsverband@cbm.nl" />
              <Pl text="Incident response: 72u meldplicht aan AP automatisch ondersteund" />
              <Pl text="Cookies: alleen functioneel, geen tracking" />
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 rounded-3xl border border-emerald-400/30 bg-emerald-500/10 p-6 text-center md:p-8">
          <p className="font-display text-lg font-bold text-white md:text-xl">
            &lsquo;Privacy by design&rsquo; is geen marketing-zin — het is hoe dit portaal is gebouwd.
          </p>
          <p className="mt-2 text-sm text-white/75">
            Vragen over een specifieke AVG-vereiste? We gaan er per punt op in.
          </p>
        </div>
      </div>
    </section>
  );
}

function Pl({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2">
      <Icon.Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
      <span className="text-white/90">{text}</span>
    </li>
  );
}
