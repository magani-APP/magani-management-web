import { ReservationStatus, ReservationChannel } from '@/types/reservations.types';

export const RESERVATION_STATUS_COLORS: Record<ReservationStatus, { bg: string; text: string; border: string }> = {
  Nouvelle: { bg: 'bg-[#F0F7F3]', text: 'text-brand-primary', border: 'border-brand-primary/20' },
  Confirmée: { bg: 'bg-[#F0F7F3]', text: 'text-brand-primary', border: 'border-brand-primary/20' },
  Préparée: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' },
  Retirée: { bg: 'bg-gray-50', text: 'text-gray-500', border: 'border-gray-200' },
  Annulée: { bg: 'bg-red-50', text: 'text-red-500', border: 'border-red-200' },
};

export const RESERVATION_CHANNEL_STYLES: Record<ReservationChannel, { bg: string; text: string }> = {
  App: { bg: 'bg-blue-50', text: 'text-blue-500' },
  Comptoir: { bg: 'bg-gray-50', text: 'text-gray-500' },
};

export const RESERVATION_STEPS: ReservationStatus[] = [
  'Nouvelle',
  'Confirmée',
  'Préparée',
  'Retirée',
];

export const RESERVATION_FILTERS = [
  'Toutes',
  'Nouvelles',
  'Confirmées',
  'Préparées',
  'Retirées',
  'Annulées',
] as const;

export type ReservationFilter = typeof RESERVATION_FILTERS[number];
