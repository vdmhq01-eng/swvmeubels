import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { Icon } from '@/components/ui/Icon';
import type { NavItem } from '@/lib/navigation';
import { iconRegistry, portalMeta } from '@/lib/navigation';
import type { Role } from '@/lib/types';
import { cn } from '@/lib/utils';

export function Sidebar({
  items,
  role,
  activeHref,
}: {
  items: NavItem[];
  role: Role;
  activeHref: string;
}) {
  const meta = portalMeta[role];
  return (
    <aside className="hidden w-64 shrink-0 border-r border-bone-200 bg-white lg:flex lg:flex-col">
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <Link href="/"><Logo /></Link>
      </div>
      <div className="mx-5 mb-3 rounded-xl border border-primary-100 bg-primary-50 px-3 py-2">
        <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary-700">
          {meta.chip} portaal
        </div>
        <div className="text-xs text-primary-600/80">{meta.subtitle}</div>
      </div>

      <nav className="mt-1 flex-1 overflow-y-auto px-3 pb-4">
        <ul className="flex flex-col gap-0.5">
          {items.map((item) => {
            const IconComp = iconRegistry[item.icon];
            const active = item.href === activeHref;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition',
                    active
                      ? 'bg-primary-500 text-white font-bold shadow-soft'
                      : 'text-ink-700 hover:bg-bone-100 font-medium',
                  )}
                  aria-current={active ? 'page' : undefined}
                >
                  <IconComp className={cn('h-[18px] w-[18px]', active ? 'text-white' : 'text-ink-500')} />
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge ? (
                    <span className={cn(
                      'inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[11px] font-bold',
                      active ? 'bg-white text-primary-600' : 'bg-primary-500 text-white',
                    )}>
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-bone-200 p-3">
        <Link href="/" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-ink-700 hover:bg-bone-100 transition">
          <Icon.Logout className="h-[18px] w-[18px] text-ink-500" />
          <span>Uitloggen</span>
        </Link>
      </div>
    </aside>
  );
}
