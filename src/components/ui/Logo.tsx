import Image from 'next/image';
import { cn } from '@/lib/utils';

export function Logo({ className, variant = 'light' }: { className?: string; variant?: 'light' | 'dark' }) {
  const textColor = variant === 'dark' ? 'text-white' : 'text-ink-900';
  const subColor = variant === 'dark' ? 'text-white/70' : 'text-ink-500';
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <Image
        src="/swv-mark.svg"
        alt="SWV Meubel"
        width={44}
        height={44}
        priority
        className="h-11 w-11 shrink-0"
      />
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
