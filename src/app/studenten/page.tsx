import Link from 'next/link';
import { MarketingShell } from '@/components/marketing/MarketingShell';
import { Hero, heroImages } from '@/components/marketing/Hero';
import { SalarySticker } from '@/components/marketing/SalarySticker';
import { StatsBar } from '@/components/marketing/StatsBar';
import { StudentStories } from '@/components/marketing/StudentStories';
import { SocialBar } from '@/components/marketing/SocialBar';
import { MobileStickyCTA } from '@/components/marketing/MobileStickyCTA';
import { Icon } from '@/components/ui/Icon';

const opleidingen = [
  {
    title: 'Meubelmaker / Interieurbouwer',
    niveau: 'BBL 2 / 3',
    duur: '24 – 36 maanden',
    beschrijving:
      'Bouw maatwerk meubels en interieurs voor woningen, kantoren en zelfs schepen. Van eerste schets tot laatste laklaag.',
    voor: 'Voor wie graag met hout en maatwerk werkt.',
  },
  {
    title: 'Machinaal houtbewerker',
    niveau: 'BBL 2',
    duur: '24 maanden',
    beschrijving:
      'Werk met geavanceerde machines voor seriewerk. Precisie, veiligheid en CNC-techniek.',
    voor: 'Voor wie van techniek en machines houdt.',
  },
];

const week = [
  { day: 'Ma', label: 'Werkdag', tone: 'work' },
  { day: 'Di', label: 'Werkdag', tone: 'work' },
  { day: 'Wo', label: 'School', tone: 'school' },
  { day: 'Do', label: 'Werkdag', tone: 'work' },
  { day: 'Vr', label: 'Werkdag', tone: 'work' },
];

const faq = [
  {
    q: 'Hoeveel verdien ik echt?',
    a: 'Vanaf €600 in het eerste jaar (16-17 jaar). Loop je in de twintig? Dan kan het oplopen tot €1.500+ per maand. Volgens cao Meubelindustrie, geen losse spaanders.',
  },
  {
    q: 'Wat als het bedrijf niet bij me past?',
    a: 'Geen drama. Je kunt wisselen van leerbedrijf zonder gedoe. Wij regelen het via de coördinator.',
  },
  {
    q: 'Moet ik mijn eigen gereedschap kopen?',
    a: 'Nee. Gereedschap, werkkleding en zelfs het examengeld — wij betalen het. Jij komt en leert.',
  },
  {
    q: 'Wat als ik ziek ben?',
    a: 'Gewoon doorbetaling van salaris volgens de cao. Geen risico voor jou of je leerbedrijf.',
  },
  {
    q: 'Krijg ik echt een diploma?',
    a: 'Ja. Een erkend mbo-diploma (niveau 2 of 3) waarmee je overal in NL aan de slag kunt.',
  },
  {
    q: 'Hoe meld ik me aan?',
    a: 'Vul het formulier in. Op basis van je postcode matchen we je aan een coördinator. Binnen 3 werkdagen contact, vaak binnen 2 weken aan het werk.',
  },
];

