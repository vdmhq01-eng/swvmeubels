import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { Icon } from '@/components/ui/Icon';

export default function PrivacyPage() {
  return (
    <div className="bg-grain min-h-screen">
      <div className="mx-auto max-w-3xl px-6 py-10 lg:py-16">
        <div className="mb-10 flex items-center justify-between">
          <Link href="/"><Logo /></Link>
          <Link href="/" className="btn-ghost"><Icon.ArrowRight className="h-4 w-4 rotate-180" /> Terug</Link>
        </div>

        <article className="card-padded space-y-6">
          <div>
            <div className="badge-wood mb-3">Privacyverklaring</div>
            <h1 className="font-display text-3xl font-semibold text-ink-900">Hoe SWV Meubel met jouw gegevens omgaat</h1>
            <p className="mt-2 text-sm text-ink-500">Laatst bijgewerkt op 1 mei 2024</p>
          </div>

          <Section title="1. Welke gegevens we verwerken">
            We verwerken alleen de gegevens die nodig zijn voor je opleiding, je arbeidscontract en
            wettelijke verplichtingen. Denk aan naam, contactgegevens, opleidingsgegevens,
            urenregistratie, contractgegevens en documenten.
          </Section>

          <Section title="2. Wie ziet wat (rolgebaseerd)">
            <ul className="mt-2 list-disc pl-5 text-ink-700">
              <li>Studenten zien alleen hun eigen gegevens.</li>
              <li>Lidbedrijven zien alleen de studenten die bij hen in opleiding zijn.</li>
              <li>Coördinatoren zien alleen studenten en bedrijven in hun eigen regio.</li>
              <li>Admins zien alles; al hun acties worden geaudit en niet-verwijderbaar gelogd.</li>
            </ul>
          </Section>

          <Section title="3. Documenten en bewaartermijnen">
            Documenten worden versleuteld opgeslagen (AES-256). Downloads gaan altijd via een
            tijdelijke signed URL met een levensduur van maximaal vijf minuten. Bewaartermijnen
            verschillen per categorie en worden automatisch bewaakt:
            <ul className="mt-2 list-disc pl-5 text-ink-700">
              <li>Contract — 7 jaar (fiscale bewaarplicht)</li>
              <li>Legitimatie — 3 jaar</li>
              <li>Beoordelingen — 7 jaar</li>
              <li>BPV — 5 jaar</li>
              <li>Overig — 2 jaar</li>
            </ul>
          </Section>

          <Section title="4. Jouw rechten">
            Je hebt te allen tijde recht op inzage, correctie en — waar wettelijk mogelijk —
            verwijdering. Dien een verzoek in via je instellingen of neem contact op met onze
            privacy officer.
          </Section>

          <Section title="5. Bronsystemen">
            Stamgegevens komen uit Exact Synergy, urenregistratie uit Cleverdesk. SWV Meubel zelf
            slaat alleen een lokale spiegel op voor performance en autorisatie. Wijzigingen die je
            doet worden via beveiligde API's teruggesynchroniseerd.
          </Section>

          <Section title="6. Beveiliging">
            HTTPS only, secure HttpOnly cookies, CSRF-bescherming, rate limiting, input validatie
            via Zod, Content Security Policy, sessietime-out na 30 minuten inactiviteit en
            verplichte 2FA voor admins. Audit- en security-logs zijn append-only.
          </Section>

          <Section title="7. Contact privacy officer">
            Vragen of klachten over privacy? E-mail naar{' '}
            <a href="mailto:privacy@swvmeubel.nl" className="font-medium text-wood-700 hover:text-wood-800">privacy@swvmeubel.nl</a>.
            We reageren binnen vijf werkdagen.
          </Section>
        </article>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-xl font-semibold text-ink-900">{title}</h2>
      <div className="mt-2 text-sm leading-relaxed text-ink-700">{children}</div>
    </section>
  );
}
