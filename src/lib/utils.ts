import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const dateFmt = new Intl.DateTimeFormat('nl-NL', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

const dateLongFmt = new Intl.DateTimeFormat('nl-NL', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const moneyFmt = new Intl.NumberFormat('nl-NL', {
  style: 'currency',
  currency: 'EUR',
});

export function formatDate(value: string | Date) {
  const d = typeof value === 'string' ? new Date(value) : value;
  return dateFmt.format(d);
}

export function formatDateLong(value: string | Date) {
  const d = typeof value === 'string' ? new Date(value) : value;
  return dateLongFmt.format(d);
}

export function formatMoney(value: number) {
  return moneyFmt.format(value);
}

export function formatHours(value: number) {
  const fixed = value.toFixed(2).replace('.', ',');
  return `${fixed} u`;
}

export function initialsFromName(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');
}

export function weekRange(startISO: string) {
  const start = new Date(startISO);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  const sFmt = new Intl.DateTimeFormat('nl-NL', { day: 'numeric', month: 'short' });
  const eFmt = new Intl.DateTimeFormat('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' });
  return `${sFmt.format(start)} – ${eFmt.format(end)}`;
}

export function isoWeekNumber(d: Date) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil(((+date - +yearStart) / 86400000 + 1) / 7);
}
