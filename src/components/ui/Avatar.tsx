import { cn, initialsFromName } from '@/lib/utils';

type Size = 'sm' | 'md' | 'lg';

const sizes: Record<Size, string> = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-base',
};

export function Avatar({
  name,
  size = 'md',
  className,
  tone = 'wood',
}: {
  name: string;
  size?: Size;
  className?: string;
  tone?: 'wood' | 'stone' | 'rose' | 'green';
}) {
  const toneClass = {
    wood: 'bg-wood-100 text-wood-700',
    stone: 'bg-bone-200 text-ink-700',
    rose: 'bg-rose-100 text-rose-700',
    green: 'bg-emerald-100 text-emerald-700',
  }[tone];

  return (
    <div
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full font-semibold ring-1 ring-bone-200',
        toneClass,
        sizes[size],
        className,
      )}
      aria-label={name}
      title={name}
    >
      {initialsFromName(name)}
    </div>
  );
}
