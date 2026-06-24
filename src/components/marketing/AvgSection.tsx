import { Icon } from '@/components/ui/Icon';

type PointStatus = 'LIVE' | 'ROADMAP';

type Point = {
  text: string;
  status: PointStatus;
};

const pillars: Array<{
  icon: React.ReactNode;
  title: string;
  points: Point[];
}> = [
  {
    icon: <Icon.Lock className="h-5 w-5" />,
    title: 'Versleuteling end-to-end',
    points: [
      { text: 'HTTPS/TLS 1.3 op alle verbindingen', status: 'LIVE' },
      { text: 'Database encrypted at rest (Neon)', status: 'LIVE' },
      { text: 'Document encryption AES-256 (Vercel Blob + KMS)', status: 'ROADMAP' },
      { text: 'Wachtwoorden bcrypt cost 12 (na NextAuth)', status: 'ROADMAP' },
    ],
  },
  {
    icon: <Icon.Activity className="h-5 w-5" />,
    title: 'Audit logboek',
    points: [
      { text: 'Audit tabel met alle wijzigingen (wie/wat/wanneer/IP)', status: 'LIVE' },
      { text: 'Audit op write-actions (sollicitaties, weekstaten, export)', status: 'LIVE' },
      { text: 'Inzichtelijk via /admin/audit-logs per gebruiker', status: 'LIVE' },
      { text: 'Onveranderlijke append-only via DB triggers', status: 'ROADMAP' },
    ],
  },
  {
    icon: <Icon.Shield className="h-5 w-5" />,
    title: 'Toegangscontrole (RBAC)',
    points: [
      { text: '4 rollen met strikt gescheiden rechten (lib/security/rbac.ts)', status: 'LIVE' },
      { text: 'Coördinator ziet alleen eigen regio (studentScopeFilter)', status: 'LIVE' },
      { text: 'Lidbedrijf ziet alleen eigen studenten', status: 'LIVE' },
      { text: '2FA verplicht voor admin (TOTP — Google Authenticator)', status: 'ROADMAP' },
    ],
  },
  {
    icon: <Icon.User className="h-5 w-5" />,
    title: 'Rechten betrokkenen',
    points: [
      { text: 'Recht op inzage: 1-klik JSON download via /api/me/export', status: 'LIVE' },
      { text: 'Recht op correctie via profiel of binnendienst', status: 'LIVE' },
      { text: 'Recht op vergetelheid: delete-flow + anonimisering', status: 'ROADMAP' },
      { text: 'Recht op bezwaar: link naar privacy officer', status: 'LIVE' },
    ],
  },
  {
    icon: <Icon.Doc className="h-5 w-5" />,
    title: 'Data minimalisatie',
    points: [
      { text: 'Geen BSN in portaal (alleen in Synergy)', status: 'LIVE' },
      { text: 'Geen medische data — alleen ziek/beter flag', status: 'LIVE' },
      { text: 'Geboortedatum alleen voor cao-loonschalen', status: 'LIVE' },
      { text: 'Geen tracking-cookies, geen analytics', status: 'LIVE' },
    ],
  },
  {
    icon: <Icon.Heart className="h-5 w-5" />,
    title: 'Bewaartermijnen',
    points: [
      { text: 'retentionUntil veld per document', status: 'LIVE' },
      { text: 'Dagelijkse cron verwijdert verlopen data (3:00 nacht)', status: 'LIVE' },
      { text: 'Audit logs auto-verwijderd na 7 jaar', status: 'LIVE' },
      { text: 'Anonimisering inactieve accounts na 2 jaar', status: 'ROADMAP' },
    ],
  },
];

const hosting = [
  { label: 'Database', value: 'Neon Postgres — EU (Frankfurt)' },
  { label: 'Webhosting', value: 'Vercel — EU edge network' },
  { label: 'Email', value: 'Resend — EU region' },
  { label: 'Documenten', value: 'Vercel Blob — EU regio' },
];

