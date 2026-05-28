import { cn } from '@/lib/utils';

type Tone = 'wood' | 'green' | 'rose' | 'amber' | 'stone';

const toneRing: Record<Tone, string> = {
  wood: 'bg-wood-50 text-wood-700 ring-wood-100',
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  rose: 'bg-rose-50 text-rose-700 ring-rose-100',
  amber: 'bg-amber-50 text-amber-700 ring-amber-100',
  stone: 'bg-bone-100 text-ink-700 ring-bone-200',
};

export function StatCard({
  label,
  value,
  hint,
  icon,
  tone = 'wood',
}: {
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
  icon?: React.ReactNode;
  tone?: Tone;
}) {
  return (
    <div className="card-padded">
      <div className="flex items-start justify-between">
        <div className={cn('grid h-10 w-10 place-items-center rounded-xl ring-1', toneRing[tone])}>
          {icon}
        </div>
      </div>
      <div className="mt-4 text-xs font-medium uppercase tracking-wider text-ink-500">{label}</div>
      <div className="mt-1 font-display text-2xl font-semibold text-ink-900">{value}</div>
      {hint ? <div className="mt-1 text-xs text-ink-500">{hint}</div> : null}
    </div>
  );
}
