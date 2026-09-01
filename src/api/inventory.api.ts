import { ApiError, apiRequest } from "@/lib/api-client";
import { InventoryProduct, InventoryStats, MovementType } from "@/types/inventory.types";

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
  movements?: ApiStockMovement[];
}

interface ApiStockMovement {
  id: string;
  type: string;
  quantity: number;
  createdAt: string;
  reason?: string | null;
}

function mapMovementType(type: string, quantity: number): MovementType {
  if (type === "SALE") return "vente";
  if (
    type === "PURCHASE_RECEIPT" ||
    type === "IMPORT" ||
    type === "TRANSFER_IN" ||
    (type === "ADJUSTMENT" && quantity > 0)
  ) {
    return "reapprovisionnement";
  }
  if (quantity < 0) return "vente";
  if (quantity > 0) return "reapprovisionnement";
  return "ajustement";
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
    categoryId: row.product.category?.id,
    imageUrl: undefined, // pas encore renvoyé par l'API
    salePrice: row.priceXaf,
    stock: row.availableQty,
    unit: row.product.form ?? "unité",
    expirationDate: row.expiryDate ?? "",
    // Pas de coût d'achat exposé par l'API pour l'instant → marge non calculable.
    marginPercent: 0,
    status: computeStatus(row),
    lots: row.lotNumber
      ? [
          {
            id: row.id,
            code: row.lotNumber,
            quantity: row.availableQty,
            expirationDate: row.expiryDate ?? "",
          },
        ]
      : [],
    movements: (row.movements ?? []).map((movement) => ({
      id: movement.id,
      type: mapMovementType(movement.type, movement.quantity),
      quantity: movement.quantity,
      date: movement.createdAt,
      user: movement.reason ?? "—",
    })),
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
  addQuantity?: number;
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

interface ApiCategoryNode {
  id: string;
  nameFr: string;
  children?: ApiCategoryNode[];
}

export interface ProductCategoryOption {
  id: string;
  name: string;
}

export const listProductCategories = async (): Promise<ProductCategoryOption[]> => {
  const nodes = await apiRequest<ApiCategoryNode[]>("/products/categories");
  const options: ProductCategoryOption[] = [];

  const walk = (items: ApiCategoryNode[]) => {
    for (const item of items) {
      options.push({ id: item.id, name: item.nameFr });
      if (item.children?.length) walk(item.children);
    }
  };

  walk(nodes);
  return options;
};

interface CreatedCatalogProduct {
  id: string;
  nameFr: string;
  form?: string | null;
  barcode?: string | null;
}

const createCatalogProduct = async (data: {
  nameFr: string;
  nameEn: string;
  form?: string;
  barcode?: string;
  categoryId?: string;
}): Promise<CreatedCatalogProduct> => {
  return apiRequest<CreatedCatalogProduct>("/products", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export interface CreateInventoryProductInput {
  name: string;
  categoryId?: string;
  categoryName?: string;
  salePrice: number;
  stock: number;
  unit: string;
  expirationDate?: string;
  barcode?: string;
}

export const createInventoryProduct = async (
  input: CreateInventoryProductInput,
): Promise<InventoryProduct> => {
  const created = await createCatalogProduct({
    nameFr: input.name,
    nameEn: input.name,
    form: input.unit || undefined,
    barcode: input.barcode || undefined,
    categoryId: input.categoryId || undefined,
  });

  const product = await upsertInventoryStock({
    productId: created.id,
    priceXaf: Math.round(input.salePrice),
    quantity: Math.round(input.stock),
    expiryDate: input.expirationDate || undefined,
    isAvailable: true,
  });

  return {
    ...product,
    category: input.categoryName ?? product.category,
    unit: input.unit || product.unit,
    code: input.barcode || product.code,
  };
};

export const getInventoryProduct = async (productId: string): Promise<InventoryProduct> => {
  const row = await apiRequest<ApiPharmacyProductRow>(`/pharmacy/inventory/${productId}`);
  return toInventoryProduct(row);
};

export const updateInventoryProduct = async (
  productId: string,
  input: CreateInventoryProductInput,
): Promise<InventoryProduct> => {
  await apiRequest(`/products/${productId}`, {
    method: "PATCH",
    body: JSON.stringify({
      nameFr: input.name,
      nameEn: input.name,
      form: input.unit || undefined,
      barcode: input.barcode || null,
      categoryId: input.categoryId || null,
    }),
  });

  const product = await upsertInventoryStock({
    productId,
    priceXaf: Math.round(input.salePrice),
    expiryDate: input.expirationDate || undefined,
  });

  return {
    ...product,
    category: input.categoryName ?? product.category,
    categoryId: input.categoryId ?? product.categoryId,
    unit: input.unit || product.unit,
    code: input.barcode || product.code,
  };
};

export const restockInventoryProduct = async (input: {
  productId: string;
  addQuantity: number;
  lotNumber?: string;
  expiryDate?: string;
}): Promise<InventoryProduct> => {
  return upsertInventoryStock({
    productId: input.productId,
    addQuantity: input.addQuantity,
    lotNumber: input.lotNumber,
    expiryDate: input.expiryDate,
    isAvailable: true,
    reason: "Réapprovisionnement",
  });
};

export const deleteInventoryProduct = async (productId: string): Promise<void> => {
  await apiRequest("/pharmacy/inventory", {
    method: "DELETE",
    body: JSON.stringify({ productId }),
  });
};

export function inventoryErrorMessage(error: unknown, fallback: string): string {
  if (!(error instanceof ApiError)) return fallback;
  if (error.status === 429) return "Trop de requêtes. Réessayez dans un instant.";
  if (error.status === 403) return "Vous n'avez pas le droit d'effectuer cette action.";
  if (error.status === 404) return "Ce produit n'est plus dans le stock.";
  if (error.status === 409 || /unique constraint/i.test(error.message)) {
    if (/barcode/i.test(error.message)) {
      return "Un produit avec ce code-barres existe déjà.";
    }
    if (/name/i.test(error.message)) {
      return "Un produit avec ce nom existe déjà.";
    }
    return "Un produit avec ces informations existe déjà.";
  }
  if (error.status >= 500) return fallback;
  return error.message || fallback;
}