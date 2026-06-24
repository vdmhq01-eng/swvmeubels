import Link from 'next/link';
import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { getDemoSession } from '@/lib/data/session';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

type CheckStatus = 'OK' | 'OPEN' | 'VERLOPEN';

type Requirement = {
  id: string;
  label: string;
  description: string;
  status: CheckStatus;
  detail?: string;
  dueDate?: string;
};

const requirements: Requirement[] = [
  {
    id: 'sbb',
    label: 'SBB-erkenning leerbedrijf',
    description: 'Erkenning door SBB (Samenwerkingsorganisatie Beroepsonderwijs Bedrijfsleven) voor de juiste opleiding.',
    status: 'OK',
    detail: 'Erkend voor Meubelmaker BBL 2/3 en Interieurbouwer BBL 3.',
  },
  {
    id: 'rie',
    label: 'Geldige RI&E',
    description: 'Risico-Inventarisatie & Evaluatie maximaal 4 jaar oud, getoetst door erkende kerndeskundige.',
    status: 'OPEN',
    dueDate: '2026-09-01',
    detail: 'Laatste RI&E uit 2022 — toetsing voor 1 september 2026 inplannen.',
  },
  {
    id: 'verzekering',
    label: 'Aansprakelijkheids- en bedrijfsongevallenverzekering',
    description: 'WA-verzekering met dekking voor inzet stagiairs en BBL-studenten.',
    status: 'OK',
    detail: 'Polis Centraal Beheer · vervalt 31-12-2026.',
  },
  {
    id: 'praktijkbegeleider',
    label: 'Erkend praktijkopleider in dienst',
    description: 'Minimaal één medewerker met praktijkopleider-certificering en voldoende ervaring.',
    status: 'OK',
    detail: 'Jan de Vries — gecertificeerd 2018 · jaarlijkse verlenging up-to-date.',
  },
  {
    id: 'veiligheid',
    label: 'Werkplekveiligheid',
    description: 'Veilige werkplek conform Arbowet: PBM\'s aanwezig, machineveiligheid, EHBO, ontruimingsplan.',
    status: 'OK',
  },
  {
    id: 'vog',
    label: 'VOG / referenties praktijkopleider',
    description: 'Verklaring Omtrent Gedrag of equivalent voor praktijkopleider niet ouder dan 3 jaar.',
    status: 'VERLOPEN',
    detail: 'VOG verlopen op 12 maart 2026 — nieuwe aanvragen via justis.nl.',
  },
  {
    id: 'cao',
    label: 'Cao Meubelindustrie nageleefd',
    description: 'Naleving cao Meubelindustrie: schooldag doorbetalen, juiste functieschaal, vakantiedagen, periodieken.',
    status: 'OK',
    detail: 'Wordt centraal door SWV verzorgd voor BBL-studenten. Eigen medewerkers vallen onder eigen cao-naleving.',
  },
  {
    id: 'rapportage',
    label: 'Praktijkbeoordeling per periode',
    description: 'Iedere onderwijsperiode (10 weken) een praktijkbeoordeling van de student.',
    status: 'OPEN',
    dueDate: '2026-06-15',
    detail: 'Praktijkbeoordeling Q2 2026 nog niet ingestuurd. Deadline 15 juni 2026.',
  },
];

const statusMeta: Record<CheckStatus, { label: string; variant: 'success' | 'warning' | 'danger'; icon: React.ReactNode }> = {
  OK: { label: 'In orde', variant: 'success', icon: <Icon.Check className="h-4 w-4" /> },
  OPEN: { label: 'Open actie', variant: 'warning', icon: <Icon.AlertTriangle className="h-4 w-4" /> },
  VERLOPEN: { label: 'Verlopen', variant: 'danger', icon: <Icon.X className="h-4 w-4" /> },
};

