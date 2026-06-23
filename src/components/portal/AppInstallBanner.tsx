'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { useToast } from '@/components/ui/Toast';

type InstallState = 'idle' | 'available' | 'ios' | 'installed';

// Banner die studenten uitnodigt de PWA te installeren en push-notificaties
// aan te zetten. Detecteert iOS (waar geen `beforeinstallprompt` event bestaat
// en de installatie via "Deel → Zet op beginscherm" gaat). Onthoudt dismissal
// in localStorage zodat hij niet steeds terugkomt.

const DISMISS_KEY = 'swv-install-dismissed-at';
const DISMISS_DAYS = 30;

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
  const [installState, setInstallState] = useState<InstallState>('idle');
  const [notifGranted, setNotifGranted] = useState(false);
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Bekijk of de gebruiker recent al heeft weggeklikt
    const dismissedAt = Number(localStorage.getItem(DISMISS_KEY) ?? 0);
    const recentlyDismissed = dismissedAt && Date.now() - dismissedAt < DISMISS_DAYS * 86400_000;

    // Is de app al geïnstalleerd? (standalone display mode)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as { standalone?: boolean }).standalone === true;

    if (isStandalone) {
      setInstallState('installed');
      return;
    }

    // iOS Safari (geen beforeinstallprompt support)
    const ua = window.navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua) && !('MSStream' in window);

    // Notification status
    if ('Notification' in window) {
      setNotifGranted(Notification.permission === 'granted');
    }

    if (isIOS) {
      setInstallState('ios');
    }

    function onBeforeInstall(e: BeforeInstallPromptEvent) {
      e.preventDefault();
      setDeferred(e);
      setInstallState('available');
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstall);

    if (!recentlyDismissed) {
      setShow(true);
    }

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
    } else if (installState === 'ios') {
      toast({
        variant: 'info',
        title: 'Voeg toe aan beginscherm',
        description: 'Tik op het Delen-icoon onderaan en kies "Zet op beginscherm".',
      });
    } else {
      toast({
        variant: 'info',
        title: 'Installeren niet beschikbaar',
        description: 'Open de site in Chrome of Safari op je telefoon om te installeren.',
      });
    }
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
      });
      toast({ variant: 'success', title: 'Meldingen aan', description: 'Je ontvangt voortaan push-meldingen.' });
    } else if (result === 'denied') {
      toast({ variant: 'error', title: 'Meldingen geblokkeerd', description: 'Zet meldingen aan in je browserinstellingen.' });
    }
  }

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setShow(false);
  }

  if (!show || installState === 'installed') return null;

  return (
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
            Krijg meldingen op je telefoon bij ziekmeldingen, weekstaten en planning. De app
            werkt offline en je kunt sneller uren invullen.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 md:flex-nowrap">
          <button onClick={handleInstall} className="btn-primary">
            <Icon.Upload className="h-4 w-4" />
            {installState === 'ios' ? 'Hoe?' : 'Installeer app'}
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
