'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@/components/ui/Icon';

type Step = {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  body: string;
  bullets?: string[];
  cta?: { label: string; href: string };
  image?: 'dashboard' | 'uren' | 'leerbedrijf' | 'vakantie' | 'verzuim' | 'app';
};

const SEEN_KEY = 'swv-tutorial-seen-v1';

const steps: Step[] = [
  {
    icon: <Icon.Heart className="h-6 w-6" />,
    eyebrow: 'Welkom!',
    title: 'Welkom bij jouw SWV portaal.',
    body:
      'In 7 stappen leiden we je rond. Geen wiskunde, geen poespas — daarna weet je precies waar je moet zijn voor uren, vakantie, verzuim en je leerbedrijf.',
    image: 'dashboard',
  },
  {
    icon: <Icon.Clock className="h-6 w-6" />,
    eyebrow: 'Stap 1',
    title: 'Vul elke vrijdag je uren in.',
    body:
      'Tik op "Urenregistratie" in het menu. Per dag vul je in hoeveel uur je hebt gewerkt of school had. Met de knop "Kopieer vorige week" ben je in 10 seconden klaar.',
    bullets: [
      'Praktijk uren op werkdagen',
      'School op je schooldag',
      'Ziekte of verlof kun je apart aangeven',
    ],
    cta: { label: 'Open urenregistratie', href: '/student/uren' },
    image: 'uren',
  },
  {
    icon: <Icon.Briefcase className="h-6 w-6" />,
    eyebrow: 'Stap 2',
    title: 'Hou je leerbedrijf in beeld.',
    body:
      'Onder "Leerbedrijf" zie je contactgegevens van je werkbegeleider, jouw werkdagen en wat er deze week gepland staat.',
    cta: { label: 'Bekijk leerbedrijf', href: '/student/leerbedrijf' },
    image: 'leerbedrijf',
  },
  {
    icon: <Icon.Heart className="h-6 w-6" />,
    eyebrow: 'Stap 3',
    title: 'Ziek? Meld het direct met 1 tik.',
    body:
      'Wees eerlijk en snel: meld je ziek zodra je het weet. Je coördinator en leerbedrijf krijgen automatisch bericht — bellen of mailen hoeft niet.',
    bullets: ['Je medische details blijven privé', 'Beter melden kan vanaf dezelfde pagina'],
    cta: { label: 'Open verzuim', href: '/student/verzuim' },
    image: 'verzuim',
  },
  {
    icon: <Icon.Palm className="h-6 w-6" />,
    eyebrow: 'Stap 4',
    title: 'Plan je vakantie zelf.',
    body:
      'Je hebt 25 vakantiedagen per jaar en bouwt vakantiegeld op. Vraag aan via "Vakantiedagen". Je coördinator keurt goed of vraagt om wijziging.',
    cta: { label: 'Vakantie aanvragen', href: '/student/vakantie' },
    image: 'vakantie',
  },
  {
    icon: <Icon.BookOpen className="h-6 w-6" />,
    eyebrow: 'Stap 5',
    title: 'Documenten zijn veilig bewaard.',
    body:
      'Je contract, beoordelingen en BPV-verslag staan onder "Documenten". Alles is versleuteld opgeslagen — alleen jij, je coördinator en je leerbedrijf kunnen erbij.',
  },
  {
    icon: <Icon.Bell className="h-6 w-6" />,
    eyebrow: 'Stap 6',
    title: 'Berichten en taken op één plek.',
    body:
      'Onder "Berichten" zie je alles van je coördinator en leerbedrijf. Onder "Taken" staan opdrachten en deadlines. Houd de cijfers in het zijmenu in de gaten.',
  },
  {
    icon: <Icon.Bell className="h-6 w-6" />,
    eyebrow: 'Laatste stap',
    title: 'Installeer de app voor pushmeldingen.',
    body:
      'Tik op "Installeer SWV app" bovenaan je dashboard. Dan krijg je meldingen op je telefoon bij berichten en herinneringen voor weekstaten.',
    image: 'app',
  },
];

