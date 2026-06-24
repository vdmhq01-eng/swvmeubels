import { cn } from '@/lib/utils';

type HeroImage = {
  src: string;
  alt: string;
};

/**
 * Hero met B&W workshop foto + dark overlay in SWV-stijl.
 * Gebruikt plain <img> ipv next/image om Vercel image-optimization edge-cases te omzeilen.
 */
export function Hero({
  eyebrow,
  title,
  highlight,
  description,
  image,
  children,
  side,
  className,
  sticker,
}: {
  eyebrow?: string;
  title: string;
  highlight?: string;
  description?: string;
  image?: HeroImage;
  children?: React.ReactNode;
  side?: React.ReactNode;
  className?: string;
  sticker?: React.ReactNode;
}) {
  const img = image ?? defaultHeroImages[0];
  return (
    <section className={cn('relative overflow-hidden bg-ink-900 text-white', className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={img.src}
        alt={img.alt}
        className="absolute inset-0 h-full w-full object-cover opacity-40"
        loading="eager"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink-900/55 via-ink-900/70 to-ink-900/95" />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-12 lg:py-28">
        <div className="lg:col-span-7">
          {eyebrow ? (
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary-400" />
              {eyebrow}
            </div>
          ) : null}
          <h1 className="mt-4 font-display text-4xl font-bold leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl">
            {title}
            {highlight ? <span className="block text-primary-400">{highlight}</span> : null}
          </h1>
          {description ? (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85">{description}</p>
          ) : null}
          {children ? <div className="mt-8 flex flex-wrap gap-3">{children}</div> : null}
        </div>
        {side ? <div className="hidden items-center lg:col-span-5 lg:flex">{side}</div> : null}
        {sticker ? (
          <div className="pointer-events-none absolute right-6 top-8 hidden md:block">
            {sticker}
          </div>
        ) : null}
      </div>
    </section>
  );
}

// AI-generated via FAL Flux. Re-genereer via:
// GET /api/admin/generate-hero?key=<SEED>&set=all
export const defaultHeroImages: HeroImage[] = [
  {
    src: 'https://v3b.fal.media/files/b/0a9f9e73/q8xkOyo2O0_oy4LxnKS_j.jpg',
    alt: 'Werkplaats met houten planken en warm licht',
  },
  {
    src: 'https://v3b.fal.media/files/b/0a9f9e73/40Bhjm-QJX095kYreDfsV.jpg',
    alt: 'Apprentice meubelmaker aan het werk',
  },
  {
    src: 'https://v3b.fal.media/files/b/0a9f9e73/WbNjVU0KJbPK-HiZ24CqQ.jpg',
    alt: 'Werkplaats interieur met meester en leerling',
  },
  {
    src: 'https://v3b.fal.media/files/b/0a9f9e73/0O0lU-Hgu0nWha_K0L_km.jpg',
    alt: 'Vriendelijke vakman met materiaalstalen',
  },
];

export const heroImages = {
  home: defaultHeroImages[0],
  bedrijven: defaultHeroImages[2],
  studenten: defaultHeroImages[1],
  solliciteren: defaultHeroImages[3],
  nieuws: defaultHeroImages[0],
  regios: defaultHeroImages[2],
};
