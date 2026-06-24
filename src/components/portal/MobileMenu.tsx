'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
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
  const [mounted, setMounted] = useState(false);
  const meta = portalMeta[role];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const drawer = (
    <div className="fixed inset-0 z-[100] lg:hidden" role="dialog" aria-modal="true">
      <button
        aria-label="Sluit menu"
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-ink-900/50 backdrop-blur-sm"
      />
      <aside className="absolute inset-y-0 left-0 flex w-80 max-w-[88%] flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-bone-100 px-5 py-4">
          <Logo />
          <button
            onClick={() => setOpen(false)}
            aria-label="Sluit menu"
            className="grid h-10 w-10 place-items-center rounded-xl text-ink-500 hover:bg-bone-100"
          >
            <Icon.X className="h-5 w-5" />
          </button>
        </div>

        <div className="mx-5 my-3 rounded-xl border border-primary-100 bg-primary-50 px-3 py-2">
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary-700">
            {meta.chip} portaal
          </div>
          <div className="text-xs text-primary-600/80">{meta.subtitle}</div>
        </div>

        <nav className="min-h-0 flex-1 overflow-y-auto px-3 pb-4">
          <ul className="flex flex-col gap-0.5">
            {items.map((item) => {
              const IconComp = iconRegistry[item.icon];
              const active = item.href === activeHref;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition',
                      active
                        ? 'bg-primary-500 text-white font-bold shadow-soft'
                        : 'text-ink-700 hover:bg-bone-100 font-medium',
                    )}
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
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-ink-700 hover:bg-bone-100 transition"
            onClick={() => setOpen(false)}
          >
            <Icon.Logout className="h-[18px] w-[18px] text-ink-500" />
            <span>Uitloggen</span>
          </Link>
        </div>
      </aside>
    </div>
  );

  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="grid h-10 w-10 place-items-center rounded-xl border border-bone-200 bg-white text-ink-700 hover:bg-bone-100 lg:hidden"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
          <line x1="4" y1="7" x2="20" y2="7" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="17" x2="20" y2="17" />
        </svg>
      </button>

      {/* Render naar document.body om escape uit backdrop-filter containing block */}
      {open && mounted ? createPortal(drawer, document.body) : null}
    </>
  );
}
