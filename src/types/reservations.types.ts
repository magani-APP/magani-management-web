export type ReservationStatus = 'Nouvelle' | 'Confirmée' | 'Préparée' | 'Retirée' | 'Annulée';

export type ReservationChannel = 'App' | 'Comptoir';

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface ReservationItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Reservation {
  id: string;
  reference: string;
  customer: Customer;
  channel: ReservationChannel;
  status: ReservationStatus;
  items: ReservationItem[];
  totalAmount: number;
  createdAt: string; // ISO format or string representing date
  note?: string;
  alert?: string; // Optional alert message, e.g., for cancellations
}
