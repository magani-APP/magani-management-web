import { Reservation } from '@/types/reservations.types';

export const mockReservations: Reservation[] = [
  {
    id: 'res-1',
    reference: 'RES-2026-0089',
    customer: {
      id: 'cust-1',
      firstName: 'Wilson',
      lastName: 'TAPAMO',
      phone: '+225 07 58 23 41',
    },
    channel: 'App',
    status: 'Nouvelle',
    items: [
      { id: 'item-1', name: 'Doliprane 1000mg', quantity: 2, price: 3000 },
    ],
    totalAmount: 3000,
    createdAt: '2026-08-09T18:55:00',
    note: 'Retrait ce soir avant 20h00',
  },
  {
    id: 'res-2',
    reference: 'RES-2026-0088',
    customer: {
      id: 'cust-2',
      firstName: 'Marguerite',
      lastName: 'ADEOLA',
      phone: '+225 05 23 18 76',
    },
    channel: 'Comptoir',
    status: 'Confirmée',
    items: [
      { id: 'item-2', name: 'Amoxicilline 250mg', quantity: 1, price: 4500 },
      { id: 'item-3', name: 'Vitamine C 500mg', quantity: 2, price: 2400 },
    ],
    totalAmount: 6900,
    createdAt: '2026-08-09T17:30:00',
  },
  {
    id: 'res-3',
    reference: 'RES-2026-0087',
    customer: {
      id: 'cust-3',
      firstName: 'Konan',
      lastName: 'AKRÊ',
      phone: '+225 01 45 67 89',
    },
    channel: 'App',
    status: 'Préparée',
    items: [
      { id: 'item-4', name: 'Artéméther-Luméfantrine', quantity: 3, price: 10500 },
    ],
    totalAmount: 10500,
    createdAt: '2026-08-09T16:00:00',
    note: 'Retrait pour la famille',
  },
  {
    id: 'res-4',
    reference: 'RES-2026-0086',
    customer: {
      id: 'cust-4',
      firstName: 'Fatima',
      lastName: 'COULIBALY',
      phone: '+225 07 11 34 22',
    },
    channel: 'App',
    status: 'Retirée',
    items: [
      { id: 'item-5', name: 'Sérum physiologique 500ml', quantity: 4, price: 3200 },
      { id: 'item-6', name: 'Oméprazole 20mg', quantity: 2, price: 11000 },
    ],
    totalAmount: 14200,
    createdAt: '2026-08-09T11:20:00',
  },
  {
    id: 'res-5',
    reference: 'RES-2026-0085',
    customer: {
      id: 'cust-5',
      firstName: 'Jean-Baptiste',
      lastName: 'EHUI',
      phone: '+225 05 98 12 34',
    },
    channel: 'Comptoir',
    status: 'Annulée',
    items: [
      { id: 'item-7', name: 'Ciprofloxacine 500mg', quantity: 1, price: 6200 },
    ],
    totalAmount: 6200,
    createdAt: '2026-08-08T14:45:00',
    alert: "Client ne s'est pas présenté",
  },
];
