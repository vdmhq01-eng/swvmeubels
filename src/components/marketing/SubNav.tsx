import Link from 'next/link';

export function SubNav({ active, items }: { active: string; items: { href: string; label: string }[] }) {
  return (
    <div className="border-b border-bone-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap gap-1 overflow-x-auto px-6 py-3">
        {items.map((it) => (
          <Link
            key={it.href}
            href={it.href}
            className={`whitespace-nowrap rounded-md px-3 py-2 text-xs font-bold uppercase tracking-wider transition ${
              it.href === active
                ? 'bg-primary-50 text-primary-700'
                : 'text-ink-600 hover:bg-bone-50 hover:text-primary-600'
            }`}
          >
            {it.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export const bedrijvenNav = [
  { href: '/bedrijven', label: 'Voordelen bedrijven' },
  { href: '/bedrijven/aanmelden', label: 'Aanmeldingsformulier' },
  { href: '/bedrijven/urenregistratie', label: 'Urenregistratie Cleverdesk' },
  { href: '/bedrijven/nieuwsbrief', label: 'SWV nieuwsbrief' },
];
