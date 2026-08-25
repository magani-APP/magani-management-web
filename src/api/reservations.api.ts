import { mockReservations } from '@/mocks/reservations.mock';
import { Reservation, ReservationStatus } from '@/types/reservations.types';

// Simulate a brief network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class ReservationsApi {
  private reservations: Reservation[] = [...mockReservations];

  async getReservations(): Promise<Reservation[]> {
    await delay(200); // Simulate network latency
    return [...this.reservations];
  }

  async getReservationById(id: string): Promise<Reservation | undefined> {
    await delay(100);
    return this.reservations.find(res => res.id === id);
  }

  async updateReservationStatus(id: string, newStatus: ReservationStatus): Promise<Reservation> {
    await delay(300);
    const index = this.reservations.findIndex(res => res.id === id);
    if (index === -1) {
      throw new Error(`Reservation with id ${id} not found`);
    }
    
    const updatedReservation = { ...this.reservations[index], status: newStatus };
    this.reservations[index] = updatedReservation;
    
    return updatedReservation;
  }
}

export const reservationsApi = new ReservationsApi();
