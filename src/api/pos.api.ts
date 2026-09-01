import { apiRequest } from "@/lib/api-client";
import { PaymentMethod, Product } from "../types/pos.types";

export type { Product };

// ---- Mapping du stock de la pharmacie -> catalogue POS ----
interface ApiCategory {
  id: string;
  nameFr: string;
}
interface ApiProduct {
  id: string;
  nameFr: string;
  genericName?: string | null;
  form?: string | null;
  barcode?: string | null;
  category?: ApiCategory | null;
}
interface ApiPharmacyProductRow {
  productId: string;
  priceXaf: number;
  availableQty: number;
  product: ApiProduct;
}

function toPosProduct(row: ApiPharmacyProductRow): Product {
  return {
    id: row.productId,
    name: row.product.nameFr,
    category: row.product.category?.nameFr ?? "Autre",
    dci: row.product.genericName ?? undefined,
    barcode: row.product.barcode ?? "",
    price: row.priceXaf,
    stock: row.availableQty,
    unit: row.product.form ?? "unité",
  };
}

// Le catalogue de caisse doit refléter le vrai stock de la pharmacie :
// on réutilise donc /pharmacy/inventory plutôt que /products (catalogue global).
export const getProducts = async (): Promise<Product[]> => {
  const rows = await apiRequest<ApiPharmacyProductRow[]>("/pharmacy/inventory");
  return rows.filter((r) => r.availableQty > 0).map(toPosProduct);
};

// ---- Session de caisse ----
export interface PosSession {
  id: string;
  status: "OPEN" | "CLOSED";
  openingFloat: number;
  closingAmount?: number | null;
  openedAt: string;
  closedAt?: string | null;
}

export const getCurrentPosSession = async (): Promise<PosSession | null> => {
  return apiRequest<PosSession | null>("/pharmacy/pos/session");
};

export const openPosSession = async (openingFloat: number): Promise<PosSession> => {
  return apiRequest<PosSession>("/pharmacy/pos/session/open", {
    method: "POST",
    body: JSON.stringify({ openingFloat }),
  });
};

export const closePosSession = async (
  closingAmount: number,
  notes?: string,
): Promise<PosSession> => {
  return apiRequest<PosSession>("/pharmacy/pos/session/close", {
    method: "POST",
    body: JSON.stringify({ closingAmount, notes }),
  });
};

// ---- Ventes ----
type ApiPaymentProvider = "CASH" | "MTN_MOMO" | "ORANGE_MONEY" | "CARD";

const PAYMENT_METHOD_TO_PROVIDER: Record<PaymentMethod, ApiPaymentProvider> = {
  "espèces": "CASH",
  mtn: "MTN_MOMO",
  orange: "ORANGE_MONEY",
  carte: "CARD",
  // Le panier ne gère pas encore de split multi-moyens : on encaisse en CASH
  // par défaut pour "mixte" (à affiner quand l'UI permettra de saisir
  // plusieurs montants).
  mixte: "CASH",
};

export interface CreateSaleInput {
  items: { productId: string; quantity: number; unitPriceXaf?: number }[];
  method: PaymentMethod;
  amountXaf: number;
  discountXaf?: number;
  notes?: string;
}

export interface SaleResult {
  id: string;
  receiptNumber: string;
  totalXaf: number;
  createdAt: string;
}

export const createSale = async (input: CreateSaleInput): Promise<SaleResult> => {
  return apiRequest<SaleResult>("/pharmacy/pos/sales", {
    method: "POST",
    body: JSON.stringify({
      items: input.items,
      payments: [
        { provider: PAYMENT_METHOD_TO_PROVIDER[input.method], amountXaf: input.amountXaf },
      ],
      discountXaf: input.discountXaf ?? 0,
      notes: input.notes,
    }),
  });
};

export const listPosSales = async (from?: string, to?: string): Promise<SaleResult[]> => {
  const params = new URLSearchParams();
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  const qs = params.toString();
  return apiRequest<SaleResult[]>(`/pharmacy/pos/sales${qs ? `?${qs}` : ""}`);
};