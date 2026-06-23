import { studentStories } from '@/lib/mock/marketing';

export function StudentStories() {
  return (
    <section className="bg-bone-50 py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary-600">
            Echte verhalen
          </div>
          <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
            Drie van onze studenten
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {studentStories.map((s) => (
            <article
              key={s.name}
              className="group overflow-hidden rounded-3xl bg-white shadow-card transition hover:-translate-y-1"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-bone-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.photo}
                  alt={`${s.name}, ${s.program}`}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-900/85 via-ink-900/40 to-transparent p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-display text-lg font-bold text-white">
                        {s.name}, {s.age}
                      </div>
                      <div className="text-xs uppercase tracking-wider text-white/80">
                        {s.city} · {s.year}
                      </div>
                    </div>
                    {s.socials?.tiktok ? (
                      <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ink-900">
                        TikTok
                      </span>
                    ) : s.socials?.instagram ? (
                      <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ink-900">
                        Instagram
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="font-display text-base leading-snug text-ink-900">
                  &ldquo;{s.quote}&rdquo;
                </p>
                <div className="mt-4 text-xs font-semibold uppercase tracking-wider text-primary-600">
                  {s.program}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
