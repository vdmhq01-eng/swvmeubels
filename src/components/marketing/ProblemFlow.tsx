import { Icon } from '@/components/ui/Icon';

type SystemBox = {
  label: string;
  tone?: 'gray' | 'rose' | 'amber' | 'primary' | 'emerald' | 'navy';
};

const toneClass = {
  gray: 'bg-bone-100 text-ink-600 border-bone-200',
  rose: 'bg-rose-100 text-rose-700 border-rose-200',
  amber: 'bg-amber-100 text-amber-700 border-amber-200',
  primary: 'bg-primary-100 text-primary-700 border-primary-200',
  emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  navy: 'bg-navy-100 text-navy-700 border-navy-200',
};

export function ProblemFlow({
  number,
  problem,
  systems,
  oldFlow,
  newFlow,
}: {
  number: string;
  problem: string;
  systems?: SystemBox[];
  oldFlow: { boxes: SystemBox[]; pain: string };
  newFlow: { box: SystemBox; gain: string };
}) {
  return (
    <article className="overflow-hidden rounded-3xl border border-bone-200 bg-white shadow-card">
      <div className="border-b border-bone-200 bg-bone-50 px-6 py-5">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary-500 font-display text-lg font-bold text-white">
            {number}
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold uppercase tracking-[0.15em] text-primary-600">
              Probleem
            </div>
            <h3 className="mt-1 font-display text-xl font-bold text-ink-900 sm:text-2xl">{problem}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-[1fr_auto_1fr] md:items-center">
        {/* OUD: chaos */}
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-rose-600">Vandaag</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {oldFlow.boxes.map((s, i) => (
              <span
                key={i}
                className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-semibold ${toneClass[s.tone ?? 'gray']}`}
              >
                {s.label}
              </span>
            ))}
          </div>
          <p className="mt-3 text-xs italic text-rose-700/80">{oldFlow.pain}</p>
        </div>

        {/* PIJL */}
        <div className="hidden text-center md:block">
          <Icon.ArrowRight className="mx-auto h-6 w-6 text-primary-500" />
          <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.15em] text-primary-600">
            Wordt
          </div>
        </div>
        <div className="block text-center md:hidden">
          <div className="mx-auto h-px w-12 bg-primary-300" />
          <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.15em] text-primary-600">
            Wordt
          </div>
          <div className="mx-auto mt-1 h-px w-12 bg-primary-300" />
        </div>

        {/* NIEUW: één plek */}
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-600">In het portaal</div>
          <div
            className={`mt-2 inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-bold ${toneClass[newFlow.box.tone ?? 'primary']}`}
          >
            <Icon.Check className="h-4 w-4" />
            {newFlow.box.label}
          </div>
          <p className="mt-3 text-xs italic text-emerald-700/80">{newFlow.gain}</p>
        </div>
      </div>
    </article>
  );
}
