'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { useToast } from '@/components/ui/Toast';
import { submitQuickWeek, copyPreviousWeek, type QuickEntryInput } from '@/lib/actions/quick-hours';

type DayType = 'PRAKTIJK' | 'SCHOOL' | 'ZIEKTE' | 'VERLOF' | 'AFWEZIG';

type Day = {
  date: string;
  label: string;
  type: DayType;
  hours: number;
};

const DEFAULT_DAYS = (weekStartDate: string): Day[] => {
  const start = new Date(weekStartDate + 'T00:00:00');
  const labels = ['Ma', 'Di', 'Wo', 'Do', 'Vr'];
  return labels.map((label, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    return {
      date: d.toISOString().slice(0, 10),
      label,
      type: i === 2 ? ('SCHOOL' as DayType) : ('PRAKTIJK' as DayType),
      hours: i === 2 ? 7 : 8,
    };
  });
};

const typeColors: Record<DayType, string> = {
  PRAKTIJK: 'bg-primary-100 text-primary-700 ring-primary-200',
  SCHOOL: 'bg-sky-100 text-sky-700 ring-sky-200',
  ZIEKTE: 'bg-rose-100 text-rose-700 ring-rose-200',
  VERLOF: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
  AFWEZIG: 'bg-bone-200 text-ink-600 ring-bone-300',
};

const typeLabels: Record<DayType, string> = {
  PRAKTIJK: 'Praktijk',
  SCHOOL: 'School',
  ZIEKTE: 'Ziek',
  VERLOF: 'Verlof',
  AFWEZIG: 'Afwezig',
};

export function QuickWeekEntry({
  studentId,
  weekNumber,
  year,
  weekStartDate,
  initialDays,
  status = 'CONCEPT',
}: {
  studentId: string;
  weekNumber: number;
  year: number;
  weekStartDate: string;
  initialDays?: Day[];
  status?: string;
}) {
  const { toast } = useToast();
  const [days, setDays] = useState<Day[]>(initialDays ?? DEFAULT_DAYS(weekStartDate));
  const [pending, startTransition] = useTransition();
  const [copying, setCopying] = useState(false);

  const total = days.reduce((s, d) => s + (d.hours || 0), 0);
  const norm = 38;
  const remaining = Math.max(0, norm - total);

  function updateDay(i: number, patch: Partial<Day>) {
    const next = [...days];
    next[i] = { ...next[i], ...patch };
    setDays(next);
  }

  async function handleCopyPrev() {
    setCopying(true);
    const result = await copyPreviousWeek(studentId, weekNumber, year);
    setCopying(false);
    if (!result.ok) {
      toast({ variant: 'error', title: 'Geen vorige week', description: result.error });
      return;
    }
    const copied = result.entries.slice(0, days.length).map((e, i) => ({
      ...days[i],
      type: e.type as DayType,
      hours: e.hours,
    }));
    setDays(copied.length === days.length ? copied : days.map((d, i) => copied[i] ?? d));
    toast({ variant: 'success', title: 'Gekopieerd', description: 'Vorige week is overgenomen — pas aan waar nodig.' });
  }

  function handleSave(submit: boolean) {
    const input: QuickEntryInput = {
      studentId,
      year,
      weekNumber,
      weekStartDate,
      entries: days
        .filter((d) => d.hours > 0)
        .map((d) => ({ date: d.date, type: d.type, hours: d.hours })),
      submit,
    };
    startTransition(async () => {
      const result = await submitQuickWeek(input);
      if (!result.ok) {
        toast({ variant: 'error', title: 'Opslaan mislukt', description: result.error });
        return;
      }
      toast({
        variant: 'success',
        title: submit ? 'Weekstaat ingediend' : 'Concept opgeslagen',
        description: submit ? 'Je leerbedrijf en coördinator krijgen bericht.' : 'Je kunt later verder.',
      });
    });
  }

  const isSubmitted = status === 'INGEDIEND' || status === 'GOEDGEKEURD';

  return (
    <div className="overflow-hidden rounded-2xl border border-bone-200 bg-white shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-bone-200 px-5 py-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.15em] text-primary-600">
            Snelle weekstaat
          </div>
          <h2 className="mt-1 font-display text-xl font-bold text-ink-900">
            Week {weekNumber} · {year}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyPrev}
            disabled={copying || isSubmitted}
            className="btn-secondary disabled:opacity-50"
          >
            <Icon.Refresh className={`h-4 w-4 ${copying ? 'animate-spin' : ''}`} />
            Vorige week kopiëren
          </button>
          <Link href="/student/uren" className="btn-ghost">
            Uitgebreid<Icon.ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-5">
        {days.map((d, i) => (
          <div key={d.date} className="flex flex-col gap-2 rounded-2xl border border-bone-200 p-3">
            <div className="flex items-center justify-between">
              <span className="font-display text-lg font-bold text-ink-900">{d.label}</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-500">
                {d.date.slice(8, 10)}/{d.date.slice(5, 7)}
              </span>
            </div>
            <select
              value={d.type}
              onChange={(e) => updateDay(i, { type: e.target.value as DayType })}
              disabled={isSubmitted}
              className={`rounded-lg px-2 py-1.5 text-xs font-semibold ring-1 disabled:opacity-60 ${typeColors[d.type]}`}
            >
              {(Object.keys(typeLabels) as DayType[]).map((t) => (
                <option key={t} value={t}>{typeLabels[t]}</option>
              ))}
            </select>
            <input
              type="number"
              min={0}
              max={12}
              step={0.5}
              value={d.hours}
              onChange={(e) => updateDay(i, { hours: Math.max(0, Math.min(12, Number(e.target.value) || 0)) })}
              disabled={isSubmitted}
              className="w-full rounded-lg border border-bone-200 px-2 py-1.5 text-right text-base font-bold disabled:bg-bone-50"
            />
            <span className="text-center text-[10px] text-ink-500">uur</span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-bone-200 bg-bone-50 px-5 py-4">
        <div className="flex items-center gap-4 text-sm">
          <div>
            <span className="text-ink-500">Totaal: </span>
            <span className={`font-display text-xl font-bold ${total >= norm ? 'text-emerald-600' : 'text-amber-600'}`}>
              {total.toFixed(1)} u
            </span>
            <span className="ml-2 text-xs text-ink-500">norm {norm} u</span>
          </div>
          {remaining > 0 ? (
            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
              {remaining.toFixed(1)} u ontbreekt
            </span>
          ) : (
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
              ✓ compleet
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleSave(false)}
            disabled={pending || isSubmitted}
            className="btn-secondary disabled:opacity-50"
          >
            Concept opslaan
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={pending || isSubmitted}
            className="btn-primary disabled:opacity-50"
          >
            {pending ? (
              <>
                <Icon.Refresh className="h-4 w-4 animate-spin" /> Versturen…
              </>
            ) : isSubmitted ? (
              <>
                <Icon.Check className="h-4 w-4" /> Al ingediend
              </>
            ) : (
              <>
                <Icon.Check className="h-4 w-4" /> Indienen
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
