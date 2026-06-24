import type { Role } from '@/lib/types';

export type NavItem = {
  label: string;
  href: string;
  icon: keyof typeof iconRegistry;
  badge?: string;
};

import { Icon } from '@/components/ui/Icon';

export const iconRegistry = {
  Home: Icon.Home,
  User: Icon.User,
  Users: Icon.Users,
  Clock: Icon.Clock,
  Calendar: Icon.Calendar,
  Doc: Icon.Doc,
  Briefcase: Icon.Briefcase,
  BookOpen: Icon.BookOpen,
  Bell: Icon.Bell,
  Heart: Icon.Heart,
  Palm: Icon.Palm,
  Euro: Icon.Euro,
  Settings: Icon.Settings,
  Shield: Icon.Shield,
  Refresh: Icon.Refresh,
  Activity: Icon.Activity,
  Link: Icon.Link,
  Lock: Icon.Lock,
};

export const navigation: Record<Role, NavItem[]> = {
  STUDENT: [
    { label: 'Dashboard', href: '/student', icon: 'Home' },
    { label: 'Mijn gegevens', href: '/student/profiel', icon: 'User' },
    { label: 'Opleiding', href: '/student/opleiding', icon: 'BookOpen' },
    { label: 'Leerbedrijf', href: '/student/leerbedrijf', icon: 'Briefcase' },
    { label: 'Urenregistratie', href: '/student/uren', icon: 'Clock' },
    { label: 'Planning', href: '/student/planning', icon: 'Calendar' },
    { label: 'Vakantiedagen', href: '/student/vakantie', icon: 'Palm' },
    { label: 'Verzuim', href: '/student/verzuim', icon: 'Heart' },
    { label: 'Contracten', href: '/student/contracten', icon: 'Doc' },
    { label: 'Documenten', href: '/student/documenten', icon: 'Doc' },
    { label: 'Taken', href: '/student/taken', icon: 'Activity', badge: '3' },
    { label: 'Berichten', href: '/student/berichten', icon: 'Bell', badge: '2' },
    { label: 'Kennisbank', href: '/student/kennisbank', icon: 'BookOpen' },
    { label: 'Veelgestelde vragen', href: '/student/help', icon: 'BookOpen' },
    { label: 'FAQ', href: '/student/faq', icon: 'BookOpen' },
    { label: 'Instellingen', href: '/student/instellingen', icon: 'Settings' },
  ],
  COORDINATOR: [
    { label: 'Dashboard', href: '/coordinator', icon: 'Home' },
    { label: 'Unified inbox', href: '/coordinator/inbox', icon: 'Bell' },
    { label: 'Mijn regio', href: '/coordinator/regio', icon: 'Activity' },
    { label: 'Agenda', href: '/coordinator/agenda', icon: 'Calendar' },
    { label: 'Meldingen', href: '/coordinator/meldingen', icon: 'Bell' },
    { label: 'Sollicitaties', href: '/coordinator/sollicitaties', icon: 'Bell' },
    { label: 'Studenten', href: '/coordinator/studenten', icon: 'Users' },
    { label: 'Urenoverzicht', href: '/coordinator/uren', icon: 'Clock' },
    { label: 'Goedkeuringen', href: '/coordinator/goedkeuringen', icon: 'Activity', badge: '3' },
    { label: 'Ziekteverzuim', href: '/coordinator/verzuim', icon: 'Heart' },
    { label: 'Vakantiedagen', href: '/coordinator/vakantie', icon: 'Palm' },
    { label: 'Lidbedrijven', href: '/coordinator/lidbedrijven', icon: 'Briefcase' },
    { label: 'Contracten', href: '/coordinator/contracten', icon: 'Doc' },
    { label: 'Planning', href: '/coordinator/planning', icon: 'Calendar' },
    { label: 'Diploma & uitstroom', href: '/coordinator/diploma', icon: 'BookOpen' },
    { label: 'Rapportages', href: '/coordinator/rapportages', icon: 'Activity' },
    { label: 'Kennisbank', href: '/coordinator/kennisbank', icon: 'BookOpen' },
    { label: 'FAQ beheer', href: '/coordinator/faq', icon: 'BookOpen' },
    { label: 'Instellingen', href: '/coordinator/instellingen', icon: 'Settings' },
  ],
  COMPANY: [
    { label: 'Dashboard', href: '/lidbedrijf', icon: 'Home' },
    { label: 'Mijn studenten', href: '/lidbedrijf/studenten', icon: 'Users' },
    { label: 'Weekstaten goedkeuren', href: '/lidbedrijf/goedkeuren', icon: 'Activity', badge: '5' },
    { label: 'Urenoverzicht', href: '/lidbedrijf/uren', icon: 'Clock' },
    { label: 'Verzuim', href: '/lidbedrijf/verzuim', icon: 'Heart' },
    { label: 'Planning schooldagen', href: '/lidbedrijf/planning', icon: 'Calendar' },
    { label: 'Contracten', href: '/lidbedrijf/contracten', icon: 'Doc' },
    { label: 'Documenten', href: '/lidbedrijf/documenten', icon: 'Doc' },
    { label: 'Voorwaarden lidbedrijf', href: '/lidbedrijf/voorwaarden', icon: 'Shield' },
    { label: 'Coördinator', href: '/lidbedrijf/coordinator', icon: 'User' },
    { label: 'Instellingen', href: '/lidbedrijf/instellingen', icon: 'Settings' },
  ],
  ADMIN: [
    { label: 'Dashboard', href: '/admin', icon: 'Home' },
    { label: 'Agenda', href: '/admin/agenda', icon: 'Calendar' },
    { label: 'Synergy kaartenbak', href: '/admin/kaartenbak', icon: 'Activity' },
    { label: 'Cross-system sync', href: '/admin/sync-status', icon: 'Link' },
    { label: 'Mutaties personeel', href: '/admin/mutaties', icon: 'Refresh' },
    { label: 'Facturatie lidbedrijven', href: '/admin/facturatie', icon: 'Euro' },
    { label: 'Eindafrekeningen', href: '/admin/eindafrekening', icon: 'Doc' },
    { label: 'Scholen', href: '/admin/scholen', icon: 'BookOpen' },
    { label: 'Gebruikers', href: '/admin/gebruikers', icon: 'Users' },
    { label: 'Rollen & rechten', href: '/admin/rollen', icon: 'Shield' },
    { label: 'Regio\'s', href: '/admin/regios', icon: 'Activity' },
    { label: 'Lidbedrijven', href: '/admin/lidbedrijven', icon: 'Briefcase' },
    { label: 'Studenten', href: '/admin/studenten', icon: 'Users' },
    { label: 'Integraties', href: '/admin/integraties', icon: 'Link' },
    { label: 'Sync logs', href: '/admin/sync-logs', icon: 'Refresh' },
    { label: 'Audit logs', href: '/admin/audit-logs', icon: 'Lock' },
    { label: 'Security logs', href: '/admin/security-logs', icon: 'Shield' },
    { label: 'Documentbeheer', href: '/admin/documenten', icon: 'Doc' },
    { label: 'FAQ beheer', href: '/admin/faq', icon: 'BookOpen' },
    { label: 'Kennisbank', href: '/admin/kennisbank', icon: 'BookOpen' },
    { label: 'Instellingen', href: '/admin/instellingen', icon: 'Settings' },
  ],
};

export const portalMeta: Record<Role, { title: string; subtitle: string; chip: string; href: string }> = {
  STUDENT: {
    title: 'Studentenportaal',
    subtitle: 'Je persoonlijke omgeving',
    chip: 'Student',
    href: '/student',
  },
  COORDINATOR: {
    title: 'Coördinator portaal',
    subtitle: 'Begeleiding en signalen',
    chip: 'Coördinator',
    href: '/coordinator',
  },
  COMPANY: {
    title: 'Lidbedrijf portaal',
    subtitle: 'Studenten en uren',
    chip: 'Lidbedrijf',
    href: '/lidbedrijf',
  },
  ADMIN: {
    title: 'Admin portaal',
    subtitle: 'Beheer en integraties',
    chip: 'Admin',
    href: '/admin',
  },
};
