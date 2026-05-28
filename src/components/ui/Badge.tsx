import { cn } from '@/lib/utils';

type Variant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'wood';

const variants: Record<Variant, string> = {
  success: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
  warning: 'bg-amber-50 text-amber-700 border border-amber-100',
  danger: 'bg-rose-50 text-rose-700 border border-rose-100',
  info: 'bg-sky-50 text-sky-700 border border-sky-100',
  neutral: 'bg-bone-100 text-ink-700 border border-bone-200',
  wood: 'bg-wood-50 text-wood-700 border border-wood-100',
};

export function Badge({
  variant = 'neutral',
  children,
  className,
}: {
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function StatusDot({ variant = 'neutral' }: { variant?: Variant }) {
  const color = {
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    info: 'bg-sky-500',
    neutral: 'bg-ink-300',
    wood: 'bg-wood-500',
  }[variant];
  return <span className={cn('inline-block h-1.5 w-1.5 rounded-full', color)} />;
}
