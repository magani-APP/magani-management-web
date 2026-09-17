import { listDetailedPosSales, DetailedSale } from "@/api/pos.api";
import { getInventoryProducts } from "@/api/inventory.api";
import {
  mockEmployees,
  mockSalesReport,
  mockTopProducts as mockTopProductsReport,
  mockMargins,
  mockLosses,
  mockStockValue,
  mockPayments,
} from "@/mocks/reports.mock";
import { apiRequest } from "@/lib/api-client";
import {
  MarginData,
  LossesData,
  EmployeePerformance,
  PaymentModeData,
  PaymentsData,
  SalesHistory,
  SalesReportData,
  StockCategoryData,
  StockValueData,
  TopProductData,
} from "@/types/reports";

// ---- Constantes de présentation ----
const PROVIDER_LABEL: Record<string, string> = {
  CASH: "Espèces",
  MTN_MOMO: "MTN MoMo",
  ORANGE_MONEY: "Orange Money",
  CARD: "Carte bancaire",
};

const PROVIDER_COLOR: Record<string, string> = {
  CASH: "#0B8F68",
  MTN_MOMO: "#FFC107",
  ORANGE_MONEY: "#FF6200",
  CARD: "#3B82F6",
};

function dayKey(iso: string): string {
  return new Date(iso).toISOString().slice(0, 10);
}

function formatDayLabel(key: string): string {
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "2-digit" }).format(new Date(key));
}

function isToday(key: string): boolean {
  return key === new Date().toISOString().slice(0, 10);
}

async function fetchSales(days: number): Promise<DetailedSale[]> {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - (days - 1));
  from.setHours(0, 0, 0, 0);
  return listDetailedPosSales(from.toISOString(), to.toISOString());
}

// ---- Rapport ventes : agrégation jour par jour des vraies ventes ----
export const getSalesReport = async (days: 7 | 14 = 14): Promise<SalesReportData> => {
  try {
    const sales = await fetchSales(days);

    const byDay = new Map<string, { revenue: number; transactions: number }>();
    for (const sale of sales) {
      const key = dayKey(sale.createdAt);
      const cur = byDay.get(key) ?? { revenue: 0, transactions: 0 };
      cur.revenue += sale.totalXaf;
      cur.transactions += 1;
      byDay.set(key, cur);
    }

    const history: SalesHistory[] = [];
    const cursor = new Date();
    cursor.setDate(cursor.getDate() - (days - 1));
    for (let i = 0; i < days; i++) {
      const key = cursor.toISOString().slice(0, 10);
      const entry = byDay.get(key) ?? { revenue: 0, transactions: 0 };
      history.push({
        date: formatDayLabel(key),
        revenue: entry.revenue,
        transactions: entry.transactions,
        averageBasket: entry.transactions > 0 ? Math.round(entry.revenue / entry.transactions) : 0,
        isToday: isToday(key),
      });
      cursor.setDate(cursor.getDate() + 1);
    }

    const totalRevenue = sales.reduce((s, sale) => s + sale.totalXaf, 0);
    const totalTransactions = sales.length;

    return {
      totalRevenue,
      totalTransactions,
      averageBasket: totalTransactions > 0 ? Math.round(totalRevenue / totalTransactions) : 0,
      history,
    };
  } catch {
    return mockSalesReport;
  }
};

// ---- Top produits : agrégation des lignes de vente réelles ----
export const getTopProductsReport = async (days: 14 | 7 = 14): Promise<TopProductData[]> => {
  try {
    const sales = await fetchSales(days);

    const byProduct = new Map<string, { name: string; unitsSold: number; revenue: number }>();
    for (const sale of sales) {
      for (const item of sale.items) {
        const cur = byProduct.get(item.productId) ?? {
          name: item.product.nameFr,
          unitsSold: 0,
          revenue: 0,
        };
        cur.unitsSold += item.quantity;
        cur.revenue += item.quantity * item.unitPriceXaf;
        byProduct.set(item.productId, cur);
      }
    }

    return [...byProduct.entries()]
      .sort((a, b) => b[1].revenue - a[1].revenue)
      .slice(0, 10)
      .map(([id, data], index) => ({
        id,
        rank: index + 1,
        name: data.name,
        unitsSold: data.unitsSold,
        revenue: data.revenue,
        // 🚧 Pas d'historique de la période précédente exposé par l'API :
        // impossible de calculer une vraie tendance pour l'instant.
        trend: 0,
      }));
  } catch {
    return mockTopProductsReport;
  }
};

