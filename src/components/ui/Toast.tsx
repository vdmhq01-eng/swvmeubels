'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Icon } from './Icon';
import { cn } from '@/lib/utils';

type Variant = 'success' | 'error' | 'info';
type ToastItem = { id: number; title: string; description?: string; variant: Variant };

type Ctx = {
  toast: (t: Omit<ToastItem, 'id'>) => void;
};

const ToastCtx = createContext<Ctx | null>(null);

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: number) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((t: Omit<ToastItem, 'id'>) => {
    const id = Date.now() + Math.random();
    setItems((prev) => [...prev, { ...t, id }]);
    setTimeout(() => dismiss(id), 4000);
  }, [dismiss]);

  return (
    <ToastCtx.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex flex-col items-center gap-2 px-4">
        {items.map((t) => (
          <ToastView key={t.id} item={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

function ToastView({ item, onDismiss }: { item: ToastItem; onDismiss: () => void }) {
  const [enter, setEnter] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setEnter(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const cls = {
    success: 'border-emerald-100 bg-emerald-50 text-emerald-900',
    error: 'border-rose-100 bg-rose-50 text-rose-900',
    info: 'border-bone-200 bg-white text-ink-900',
  }[item.variant];

  const icon = {
    success: <Icon.CheckCircle className="h-4 w-4 text-emerald-600" />,
    error: <Icon.AlertTriangle className="h-4 w-4 text-rose-600" />,
    info: <Icon.Activity className="h-4 w-4 text-wood-600" />,
  }[item.variant];

  return (
    <div
      className={cn(
        'pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-2xl border px-4 py-3 shadow-card transition-all duration-200',
        cls,
        enter ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0',
      )}
      role="status"
    >
      <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-white/70">{icon}</div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium">{item.title}</div>
        {item.description ? <div className="mt-0.5 text-xs opacity-80">{item.description}</div> : null}
      </div>
      <button
        onClick={onDismiss}
        aria-label="Sluit melding"
        className="rounded-lg p-1 text-ink-500 hover:bg-bone-100"
      >
        <Icon.X className="h-4 w-4" />
      </button>
    </div>
  );
}
