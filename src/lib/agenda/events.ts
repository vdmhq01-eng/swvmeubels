/**
 * Jaarlijks-terugkerende events generator + event types per scope.
 * Combineert: vaste feestdagen, vaste maandelijkse loon/facturatie,
 * trainingen/cursussen, bouwvak per regio.
 *
 * In productie: PlanningItem in DB voor unieke events,
 * deze generator voor repeating/calculated events.
 */

export type EventCategory =
  | 'FEESTDAG'
  | 'SALARIS'
  | 'FACTURATIE'
  | 'BOUWVAK'
  | 'OPENDAG_SCHOOL'
  | 'DIPLOMA'
  | 'TRAINING'
  | 'VAKANTIE'
  | 'EVALUATIE'
  | 'INTERN';

export type AgendaEvent = {
  id: string;
  title: string;
  date: string; // ISO YYYY-MM-DD
  endDate?: string;
  category: EventCategory;
  scope: 'ALGEMEEN' | 'BINNENDIENST' | 'REGIO' | 'COORDINATOR' | 'LEERBEDRIJF';
  regio?: string;
  details?: string;
  recurring?: boolean;
};

const categoryMeta: Record<EventCategory, { label: string; color: string; bg: string }> = {
  FEESTDAG:        { label: 'Feestdag',          color: 'text-rose-700',    bg: 'bg-rose-100' },
  SALARIS:         { label: 'Salaris',           color: 'text-emerald-700', bg: 'bg-emerald-100' },
  FACTURATIE:      { label: 'Facturatie',        color: 'text-amber-700',   bg: 'bg-amber-100' },
  BOUWVAK:         { label: 'Bouwvak',           color: 'text-orange-700',  bg: 'bg-orange-100' },
  OPENDAG_SCHOOL:  { label: 'Open dag school',   color: 'text-blue-700',    bg: 'bg-blue-100' },
  DIPLOMA:         { label: 'Diploma-uitreiking', color: 'text-violet-700', bg: 'bg-violet-100' },
  TRAINING:        { label: 'Training/cursus',   color: 'text-teal-700',    bg: 'bg-teal-100' },
  VAKANTIE:        { label: 'Vakantie collega',  color: 'text-sky-700',     bg: 'bg-sky-100' },
  EVALUATIE:       { label: 'Evaluatie',         color: 'text-indigo-700',  bg: 'bg-indigo-100' },
  INTERN:          { label: 'Intern',            color: 'text-ink-700',     bg: 'bg-bone-200' },
};

export function categoryStyle(c: EventCategory) {
  return categoryMeta[c];
}

// ─── NL Feestdagen (incl. variabele Pasen-gebaseerde) ───────────────

function easter(year: number): Date {
  // Anonymous Gregorian algorithm
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const L = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * L) / 451);
  const month = Math.floor((h + L - 7 * m + 114) / 31);
  const day = ((h + L - 7 * m + 114) % 31) + 1;
  return new Date(Date.UTC(year, month - 1, day));
}

function iso(d: Date) {
  return d.toISOString().slice(0, 10);
}

function addDays(d: Date, n: number) {
  const r = new Date(d);
  r.setUTCDate(r.getUTCDate() + n);
  return r;
}

export function feestdagen(year: number): AgendaEvent[] {
  const e = easter(year);
  return [
    { id: `fd-${year}-01`, title: 'Nieuwjaarsdag',         date: `${year}-01-01`, category: 'FEESTDAG', scope: 'ALGEMEEN', recurring: true },
    { id: `fd-${year}-02`, title: 'Goede Vrijdag',         date: iso(addDays(e, -2)), category: 'FEESTDAG', scope: 'ALGEMEEN', recurring: true },
    { id: `fd-${year}-03`, title: 'Eerste Paasdag',        date: iso(e), category: 'FEESTDAG', scope: 'ALGEMEEN', recurring: true },
    { id: `fd-${year}-04`, title: 'Tweede Paasdag',        date: iso(addDays(e, 1)), category: 'FEESTDAG', scope: 'ALGEMEEN', recurring: true },
    { id: `fd-${year}-05`, title: 'Koningsdag',            date: `${year}-04-27`, category: 'FEESTDAG', scope: 'ALGEMEEN', recurring: true },
    { id: `fd-${year}-06`, title: 'Bevrijdingsdag',        date: `${year}-05-05`, category: 'FEESTDAG', scope: 'ALGEMEEN', recurring: true },
    { id: `fd-${year}-07`, title: 'Hemelvaartsdag',        date: iso(addDays(e, 39)), category: 'FEESTDAG', scope: 'ALGEMEEN', recurring: true },
    { id: `fd-${year}-08`, title: 'Eerste Pinksterdag',    date: iso(addDays(e, 49)), category: 'FEESTDAG', scope: 'ALGEMEEN', recurring: true },
    { id: `fd-${year}-09`, title: 'Tweede Pinksterdag',    date: iso(addDays(e, 50)), category: 'FEESTDAG', scope: 'ALGEMEEN', recurring: true },
    { id: `fd-${year}-10`, title: 'Eerste Kerstdag',       date: `${year}-12-25`, category: 'FEESTDAG', scope: 'ALGEMEEN', recurring: true },
    { id: `fd-${year}-11`, title: 'Tweede Kerstdag',       date: `${year}-12-26`, category: 'FEESTDAG', scope: 'ALGEMEEN', recurring: true },
  ];
}

