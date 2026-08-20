export type StockStatus = 'en-stock' | 'stock-bas' | 'critique' | 'expire';

export interface ProductLot {
  id: string;
  code: string;
  quantity: number;
  expirationDate: string; // ISO 8601
}

export type MovementType = 'vente' | 'reapprovisionnement';

export interface ProductMovement {
  id: string;
  type: MovementType;
  /** Signé : négatif pour une vente, positif pour un réapprovisionnement */
  quantity: number;
  date: string; // ISO 8601
  user: string;
}

export interface InventoryProduct {
  id: string;
  name: string;
  code: string;
  category: string;
  imageUrl?: string;
  salePrice: number;
  stock: number;
  unit: string;
  expirationDate: string; // ISO 8601
  marginPercent: number;
  status: StockStatus;
  lots?: ProductLot[];
  movements?: ProductMovement[];
}

export interface InventoryStats {
  activeProducts: number;
  activeProductsTrend: number;
  stockValue: number;
  stockValueTrend: number;
  criticalStock: number;
  criticalStockTrend: number;
  expiringSoon: number;
  expiringSoonTrend: number | null;
  averageMargin: number;
  averageMarginTrend: number;
}

export type InventoryFilterLabel = 'Tous' | 'En stock' | 'Bas' | 'Critique' | 'Expiré';