import { cn } from '@/lib/utils';

export function Tabs({
  items,
  active,
  onChange,
}: {
  items: { key: string; label: string; count?: number }[];
  active: string;
  onChange?: (k: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1 rounded-xl border border-bone-200 bg-white p-1">
      {items.map((t) => {
        const isActive = t.key === active;
        return (
          <button
            key={t.key}
            type="button"
            onClick={() => onChange?.(t.key)}
            className={cn(
              'inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition',
              isActive ? 'bg-wood-50 text-wood-700' : 'text-ink-600 hover:bg-bone-50',
            )}
          >
            {t.label}
            {t.count !== undefined ? (
              <span
                className={cn(
                  'rounded-full px-1.5 text-[11px]',
                  isActive ? 'bg-wood-100 text-wood-700' : 'bg-bone-100 text-ink-500',
                )}
              >
                {t.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
