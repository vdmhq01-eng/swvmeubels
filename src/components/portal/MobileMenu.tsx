'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { Icon } from '@/components/ui/Icon';
import type { NavItem } from '@/lib/navigation';
import { iconRegistry, portalMeta } from '@/lib/navigation';
import type { Role } from '@/lib/types';
import { cn } from '@/lib/utils';

export function MobileMenu({
  items,
  role,
  activeHref,
}: {
  items: NavItem[];
  role: Role;
  activeHref: string;
}) {
  const [open, setOpen] = useState(false);
  const meta = portalMeta[role];

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="grid h-10 w-10 place-items-center rounded-xl border border-bone-200 bg-white text-ink-700 hover:bg-bone-100 lg:hidden"
      >
        <Icon.Settings className="h-[18px] w-[18px]" />
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <button
            aria-label="Sluit menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-ink-900/30 backdrop-blur-sm"
          />
          <aside className="absolute left-0 top-0 flex h-full w-72 max-w-[85%] flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <Logo />
              <button
                onClick={() => setOpen(false)}
                aria-label="Sluit menu"
                className="grid h-9 w-9 place-items-center rounded-xl text-ink-500 hover:bg-bone-100"
              >
                <Icon.X className="h-5 w-5" />
              </button>
            </div>
            <div className="mx-5 mb-2 rounded-xl border border-bone-200 bg-bone-50 px-3 py-2">
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-wood-700">
                {meta.chip} portaal
              </div>
              <div className="text-xs text-ink-500">{meta.subtitle}</div>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 pb-4">
              <ul className="flex flex-col gap-0.5">
                {items.map((item) => {
                  const IconComp = iconRegistry[item.icon];
                  const active = item.href === activeHref;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(active ? 'nav-link-active' : 'nav-link')}
                      >
                        <IconComp className={cn('h-[18px] w-[18px]', active ? 'text-wood-700' : 'text-ink-500')} />
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.badge ? (
                          <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-wood-500 px-1.5 text-[11px] font-semibold text-white">
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
              <Link href="/" className="nav-link" onClick={() => setOpen(false)}>
                <Icon.Logout className="h-[18px] w-[18px] text-ink-500" />
                <span>Uitloggen</span>
              </Link>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
