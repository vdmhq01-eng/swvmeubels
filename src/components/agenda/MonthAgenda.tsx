'use client';

import { useMemo, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { allEventsForYear, categoryStyle, type AgendaEvent, type EventCategory } from '@/lib/agenda/events';

type Props = {
  /** Filter scope: alles voor admin, regio voor coordinator */
  filterRegio?: string;
  /** Toon alleen relevante categorieën */
  hideCategories?: EventCategory[];
  /** Initieel jaar/maand */
  initialYear?: number;
  initialMonth?: number;
};

const DAGEN = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'];
const MAANDEN = [
  'januari', 'februari', 'maart', 'april', 'mei', 'juni',
  'juli', 'augustus', 'september', 'oktober', 'november', 'december',
];

export function MonthAgenda({ filterRegio, hideCategories = [], initialYear, initialMonth }: Props) {
  const today = new Date();
  const [year, setYear] = useState(initialYear ?? today.getFullYear());
  const [month, setMonth] = useState(initialMonth ?? today.getMonth()); // 0-11
  const [activeFilter, setActiveFilter] = useState<EventCategory | 'ALL'>('ALL');

  const events = useMemo(() => {
    return allEventsForYear(year).filter((e) => {
      if (filterRegio && e.regio && e.regio !== filterRegio) return false;
      if (hideCategories.includes(e.category)) return false;
      if (activeFilter !== 'ALL' && e.category !== activeFilter) return false;
      return true;
    });
  }, [year, filterRegio, hideCategories, activeFilter]);

  // Bouw maand grid
  const firstOfMonth = new Date(Date.UTC(year, month, 1));
  const dayOfWeek = (firstOfMonth.getUTCDay() + 6) % 7; // 0 = ma, 6 = zo
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();

  const cells: Array<{ date: Date | null; events: AgendaEvent[] }> = [];

  // Lege cells voor dagen voor de 1e
  for (let i = 0; i < dayOfWeek; i++) cells.push({ date: null, events: [] });

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(Date.UTC(year, month, d));
    const iso = date.toISOString().slice(0, 10);
    const dayEvents = events.filter((e) => {
      if (e.date === iso) return true;
      if (e.endDate) {
        const start = new Date(e.date + 'T00:00:00Z');
        const end = new Date(e.endDate + 'T00:00:00Z');
        return date >= start && date <= end;
      }
      return false;
    });
    cells.push({ date, events: dayEvents });
  }

  // Aanvul tot 42 cells (6 weken)
  while (cells.length % 7 !== 0) cells.push({ date: null, events: [] });

  function nav(delta: number) {
    let m = month + delta;
    let y = year;
    if (m < 0) { m = 11; y--; }
    if (m > 11) { m = 0; y++; }
    setMonth(m);
    setYear(y);
  }

  const upcomingEvents = events
    .filter((e) => new Date(e.date) >= new Date(today.toISOString().slice(0, 10)))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 8);

  const categoriesInUse: EventCategory[] = Array.from(new Set(events.map((e) => e.category)));

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
      <div>
        {/* Header met navigatie + filters */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-bone-200 bg-white p-4 shadow-card">
          <div className="flex items-center gap-2">
            <button onClick={() => nav(-1)} className="grid h-9 w-9 place-items-center rounded-lg border border-bone-200 hover:bg-bone-100" aria-label="Vorige maand">
              <Icon.ArrowRight className="h-4 w-4 rotate-180" />
            </button>
            <h2 className="font-display text-xl font-bold capitalize text-ink-900">
              {MAANDEN[month]} {year}
            </h2>
            <button onClick={() => nav(1)} className="grid h-9 w-9 place-items-center rounded-lg border border-bone-200 hover:bg-bone-100" aria-label="Volgende maand">
              <Icon.ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => { setYear(today.getFullYear()); setMonth(today.getMonth()); }}
              className="ml-2 rounded-lg border border-bone-200 px-3 py-1.5 text-xs font-bold uppercase tracking-wider hover:bg-bone-100"
            >
              Vandaag
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <FilterPill label="Alles" active={activeFilter === 'ALL'} onClick={() => setActiveFilter('ALL')} />
            {categoriesInUse.map((c) => (
              <FilterPill
                key={c}
                label={categoryStyle(c).label}
                active={activeFilter === c}
                onClick={() => setActiveFilter(c)}
                color={categoryStyle(c).bg}
              />
            ))}
          </div>
        </div>

        {/* Calendar grid */}
        <div className="overflow-hidden rounded-2xl border border-bone-200 bg-white shadow-card">
          <div className="grid grid-cols-7 border-b border-bone-200 bg-bone-50">
            {DAGEN.map((d) => (
              <div key={d} className="px-2 py-3 text-center text-[11px] font-bold uppercase tracking-[0.15em] text-ink-500">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {cells.map((cell, i) => {
              const isToday =
                cell.date &&
                cell.date.toISOString().slice(0, 10) === today.toISOString().slice(0, 10);
              return (
                <div
                  key={i}
                  className={`relative min-h-[90px] border-b border-r border-bone-100 p-1.5 ${
                    !cell.date ? 'bg-bone-50/50' : ''
                  }`}
                >
                  {cell.date ? (
                    <>
                      <div
                        className={`mb-1 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                          isToday ? 'bg-primary-500 text-white' : 'text-ink-700'
                        }`}
                      >
                        {cell.date.getUTCDate()}
                      </div>
                      <div className="space-y-0.5">
                        {cell.events.slice(0, 3).map((e) => {
                          const m = categoryStyle(e.category);
                          return (
                            <div
                              key={e.id}
                              className={`truncate rounded px-1 py-0.5 text-[10px] font-semibold ${m.bg} ${m.color}`}
                              title={e.title + (e.details ? ' — ' + e.details : '')}
                            >
                              {e.title}
                            </div>
                          );
                        })}
                        {cell.events.length > 3 ? (
                          <div className="text-[10px] text-ink-500">+{cell.events.length - 3} meer</div>
                        ) : null}
                      </div>
                    </>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sidebar: aankomende events */}
      <aside>
        <div className="rounded-2xl border border-bone-200 bg-white p-5 shadow-card">
          <div className="text-xs font-bold uppercase tracking-[0.15em] text-primary-600">
            Aankomend
          </div>
          <h3 className="mt-1 font-display text-lg font-bold">Volgende 8 events</h3>
          <ul className="mt-4 space-y-3">
            {upcomingEvents.length === 0 ? (
              <li className="text-sm text-ink-500">Geen events gepland.</li>
            ) : (
              upcomingEvents.map((e) => {
                const m = categoryStyle(e.category);
                const d = new Date(e.date + 'T00:00:00Z');
                return (
                  <li key={e.id} className="flex items-start gap-3">
                    <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-md ${m.bg} ${m.color}`}>
                      <div className="text-center">
                        <div className="font-display text-base font-bold leading-none">{d.getUTCDate()}</div>
                        <div className="text-[9px] font-semibold uppercase">{MAANDEN[d.getUTCMonth()].slice(0, 3)}</div>
                      </div>
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-ink-900 line-clamp-1">{e.title}</div>
                      <div className="text-[11px] text-ink-500">
                        {m.label}{e.regio ? ` · ${e.regio}` : ''}
                      </div>
                      {e.details ? (
                        <div className="mt-0.5 text-[11px] text-ink-600 line-clamp-1">{e.details}</div>
                      ) : null}
                    </div>
                  </li>
                );
              })
            )}
          </ul>
        </div>

        <div className="mt-4 rounded-2xl border border-bone-200 bg-white p-5 shadow-card">
          <div className="text-xs font-bold uppercase tracking-[0.15em] text-primary-600">Categorieën</div>
          <ul className="mt-3 space-y-1.5 text-xs">
            {categoriesInUse.map((c) => {
              const m = categoryStyle(c);
              const count = events.filter((e) => e.category === c).length;
              return (
                <li key={c} className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className={`inline-block h-2.5 w-2.5 rounded-sm ${m.bg.replace('bg-', 'bg-')}`} />
                    {m.label}
                  </span>
                  <span className="font-semibold text-ink-500">{count}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>
    </div>
  );
}

function FilterPill({ label, active, onClick, color }: { label: string; active: boolean; onClick: () => void; color?: string }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold transition ${
        active ? 'bg-ink-900 text-white' : 'bg-bone-100 text-ink-700 hover:bg-bone-200'
      }`}
    >
      {color ? <span className={`inline-block h-2 w-2 rounded-sm ${color}`} /> : null}
      {label}
    </button>
  );
}
