"use client";

import { useReservations } from '@/hooks/reservations/useReservations';
import { ReservationsList } from './ReservationsList';
import { ReservationDetail } from './ReservationDetail';
import { Loader2 } from 'lucide-react';

export function ReservationsLayout() {
  const {
    reservations,
    isLoading,
    error,
    activeFilter,
    setActiveFilter,
    selectedReservation,
    setSelectedReservationId,
    updateReservationStatus,
    counts,
  } = useReservations();

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-background">
        <div className="text-red-500 font-medium">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-background overflow-hidden">
      <ReservationsList
        reservations={reservations}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        selectedId={selectedReservation?.id || null}
        onSelect={setSelectedReservationId}
        counts={counts}
      />
      <ReservationDetail
        reservation={selectedReservation}
        onUpdateStatus={updateReservationStatus}
      />
    </div>
  );
}
