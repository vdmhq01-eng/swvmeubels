import { MarketingShell } from '@/components/marketing/MarketingShell';
import { Hero, heroImages } from '@/components/marketing/Hero';
import { Icon } from '@/components/ui/Icon';

export default function SollicitatiePage() {
  return (
    <MarketingShell activeHref="/solliciteren">
      <Hero
        eyebrow="Solliciteren"
        title="Doe mee aan het"
        highlight="meubelvak."
        description="Vul het formulier in en we nemen binnen drie werkdagen contact met je op om de mogelijkheden in jouw regio te bespreken."
        image={heroImages.solliciteren}
      />

      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <form className="card-padded space-y-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="label mb-1.5 block">Voornaam</label>
                  <input className="input" placeholder="" />
                </div>
                <div>
                  <label className="label mb-1.5 block">Achternaam</label>
                  <input className="input" placeholder="" />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="label mb-1.5 block">E-mailadres</label>
                  <input type="email" className="input" placeholder="" />
                </div>
                <div>
                  <label className="label mb-1.5 block">Telefoonnummer</label>
                  <input className="input" placeholder="" />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="label mb-1.5 block">Postcode</label>
                  <input className="input" placeholder="1234 AB" />
                </div>
                <div>
                  <label className="label mb-1.5 block">Ik ben</label>
                  <select className="input">
                    <option>Student</option>
                    <option>Bedrijf</option>
                    <option>Ouder / verzorger</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="label mb-1.5 block">Welke opleiding heeft je interesse?</label>
                <select className="input">
                  <option>Meubelmaker / Interieurbouwer (BBL 2/3)</option>
                  <option>Scheepsinterieurbouwer (BBL 3)</option>
                  <option>Machinaal houtbewerker (BBL 2)</option>
                  <option>Weet ik nog niet</option>
                </select>
              </div>
              <div>
                <label className="label mb-1.5 block">Vertel iets over jezelf</label>
                <textarea rows={5} className="input" placeholder="Bijvoorbeeld: ervaring, motivatie, vragen…" />
              </div>
              <label className="flex items-start gap-2 text-xs text-ink-600">
                <input type="checkbox" className="mt-0.5 h-4 w-4 rounded border-bone-300" />
                <span>
                  Ik geef toestemming voor verwerking van mijn gegevens volgens de{' '}
                  <a href="/privacy" className="font-semibold text-primary-600">privacyverklaring</a>.
                </span>
              </label>
              <button type="submit" className="btn-primary w-full">
                <Icon.Check className="h-4 w-4" /> Verstuur sollicitatie
              </button>
            </form>
          </div>

          <aside className="space-y-5">
            <div className="card-padded">
              <Icon.Bell className="h-6 w-6 text-primary-500" />
              <h3 className="mt-3 font-display text-base font-bold">Direct contact</h3>
              <p className="mt-1 text-sm text-ink-600">
                Liever even bellen? We helpen je graag verder.
              </p>
              <a href="tel:0235158830" className="btn-secondary mt-4 w-full">
                023 515 88 30
              </a>
            </div>
            <div className="card-padded">
              <Icon.Doc className="h-6 w-6 text-primary-500" />
              <h3 className="mt-3 font-display text-base font-bold">E-mail ons</h3>
              <p className="mt-1 text-sm text-ink-600">
                Stuur je vraag of motivatiebrief direct naar:
              </p>
              <a
                href="mailto:samenwerkingsverband@cbm.nl"
                className="mt-4 inline-block text-sm font-semibold text-primary-600 hover:text-primary-700"
              >
                samenwerkingsverband@cbm.nl
              </a>
            </div>
          </aside>
        </div>
      </section>
    </MarketingShell>
  );
}
