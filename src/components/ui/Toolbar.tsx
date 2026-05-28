import { Icon } from './Icon';

export function Toolbar({
  placeholder = 'Zoeken…',
  children,
}: {
  placeholder?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative flex-1 min-w-[200px]">
        <Icon.Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
        <input className="input pl-9" placeholder={placeholder} />
      </div>
      {children}
    </div>
  );
}

export function FilterChip({ label, active }: { label: string; active?: boolean }) {
  return (
    <button
      type="button"
      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
        active
          ? 'border-wood-200 bg-wood-50 text-wood-700'
          : 'border-bone-200 bg-white text-ink-600 hover:bg-bone-50'
      }`}
    >
      {label}
    </button>
  );
}
