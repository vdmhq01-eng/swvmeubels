import { MarketingShell } from '@/components/marketing/MarketingShell';
import { Hero, heroImages } from '@/components/marketing/Hero';
import { SubNav, bedrijvenNav } from '@/components/marketing/SubNav';
import { Icon } from '@/components/ui/Icon';

export default function BedrijfAanmelden() {
  return (
    <MarketingShell activeHref="/bedrijven">
      <Hero
        eyebrow="Aanmelden"
        title="Word lidbedrijf."
        highlight="Geen kleine lettertjes."
        description="Vul het formulier in en de coördinator van jouw regio neemt binnen drie werkdagen contact op. Geen contracten op zak — dat regelen we later samen."
        image={heroImages.bedrijven}
      />
      <SubNav active="/bedrijven/aanmelden" items={bedrijvenNav} />

      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <form className="card-padded space-y-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="label mb-1.5 block">Bedrijfsnaam</label>
                  <input className="input" />
                </div>
                <div>
                  <label className="label mb-1.5 block">KvK-nummer</label>
                  <input className="input" />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="label mb-1.5 block">Contactpersoon</label>
                  <input className="input" />
                </div>
                <div>
                  <label className="label mb-1.5 block">Functie</label>
                  <input className="input" />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="label mb-1.5 block">E-mail</label>
                  <input type="email" className="input" />
                </div>
                <div>
                  <label className="label mb-1.5 block">Telefoon</label>
                  <input className="input" />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="label mb-1.5 block">Postcode</label>
                  <input className="input" placeholder="1234 AB" />
                  <p className="mt-1 text-[11px] text-ink-500">Op basis van postcode koppelen we de juiste regio + coördinator.</p>
                </div>
                <div>
                  <label className="label mb-1.5 block">Aantal medewerkers</label>
                  <select className="input">
                    <option>1 – 5</option>
                    <option>6 – 20</option>
                    <option>21 – 50</option>
                    <option>50+</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="label mb-1.5 block">Type werk</label>
                <select className="input">
                  <option>Meubelmakerij / maatwerk</option>
                  <option>Interieurbouw</option>
                  <option>Scheepsinterieur</option>
                  <option>Machinaal houtbewerken / seriewerk</option>
                  <option>Anders</option>
                </select>
              </div>
              <div>
                <label className="label mb-1.5 block">Vertel iets over je bedrijf</label>
                <textarea rows={4} className="input" placeholder="Wat voor producten maak je, hoeveel studenten zou je kunnen plaatsen, etc." />
              </div>
              <div className="rounded-xl border border-bone-200 bg-bone-50 p-3 text-xs text-ink-600">
                <strong className="text-ink-900">Wat gebeurt er hierna?</strong>
                <ol className="mt-2 list-decimal space-y-1 pl-5">
                  <li>Je krijgt direct een bevestigingsmail.</li>
                  <li>De coördinator van jouw regio belt of mailt binnen 3 werkdagen.</li>
                  <li>Kennismakingsgesprek op locatie — geen verplichtingen.</li>
                  <li>Erkenning regelen via SBB (wij helpen).</li>
                </ol>
              </div>
              <button className="btn-primary w-full">
                <Icon.Check className="h-4 w-4" />
                Verstuur aanmelding
              </button>
            </form>
          </div>

          <aside className="space-y-5">
            <div className="card-padded">
              <Icon.Bell className="h-6 w-6 text-primary-500" />
              <h3 className="mt-3 font-display text-base font-bold">Liever bellen?</h3>
              <p className="mt-1 text-sm text-ink-600">Op werkdagen 09:00 — 17:00.</p>
              <a href="tel:0235158830" className="btn-secondary mt-4 w-full">023 515 88 30</a>
            </div>
            <div className="card-padded">
              <Icon.Doc className="h-6 w-6 text-primary-500" />
              <h3 className="mt-3 font-display text-base font-bold">Direct mailen</h3>
              <a href="mailto:samenwerkingsverband@cbm.nl" className="mt-4 inline-block text-sm font-semibold text-primary-600 hover:text-primary-700">
                samenwerkingsverband@cbm.nl
              </a>
            </div>
          </aside>
        </div>
      </section>
    </MarketingShell>
  );
}
