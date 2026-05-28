import type { User, Coordinator } from '@/lib/types';

export const currentStudent: User = {
  id: 'user-stu-001',
  name: 'Jamie van Dijk',
  email: 'jamie.vandijk@swvmeubel.nl',
  role: 'STUDENT',
  regionId: 'reg-noord',
};

export const currentCoordinator: User = {
  id: 'user-coord-001',
  name: 'Sanne Bakker',
  email: 'sanne.bakker@swvmeubel.nl',
  role: 'COORDINATOR',
  regionId: 'reg-noord',
};

export const currentCompany: User = {
  id: 'user-bedr-001',
  name: 'Jan de Vries',
  email: 'jan@devriesinterieurbouw.nl',
  role: 'COMPANY',
};

export const currentAdmin: User = {
  id: 'user-adm-001',
  name: 'Eva Hoogeveen',
  email: 'eva.hoogeveen@swvmeubel.nl',
  role: 'ADMIN',
  twoFactorEnabled: true,
  lastLoginAt: '2026-05-27T08:42:00Z',
};

export const coordinators: Coordinator[] = [
  {
    id: 'coord-001',
    name: 'Sanne Bakker',
    email: 'sanne.bakker@swvmeubel.nl',
    phone: '06 87654321',
    regionId: 'reg-noord',
    studentCount: 126,
  },
  {
    id: 'coord-002',
    name: 'Pieter de Groot',
    email: 'pieter.degroot@swvmeubel.nl',
    phone: '06 12348765',
    regionId: 'reg-oost',
    studentCount: 98,
  },
  {
    id: 'coord-003',
    name: 'Marit Jansen',
    email: 'marit.jansen@swvmeubel.nl',
    phone: '06 55667788',
    regionId: 'reg-west',
    studentCount: 132,
  },
  {
    id: 'coord-004',
    name: 'Bram Smit',
    email: 'bram.smit@swvmeubel.nl',
    phone: '06 99887766',
    regionId: 'reg-zuid',
    studentCount: 104,
  },
];
