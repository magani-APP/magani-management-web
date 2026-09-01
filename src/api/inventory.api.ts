import { apiRequest } from "@/lib/api-client";
import { InventoryProduct, InventoryStats } from "@/types/inventory.types";

export type { InventoryProduct, InventoryStats };

// ---- Types bruts renvoyés par le backend (GET/PUT /pharmacy/inventory) ----
interface ApiCategory {
  id: string;
  nameFr: string;
}

interface ApiProduct {
  id: string;
  nameFr: string;
  nameEn: string;
  genericName?: string | null;
  brand?: string | null;
  form?: string | null;
  barcode?: string | null;
  category?: ApiCategory | null;
}

interface ApiPharmacyProductRow {
  id: string;
  productId: string;
  priceXaf: number;
  quantity: number;
  reservedQuantity: number;
  availableQty: number;
  isLowStock: boolean;
  lotNumber?: string | null;
  expiryDate?: string | null;
  location?: string | null;
  alertThreshold: number;
  isAvailable: boolean;
  lastUpdatedAt: string;
  product: ApiProduct;
}

function computeStatus(row: ApiPharmacyProductRow): InventoryProduct["status"] {
  if (row.expiryDate && new Date(row.expiryDate).getTime() < Date.now()) return "expire";
  if (row.availableQty <= 0) return "critique";
  if (row.isLowStock) return "stock-bas";
  return "en-stock";
}

function toInventoryProduct(row: ApiPharmacyProductRow): InventoryProduct {
  return {
    // On expose directement le productId : c'est lui qu'attendent
    // upsertStock/importStock côté backend.
    id: row.productId,
    name: row.product.nameFr,
    code: row.product.barcode ?? row.productId.slice(0, 8).toUpperCase(),
    category: row.product.category?.nameFr ?? "Autre",
    imageUrl: undefined, // pas encore renvoyé par l'API
    salePrice: row.priceXaf,
    stock: row.availableQty,
    unit: row.product.form ?? "unité",
    expirationDate: row.expiryDate ?? "",
    // Pas de coût d'achat exposé par l'API pour l'instant → marge non calculable.
    marginPercent: 0,
    status: computeStatus(row),
    // Les lots / mouvements détaillés ne sont pas retournés par GET /pharmacy/inventory.
    lots: undefined,
    movements: undefined,
  };
}

export const getInventoryProducts = async (): Promise<InventoryProduct[]> => {
  const rows = await apiRequest<ApiPharmacyProductRow[]>("/pharmacy/inventory");
  return rows.map(toInventoryProduct);
};

export const getInventoryStats = async (): Promise<InventoryStats> => {
  const rows = await apiRequest<ApiPharmacyProductRow[]>("/pharmacy/inventory");

  const activeProducts = rows.filter((r) => r.isAvailable).length;
  const stockValue = rows.reduce((sum, r) => sum + r.priceXaf * r.availableQty, 0);
  const criticalStock = rows.filter((r) => r.availableQty <= 0 || r.isLowStock).length;
  const now = Date.now();
  const expiringSoon = rows.filter(
    (r) =>
      r.expiryDate &&
      new Date(r.expiryDate).getTime() > now &&
      new Date(r.expiryDate).getTime() < now + 30 * 24 * 60 * 60 * 1000,
  ).length;

  return {
    activeProducts,
    activeProductsTrend: 0, // 🚧 pas d'historique renvoyé par l'API
    stockValue,
    stockValueTrend: 0,
    criticalStock,
    criticalStockTrend: 0,
    expiringSoon,
    expiringSoonTrend: null,
    averageMargin: 0, // 🚧 pas de coût d'achat exposé
    averageMarginTrend: 0,
  };
};

// ---- Nouveaux services prêts à l'emploi (pas encore branchés dans l'UI) ----

export interface UpsertStockInput {
  productId: string;
  priceXaf?: number;
  quantity?: number;
  lotNumber?: string;
  expiryDate?: string;
  location?: string;
  alertThreshold?: number;
  isAvailable?: boolean;
  reason?: string;
}

export const upsertInventoryStock = async (
  data: UpsertStockInput,
): Promise<InventoryProduct> => {
  const row = await apiRequest<ApiPharmacyProductRow>("/pharmacy/inventory", {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return toInventoryProduct(row);
};

export interface ImportStockItem {
  productId: string;
  priceXaf: number;
  quantity: number;
  lotNumber?: string;
  expiryDate?: string;
}

export const importInventoryStock = async (
  items: ImportStockItem[],
): Promise<{ imported: number }> => {
  return apiRequest<{ imported: number }>("/pharmacy/inventory/import", {
    method: "POST",
    body: JSON.stringify({ items }),
  });
};