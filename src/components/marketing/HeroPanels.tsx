import { cn } from '@/lib/utils';

type Panel = {
  src: string;
  alt: string;
};

/**
 * Hero met 4 verticale panels (composite stijl).
 * Gebruik voor homepage als alternatief voor enkele foto.
 */
export function HeroPanels({
  eyebrow,
  title,
  highlight,
  description,
  panels,
  children,
  sticker,
  className,
}: {
  eyebrow?: string;
  title: string;
  highlight?: string;
  description?: string;
  panels: Panel[];
  children?: React.ReactNode;
  sticker?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn('relative overflow-hidden bg-ink-900 text-white', className)}>
      {/* 4-panel grid background */}
      <div className="absolute inset-0 grid grid-cols-4 gap-0">
        {panels.map((p, i) => (
          <div key={i} className="relative overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.src}
              alt={p.alt}
              className="h-full w-full object-cover opacity-60"
              loading="eager"
            />
          </div>
        ))}
      </div>

      {/* Dark overlay voor leesbaarheid */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink-900/30 via-ink-900/65 to-ink-900/95" />

      {/* Subtle accent stripes tussen panels */}
      <div className="absolute inset-0 grid grid-cols-4 pointer-events-none">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="border-r border-white/10" />
        ))}
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-6xl px-6 py-20 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-8">
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
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/90">{description}</p>
            ) : null}
            {children ? <div className="mt-8 flex flex-wrap gap-3">{children}</div> : null}
          </div>
          {sticker ? (
            <div className="hidden justify-end lg:col-span-4 lg:flex">{sticker}</div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

// Default panels die de 4-panel composiet stijl matchen:
// meubelmaker / koppel met materiaal / CAD-tekening / houtstapel
export const defaultHeroPanels: Panel[] = [
  {
    src: 'https://images.unsplash.com/photo-1601054932830-25ed79a4d6ea?auto=format&fit=crop&w=900&q=85',
    alt: 'Meubelmaker aan het werk in werkplaats',
  },
  {
    src: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=900&q=85',
    alt: 'Houtbewerking met handgereedschap',
  },
  {
    src: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=900&q=85',
    alt: 'CAD tekenwerk op monitor',
  },
  {
    src: 'https://images.unsplash.com/photo-1565374395542-0ce18882c857?auto=format&fit=crop&w=900&q=85',
    alt: 'Stapel houten balken',
  },
];
