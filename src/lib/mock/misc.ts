import type {
  Contract,
  Absence,
  HolidayBalance,
  PlanningItem,
  Task,
  Message,
  DocumentRecord,
} from '@/lib/types';

export const contracts: Contract[] = [
  { id: 'con-001', studentId: 'stu-001', companyId: 'comp-001', startDate: '2023-08-01', endDate: '2025-07-31', status: 'Actief', hoursPerWeek: 32 },
  { id: 'con-002', studentId: 'stu-002', companyId: 'comp-002', startDate: '2024-08-01', endDate: '2026-07-31', status: 'Actief', hoursPerWeek: 32 },
  { id: 'con-003', studentId: 'stu-003', companyId: 'comp-002', startDate: '2024-08-01', endDate: '2026-07-31', status: 'Actief', hoursPerWeek: 32 },
  { id: 'con-004', studentId: 'stu-004', companyId: 'comp-003', startDate: '2023-08-01', endDate: '2025-07-31', status: 'Aflopend', hoursPerWeek: 32 },
  { id: 'con-005', studentId: 'stu-005', companyId: 'comp-004', startDate: '2024-08-01', endDate: '2026-07-31', status: 'Actief', hoursPerWeek: 32 },
  { id: 'con-006', studentId: 'stu-006', companyId: 'comp-004', startDate: '2023-08-01', endDate: '2025-07-31', status: 'Aflopend', hoursPerWeek: 32 },
  { id: 'con-007', studentId: 'stu-007', companyId: 'comp-001', startDate: '2025-08-01', endDate: '2027-07-31', status: 'Actief', hoursPerWeek: 32 },
];

export const absences: Absence[] = [
  { id: 'abs-001', studentId: 'stu-001', type: 'ZIEKTE', startDate: '2026-05-13', endDate: '2026-05-14', status: 'GESLOTEN', reportedAt: '2026-05-13T07:54:00Z' },
  { id: 'abs-002', studentId: 'stu-006', type: 'ZIEKTE', startDate: '2026-05-26', status: 'OPEN', reportedAt: '2026-05-26T07:32:00Z' },
  { id: 'abs-003', studentId: 'stu-004', type: 'VERLOF', startDate: '2026-06-12', endDate: '2026-06-13', status: 'OPEN', reportedAt: '2026-05-20T10:21:00Z' },
];

export const holidayBalances: HolidayBalance[] = [
  { studentId: 'stu-001', totalDays: 20, usedDays: 5, remainingDays: 15, holidayMoneyCents: 62045, lastUpdated: '2024-05-01' },
  { studentId: 'stu-002', totalDays: 20, usedDays: 8, remainingDays: 12, holidayMoneyCents: 54320, lastUpdated: '2024-05-01' },
];

export const planningItems: PlanningItem[] = [
  { id: 'pl-1', title: 'Start nieuwe BPV periode', type: 'BPV', startDate: '2026-06-01', endDate: '2026-07-19', status: 'BEVESTIGD' },
  { id: 'pl-2', title: 'Diploma uitreiking BBL 3', type: 'DIPLOMA', startDate: '2026-06-25', status: 'BEVESTIGD', regionId: 'reg-noord' },
  { id: 'pl-3', title: 'Evaluatiegesprekken jaar 2', type: 'EVALUATIE', startDate: '2026-06-04', endDate: '2026-06-11', status: 'GEPLAND' },
  { id: 'pl-4', title: 'Praktijkbeoordeling Interieurbouwer N3', type: 'PRAKTIJKBEOORDELING', startDate: '2026-06-08', status: 'GEPLAND' },
  { id: 'pl-5', title: 'Examen Houtbewerker N2', type: 'EXAMEN', startDate: '2026-06-17', status: 'GEPLAND' },
  { id: 'pl-6', title: 'Uitstroomgesprek jaar 3', type: 'UITSTROOM', startDate: '2026-06-19', status: 'GEPLAND' },
  { id: 'pl-7', title: 'Start nieuwe opleidingsgroep aug 2026', type: 'NIEUWE_OPLEIDING', startDate: '2026-08-19', status: 'GEPLAND' },
];

export const tasks: Task[] = [
  { id: 'tk-1', studentId: 'stu-001', title: 'BPV-verslag inleveren', dueDate: '2026-05-30', status: 'OPEN', priority: 'HOOG' },
  { id: 'tk-2', studentId: 'stu-001', title: 'Evaluatieformulier invullen', dueDate: '2026-06-12', status: 'OPEN', priority: 'NORMAAL' },
  { id: 'tk-3', studentId: 'stu-001', title: 'Schoolopdracht: materialenkennis', dueDate: '2026-06-20', status: 'OPEN', priority: 'NORMAAL' },
  { id: 'tk-4', studentId: 'stu-004', title: 'Legitimatie opnieuw uploaden (verlopen)', dueDate: '2026-06-05', status: 'OPEN', priority: 'HOOG' },
];

export const messages: Message[] = [
  {
    id: 'msg-1',
    fromUserId: 'user-coord-001',
    fromName: 'Sanne Bakker',
    toUserId: 'user-stu-001',
    subject: 'Evaluatiegesprek gepland',
    preview: 'Hoi Jamie, je evaluatiegesprek staat gepland op 11 juni om 10:00. Laat even weten of dit lukt.',
    sentAt: '2026-05-28T10:24:00Z',
    read: false,
  },
  {
    id: 'msg-2',
    fromUserId: 'user-system',
    fromName: 'SWV Meubel',
    toUserId: 'user-stu-001',
    subject: 'Belangrijke update schoolplanning',
    preview: 'De schoolplanning voor periode 4 is bijgewerkt. Bekijk de wijzigingen in je planning.',
    sentAt: '2026-05-27T09:00:00Z',
    read: false,
  },
  {
    id: 'msg-3',
    fromUserId: 'user-bedr-001',
    fromName: 'De Vries Interieurbouw',
    toUserId: 'user-stu-001',
    subject: 'Praktijkbeoordeling ontvangen',
    preview: 'Je praktijkbeoordeling is door Jan toegevoegd. Resultaat: Goed.',
    sentAt: '2026-05-02T15:12:00Z',
    read: true,
  },
];

export const documents: DocumentRecord[] = [
  {
    id: 'doc-001',
    studentId: 'stu-001',
    category: 'CONTRACT',
    fileName: 'Praktijkovereenkomst-Jamie-2023.pdf',
    mimeType: 'application/pdf',
    sizeBytes: 248_392,
    uploadedAt: '2023-08-01T09:14:00Z',
    uploadedByUserId: 'user-bedr-001',
    retentionUntil: '2031-07-31',
    encrypted: true,
  },
  {
    id: 'doc-002',
    studentId: 'stu-001',
    category: 'LEGITIMATIE',
    fileName: 'Legitimatie-Jamie.pdf',
    mimeType: 'application/pdf',
    sizeBytes: 612_104,
    uploadedAt: '2023-08-04T10:42:00Z',
    uploadedByUserId: 'user-stu-001',
    retentionUntil: '2026-08-04',
    encrypted: true,
  },
  {
    id: 'doc-003',
    studentId: 'stu-001',
    category: 'BEOORDELING',
    fileName: 'Praktijkbeoordeling-jaar2.pdf',
    mimeType: 'application/pdf',
    sizeBytes: 412_590,
    uploadedAt: '2024-06-12T14:02:00Z',
    uploadedByUserId: 'user-coord-001',
    retentionUntil: '2031-06-12',
    encrypted: true,
  },
];
