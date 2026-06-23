import { cn } from '@/lib/utils';

export function Logo({ className, variant = 'light' }: { className?: string; variant?: 'light' | 'dark' }) {
  const textColor = variant === 'dark' ? 'text-white' : 'text-ink-900';
  const subColor = variant === 'dark' ? 'text-white/70' : 'text-ink-500';
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="grid h-11 w-11 place-items-center rounded-md bg-primary-500 text-white shadow-soft">
        <span className="font-display text-lg font-bold leading-none tracking-tighter">SWV</span>
      </div>
      <div className="leading-tight">
        <div className={cn('font-display text-base font-bold tracking-wide', textColor)}>
          Samenwerkingsverband
        </div>
        <div className={cn('text-[10px] uppercase tracking-[0.22em] font-semibold', subColor)}>
          Meubel
        </div>
      </div>
    </div>
  );
}
