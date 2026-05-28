export type Notification = {
  id: string;
  at: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ACTION';
  title: string;
  body: string;
  read: boolean;
  href?: string;
};

export const studentNotifications: Notification[] = [
  { id: 'n-1', at: '2026-05-28T08:00:00Z', type: 'ACTION', title: 'Weekstaat W22 nog niet ingediend', body: 'Lever je weekstaat in voor vrijdag 23:59.', read: false, href: '/student/uren' },
  { id: 'n-2', at: '2026-05-27T09:00:00Z', type: 'INFO', title: 'Nieuwe schoolplanning', body: 'De planning voor periode 4 is bijgewerkt.', read: false, href: '/student/planning' },
  { id: 'n-3', at: '2026-05-25T14:22:00Z', type: 'SUCCESS', title: 'Weekstaat W21 goedgekeurd', body: 'Je weekstaat is goedgekeurd door Jan de Vries.', read: true },
  { id: 'n-4', at: '2026-05-24T11:12:00Z', type: 'WARNING', title: 'Legitimatie vervalt binnenkort', body: 'Upload een nieuwe legitimatie binnen 30 dagen.', read: true, href: '/student/documenten' },
];

export const coordinatorNotifications: Notification[] = [
  { id: 'n-1', at: '2026-05-28T09:21:00Z', type: 'WARNING', title: '3 studenten met ontbrekende uren', body: 'Vorige week niet ingediend door Mark, Tom en Sara.', read: false, href: '/coordinator/uren' },
  { id: 'n-2', at: '2026-05-28T08:30:00Z', type: 'ACTION', title: '2 weekstaten ter goedkeuring', body: 'Goedkeuring nodig binnen 48 uur.', read: false, href: '/coordinator/goedkeuringen' },
  { id: 'n-3', at: '2026-05-27T15:14:00Z', type: 'WARNING', title: 'Signaal gewijzigd: Tom de Wit', body: 'Signaal aangepast van Aandacht naar Risico.', read: true, href: '/coordinator/studenten/stu-004' },
  { id: 'n-4', at: '2026-05-26T10:00:00Z', type: 'INFO', title: '2 aflopende contracten', body: 'Binnen 4 weken aflopend.', read: true, href: '/coordinator/contracten' },
];

export const companyNotifications: Notification[] = [
  { id: 'n-1', at: '2026-05-28T09:00:00Z', type: 'ACTION', title: '3 weekstaten wachten op goedkeuring', body: 'Lisa, Mark en Noah hebben hun weekstaat ingediend.', read: false, href: '/lidbedrijf/goedkeuren' },
  { id: 'n-2', at: '2026-05-26T07:32:00Z', type: 'INFO', title: 'Ziekmelding Noah van Leeuwen', body: 'Sinds 26 mei.', read: false, href: '/lidbedrijf/verzuim' },
  { id: 'n-3', at: '2026-05-25T08:00:00Z', type: 'SUCCESS', title: 'Praktijkbeoordeling toegevoegd', body: 'Beoordeling Lisa de Boer succesvol toegevoegd.', read: true },
];

export const adminNotifications: Notification[] = [
  { id: 'n-1', at: '2026-05-28T07:42:00Z', type: 'WARNING', title: 'Cleverdesk integratie degraded', body: '14 sync-fouten in 24 uur. Onderzoek aanbevolen.', read: false, href: '/admin/integraties' },
  { id: 'n-2', at: '2026-05-28T03:14:00Z', type: 'WARNING', title: 'Brute force poging gedetecteerd', body: 'IP 45.95.169.12 geblokkeerd voor 24u.', read: false, href: '/admin/security-logs' },
  { id: 'n-3', at: '2026-05-27T22:48:00Z', type: 'INFO', title: 'Wekelijkse rapportages verzonden', body: 'Maandagochtend-mailing voor 4 coördinatoren.', read: true },
  { id: 'n-4', at: '2026-05-27T11:08:00Z', type: 'SUCCESS', title: 'Cleverdesk poll interval gewijzigd', body: 'Aangepast van 60 naar 15 minuten.', read: true, href: '/admin/audit-logs' },
];
