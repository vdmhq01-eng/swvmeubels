import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { Icon } from '@/components/ui/Icon';

export default function DpaPage() {
  return (
    <div className="min-h-screen bg-bone-50">
      <header className="border-b border-bone-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/"><Logo /></Link>
          <Link href="/" className="btn-ghost"><Icon.ArrowRight className="h-4 w-4 rotate-180" /> Terug</Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10 lg:py-14">
        <div className="mb-8">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary-600">AVG art. 28</div>
          <h1 className="mt-2 font-display text-3xl font-bold text-ink-900 sm:text-4xl">Verwerkersovereenkomst (DPA)</h1>
          <p className="mt-3 max-w-3xl text-ink-700">
            Tussen <strong>SWV Meubel</strong> (verwerkingsverantwoordelijke) en de leverancier van
            dit portaal (verwerker). Conform art. 28 AVG.
          </p>
        </div>

        <div className="space-y-6 rounded-2xl border border-bone-200 bg-white p-8 shadow-card">
          <Sect title="1. Onderwerp en duur">
            <p>De verwerker verwerkt persoonsgegevens namens SWV ten behoeve van het portaal voor
            studenten, coördinatoren, lidbedrijven en binnendienst. Duur: zolang de overeenkomst
            tussen partijen loopt + 30 dagen overdrachtsperiode.</p>
          </Sect>

          <Sect title="2. Aard en doel van de verwerking">
            <p>Hosting van portaalsoftware, opslag van studentdossiers, urenregistratie,
            documentbeheer, e-mail- en pushnotificaties, sync met Exact Synergy/Globe en Cleverdesk.
            Geen verwerking voor eigen doeleinden van de verwerker.</p>
          </Sect>

          <Sect title="3. Categorieën gegevens en betrokkenen">
            <ul className="list-disc pl-5">
              <li>Studenten: NAW, e-mail, telefoon, geboortedatum, opleidingsniveau, contract, uren, ziekteverzuim (datum/status, geen diagnose), vakantiegegevens</li>
              <li>Coördinatoren en binnendienst: NAW, e-mail, rol, regio</li>
              <li>Lidbedrijven: bedrijfsnaam, KvK, contactpersoon, status</li>
              <li>Sollicitanten: NAW, e-mail, telefoon, postcode, motivatie</li>
            </ul>
          </Sect>

          <Sect title="4. Beveiligingsmaatregelen">
            <ul className="list-disc pl-5">
              <li>TLS 1.3 voor alle verbindingen</li>
              <li>Encryption at rest (database + documenten)</li>
              <li>RBAC met scope-isolatie per regio/bedrijf</li>
              <li>Audit log met onveranderlijke append-only structuur</li>
              <li>2FA voor admin-accounts</li>
              <li>Wekelijkse security scan + dependency updates</li>
              <li>Backup en disaster recovery (RPO 24u, RTO 4u)</li>
            </ul>
          </Sect>

          <Sect title="5. Sub-verwerkers (subprocessors)">
            <p>Verwerker mag de volgende subprocessors inschakelen, allen met eigen DPA:</p>
            <ul className="list-disc pl-5">
              <li><strong>Neon</strong> — database hosting (EU Frankfurt)</li>
              <li><strong>Vercel</strong> — webhosting + CDN (EU edge)</li>
              <li><strong>Resend</strong> — e-mail (EU region)</li>
              <li><strong>Exact</strong> — Synergy/Globe API integratie (NL)</li>
              <li><strong>Cleverdesk</strong> — urenregistratie integratie (NL)</li>
              <li><strong>DocuSign</strong> — contract ondertekening (EU)</li>
            </ul>
            <p className="mt-2 text-sm text-ink-600">Wijzigingen worden minimaal 30 dagen vooraf gecommuniceerd. SWV heeft recht op bezwaar.</p>
          </Sect>

          <Sect title="6. Doorgifte buiten de EU">
            <p>Alle subprocessors hosten data binnen de EU. Geen doorgifte naar derde landen.
            Indien dit in de toekomst nodig is: alleen met Standard Contractual Clauses van de
            Europese Commissie + aanvullende technische maatregelen.</p>
          </Sect>

          <Sect title="7. Meldplicht datalekken">
            <p>De verwerker meldt een datalek <strong>binnen 24 uur</strong> na ontdekking aan SWV.
            SWV is dan zelf verantwoordelijk voor melding aan de Autoriteit Persoonsgegevens binnen 72 uur.
            Verwerker verleent volledige medewerking aan onderzoek.</p>
          </Sect>

          <Sect title="8. Rechten betrokkenen">
            <p>Verzoeken om inzage, correctie, verwijdering of dataportabiliteit worden binnen
            48 uur door verwerker doorgezet naar SWV. Verwerker biedt technische middelen voor
            export via <code>/api/me/export</code>.</p>
          </Sect>

          <Sect title="9. Audit recht">
            <p>SWV heeft jaarlijks recht op audit door eigen of onafhankelijke partij, na 30 dagen
            kennisgeving. Verwerker levert audit logs en certificeringen aan zonder extra kosten.</p>
          </Sect>

          <Sect title="10. Beëindiging">
            <p>Bij beëindiging draagt verwerker alle data over aan SWV in machine-readable formaat
            (JSON + database dump). 30 dagen na overdracht wordt alle data definitief gewist en
            een verklaring van vernietiging geleverd.</p>
          </Sect>
        </div>

        <div className="mt-8 rounded-2xl border border-primary-200 bg-primary-50 p-5 text-sm text-ink-700">
          Dit is een template. De definitieve DPA wordt door SWV en de leverancier
          ondertekend voorafgaand aan productie-livegang. Vraag een ondertekend exemplaar op via
          samenwerkingsverband@cbm.nl.
        </div>
      </main>
    </div>
  );
}

function Sect({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-lg font-bold text-ink-900">{title}</h2>
      <div className="mt-2 space-y-2 text-sm leading-relaxed text-ink-700">{children}</div>
    </section>
  );
}