export function StudentTutorial({ firstName = 'Jamie' }: { firstName?: string }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const seen = localStorage.getItem(SEEN_KEY);
    if (!seen) setOpen(true);
  }, []);

  function close() {
    localStorage.setItem(SEEN_KEY, String(Date.now()));
    setOpen(false);
    setStep(0);
  }

  function next() {
    if (step < steps.length - 1) setStep(step + 1);
    else close();
  }

  function prev() {
    if (step > 0) setStep(step - 1);
  }

  if (!open) return null;
  const s = steps[step];
  const isFirst = step === 0;
  const isLast = step === steps.length - 1;
  const personalizedTitle = isFirst ? s.title.replace('Welkom bij jouw SWV portaal.', `Welkom ${firstName}!`) : s.title;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink-900/75 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Header met progress */}
        <div className="flex items-center justify-between gap-3 border-b border-bone-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-md bg-primary-500 text-white">
              <Icon.BookOpen className="h-4 w-4" />
            </div>
            <div className="text-xs font-bold uppercase tracking-[0.15em] text-ink-500">
              Stap {step + 1} van {steps.length}
            </div>
          </div>
          <button onClick={close} className="rounded-lg p-1 text-ink-400 hover:bg-bone-100 hover:text-ink-900" aria-label="Sluiten">
            <Icon.X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-bone-100">
          <div
            className="h-full bg-primary-500 transition-all"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-6 md:p-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-700">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-primary-500 text-white">
                {s.icon}
              </span>
              {s.eyebrow}
            </div>
            <h2 className="mt-3 font-display text-2xl font-bold leading-tight text-ink-900 sm:text-3xl">
              {personalizedTitle}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-700 sm:text-base">{s.body}</p>
            {s.bullets ? (
              <ul className="mt-4 space-y-2">
                {s.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-ink-700">
                    <Icon.Check className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            ) : null}
            {s.cta ? (
              <a
                href={s.cta.href}
                className="btn-outline-primary mt-5"
                onClick={() => {
                  localStorage.setItem(SEEN_KEY, String(Date.now()));
                }}
              >
                {s.cta.label} <Icon.ArrowRight className="h-4 w-4" />
              </a>
            ) : null}
          </div>

          {/* Visual mock per stap */}
          <div className="hidden bg-gradient-to-br from-primary-50 to-bone-100 p-6 md:block">
            <TutorialVisual variant={s.image ?? 'dashboard'} />
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-bone-100 bg-bone-50 px-6 py-4">
          <button onClick={close} className="text-xs font-semibold uppercase tracking-wider text-ink-500 hover:text-ink-900">
            Sla over
          </button>
          <div className="flex gap-2">
            <button
              onClick={prev}
              disabled={isFirst}
              className="btn-secondary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Icon.ArrowRight className="h-4 w-4 rotate-180" />
              Vorige
            </button>
            <button onClick={next} className="btn-primary">
              {isLast ? 'Aan de slag' : 'Volgende'}
              {isLast ? <Icon.Check className="h-4 w-4" /> : <Icon.ArrowRight className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TutorialVisual({ variant }: { variant: NonNullable<Step['image']> }) {
  const common = 'flex aspect-square w-full items-center justify-center rounded-2xl';
  if (variant === 'dashboard') {
    return (
      <div className={`${common} bg-white shadow-card`}>
        <div className="w-full max-w-[200px] space-y-2 p-4">
          <div className="h-6 w-2/3 rounded bg-primary-200" />
          <div className="h-4 w-1/2 rounded bg-bone-200" />
          <div className="grid grid-cols-2 gap-2 pt-2">
            <div className="h-16 rounded-xl bg-primary-100" />
            <div className="h-16 rounded-xl bg-navy-100" />
            <div className="h-16 rounded-xl bg-emerald-100" />
            <div className="h-16 rounded-xl bg-amber-100" />
          </div>
        </div>
      </div>
    );
  }
  if (variant === 'uren') {
    return (
      <div className={`${common} bg-white shadow-card`}>
        <div className="w-full max-w-[220px] space-y-1.5 p-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-primary-600">Week 22</div>
          {['Ma', 'Di', 'Wo', 'Do', 'Vr'].map((d, i) => (
            <div key={d} className="flex items-center justify-between rounded-md border border-bone-200 px-2 py-1.5">
              <span className="text-xs font-semibold">{d}</span>
              <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${i === 2 ? 'bg-sky-100 text-sky-700' : 'bg-primary-100 text-primary-700'}`}>
                {i === 2 ? 'School' : '8u'}
              </span>
            </div>
          ))}
          <button className="mt-2 w-full rounded bg-primary-500 py-1.5 text-xs font-bold uppercase tracking-wider text-white">
            Indienen
          </button>
        </div>
      </div>
    );
  }
  if (variant === 'leerbedrijf') {
    return (
      <div className={`${common} bg-white shadow-card`}>
        <div className="w-full max-w-[200px] p-4 text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-md bg-primary-500 text-white">
            <Icon.Briefcase className="h-5 w-5" />
          </div>
          <div className="mt-3 font-display text-sm font-bold">De Vries Interieurbouw</div>
          <div className="text-[10px] text-ink-500">Groningen · Noord</div>
          <div className="mt-3 rounded-md bg-bone-50 p-2 text-[10px]">Jan de Vries · Praktijkopleider</div>
        </div>
      </div>
    );
  }
  if (variant === 'vakantie') {
    return (
      <div className={`${common} bg-white shadow-card`}>
        <div className="w-full max-w-[200px] p-4 text-center">
          <Icon.Palm className="mx-auto h-10 w-10 text-emerald-600" />
          <div className="mt-2 font-display text-3xl font-bold text-emerald-700">20</div>
          <div className="text-[10px] uppercase tracking-wider text-ink-500">Dagen beschikbaar</div>
          <div className="mt-3 rounded-md bg-emerald-50 p-2 text-[10px] font-semibold text-emerald-700">
            € 862,45 vakantiegeld
          </div>
        </div>
      </div>
    );
  }
  if (variant === 'verzuim') {
    return (
      <div className={`${common} bg-white shadow-card`}>
        <div className="w-full max-w-[200px] p-4 text-center">
          <Icon.Heart className="mx-auto h-10 w-10 text-rose-500" />
          <div className="mt-3 text-xs font-semibold text-ink-700">Ziek? 1 tik.</div>
          <button className="mt-3 w-full rounded-md bg-rose-500 py-2 text-xs font-bold uppercase tracking-wider text-white">
            Meld ziek
          </button>
        </div>
      </div>
    );
  }
  // app install
  return (
    <div className={`${common} bg-white shadow-card`}>
      <div className="w-full max-w-[180px] p-4 text-center">
        <div className="mx-auto h-32 w-20 rounded-2xl border-4 border-ink-900 bg-bone-50 p-1.5">
          <div className="grid h-full w-full place-items-center rounded-lg bg-gradient-to-br from-primary-400 to-primary-600">
            <div className="text-center">
              <div className="font-display text-xl font-black text-white">SWV</div>
              <div className="text-[8px] font-bold uppercase tracking-wider text-white/90">Meubel</div>
            </div>
          </div>
        </div>
        <div className="mt-3 text-[10px] font-semibold text-ink-700">App op je startscherm</div>
      </div>
    </div>
  );
}
