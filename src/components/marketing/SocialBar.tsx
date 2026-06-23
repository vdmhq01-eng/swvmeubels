import { socialPosts } from '@/lib/mock/marketing';

export function SocialBar() {
  return (
    <section className="bg-ink-900 py-16 text-white">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary-400">
              Volg @swvmeubel
            </div>
            <h2 className="mt-2 font-display text-3xl font-bold leading-tight sm:text-4xl">
              Jouw TikTok is{' '}
              <span className="relative inline-block">
                je hamer
                <span className="absolute inset-x-0 -bottom-1 h-1.5 bg-primary-400/70" />
              </span>
              .
            </h2>
            <p className="mt-2 max-w-md text-sm text-white/70">
              Zien wat we maken? Kijk mee op TikTok en Insta.
            </p>
          </div>
          <div className="flex gap-2">
            <a
              href="https://www.tiktok.com/@swvmeubel"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-ink-900 hover:bg-bone-50"
            >
              TikTok
            </a>
            <a
              href="https://www.instagram.com/swvmeubel"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 rounded-full bg-primary-500 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-primary-600"
            >
              Instagram
            </a>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {socialPosts.map((p, i) => (
            <a
              key={i}
              href={p.platform === 'tiktok' ? 'https://www.tiktok.com/@swvmeubel' : 'https://www.instagram.com/swvmeubel'}
              target="_blank"
              rel="noopener"
              className="group relative block aspect-[9/12] overflow-hidden rounded-2xl bg-ink-800"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.thumb}
                alt={p.caption}
                className="h-full w-full object-cover opacity-80 transition duration-500 group-hover:opacity-100 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/30 to-transparent" />
              <div className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ink-900">
                {p.platform}
              </div>
              <div className="absolute inset-x-0 bottom-0 p-3">
                <div className="text-sm font-bold leading-tight text-white">{p.caption}</div>
                <div className="mt-1 text-[11px] text-white/70">♥ {p.likes}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
