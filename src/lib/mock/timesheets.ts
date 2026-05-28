import type { Timesheet, TimeEntryType } from '@/lib/types';

function entry(date: string, type: TimeEntryType, hours: number, note?: string) {
  return { id: `te-${date}-${type}`, date, type, hours, note };
}

const norm = 38;

export const currentWeekTimesheet: Timesheet = {
  id: 'ts-stu001-w22',
  studentId: 'stu-001',
  weekNumber: 22,
  year: 2026,
  weekStartDate: '2026-05-25',
  status: 'CONCEPT',
  entries: [
    entry('2026-05-25', 'PRAKTIJK', 8, 'Maatwerk kast: frame opbouwen'),
    entry('2026-05-26', 'PRAKTIJK', 8, 'Maatwerk kast: deuren afmonteren'),
    entry('2026-05-27', 'SCHOOL', 7, 'Techniektheorie + werkvoorbereiding'),
    entry('2026-05-28', 'PRAKTIJK', 8),
    entry('2026-05-29', 'PRAKTIJK', 7),
  ],
  totals: {
    praktijk: 31,
    school: 7,
    ziekte: 0,
    verlof: 0,
    afwezig: 0,
    totaal: 38,
    norm,
    ontbrekend: 0,
  },
};

export const previousTimesheets: Timesheet[] = [
  {
    id: 'ts-stu001-w21',
    studentId: 'stu-001',
    weekNumber: 21,
    year: 2026,
    weekStartDate: '2026-05-18',
    status: 'GOEDGEKEURD',
    submittedAt: '2026-05-22T16:14:00Z',
    approvedAt: '2026-05-23T09:02:00Z',
    approvedByUserId: 'user-bedr-001',
    entries: [
      entry('2026-05-18', 'PRAKTIJK', 8),
      entry('2026-05-19', 'PRAKTIJK', 8),
      entry('2026-05-20', 'SCHOOL', 7),
      entry('2026-05-21', 'PRAKTIJK', 8),
      entry('2026-05-22', 'PRAKTIJK', 7),
    ],
    totals: { praktijk: 31, school: 7, ziekte: 0, verlof: 0, afwezig: 0, totaal: 38, norm, ontbrekend: 0 },
  },
  {
    id: 'ts-stu001-w20',
    studentId: 'stu-001',
    weekNumber: 20,
    year: 2026,
    weekStartDate: '2026-05-11',
    status: 'AFGEKEURD',
    submittedAt: '2026-05-15T16:30:00Z',
    rejectionReason: 'Donderdag praktijkuren komen niet overeen met afmelding bij coördinator.',
    entries: [
      entry('2026-05-11', 'PRAKTIJK', 8),
      entry('2026-05-12', 'PRAKTIJK', 8),
      entry('2026-05-13', 'SCHOOL', 7),
      entry('2026-05-14', 'PRAKTIJK', 8),
      entry('2026-05-15', 'ZIEKTE', 8),
    ],
    totals: { praktijk: 24, school: 7, ziekte: 8, verlof: 0, afwezig: 0, totaal: 39, norm, ontbrekend: 0 },
  },
  {
    id: 'ts-stu001-w19',
    studentId: 'stu-001',
    weekNumber: 19,
    year: 2026,
    weekStartDate: '2026-05-04',
    status: 'GOEDGEKEURD',
    submittedAt: '2026-05-08T15:45:00Z',
    approvedAt: '2026-05-09T10:12:00Z',
    entries: [
      entry('2026-05-04', 'VERLOF', 8),
      entry('2026-05-05', 'VERLOF', 8),
      entry('2026-05-06', 'SCHOOL', 7),
      entry('2026-05-07', 'PRAKTIJK', 8),
      entry('2026-05-08', 'PRAKTIJK', 7),
    ],
    totals: { praktijk: 15, school: 7, ziekte: 0, verlof: 16, afwezig: 0, totaal: 38, norm, ontbrekend: 0 },
  },
];

export const pendingApprovals: Array<{
  timesheet: Timesheet;
  studentName: string;
  companyName: string;
}> = [
  {
    timesheet: {
      id: 'ts-stu002-w22',
      studentId: 'stu-002',
      weekNumber: 22,
      year: 2026,
      weekStartDate: '2026-05-25',
      status: 'INGEDIEND',
      submittedAt: '2026-05-29T17:02:00Z',
      entries: [
        entry('2026-05-25', 'PRAKTIJK', 8),
        entry('2026-05-26', 'PRAKTIJK', 8),
        entry('2026-05-27', 'SCHOOL', 7),
        entry('2026-05-28', 'PRAKTIJK', 8),
        entry('2026-05-29', 'PRAKTIJK', 4, 'Eerder weg ivm afspraak'),
      ],
      totals: { praktijk: 28, school: 7, ziekte: 0, verlof: 0, afwezig: 0, totaal: 35, norm, ontbrekend: 3 },
    },
    studentName: 'Lisa de Boer',
    companyName: 'Hout & Meubel Groep',
  },
  {
    timesheet: {
      id: 'ts-stu003-w22',
      studentId: 'stu-003',
      weekNumber: 22,
      year: 2026,
      weekStartDate: '2026-05-25',
      status: 'INGEDIEND',
      submittedAt: '2026-05-29T16:48:00Z',
      entries: [
        entry('2026-05-25', 'PRAKTIJK', 8),
        entry('2026-05-26', 'PRAKTIJK', 8),
        entry('2026-05-27', 'SCHOOL', 7),
        entry('2026-05-28', 'PRAKTIJK', 8),
        entry('2026-05-29', 'PRAKTIJK', 7),
      ],
      totals: { praktijk: 31, school: 7, ziekte: 0, verlof: 0, afwezig: 0, totaal: 38, norm, ontbrekend: 0 },
    },
    studentName: 'Mark Kramer',
    companyName: 'Hout & Meubel Groep',
  },
  {
    timesheet: {
      id: 'ts-stu006-w22',
      studentId: 'stu-006',
      weekNumber: 22,
      year: 2026,
      weekStartDate: '2026-05-25',
      status: 'INGEDIEND',
      submittedAt: '2026-05-29T18:11:00Z',
      entries: [
        entry('2026-05-25', 'PRAKTIJK', 8),
        entry('2026-05-26', 'ZIEKTE', 8),
        entry('2026-05-27', 'SCHOOL', 7),
        entry('2026-05-28', 'PRAKTIJK', 8),
        entry('2026-05-29', 'PRAKTIJK', 7),
      ],
      totals: { praktijk: 23, school: 7, ziekte: 8, verlof: 0, afwezig: 0, totaal: 38, norm, ontbrekend: 0 },
    },
    studentName: 'Noah van Leeuwen',
    companyName: 'Meubelfabriek De Linde',
  },
];
