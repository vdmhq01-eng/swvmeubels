import Link from 'next/link';
import { MarketingShell } from '@/components/marketing/MarketingShell';
import { Hero, heroImages } from '@/components/marketing/Hero';
import { HeroPanels, defaultHeroPanels } from '@/components/marketing/HeroPanels';
import { SalarySticker } from '@/components/marketing/SalarySticker';
import { StatsBar } from '@/components/marketing/StatsBar';
import { StudentStories } from '@/components/marketing/StudentStories';
import { SocialBar } from '@/components/marketing/SocialBar';
import { MobileStickyCTA } from '@/components/marketing/MobileStickyCTA';
import { Icon } from '@/components/ui/Icon';
import { marketingRegions } from '@/lib/mock/marketing';

export default function HomePage() {
  const topRegions = marketingRegions.slice(0, 6);

  return (
    <MarketingShell activeHref="/">
      <HeroPanels
        eyebrow="Volg een opleiding via het SWV"
        title="Uit het juiste hout gesneden?"
        highlight="Word vakman."
        description="Vier dagen per week aan de slag bij een lidbedrijf, één dag naar school. Geen geblader in boeken, wel iets in je handen. En aan het eind van de maand: salaris. Recht door zee."
        panels={defaultHeroPanels}
        sticker={<SalarySticker />}
      >
        <Link href="/solliciteren" className="btn-primary">
          Solliciteer in 2 minuten
          <Icon.ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/studenten"
          className="inline-flex items-center justify-center gap-2 rounded-md border-2 border-white px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-white hover:bg-white hover:text-ink-900 transition"
        >
          Hoe werkt het?
        </Link>
      </HeroPanels>

      <StatsBar />

      {/* Foto-strook met grayscale → kleur op hover */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <ImageTile src="https://v3b.fal.media/files/b/0a9f9efd/0GUS6GJ5g6ZNiQ6biwSdo.jpg" alt="Interieurbouwer in werkplaats" />
          <ImageTile src="https://v3b.fal.media/files/b/0a9f9efd/JdFTOXc_ek8w9jDiWZjQr.jpg" alt="Houtbewerking detail" />
          <ImageTile src="https://v3b.fal.media/files/b/0a9f9efd/CkmUdQ29yp0aGhu2-xP6Q.jpg" alt="Maatwerk meubel" />
          <ImageTile src="https://v3b.fal.media/files/b/0a9f9efd/LPhJ3KW_jzrYslYLv_o_S.jpg" alt="Vakmanschap" />
        </div>
      </section>

      <StudentStories />

      <SocialBar />

      {/* Bedrijven block — kleiner en duidelijk gescheiden van student-content */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="corner-br grid gap-10 bg-navy-600 p-10 text-white md:grid-cols-2">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">Voor bedrijven</div>
            <h3 className="mt-2 font-display text-2xl font-bold">Lidbedrijf worden?</h3>
            <p className="mt-3 leading-relaxed text-white/85">
              Leid jonge vakmensen op zonder gedoe met salarisadministratie of contracten. De
              regionale coördinator regelt alles, jij krijgt 4 dagen per week een gemotiveerde
              student in je werkplaats.
            </p>
            <Link
              href="/bedrijven"
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-md border-2 border-white px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-white hover:bg-white hover:text-navy-700 transition"
            >
              10 voordelen voor jouw bedrijf
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="rounded-xl bg-white/10 p-4">
              <div className="font-display text-3xl font-bold">335+</div>
              <div className="mt-1 text-xs uppercase tracking-wider opacity-80">Lidbedrijven</div>
            </div>
            <div className="rounded-xl bg-white/10 p-4">
              <div className="font-display text-3xl font-bold">8</div>
              <div className="mt-1 text-xs uppercase tracking-wider opacity-80">Regio&apos;s</div>
            </div>
            <div className="rounded-xl bg-white/10 p-4">
              <div className="font-display text-3xl font-bold">9</div>
              <div className="mt-1 text-xs uppercase tracking-wider opacity-80">Coördinatoren</div>
            </div>
            <div className="rounded-xl bg-white/10 p-4">
              <div className="font-display text-3xl font-bold">876</div>
              <div className="mt-1 text-xs uppercase tracking-wider opacity-80">Studenten</div>
            </div>
          </div>
        </div>
      </section>

      {/* Regio's */}
      <section className="bg-bone-50 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary-600">
                Acht regio&apos;s
              </div>
              <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Vind jouw regio</h2>
            </div>
            <Link href="/regios" className="text-sm font-semibold uppercase tracking-wider text-primary-600 hover:text-primary-700">
              Alle regio&apos;s →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {topRegions.map((r) => (
              <Link
                key={r.slug}
                href={`/regios/${r.slug}`}
                className="group flex flex-col gap-3 rounded-2xl border border-bone-200 bg-white p-6 shadow-card transition hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="badge-primary">Regio</span>
                  <Icon.ArrowRight className="h-4 w-4 text-primary-500 transition group-hover:translate-x-1" />
                </div>
                <h3 className="font-display text-lg font-bold">{r.name}</h3>
                <p className="text-sm text-ink-600 line-clamp-2">{r.description}</p>
                <div className="mt-auto text-xs text-ink-500">
                  {r.companyCount} lidbedrijven · {r.studentCount} studenten
                </div>
              </Link>
            ))}
          </div>
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
                Solliciteer in 2 minuten via het formulier. We matchen je aan een lidbedrijf in
                jouw regio en je kunt vaak binnen 2 weken starten.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Link href="/solliciteren" className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-bold uppercase tracking-wide text-primary-600 hover:bg-bone-50 transition">
                Solliciteer nu
                <Icon.ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <MobileStickyCTA />
    </MarketingShell>
  );
}

function ImageTile({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative aspect-square overflow-hidden rounded-2xl bg-bone-100">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="h-full w-full object-cover grayscale transition duration-500 hover:grayscale-0 hover:scale-105" loading="lazy" />
    </div>
  );
}