// ---- Moyens de paiement : agrégation réelle des paiements des ventes ----
export const getPaymentsReport = async (days: 14 | 7 = 14): Promise<PaymentsData> => {
  try {
    const sales = await fetchSales(days);

    const byMode = new Map<string, { transactions: number; amount: number }>();
    for (const sale of sales) {
      for (const payment of sale.payments) {
        const cur = byMode.get(payment.provider) ?? { transactions: 0, amount: 0 };
        cur.transactions += 1;
        cur.amount += payment.amountXaf;
        byMode.set(payment.provider, cur);
      }
    }

    const totalAmount = [...byMode.values()].reduce((s, m) => s + m.amount, 0);

    const modes: PaymentModeData[] = [...byMode.entries()]
      .sort((a, b) => b[1].amount - a[1].amount)
      .map(([provider, data]) => ({
        id: provider,
        mode: PROVIDER_LABEL[provider] ?? provider,
        transactions: data.transactions,
        amount: data.amount,
        share: totalAmount > 0 ? Math.round((data.amount / totalAmount) * 100) : 0,
        color: PROVIDER_COLOR[provider] ?? "#8B5CF6",
      }));

    return { totalAmount, modes };
  } catch {
    return mockPayments;
  }
};

// ---- Valeur du stock : agrégation réelle par catégorie depuis /pharmacy/inventory ----
export const getStockValueReport = async (): Promise<StockValueData> => {
  try {
    const products = await getInventoryProducts();

    const byCategory = new Map<string, { references: number; units: number; estimatedValue: number }>();
    for (const product of products) {
      const cur = byCategory.get(product.category) ?? { references: 0, units: 0, estimatedValue: 0 };
      cur.references += 1;
      cur.units += product.stock;
      cur.estimatedValue += product.stock * product.salePrice;
      byCategory.set(product.category, cur);
    }

    const totalValue = [...byCategory.values()].reduce((s, c) => s + c.estimatedValue, 0);

    const categories: StockCategoryData[] = [...byCategory.entries()]
      .sort((a, b) => b[1].estimatedValue - a[1].estimatedValue)
      .map(([category, data], index) => ({
        id: `${index}-${category}`,
        category,
        references: data.references,
        units: data.units,
        estimatedValue: data.estimatedValue,
        stockPercent: totalValue > 0 ? Math.round((data.estimatedValue / totalValue) * 100) : 0,
      }));

    return { totalValue, categories };
  } catch {
    return mockStockValue;
  }
};

// ---- Marges & pertes : endpoints dédiés ----
export const getMarginsReport = async (days: 14 | 30 = 30): Promise<MarginData[]> => {
  try {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - (days - 1));
    from.setHours(0, 0, 0, 0);
    const qs = new URLSearchParams({
      from: from.toISOString(),
      to: to.toISOString(),
    });
    return await apiRequest<MarginData[]>(`/pharmacy/reports/margins?${qs}`);
  } catch {
    return mockMargins;
  }
};

export const getLossesReport = async (days: 365 = 365): Promise<LossesData> => {
  try {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - (days - 1));
    from.setHours(0, 0, 0, 0);
    const qs = new URLSearchParams({
      from: from.toISOString(),
      to: to.toISOString(),
    });
    return await apiRequest<LossesData>(`/pharmacy/reports/losses?${qs}`);
  } catch {
    return mockLosses;
  }
};

export const getEmployeesReport = async (): Promise<EmployeePerformance[]> => {
  return mockEmployees;
};
