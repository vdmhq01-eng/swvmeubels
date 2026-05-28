import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import type { Role } from '@/lib/types';
import { navigation } from '@/lib/navigation';

export function PortalShell({
  role,
  activeHref,
  userName,
  userSubtitle,
  greeting,
  showSearch,
  children,
}: {
  role: Role;
  activeHref: string;
  userName: string;
  userSubtitle: string;
  greeting?: { title: string; subtitle: string };
  showSearch?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-bone-50">
      <Sidebar items={navigation[role]} role={role} activeHref={activeHref} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          userName={userName}
          userSubtitle={userSubtitle}
          greeting={greeting}
          showSearch={showSearch}
          role={role}
          activeHref={activeHref}
        />
        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
