import { MarketingShell } from '@/components/marketing/MarketingShell';
import { Hero, heroImages } from '@/components/marketing/Hero';
import { SubNav, bedrijvenNav } from '@/components/marketing/SubNav';
import { Icon } from '@/components/ui/Icon';

export default function NieuwsbriefPage() {
  return (
    <MarketingShell activeHref="/bedrijven">
      <Hero
        eyebrow="Nieuwsbrief"
        title="Blijf op de hoogte."
        highlight="Geen spam, wel vakwerk."
        description="Per kwartaal het belangrijkste nieuws over BBL, opleidingen, beleid en evenementen voor lidbedrijven. Uitschrijven kan altijd in één tik."
        image={heroImages.bedrijven}
      />
      <SubNav active="/bedrijven/nieuwsbrief" items={bedrijvenNav} />

      <section className="mx-auto max-w-3xl px-6 py-16">
        <div className="card-padded">
          <h2 className="font-display text-2xl font-bold">Inschrijven SWV-nieuwsbrief</h2>
          <p className="mt-2 text-sm text-ink-600">Voor lidbedrijven en geïnteresseerde bedrijven.</p>

          <form className="mt-6 space-y-4">
            <div>
              <label className="label mb-1.5 block">Bedrijfsnaam</label>
              <input className="input" />
            </div>
            <div>
              <label className="label mb-1.5 block">Contactpersoon</label>
              <input className="input" />
            </div>
            <div>
              <label className="label mb-1.5 block">E-mail</label>
              <input type="email" className="input" />
            </div>
            <div>
              <label className="label mb-1.5 block">Regio</label>
              <select className="input">
                <option>Noord-Nederland</option>
                <option>Twente-Salland</option>
                <option>Noord-Holland</option>
                <option>AAA</option>
                <option>Brabant</option>
                <option>Rotterdam</option>
                <option>Limburg</option>
                <option>Achterhoek-Liemers</option>
                <option>Anders</option>
              </select>
            </div>
            <label className="flex items-start gap-2 text-xs text-ink-600">
              <input type="checkbox" className="mt-0.5 h-4 w-4 rounded border-bone-300" />
              <span>Ik ga akkoord met de privacyverklaring en ontvang per kwartaal de nieuwsbrief.</span>
            </label>
            <button className="btn-primary w-full">
              <Icon.Check className="h-4 w-4" />
              Inschrijven
            </button>
          </form>

          <div className="mt-8 grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
            <Feat icon={<Icon.Calendar className="h-4 w-4" />} label="1× per kwartaal" />
            <Feat icon={<Icon.X className="h-4 w-4" />} label="Geen spam" />
            <Feat icon={<Icon.Doc className="h-4 w-4" />} label="Uitschrijven in 1 tik" />
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}

function Feat({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-bone-200 bg-bone-50 px-3 py-2 text-ink-700">
      <span className="text-primary-500">{icon}</span>
      {label}
    </div>
  );
}