export default function StudentenPage() {
  return (
    <MarketingShell activeHref="/studenten">
      <Hero
        eyebrow="Voor studenten"
        title="Geen geblader in boeken."
        highlight="Wel iets in je handen."
        description="Werk vier dagen in de week bij een meubelmaker of interieurbouwer. Eén dag school. Salaris vanaf maand één. Aan het eind een diploma waar je een vak mee kunt uitoefenen — voor de rest van je leven."
        image={heroImages.studenten}
        sticker={<SalarySticker />}
      >
        <Link href="/solliciteren" className="btn-primary">
          Solliciteer in 2 minuten
          <Icon.ArrowRight className="h-4 w-4" />
        </Link>
        <a
          href="https://www.tiktok.com/@swvmeubel"
          target="_blank"
          rel="noopener"
          className="inline-flex items-center justify-center gap-2 rounded-md border-2 border-white px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-white hover:bg-white hover:text-ink-900 transition"
        >
          Volg ons op TikTok
        </a>
      </Hero>

      <StatsBar />

      {/* Salaris sectie met de wordplay */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary-600">
              Wat verdien je
            </div>
            <h2 className="mt-2 font-display text-3xl font-bold leading-tight sm:text-4xl">
              Bij ons hoef je niet op een{' '}
              <span className="relative inline-block">
                houtje te bijten
                <span className="absolute inset-x-0 -bottom-1 h-1.5 bg-primary-300/70" />
              </span>
              .
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-700">
              Je krijgt direct salaris volgens de cao Meubelindustrie. Van de eerste dag dat je
              begint. Geen stagevergoeding, geen sigarettengeld — echt salaris op je rekening.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-3 text-center">
              <SalaryBox leeftijd="16 jaar" bedrag="€615" />
              <SalaryBox leeftijd="18 jaar" bedrag="€940" />
              <SalaryBox leeftijd="21+ jaar" bedrag="€1.580" />
            </div>
            <p className="mt-3 text-xs text-ink-500">
              Indicatief, bij 32 uur per week volgens cao Meubelindustrie 2026.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <StickerBox tone="primary" label="Eigen contract" />
            <StickerBox tone="navy" label="25 vakantiedagen" />
            <StickerBox tone="primary" label="Geen schoolboeken" />
            <StickerBox tone="navy" label="Salaris cao Meubel" />
          </div>
        </div>
      </section>

      <section className="bg-bone-50 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-10">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary-600">Opleidingen</div>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
              Uit het juiste hout gesneden?
            </h2>
            <p className="mt-2 max-w-2xl text-ink-600">
              Kies waar je hart ligt. Allebei erkende mbo-opleidingen waarmee je overal aan de bak komt.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {opleidingen.map((o) => (
              <article key={o.title} className="card-padded">
                <div className="flex items-start justify-between gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-md bg-primary-500 text-white">
                    <Icon.BookOpen className="h-5 w-5" />
                  </div>
                  <span className="badge-primary">{o.niveau}</span>
                </div>
                <h3 className="mt-4 font-display text-xl font-bold">{o.title}</h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-ink-500">{o.duur}</p>
                <p className="mt-3 text-sm leading-relaxed text-ink-700">{o.beschrijving}</p>
                <p className="mt-3 text-xs italic text-primary-700">{o.voor}</p>
                <Link href="/solliciteren" className="btn-outline-primary mt-5 inline-flex">
                  Solliciteer
                  <Icon.ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <StudentStories />

      {/* Hoe een week eruit ziet */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary-600">Hoe werkt het</div>
          <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
            Een week als BBL-student
          </h2>
          <p className="mt-2 max-w-2xl text-ink-600">
            Geen rare uren, geen ploegendienst. Maandag tot vrijdag, normale werktijden.
            Recht door zee.
          </p>
        </div>
        <div className="grid grid-cols-5 gap-3">
          {week.map((d) => (
            <div
              key={d.day}
              className={`rounded-2xl border p-6 text-center ${
                d.tone === 'school'
                  ? 'border-navy-200 bg-navy-50 text-navy-700'
                  : 'border-primary-200 bg-primary-50 text-primary-700'
              }`}
            >
              <div className="font-display text-2xl font-bold">{d.day}</div>
              <div className="mt-2 text-xs font-semibold uppercase tracking-wider">{d.label}</div>
            </div>
          ))}
        </div>
      </section>

      <SocialBar />

      {/* FAQ — speels */}
      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-10">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary-600">Vragen?</div>
          <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Geen losse spaanders</h2>
          <p className="mt-2 text-ink-600">De vragen die we het meeste krijgen — direct beantwoord.</p>
        </div>
        <div className="space-y-3">
          {faq.map((item) => (
            <details key={item.q} className="group rounded-2xl border border-bone-200 bg-white p-5 shadow-card">
              <summary className="flex cursor-pointer items-center justify-between gap-3 font-display text-base font-bold text-ink-900">
                {item.q}
                <Icon.Plus className="h-4 w-4 transition group-open:rotate-45 text-primary-500" />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-ink-700">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Big CTA */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="corner-br bg-primary-500 p-10 text-white">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="font-display text-3xl font-bold sm:text-4xl">
                Klaar om te beginnen?
              </h2>
              <p className="mt-3 max-w-2xl leading-relaxed text-white/90">
                Stop met twijfelen. Solliciteer en je hoort binnen 3 dagen iets terug van een
                coördinator in jouw regio.
              </p>
            </div>
            <Link href="/solliciteren" className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-bold uppercase tracking-wide text-primary-600 hover:bg-bone-50 transition">
              Solliciteer nu
              <Icon.ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <MobileStickyCTA />
    </MarketingShell>
  );
}

function SalaryBox({ leeftijd, bedrag }: { leeftijd: string; bedrag: string }) {
  return (
    <div className="rounded-2xl border border-bone-200 bg-white p-4 text-center">
      <div className="text-[10px] font-bold uppercase tracking-wider text-ink-500">{leeftijd}</div>
      <div className="mt-1 font-display text-2xl font-bold text-primary-600">{bedrag}</div>
      <div className="text-[10px] text-ink-500">per maand</div>
    </div>
  );
}

function StickerBox({ tone, label }: { tone: 'primary' | 'navy'; label: string }) {
  const cls = tone === 'primary' ? 'bg-primary-500 text-white' : 'bg-navy-600 text-white';
  const rotate = tone === 'primary' ? 'rotate-[-2deg]' : 'rotate-[2deg]';
  return (
    <div className={`flex aspect-square items-center justify-center rounded-3xl p-6 text-center font-display text-lg font-bold leading-tight shadow-lg ${cls} ${rotate}`}>
      {label}
    </div>
  );
}
