export type PosSaleStatus = "encaisse" | "rembourse" | "annule";

export type PosSalePaymentMethod = "cash" | "mtn" | "orange" | "card" | "mixed";

export type PosSaleTabId = "all" | "collected" | "refunded" | "cancelled";

export interface PosSaleItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface PosSaleClient {
  name: string;
  phone?: string;
  isWalkIn: boolean;
  avatarColor: string;
}

export interface PosSaleCashier {
  initials: string;
  name: string;
  avatarColor: string;
}

export interface PosSale {
  id: string;
  /** Référence courte affichée dans le tableau (ex. "V-004291"). */
  reference: string;
  /** Numéro de reçu associé (ex. "R-2026-004291"). */
  receiptNumber: string;
  status: PosSaleStatus;
  client: PosSaleClient;
  items: PosSaleItem[];
  /** Montant total de la vente (FCFA). */
  amount: number;
  /** Remise appliquée (FCFA). */
  discount: number;
  paymentMethod: PosSalePaymentMethod;
  /** Référence de la transaction du prestataire de paiement. */
  transactionRef: string;
  /** Date ISO (AAAA-MM-JJ). */
  date: string;
  /** Heure au format HH:mm. */
  time: string;
  cashier: PosSaleCashier;
}
