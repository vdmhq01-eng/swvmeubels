import { MarketingShell } from '@/components/marketing/MarketingShell';
import { Hero, heroImages } from '@/components/marketing/Hero';
import { SollicitatieForm } from '@/components/marketing/SollicitatieForm';
import { Icon } from '@/components/ui/Icon';

export default function SollicitatiePage() {
  return (
    <MarketingShell activeHref="/solliciteren">
      <Hero
        eyebrow="Solliciteren"
        title="Stop met scrollen."
        highlight="Bouw iets echts."
        description="AI praat. Jij maakt. In het meubelvak telt elke vezel, elke afwerking, elke maatvoering — door jouw handen. Vul het formulier in en je staat binnen 2 weken in de werkplaats. Op vrijdag salaris op je rekening."
        image={heroImages.solliciteren}
      />

      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SollicitatieForm />
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
            <div className="card-padded">
              <Icon.Activity className="h-6 w-6 text-primary-500" />
              <h3 className="mt-3 font-display text-base font-bold">Auto-routing</h3>
              <p className="mt-1 text-sm text-ink-600">
                Je sollicitatie gaat automatisch naar de coördinator in jouw regio op basis van
                je postcode. Geen handmatige tussenstap.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </MarketingShell>
  );
}