export default async function VoorwaardenPage() {
  const ctx = getDemoSession('COMPANY');
  const contact = await db.companyContact
    .findFirst({
      where: { companyId: ctx.companyId! },
      include: { user: true, company: true },
    })
    .catch(() => null);

  const ok = requirements.filter((r) => r.status === 'OK').length;
  const open = requirements.filter((r) => r.status === 'OPEN').length;
  const verlopen = requirements.filter((r) => r.status === 'VERLOPEN').length;
  const score = Math.round((ok / requirements.length) * 100);

  return (
    <PortalShell
      role="COMPANY"
      activeHref="/lidbedrijf/voorwaarden"
      userName={contact?.user.name ?? 'Lidbedrijf'}
      userSubtitle={contact?.company.name ?? 'Lidbedrijf'}
      greeting={{ title: 'Voorwaarden lidbedrijf', subtitle: 'Compliance-check: wat moet je hebben als erkend leerbedrijf.' }}
    >
      {/* Score */}
      <Card>
        <CardBody>
          <div className="grid items-center gap-6 md:grid-cols-[auto_1fr_auto]">
            <div className="grid h-24 w-24 place-items-center rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100">
              <div className="text-center">
                <div className="font-display text-3xl font-bold text-primary-700">{score}%</div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-primary-600">compliant</div>
              </div>
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-ink-900">
                Lidbedrijf voorwaarden
              </h2>
              <p className="mt-1 text-sm text-ink-600">
                {ok} in orde · {open} open · {verlopen} verlopen
              </p>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-bone-100">
                <div className="h-full rounded-full bg-primary-500" style={{ width: `${score}%` }} />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="btn-secondary">
                <Icon.Refresh className="h-4 w-4" />
                Herbeoordeling aanvragen
              </button>
              <Link href="/lidbedrijf/documenten" className="btn-primary">
                <Icon.Doc className="h-4 w-4" />
                Documenten uploaden
              </Link>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat tone="emerald" label="In orde" value={`${ok}`} icon={<Icon.Check className="h-5 w-5" />} />
        <Stat tone="amber" label="Open" value={`${open}`} icon={<Icon.AlertTriangle className="h-5 w-5" />} />
        <Stat tone="rose" label="Verlopen" value={`${verlopen}`} icon={<Icon.X className="h-5 w-5" />} />
        <Stat tone="navy" label="Totaal" value={`${requirements.length}`} icon={<Icon.Doc className="h-5 w-5" />} />
      </div>

      {/* Requirements list */}
      <Card className="mt-6">
        <CardHeader title="Checklist" subtitle="Vereisten om als lidbedrijf BBL-studenten op te leiden" />
        <CardBody>
          <ul className="divide-y divide-bone-100">
            {requirements.map((r) => {
              const meta = statusMeta[r.status];
              return (
                <li key={r.id} className="py-5 first:pt-0 last:pb-0">
                  <div className="flex items-start gap-4">
                    <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-md ring-1 ${
                      r.status === 'OK' ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' :
                      r.status === 'OPEN' ? 'bg-amber-50 text-amber-700 ring-amber-200' :
                      'bg-rose-50 text-rose-700 ring-rose-200'
                    }`}>
                      {meta.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-display text-base font-bold text-ink-900">{r.label}</h3>
                        <Badge variant={meta.variant}>{meta.label}</Badge>
                        {r.dueDate ? (
                          <span className="text-xs text-ink-500">Deadline: {r.dueDate}</span>
                        ) : null}
                      </div>
                      <p className="mt-1 text-sm text-ink-600">{r.description}</p>
                      {r.detail ? (
                        <p className="mt-2 rounded-md bg-bone-50 p-2 text-xs text-ink-700">{r.detail}</p>
                      ) : null}
                    </div>
                    <button className="btn-ghost shrink-0">
                      <Icon.Doc className="h-4 w-4" />
                      Document
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </CardBody>
      </Card>

      {/* Hulp */}
      <Card className="mt-6">
        <CardHeader title="Hulp bij voorwaarden" subtitle="Veelgestelde vragen" />
        <CardBody>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FaqItem
              q="Hoe vraag ik SBB-erkenning aan?"
              a="Via s-bb.nl. Procedure duurt ~6 weken. Onze coördinator kan je helpen met de aanvraag en de juiste opleiding selecteren."
            />
            <FaqItem
              q="Wanneer moet ik mijn RI&E vernieuwen?"
              a="Elke 4 jaar, of bij grote wijzigingen in je werkplek/processen. Toets via een gecertificeerde kerndeskundige."
            />
            <FaqItem
              q="Wat als een student onveilig werkt?"
              a="Direct stoppen, situatie evalueren en de coördinator informeren. SWV staat bij arbeidsongevallen direct paraat."
            />
            <FaqItem
              q="Wat dekt mijn verzekering?"
              a="Standaard WA dekt schade door eigen medewerkers en BBL-studenten. Check je polis op specifieke uitsluitingen."
            />
          </div>
        </CardBody>
      </Card>
    </PortalShell>
  );
}

function Stat({ tone, label, value, icon }: { tone: 'emerald' | 'amber' | 'rose' | 'navy'; label: string; value: string; icon: React.ReactNode }) {
  const cls = {
    emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    amber: 'bg-amber-50 text-amber-700 ring-amber-100',
    rose: 'bg-rose-50 text-rose-700 ring-rose-100',
    navy: 'bg-navy-50 text-navy-700 ring-navy-100',
  }[tone];
  return (
    <div className="card-padded">
      <div className={`grid h-10 w-10 place-items-center rounded-md ring-1 ${cls}`}>{icon}</div>
      <div className="mt-3 font-display text-2xl font-bold text-ink-900">{value}</div>
      <div className="text-xs font-semibold uppercase tracking-wider text-ink-500">{label}</div>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <div className="rounded-xl border border-bone-200 bg-bone-50 p-4">
      <div className="font-display text-sm font-bold text-ink-900">{q}</div>
      <p className="mt-1 text-sm text-ink-700">{a}</p>
    </div>
  );
}
