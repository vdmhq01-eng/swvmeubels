import { cn } from '@/lib/utils';

/**
 * Schuine 'sticker' badge — schreeuwt salarisinfo voor jeugd.
 * Stoer en direct: het belangrijkste dat ze willen weten.
 */
export function SalarySticker({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'inline-flex flex-col items-center gap-1 rotate-[-6deg] rounded-2xl bg-primary-500 px-5 py-4 text-white shadow-lg ring-4 ring-primary-300/40',
        className,
      )}
      role="img"
      aria-label="Salaris vanaf 600 euro per maand"
    >
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">
        Verdien vanaf
      </span>
      <span className="font-display text-4xl font-bold leading-none">€600</span>
      <span className="text-[11px] font-semibold uppercase tracking-wider">
        per maand
      </span>
    </div>
  );
}
