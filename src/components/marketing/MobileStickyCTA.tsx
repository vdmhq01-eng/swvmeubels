import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';

/**
 * Sticky CTA onderaan op mobiel — altijd zichtbaar voor jeugd
 * die scrollend door de pagina gaat. WhatsApp + Solliciteer.
 */
export function MobileStickyCTA() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 pb-4 lg:hidden">
      <div className="pointer-events-auto mx-auto flex max-w-md gap-2 rounded-2xl bg-ink-900/95 p-2 shadow-2xl backdrop-blur-md">
        <a
          href="https://wa.me/31235158830"
          target="_blank"
          rel="noopener"
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-white px-3 py-3 text-xs font-bold uppercase tracking-wider text-ink-900"
        >
          <Icon.Bell className="h-4 w-4" />
          App ons
        </a>
        <Link
          href="/solliciteren"
          className="inline-flex flex-[2] items-center justify-center gap-2 rounded-xl bg-primary-500 px-3 py-3 text-xs font-bold uppercase tracking-wider text-white"
        >
          Solliciteer nu
          <Icon.ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
