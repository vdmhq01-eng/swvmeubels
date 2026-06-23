import Image from 'next/image';
import Link from 'next/link';
import { MarketingShell } from '@/components/marketing/MarketingShell';
import { Hero, heroImages } from '@/components/marketing/Hero';
import { Icon } from '@/components/ui/Icon';
import { marketingRegions, newsItems } from '@/lib/mock/marketing';
import { formatDateLong } from '@/lib/utils';

export default function HomePage() {
  const topRegions = marketingRegions.slice(0, 6);
  const recentNews = newsItems.slice(0, 3);

  return (
    <MarketingShell activeHref="/">
      <Hero
        eyebrow="Ontdek de voordelen van het"
        title="Samenwerkingsverband"
        highlight="Meubel"
        description="Het Samenwerkingsverband biedt de mogelijkheid om jongeren bij jou in het bedrijf een meubelopleiding te laten volgen via het systeem ‘werkend leren’, de BBL-route (Beroepsbegeleidende Leerweg)."
        image={heroImages.home}
        side={
          <div className="corner-br w-full bg-primary-500 p-8 text-white shadow-card">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/80">Werkend leren</div>
            <h2 className="mt-2 font-display text-2xl font-bold leading-tight">
              BBL-route voor meubelmakers, interieurbouwers en houtbewerkers
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/90">
              Vier dagen in de week bij een lidbedrijf, één dag op school in de eigen regio.
              Begeleid door regionale coördinatoren.
            </p>
          </div>
        }
      >
        <Link href="/solliciteren" className="btn-primary">Solliciteren</Link>
        <Link
          href="/bedrijven"
          className="inline-flex items-center justify-center gap-2 rounded-md border-2 border-white px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-white hover:bg-white hover:text-ink-900 transition"
        >
          Word lidbedrijf
        </Link>
      </Hero>

      {/* Twee blokken Bedrijven / Studenten in navy met diagonal */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="corner-br bg-navy-600 text-white">
          <div className="grid gap-10 p-10 md:grid-cols-2">
            <div>
              <h3 className="font-display text-2xl font-bold">Bedrijven</h3>
              <p className="mt-3 leading-relaxed text-white/85">
                Een Samenwerkingsverband is een groep bedrijven die 4 dagen per week
                BBL-studenten aan het werk hebben binnen het bedrijf. De regionale coördinatoren
                en centrale personeelsadministratie nemen de bedrijven veel werk uit handen.
                Het SWV heeft 10 voordelen die het aantrekkelijk maken voor bedrijven om jongeren op te leiden.
              </p>
              <Link
                href="/bedrijven"
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-md border-2 border-white px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-white hover:bg-white hover:text-navy-700 transition"
              >
                Lees verder
              </Link>
            </div>
            <div>
              <h3 className="font-display text-2xl font-bold">Studenten</h3>
              <p className="mt-3 leading-relaxed text-white/85">
                Studenten kunnen kiezen uit de opleidingen voor meubelmaker, (scheeps-)
                interieurbouwer of machinaal houtbewerker. Vier dagen per week bij een
                lidbedrijf, één dag per week naar school in hun eigen regio.
              </p>
              <Link
                href="/studenten"
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-md border-2 border-white px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-white hover:bg-white hover:text-navy-700 transition"
              >
                Lees verder
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Foto-strook: vakmanschap in beeld */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <ImageTile src="https://images.unsplash.com/photo-1611025437671-ae3acc7e4d34?auto=format&fit=crop&w=900&q=80" alt="Interieurbouwer in werkplaats" />
          <ImageTile src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=900&q=80" alt="Houtbewerking detail" />
          <ImageTile src="https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=900&q=80" alt="Maatwerk meubel" />
          <ImageTile src="https://images.unsplash.com/photo-1568871453524-78fc36476b15?auto=format&fit=crop&w=900&q=80" alt="Vakmanschap" />
        </div>
      </section>

      {/* Regio's */}
      <section className="bg-bone-50 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary-600">
                Acht regio&apos;s in Nederland
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

      {/* Portaal-toegang */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary-600">Online portaal</div>
          <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Direct naar jouw omgeving</h2>
          <p className="mt-2 max-w-2xl text-ink-600">
            Studenten, coördinatoren, lidbedrijven en admins werken in één portaal. Uren,
            documenten, planning en signalen — alles op één plek.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <PortalLink href="/student" title="Student" icon={<Icon.User className="h-5 w-5" />} />
          <PortalLink href="/coordinator" title="Coördinator" icon={<Icon.Users className="h-5 w-5" />} />
          <PortalLink href="/lidbedrijf" title="Lidbedrijf" icon={<Icon.Briefcase className="h-5 w-5" />} />
          <PortalLink href="/admin" title="Admin" icon={<Icon.Shield className="h-5 w-5" />} />
        </div>
      </section>

      {/* Recent nieuws */}
      <section className="bg-bone-50 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary-600">Nieuws &amp; events</div>
              <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Wat speelt er</h2>
            </div>
            <Link href="/nieuws" className="text-sm font-semibold uppercase tracking-wider text-primary-600 hover:text-primary-700">
              Alle berichten →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {recentNews.map((n, i) => (
              <article key={n.slug} className="overflow-hidden rounded-2xl border border-bone-200 bg-white shadow-card">
                <div className="relative aspect-[16/10]">
                  <Image
                    src={newsImages[i % newsImages.length]}
                    alt={n.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <span className="badge-primary">{n.category}</span>
                  <h3 className="mt-3 font-display text-lg font-bold leading-snug">{n.title}</h3>
                  <p className="mt-2 text-sm text-ink-600 line-clamp-2">{n.excerpt}</p>
                  <time className="mt-3 block text-xs text-ink-500">{formatDateLong(n.date)}</time>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="corner-br bg-primary-500 p-10 text-white">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="font-display text-2xl font-bold sm:text-3xl">Klaar om te beginnen?</h2>
              <p className="mt-3 max-w-2xl leading-relaxed text-white/90">
                Solliciteer direct of word lidbedrijf. We helpen je graag verder in jouw regio.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Link href="/solliciteren" className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-primary-600 hover:bg-bone-50 transition">
                Solliciteren
              </Link>
              <Link href="/bedrijven" className="inline-flex items-center justify-center gap-2 rounded-md border-2 border-white px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-white hover:bg-white hover:text-primary-600 transition">
                Word lidbedrijf
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}

const newsImages = [
  'https://images.unsplash.com/photo-1611025437671-ae3acc7e4d34?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1200&q=80',
];

function ImageTile({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative aspect-square overflow-hidden rounded-2xl">
      <Image src={src} alt={alt} fill className="object-cover grayscale transition duration-500 hover:grayscale-0 hover:scale-105" sizes="(max-width: 768px) 50vw, 25vw" />
    </div>
  );
}

function PortalLink({ href, title, icon }: { href: string; title: string; icon: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group flex flex-col items-center gap-3 rounded-2xl border border-bone-200 bg-white p-6 text-center shadow-card transition hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-lg"
    >
      <div className="grid h-12 w-12 place-items-center rounded-md bg-primary-500 text-white">{icon}</div>
      <div className="font-display text-base font-bold text-ink-900">{title}</div>
      <Icon.ArrowRight className="h-4 w-4 text-primary-500 transition group-hover:translate-x-1" />
    </Link>
  );
}
