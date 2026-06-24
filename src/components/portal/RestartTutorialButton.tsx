'use client';

import { Icon } from '@/components/ui/Icon';

export function RestartTutorialButton() {
  return (
    <button
      onClick={() => {
        try {
          localStorage.removeItem('swv-tutorial-seen-v1');
          window.location.reload();
        } catch {}
      }}
      className="btn-secondary"
    >
      <Icon.BookOpen className="h-4 w-4" />
      Herstart rondleiding
    </button>
  );
}