const docs = [
  { label: 'Verwerkingsregister (art. 30 AVG)', href: '/avg/verwerkingsregister' },
  { label: 'Privacyverklaring', href: '/privacy' },
  { label: 'Verwerkersovereenkomst (DPA)', href: '/avg/dpa' },
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
              AVG / GDPR by design
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
              SWV verwerkt gegevens van ~400 jongeren, hun ouders, lidbedrijven en scholen. Het
              portaal heeft AVG-vereisten als fundament, niet als bijlage. Hieronder transparant
              wat <strong className="text-emerald-400">live</strong> is en wat nog op de{' '}
              <strong className="text-amber-400">roadmap</strong> staat.
            </p>
          </div>
          <div className="hidden lg:block">
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4 text-center backdrop-blur-sm">
              <div className="font-display text-4xl font-bold text-emerald-400">100%</div>
              <div className="text-xs uppercase tracking-wider text-white/70">in EU gehost</div>
            </div>
          </div>
        </div>

        {/* Legenda */}
        <div className="mb-6 flex flex-wrap gap-3 text-xs">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-emerald-300">
            <span className="grid h-4 w-4 place-items-center rounded-full bg-emerald-500 text-white">
              <Icon.Check className="h-2.5 w-2.5" />
            </span>
            Live in productie
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-amber-300">
            <span className="grid h-4 w-4 place-items-center rounded-full bg-amber-500 text-white">
              <Icon.Refresh className="h-2.5 w-2.5" />
            </span>
            Op roadmap
          </span>
        </div>

        {/* 6 pijlers met live/roadmap badges */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pillars.map((p) => {
            const liveCount = p.points.filter((pt) => pt.status === 'LIVE').length;
            const total = p.points.length;
            return (
              <article key={p.title} className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div className="grid h-10 w-10 place-items-center rounded-md bg-primary-500 text-white">
                    {p.icon}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                    {liveCount}/{total} live
                  </span>
                </div>
                <h3 className="mt-3 font-display text-base font-bold">{p.title}</h3>
                <ul className="mt-3 space-y-1.5">
                  {p.points.map((pt) => (
                    <li key={pt.text} className="flex items-start gap-2 text-xs text-white/85">
                      <span
                        className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full ${
                          pt.status === 'LIVE' ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                      >
                        {pt.status === 'LIVE' ? (
                          <Icon.Check className="h-2.5 w-2.5 text-white" />
                        ) : (
                          <Icon.Refresh className="h-2.5 w-2.5 text-white" />
                        )}
                      </span>
                      <span>{pt.text}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>

        {/* Hosting + AVG docs */}
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-400">Hosting</div>
            <h3 className="mt-2 font-display text-xl font-bold">Alles in de EU</h3>
            <p className="mt-2 text-sm text-white/75">
              Geen data naar de VS, geen Schrems II issues. Alle subprocessors hebben DPA.
            </p>
            <ul className="mt-4 space-y-2">
              {hosting.map((h) => (
                <li
                  key={h.label}
                  className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm"
                >
                  <span className="text-white/70">{h.label}</span>
                  <span className="font-mono text-xs text-white">{h.value}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-400">Documenten</div>
            <h3 className="mt-2 font-display text-xl font-bold">AVG paperwork</h3>
            <p className="mt-2 text-sm text-white/75">Klaar voor audit, DPIA en SBB-controle.</p>
            <ul className="mt-4 space-y-2">
              {docs.map((d) => (
                <a
                  key={d.label}
                  href={d.href}
                  className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm transition hover:border-emerald-400/40 hover:bg-emerald-500/10"
                >
                  <span className="text-white/90">{d.label}</span>
                  <Icon.ArrowRight className="h-4 w-4 text-emerald-400" />
                </a>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-emerald-400/30 bg-emerald-500/10 p-6 text-center md:p-8">
          <p className="font-display text-lg font-bold text-white md:text-xl">
            Eerlijk: wat live is, is écht in code. Roadmap items zijn niet in de gevels gemoet.
          </p>
          <p className="mt-2 text-sm text-white/75">
            Vraag tijdens demo gerust naar de implementatie — we tonen het file path.
          </p>
        </div>
      </div>
    </section>
  );
}
