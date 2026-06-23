'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { useToast } from '@/components/ui/Toast';

type InstallState = 'idle' | 'available' | 'ios' | 'android-other' | 'desktop' | 'installed';

const DISMISS_KEY = 'swv-install-dismissed-at';
const DISMISS_DAYS = 14;

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function AppInstallBanner() {
  const { toast } = useToast();
  const [show, setShow] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [installState, setInstallState] = useState<InstallState>('idle');
  const [notifGranted, setNotifGranted] = useState(false);
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Register service worker (vereist voor PWA install prompt op Chrome/Edge)
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.warn('SW registratie mislukt', err);
      });
    }

    // Recent gedismissed?
    const dismissedAt = Number(localStorage.getItem(DISMISS_KEY) ?? 0);
    const recentlyDismissed = dismissedAt && Date.now() - dismissedAt < DISMISS_DAYS * 86400_000;

    // Standalone (al geïnstalleerd)?
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as { standalone?: boolean }).standalone === true;

    if (isStandalone) {
      setInstallState('installed');
      return;
    }

    if ('Notification' in window) {
      setNotifGranted(Notification.permission === 'granted');
    }

    // Detecteer platform
    const ua = window.navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua);
    const isAndroid = /Android/i.test(ua);
    const isMobile = isIOS || isAndroid;

    if (isIOS) setInstallState('ios');
    else if (isAndroid) setInstallState('android-other');
    else setInstallState('desktop');

    function onBeforeInstall(e: BeforeInstallPromptEvent) {
      e.preventDefault();
      setDeferred(e);
      setInstallState('available');
    }
    window.addEventListener('beforeinstallprompt', onBeforeInstall);

    if (!recentlyDismissed) setShow(true);

    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstall);
  }, []);

  async function handleInstall() {
    if (deferred) {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      if (choice.outcome === 'accepted') {
        toast({ variant: 'success', title: 'App geïnstalleerd', description: 'Je kunt SWV Meubel nu vanaf je startscherm openen.' });
        setShow(false);
      }
      setDeferred(null);
      return;
    }
    setShowInstructions(true);
  }

  async function handleNotifications() {
    if (!('Notification' in window)) {
      toast({ variant: 'error', title: 'Niet ondersteund', description: 'Je browser ondersteunt geen push-meldingen.' });
      return;
    }
    const result = await Notification.requestPermission();
    if (result === 'granted') {
      setNotifGranted(true);
      new Notification('SWV Meubel', {
        body: 'Meldingen staan aan. Je ontvangt updates over weekstaten, ziekmeldingen en planning.',
        icon: '/icon.svg',
      });
      toast({ variant: 'success', title: 'Meldingen aan', description: 'Je ontvangt voortaan push-meldingen.' });
    } else if (result === 'denied') {
      toast({ variant: 'error', title: 'Geblokkeerd', description: 'Zet meldingen aan in je browserinstellingen.' });
    }
  }

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setShow(false);
  }

  if (!show || installState === 'installed') return null;

  return (
    <>
      <div className="mb-6 overflow-hidden rounded-2xl border border-primary-200 bg-gradient-to-br from-primary-50 to-bone-50 shadow-card">
        <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-[auto_1fr_auto] md:items-center md:gap-6">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-primary-500 text-white shadow-soft">
            <PhoneIcon className="h-6 w-6" />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-display text-base font-bold text-ink-900">
                Installeer de SWV Meubel app
              </h3>
              <span className="badge-primary">Aanbevolen</span>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-ink-600">
              Krijg meldingen op je telefoon bij weekstaten, ziekmeldingen en planning. De app werkt
              offline en je vult uren sneller in.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 md:flex-nowrap">
            <button onClick={handleInstall} className="btn-primary">
              <Icon.Upload className="h-4 w-4" />
              {installState === 'available' ? 'Installeer app' : 'Hoe installeren?'}
            </button>
            <button
              onClick={handleNotifications}
              disabled={notifGranted}
              className="btn-secondary disabled:opacity-60"
            >
              <Icon.Bell className="h-4 w-4" />
              {notifGranted ? 'Meldingen aan' : 'Meldingen aan'}
            </button>
            <button
              onClick={dismiss}
              aria-label="Sluit melding"
              className="grid h-9 w-9 place-items-center rounded-xl text-ink-500 hover:bg-bone-100"
            >
              <Icon.X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {showInstructions ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-ink-900/60 p-4 backdrop-blur-sm"
          onClick={() => setShowInstructions(false)}
        >
          <div
            className="max-w-md rounded-3xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-md bg-primary-500 text-white">
                  <PhoneIcon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg font-bold">Installeer de SWV app</h3>
              </div>
              <button onClick={() => setShowInstructions(false)} className="rounded-lg p-1 hover:bg-bone-100">
                <Icon.X className="h-5 w-5" />
              </button>
            </div>

            {installState === 'ios' ? (
              <ol className="mt-5 list-decimal space-y-3 pl-5 text-sm text-ink-700">
                <li>Tik op de <strong>Delen-knop</strong> onderin je Safari-browser (vierkant met pijl omhoog).</li>
                <li>Scroll omlaag en kies <strong>&ldquo;Zet op beginscherm&rdquo;</strong>.</li>
                <li>Tik op <strong>Voeg toe</strong>.</li>
                <li>Open de SWV-app voortaan vanaf je beginscherm.</li>
              </ol>
            ) : installState === 'android-other' ? (
              <ol className="mt-5 list-decimal space-y-3 pl-5 text-sm text-ink-700">
                <li>Tik op het <strong>menu (drie puntjes)</strong> rechtsboven in je browser.</li>
                <li>Kies <strong>&ldquo;App installeren&rdquo;</strong> of <strong>&ldquo;Toevoegen aan startscherm&rdquo;</strong>.</li>
                <li>Bevestig met <strong>Installeren</strong>.</li>
                <li>De app verschijnt op je startscherm — open vanaf daar.</li>
              </ol>
            ) : (
              <ol className="mt-5 list-decimal space-y-3 pl-5 text-sm text-ink-700">
                <li>Klik op het <strong>installatie-icoontje</strong> rechts in de adresbalk (computer-met-pijl).</li>
                <li>Klik op <strong>&ldquo;Installeren&rdquo;</strong>.</li>
                <li>De SWV app opent in een eigen venster.</li>
                <li>Niet zichtbaar? Open in Chrome of Edge.</li>
              </ol>
            )}

            <div className="mt-5 rounded-xl border border-bone-200 bg-bone-50 p-3 text-xs text-ink-600">
              Werkt het niet? Refresh de pagina eens of bezoek het portaal een paar keer — browsers tonen de installatie-optie pas na voldoende gebruik.
            </div>

            <button onClick={() => setShowInstructions(false)} className="btn-primary mt-4 w-full">
              Begrepen
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="6" y="2.5" width="12" height="19" rx="2.5" />
      <path d="M11 18.5h2" />
    </svg>
  );
}
