import { useState, useEffect, useMemo } from 'react';
import { reservationsApi } from '@/api/reservations.api';
import { Reservation, ReservationStatus } from '@/types/reservations.types';
import { ReservationFilter } from '@/constants/reservations.constants';

export function useReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [activeFilter, setActiveFilter] = useState<ReservationFilter>('Toutes');
  const [selectedReservationId, setSelectedReservationId] = useState<string | null>(null);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await reservationsApi.getReservations();
      setReservations(data);
      // Select the first one by default if none selected and there are results
      if (data.length > 0 && !selectedReservationId) {
        setSelectedReservationId(data[0].id);
      }
    } catch (err) {
      setError('Erreur lors du chargement des réservations');
    } finally {
      setIsLoading(false);
    }
  };

  const updateReservationStatus = async (id: string, newStatus: ReservationStatus) => {
    try {
      const updated = await reservationsApi.updateReservationStatus(id, newStatus);
      setReservations(prev => prev.map(res => res.id === id ? updated : res));
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const filteredReservations = useMemo(() => {
    if (activeFilter === 'Toutes') return reservations;
    // Map the filter to status. Note that the plural form matches the status (Nouvelles -> Nouvelle)
    const statusMap: Record<string, ReservationStatus> = {
      'Nouvelles': 'Nouvelle',
      'Confirmées': 'Confirmée',
      'Préparées': 'Préparée',
      'Retirées': 'Retirée',
      'Annulées': 'Annulée',
    };
    const targetStatus = statusMap[activeFilter];
    return reservations.filter(res => res.status === targetStatus);
  }, [reservations, activeFilter]);

  const selectedReservation = useMemo(() => {
    return reservations.find(res => res.id === selectedReservationId) || null;
  }, [reservations, selectedReservationId]);
  
  // Calculate counts for pills
  const counts = useMemo(() => {
    const defaultCounts: Record<ReservationFilter, number> = {
      'Toutes': reservations.length,
      'Nouvelles': 0,
      'Confirmées': 0,
      'Préparées': 0,
      'Retirées': 0,
      'Annulées': 0,
    };
    
    reservations.forEach(res => {
      if (res.status === 'Nouvelle') defaultCounts['Nouvelles']++;
      else if (res.status === 'Confirmée') defaultCounts['Confirmées']++;
      else if (res.status === 'Préparée') defaultCounts['Préparées']++;
      else if (res.status === 'Retirée') defaultCounts['Retirées']++;
      else if (res.status === 'Annulée') defaultCounts['Annulées']++;
    });
    
    return defaultCounts;
  }, [reservations]);

  return {
    reservations: filteredReservations,
    allReservations: reservations,
    isLoading,
    error,
    activeFilter,
    setActiveFilter,
    selectedReservation,
    setSelectedReservationId,
    updateReservationStatus,
    counts,
  };
}
