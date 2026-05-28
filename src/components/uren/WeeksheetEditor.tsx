'use client';

import { useMemo, useState } from 'react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { formatHours, weekRange } from '@/lib/utils';
import type { Timesheet, TimeEntryType } from '@/lib/types';

type Row = {
  date: string;
  weekday: string;
  PRAKTIJK: number;
  SCHOOL: number;
  ZIEKTE: number;
  VERLOF: number;
  AFWEZIG: number;
  note: string;
};

const dayNames = ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag', 'Zondag'];
const types: { key: TimeEntryType; label: string; tone: string }[] = [
  { key: 'PRAKTIJK', label: 'Praktijk', tone: 'text-wood-700' },
  { key: 'SCHOOL', label: 'School', tone: 'text-sky-700' },
  { key: 'ZIEKTE', label: 'Ziekte', tone: 'text-rose-700' },
  { key: 'VERLOF', label: 'Verlof', tone: 'text-emerald-700' },
  { key: 'AFWEZIG', label: 'Afwezig', tone: 'text-amber-700' },
];

function buildInitialRows(ts: Timesheet): Row[] {
  const start = new Date(ts.weekStartDate);
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const iso = d.toISOString().slice(0, 10);
    const dayEntries = ts.entries.filter((e) => e.date === iso);
    const row: Row = {
      date: iso,
      weekday: dayNames[i],
      PRAKTIJK: 0,
      SCHOOL: 0,
      ZIEKTE: 0,
      VERLOF: 0,
      AFWEZIG: 0,
      note: '',
    };
    for (const e of dayEntries) {
      row[e.type] = e.hours;
      if (e.note) row.note = e.note;
    }
    return row;
  });
}

export function WeeksheetEditor({ timesheet }: { timesheet: Timesheet }) {
  const [rows, setRows] = useState<Row[]>(() => buildInitialRows(timesheet));

  const totals = useMemo(() => {
    const t = { PRAKTIJK: 0, SCHOOL: 0, ZIEKTE: 0, VERLOF: 0, AFWEZIG: 0, totaal: 0 };
    for (const r of rows) {
      t.PRAKTIJK += r.PRAKTIJK;
      t.SCHOOL += r.SCHOOL;
      t.ZIEKTE += r.ZIEKTE;
      t.VERLOF += r.VERLOF;
      t.AFWEZIG += r.AFWEZIG;
    }
    t.totaal = t.PRAKTIJK + t.SCHOOL + t.ZIEKTE + t.VERLOF + t.AFWEZIG;
    return t;
  }, [rows]);

  const norm = timesheet.totals.norm;
  const ontbrekend = Math.max(0, norm - totals.totaal);

  function setCell(rowIdx: number, key: TimeEntryType, value: string) {
    const n = parseFloat(value.replace(',', '.'));
    setRows((prev) =>
      prev.map((r, i) => (i === rowIdx ? { ...r, [key]: Number.isFinite(n) ? Math.max(0, Math.min(16, n)) : 0 } : r)),
    );
  }

  function setNote(rowIdx: number, value: string) {
    setRows((prev) => prev.map((r, i) => (i === rowIdx ? { ...r, note: value.slice(0, 280) } : r)));
  }

  return (
    <Card>
      <CardHeader
        title={`Weekstaat week ${timesheet.weekNumber} · ${timesheet.year}`}
        subtitle={weekRange(timesheet.weekStartDate)}
        action={
          <div className="flex items-center gap-2">
            <Badge variant="warning">Concept</Badge>
            <button type="button" className="btn-secondary">
              Opslaan als concept
            </button>
            <button type="button" className="btn-primary">
              <Icon.Check className="h-4 w-4" />
              Indienen
            </button>
          </div>
        }
      />
      <CardBody>
        <div className="overflow-x-auto rounded-xl border border-bone-200">
          <table className="w-full min-w-[760px] border-collapse">
            <thead>
              <tr>
                <th className="table-head w-44">Dag</th>
                {types.map((t) => (
                  <th key={t.key} className="table-head text-right">
                    {t.label}
                  </th>
                ))}
                <th className="table-head text-right">Totaal</th>
                <th className="table-head">Notitie</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => {
                const rowTotal = r.PRAKTIJK + r.SCHOOL + r.ZIEKTE + r.VERLOF + r.AFWEZIG;
                return (
                  <tr key={r.date} className="table-row">
                    <td className="table-cell">
                      <div className="font-medium text-ink-900">{r.weekday}</div>
                      <div className="text-xs text-ink-500">{r.date}</div>
                    </td>
                    {types.map((t) => (
                      <td key={t.key} className="table-cell">
                        <input
                          inputMode="decimal"
                          aria-label={`${t.label} op ${r.weekday}`}
                          value={r[t.key] === 0 ? '' : String(r[t.key]).replace('.', ',')}
                          onChange={(e) => setCell(i, t.key, e.target.value)}
                          placeholder="0"
                          className={`input h-9 w-16 px-2 py-1 text-right ${t.tone}`}
                        />
                      </td>
                    ))}
                    <td className="table-cell text-right">
                      <span className="font-semibold text-ink-900">{formatHours(rowTotal)}</span>
                    </td>
                    <td className="table-cell">
                      <input
                        type="text"
                        value={r.note}
                        onChange={(e) => setNote(i, e.target.value)}
                        placeholder="Korte toelichting"
                        className="input h-9 py-1"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-bone-50">
                <td className="table-cell font-semibold">Totaal</td>
                {types.map((t) => (
                  <td key={t.key} className="table-cell text-right font-semibold">
                    {formatHours(totals[t.key])}
                  </td>
                ))}
                <td className="table-cell text-right font-semibold">{formatHours(totals.totaal)}</td>
                <td className="table-cell text-right text-xs text-ink-500">norm {formatHours(norm)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          <Status label="Totaal" value={formatHours(totals.totaal)} tone="wood" />
          <Status
            label="Ontbrekende uren"
            value={ontbrekend === 0 ? 'Geen' : formatHours(ontbrekend)}
            tone={ontbrekend === 0 ? 'green' : 'rose'}
          />
          <Status
            label="Afwijking school"
            value={totals.SCHOOL >= 7 ? 'Binnen norm' : 'Onder norm'}
            tone={totals.SCHOOL >= 7 ? 'green' : 'amber'}
          />
        </div>

        <div className="mt-5 rounded-xl border border-bone-200 bg-bone-50 p-4 text-sm text-ink-600">
          <div className="font-medium text-ink-900">Toelichting bij afkeuring</div>
          <p className="mt-1 text-xs text-ink-500">
            Als je weekstaat wordt afgekeurd ontvang je een verplichte reden. Je kunt de week
            daarna aanpassen en opnieuw indienen. Alle wijzigingen worden vastgelegd in de auditlog.
          </p>
        </div>
      </CardBody>
    </Card>
  );
}

function Status({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: 'wood' | 'green' | 'rose' | 'amber';
}) {
  const cls = {
    wood: 'bg-wood-50 text-wood-700 ring-wood-100',
    green: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    rose: 'bg-rose-50 text-rose-700 ring-rose-100',
    amber: 'bg-amber-50 text-amber-700 ring-amber-100',
  }[tone];
  return (
    <div className={`rounded-xl px-4 py-3 ring-1 ${cls}`}>
      <div className="text-[11px] uppercase tracking-wider opacity-80">{label}</div>
      <div className="text-base font-semibold">{value}</div>
    </div>
  );
}
