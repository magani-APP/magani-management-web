export type ReportTabId =
  | "sales"
  | "top-products"
  | "margins"
  | "stock-value"
  | "losses"
  | "employees"
  | "payments";

export interface SalesHistory {
  date: string;
  revenue: number;
  transactions: number;
  averageBasket: number;
  isToday?: boolean;
}

export interface SalesReportData {
  totalRevenue: number;
  totalTransactions: number;
  averageBasket: number;
  history: SalesHistory[];
}

export interface TopProductData {
  id: string;
  rank: number;
  name: string;
  unitsSold: number;
  revenue: number;
  trend: number; // Percentage, can be negative
}

export interface MarginData {
  id: string;
  name: string;
  marginPercent: number;
  revenue: number;
  netMargin: number;
}

export interface StockCategoryData {
  id: string;
  category: string;
  references: number | string; // or string "-" if null
  units: number;
  estimatedValue: number;
  stockPercent: number;
}

export interface StockValueData {
  totalValue: number;
  categories: StockCategoryData[];
}

export type LossType = "Expiré" | "Endommagé" | "Cassé";

export interface LossItem {
  id: string;
  name: string;
  type: LossType;
  quantity: number;
  lostValue: number;
  date: string;
}

export interface LossesData {
  totalLossValue: number;
  productsAffected: number;
  unitsLost: number;
  items: LossItem[];
}

export interface EmployeePerformance {
  id: string;
  name: string;
  initials: string;
  role: string;
  salesCount: number;
  revenue: number;
  averageBasket: number;
  revenueShare: number;
}

export interface PaymentModeData {
  id: string;
  mode: string;
  transactions: number;
  amount: number;
  share: number;
  color: string;
}

export interface PaymentsData {
  totalAmount: number;
  modes: PaymentModeData[];
}
