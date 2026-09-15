export type ReceiptStatus = "vente" | "rembourse" | "annule";

export type ReceiptPaymentMethod = "cash" | "mtn" | "orange" | "card";

export type ReceiptTabId = "all" | "sales" | "refunds" | "cancellations";

export interface ReceiptItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface ReceiptClient {
  name: string;
  phone?: string;
  isWalkIn: boolean;
  avatarColor: string;
}

export interface ReceiptCashier {
  initials: string;
  name: string;
}

export interface Receipt {
  id: string;
  receiptNumber: string;
  status: ReceiptStatus;
  client: ReceiptClient;
  amount: number;
  discount: number;
  amountPaid: number;
  changeGiven: number;
  paymentMethod: ReceiptPaymentMethod;
  /** Date ISO (AAAA-MM-JJ) */
  date: string;
  /** Heure au format HH:mm */
  time: string;
  cashier: ReceiptCashier;
  items: ReceiptItem[];
}
