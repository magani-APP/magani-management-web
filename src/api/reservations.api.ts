import { apiRequest } from "@/lib/api-client";
import { Reservation, ReservationStatus } from "@/types/reservations.types";

// ---- Shape brute renvoyée par GET /reservations/inbox et /reservations/:id ----
interface ApiReservationItem {
  id: string;
  quantity: number;
  unitPriceXaf: number;
  product: { nameFr: string };
}
interface ApiReservation {
  id: string;
  pickupCode: string;
  status:
    | "PENDING"
    | "AWAITING_PRESCRIPTION"
    | "VALIDATED"
    | "PREPARED"
    | "READY_FOR_PICKUP"
    | "OUT_FOR_DELIVERY"
    | "COMPLETED"
    | "CANCELLED";
  totalXaf: number;
  notes?: string | null;
  cancelledReason?: string | null;
  createdAt: string;
  items: ApiReservationItem[];
  user?: { firstName: string; lastName: string; phone: string } | null;
}

const STATUS_FROM_API: Record<ApiReservation["status"], ReservationStatus> = {
  PENDING: "Nouvelle",
  AWAITING_PRESCRIPTION: "Nouvelle",
  VALIDATED: "Confirmée",
  PREPARED: "Préparée",
  READY_FOR_PICKUP: "Préparée",
  OUT_FOR_DELIVERY: "Préparée",
  COMPLETED: "Retirée",
  CANCELLED: "Annulée",
};

// Seules ces transitions sont acceptées par PATCH /reservations/:id/status
const STATUS_TO_API: Partial<Record<ReservationStatus, string>> = {
  "Confirmée": "VALIDATED",
  "Préparée": "PREPARED",
  "Retirée": "COMPLETED",
  "Annulée": "CANCELLED",
};

function toReservation(row: ApiReservation): Reservation {
  return {
    id: row.id,
    reference: row.pickupCode,
    customer: {
      id: row.id, // l'API n'expose pas l'userId sur cette liste, on retombe sur l'id de la réservation
      firstName: row.user?.firstName ?? "",
      lastName: row.user?.lastName ?? "",
      phone: row.user?.phone ?? "",
    },
    channel: "App", // les réservations viennent toujours de l'app patient
    status: STATUS_FROM_API[row.status],
    items: row.items.map((i) => ({
      id: i.id,
      name: i.product.nameFr,
      quantity: i.quantity,
      price: i.unitPriceXaf,
    })),
    totalAmount: row.totalXaf,
    createdAt: row.createdAt,
    note: row.notes ?? undefined,
    alert: row.status === "CANCELLED" ? row.cancelledReason ?? undefined : undefined,
  };
}

class ReservationsApi {
  async getReservations(): Promise<Reservation[]> {
    const rows = await apiRequest<ApiReservation[]>("/reservations/inbox");
    return rows.map(toReservation);
  }

  async getReservationById(id: string): Promise<Reservation | undefined> {
    try {
      const row = await apiRequest<ApiReservation>(`/reservations/${id}`);
      return toReservation(row);
    } catch {
      return undefined;
    }
  }

  async updateReservationStatus(
    id: string,
    newStatus: ReservationStatus,
  ): Promise<Reservation> {
    const apiStatus = STATUS_TO_API[newStatus];
    if (!apiStatus) {
      throw new Error(`Le statut "${newStatus}" ne peut pas être défini manuellement.`);
    }
    const row = await apiRequest<ApiReservation>(`/reservations/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: apiStatus }),
    });
    return toReservation(row);
  }
}

export const reservationsApi = new ReservationsApi();