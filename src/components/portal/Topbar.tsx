import Link from 'next/link';
import { Avatar } from '@/components/ui/Avatar';
import { Icon } from '@/components/ui/Icon';
import { MobileMenu } from './MobileMenu';
import { NotificationBell } from './NotificationBell';
import type { Role } from '@/lib/types';
import { navigation } from '@/lib/navigation';

export function Topbar({
  userName,
  userSubtitle,
  showSearch = true,
  greeting,
  role,
  activeHref,
  userId,
}: {
  userName: string;
  userSubtitle: string;
  showSearch?: boolean;
  greeting?: { title: string; subtitle: string };
  role: Role;
  activeHref: string;
  userId?: string;
}) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-bone-200 bg-bone-50/85 px-4 py-4 backdrop-blur lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <MobileMenu items={navigation[role]} role={role} activeHref={activeHref} />
        <div className="min-w-0">
          {greeting ? (
            <>
              <h1 className="truncate font-display text-xl font-semibold tracking-tight text-ink-900 sm:text-2xl lg:text-3xl">
                {greeting.title}
              </h1>
              <p className="mt-0.5 hidden text-sm text-ink-500 sm:block">{greeting.subtitle}</p>
            </>
          ) : null}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        {showSearch && role !== 'STUDENT' ? (
          <div className="relative hidden md:block">
            <Icon.Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              type="search"
              placeholder={searchPlaceholder(role)}
              className="input w-72 pl-9"
            />
          </div>
        ) : null}

        {userId ? <NotificationBell userId={userId} /> : null}

        <Link
          href={portalSettingsHref(role)}
          className="flex items-center gap-3 rounded-full border border-bone-200 bg-white py-1.5 pl-1.5 pr-3 hover:bg-bone-50"
        >
          <Avatar name={userName} size="sm" />
          <div className="hidden text-left leading-tight sm:block">
            <div className="text-sm font-medium text-ink-900">{userName}</div>
            <div className="text-xs text-ink-500">{userSubtitle}</div>
          </div>
        </Link>
      </div>
    </header>
  );
}

function portalSettingsHref(role: Role) {
  switch (role) {
    case 'STUDENT': return '/student/instellingen';
    case 'COORDINATOR': return '/coordinator/instellingen';
    case 'COMPANY': return '/lidbedrijf/instellingen';
    case 'ADMIN': return '/admin/instellingen';
  }
}

function searchPlaceholder(role: Role): string {
  switch (role) {
    case 'COORDINATOR': return 'Zoek student, lidbedrijf of document';
    case 'COMPANY': return 'Zoek student, weekstaat of document';
    case 'ADMIN': return 'Zoek gebruiker, bedrijf, integratie of log';
    default: return 'Zoeken';
  }
}
