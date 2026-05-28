import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-wood-500 text-white shadow-soft">
        <span className="font-display text-lg font-semibold leading-none">S</span>
      </div>
      <div className="leading-tight">
        <div className="font-display text-base font-semibold tracking-wide text-wood-700">SWV</div>
        <div className="text-[10px] uppercase tracking-[0.18em] text-ink-500">Meubel</div>
      </div>
    </div>
  );
}
