'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@/components/ui/Icon';

type Phase = 'CHAOS' | 'TRANSITION' | 'UNIFIED';

export function AnimatedFlow({
  number,
  problem,
  oldBoxes,
  oldPain,
  newLabel,
  newGain,
  durationMs = 4500,
}: {
  number: string;
  problem: string;
  oldBoxes: string[];
  oldPain: string;
  newLabel: string;
  newGain: string;
  durationMs?: number;
}) {
  const [phase, setPhase] = useState<Phase>('CHAOS');

  useEffect(() => {
    let cancelled = false;
    const cycle = () => {
      if (cancelled) return;
      setPhase('CHAOS');
      const t1 = setTimeout(() => !cancelled && setPhase('TRANSITION'), durationMs * 0.4);
      const t2 = setTimeout(() => !cancelled && setPhase('UNIFIED'), durationMs * 0.55);
      const t3 = setTimeout(cycle, durationMs);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    };
    const stop = cycle();
    return () => {
      cancelled = true;
      stop?.();
    };
  }, [durationMs]);

  return (
    <article className="overflow-hidden rounded-3xl border border-bone-200 bg-white shadow-card">
      <div className="border-b border-bone-200 bg-bone-50 px-6 py-5">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary-500 font-display text-lg font-bold text-white">
            {number}
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.15em] text-primary-600">
              Probleem
            </div>
            <h3 className="mt-1 font-display text-xl font-bold text-ink-900 sm:text-2xl">{problem}</h3>
          </div>
        </div>
      </div>

      <div className="relative min-h-[260px] overflow-hidden p-6 sm:p-8">
        {/* Pijl/centrale lijn — alleen tijdens TRANSITION */}
        <div
          className={`pointer-events-none absolute inset-x-6 top-1/2 h-0.5 -translate-y-1/2 bg-gradient-to-r from-rose-300 via-amber-300 to-emerald-400 transition-all duration-700 ${
            phase === 'TRANSITION' ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
          }`}
          style={{ transformOrigin: 'left' }}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_auto_1fr] md:items-center">
          {/* OLD - chaos */}
          <div className="relative">
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-rose-600">
              Vandaag
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {oldBoxes.map((label, i) => (
                <span
                  key={i}
                  className={`inline-flex items-center gap-1.5 rounded-md border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-700 transition-all duration-500 ${
                    phase === 'CHAOS'
                      ? 'opacity-100 translate-y-0'
                      : phase === 'TRANSITION'
                      ? `opacity-30 -translate-x-${(i % 3) * 2}`
                      : 'opacity-0 -translate-x-8'
                  }`}
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  <span
                    className={`inline-block h-1.5 w-1.5 rounded-full bg-rose-500 ${
                      phase === 'CHAOS' ? 'animate-pulse' : ''
                    }`}
                  />
                  {label}
                </span>
              ))}
            </div>
            <p className="mt-3 text-xs italic text-rose-700/80">{oldPain}</p>
          </div>

          {/* MIDDEN — pijl */}
          <div className="relative hidden text-center md:block">
            <div
              className={`mx-auto grid h-10 w-10 place-items-center rounded-full bg-primary-500 text-white transition-all duration-700 ${
                phase === 'TRANSITION' ? 'scale-110 shadow-lg' : 'scale-100'
              }`}
            >
              <Icon.ArrowRight
                className={`h-5 w-5 transition-transform duration-700 ${
                  phase === 'TRANSITION' ? 'translate-x-1' : ''
                }`}
              />
            </div>
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

          {/* NEW - unified */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-600">
              In het portaal
            </div>
            <div
              className={`mt-3 inline-flex items-center gap-2 rounded-2xl border-2 border-emerald-300 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 transition-all duration-700 ${
                phase === 'UNIFIED'
                  ? 'opacity-100 scale-100 shadow-lg shadow-emerald-200/50'
                  : phase === 'TRANSITION'
                  ? 'opacity-60 scale-95'
                  : 'opacity-30 scale-90'
              }`}
            >
              <span
                className={`grid h-5 w-5 place-items-center rounded-full bg-emerald-500 text-white transition-all duration-500 ${
                  phase === 'UNIFIED' ? 'scale-100' : 'scale-0'
                }`}
              >
                <Icon.Check className="h-3 w-3" />
              </span>
              {newLabel}
            </div>
            <p
              className={`mt-3 text-xs italic transition-opacity duration-700 ${
                phase === 'UNIFIED' ? 'text-emerald-700 opacity-100' : 'text-emerald-700/40 opacity-60'
              }`}
            >
              {newGain}
            </p>
          </div>
        </div>

        {/* Phase indicator */}
        <div className="mt-6 flex justify-center gap-1.5">
          {(['CHAOS', 'TRANSITION', 'UNIFIED'] as Phase[]).map((p) => (
            <span
              key={p}
              className={`h-1 rounded-full transition-all ${
                phase === p ? 'w-8 bg-primary-500' : 'w-1.5 bg-bone-300'
              }`}
            />
          ))}
        </div>
      </div>
    </article>
  );
}