// ─── Maandelijkse loon + facturatie ──────────────────────────────────

export function maandritmes(year: number): AgendaEvent[] {
  const out: AgendaEvent[] = [];
  for (let m = 0; m < 12; m++) {
    const mm = String(m + 1).padStart(2, '0');
    out.push({
      id: `sal-${year}-${mm}`,
      title: 'Salarisbetaling',
      date: `${year}-${mm}-25`,
      category: 'SALARIS',
      scope: 'BINNENDIENST',
      details: 'Maandelijkse loonbetaling alle studenten',
      recurring: true,
    });
    out.push({
      id: `fac-${year}-${mm}`,
      title: 'Facturatie lidbedrijven',
      date: `${year}-${mm}-05`,
      category: 'FACTURATIE',
      scope: 'BINNENDIENST',
      details: 'Maandelijkse factuurronde aan 300 lidbedrijven',
      recurring: true,
    });
  }
  return out;
}

// ─── Bouwvak per regio ──────────────────────────────────────────────

export function bouwvakken(year: number): AgendaEvent[] {
  // Bouwvak Nederland: ~3 weken in juli-augustus per regio
  return [
    {
      id: `bv-${year}-noord`,
      title: 'Bouwvak Noord',
      date: `${year}-07-27`,
      endDate: `${year}-08-14`,
      category: 'BOUWVAK',
      scope: 'REGIO',
      regio: 'Noord-Nederland',
      recurring: true,
    },
    {
      id: `bv-${year}-midden`,
      title: 'Bouwvak Midden',
      date: `${year}-07-20`,
      endDate: `${year}-08-07`,
      category: 'BOUWVAK',
      scope: 'REGIO',
      regio: 'Twente-Salland',
      recurring: true,
    },
    {
      id: `bv-${year}-zuid`,
      title: 'Bouwvak Zuid',
      date: `${year}-07-13`,
      endDate: `${year}-07-31`,
      category: 'BOUWVAK',
      scope: 'REGIO',
      regio: 'Brabant',
      recurring: true,
    },
  ];
}

// ─── Een-malige events (in productie: uit DB PlanningItem) ───────────

export function eenmaligeEvents(year: number): AgendaEvent[] {
  return [
    { id: 'evt-1', title: 'Open dag Noorderpoort',     date: `${year}-03-15`, category: 'OPENDAG_SCHOOL', scope: 'REGIO', regio: 'Noord-Nederland', details: 'Groningen, 10:00 — 16:00' },
    { id: 'evt-2', title: 'Open dag ROC van Twente',   date: `${year}-03-22`, category: 'OPENDAG_SCHOOL', scope: 'REGIO', regio: 'Twente-Salland' },
    { id: 'evt-3', title: 'Diploma-uitreiking BBL 3',  date: `${year}-06-25`, category: 'DIPLOMA',        scope: 'REGIO', regio: 'Noord-Nederland', details: 'Galerij 19:30' },
    { id: 'evt-4', title: 'VCA training (basis)',      date: `${year}-04-08`, category: 'TRAINING',       scope: 'ALGEMEEN', details: 'Heel SWV, 2-daags' },
    { id: 'evt-5', title: 'Heftruckcursus Q2',         date: `${year}-05-12`, category: 'TRAINING',       scope: 'ALGEMEEN' },
    { id: 'evt-6', title: 'Praktijkbeoordeling Q2',    date: `${year}-06-08`, category: 'EVALUATIE',      scope: 'BINNENDIENST' },
    { id: 'evt-7', title: 'Sanne Bakker vakantie',     date: `${year}-08-05`, endDate: `${year}-08-19`, category: 'VAKANTIE', scope: 'COORDINATOR', regio: 'Noord-Nederland' },
    { id: 'evt-8', title: 'Eva Hoogeveen vakantie',    date: `${year}-07-28`, endDate: `${year}-08-15`, category: 'VAKANTIE', scope: 'BINNENDIENST' },
    { id: 'evt-9', title: 'Bestuursvergadering CBM',   date: `${year}-09-18`, category: 'INTERN',         scope: 'BINNENDIENST' },
    { id: 'evt-10', title: 'Coördinatoren overleg Q2', date: `${year}-04-22`, category: 'INTERN',         scope: 'BINNENDIENST' },
  ];
}

export function allEventsForYear(year: number): AgendaEvent[] {
  return [
    ...feestdagen(year),
    ...maandritmes(year),
    ...bouwvakken(year),
    ...eenmaligeEvents(year),
  ];
}

export function eventsInMonth(year: number, month0: number): AgendaEvent[] {
  return allEventsForYear(year).filter((e) => {
    const d = new Date(e.date + 'T00:00:00Z');
    if (d.getUTCFullYear() === year && d.getUTCMonth() === month0) return true;
    // Check ranges (bouwvak/vakantie kan over maandgrenzen)
    if (e.endDate) {
      const end = new Date(e.endDate + 'T00:00:00Z');
      if (d.getUTCFullYear() === year && end >= new Date(Date.UTC(year, month0, 1))) {
        return d <= new Date(Date.UTC(year, month0 + 1, 0));
      }
    }
    return false;
  });
}
