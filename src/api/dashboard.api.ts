import { cache } from "react";
import { apiRequest } from "@/lib/api-client";
import {
  mockRevenueChartData,
  mockPaymentData,
  mockOwnerStats,
  mockKpis,
  mockAlerts,
  mockTopProducts,
  KpiData,
  AlertData,
  TopProduct,
} from "../mocks/dashboard.mock";

interface ApiDashboardPayload {
  today: { salesCount: number; turnoverXaf: number; currency: string };
  pendingReservations: number;
  pendingExpressRequests: number;
  lowStock: { productId: string; product: { nameFr: string }; quantity: number; alertThreshold: number }[];
  expiringSoon: { productId: string; product: { nameFr: string }; expiryDate: string }[];
  topProductsToday: { productId: string; qty: number; amount: number }[];
  inventoryCount: number;
}

interface ApiPharmacyProductRow {
  productId: string;
  product: { nameFr: string };
}

type Tokens = { accessToken?: string; refreshToken?: string };

const fetchDashboard = cache(async (accessToken = "", refreshToken = ""): Promise<ApiDashboardPayload> => {
  return apiRequest<ApiDashboardPayload>("/pharmacy/pos/dashboard", {
    accessToken: accessToken || undefined,
    refreshToken: refreshToken || undefined,
  });
});

export const getDashboardKpis = async (tokens?: Tokens): Promise<Record<string, KpiData>> => {
  try {
    const dashboard = await fetchDashboard(tokens?.accessToken ?? "", tokens?.refreshToken ?? "");
    const basket =
      dashboard.today.salesCount > 0
        ? Math.round(dashboard.today.turnoverXaf / dashboard.today.salesCount)
        : 0;

    return {
      revenue: {
        label: "CHIFFRE D'AFFAIRES (AUJOURD'HUI)",
        value: `${dashboard.today.turnoverXaf.toLocaleString("fr-FR")} F`,
        trend: "neutral",
        percentage: "—",
        subText: `${dashboard.today.salesCount} vente(s) aujourd'hui`,
      },
      margin: {
        label: "MARGE BRUTE",
        value: "—",
        trend: "neutral",
        percentage: "—",
        subText: "Donnée à venir",
      },
      transactions: {
        label: "TRANSACTIONS",
        value: String(dashboard.today.salesCount),
        trend: "neutral",
        percentage: "—",
        subText: "ventes aujourd'hui",
      },
      basket: {
        label: "PANIER MOYEN",
        value: `${basket.toLocaleString("fr-FR")} F`,
        trend: "neutral",
        percentage: "—",
        subText: "par transaction",
      },
    };
  } catch {
    return mockKpis;
  }
};

export const getActiveAlerts = async (tokens?: Tokens): Promise<AlertData[]> => {
  try {
    const dashboard = await fetchDashboard(tokens?.accessToken ?? "", tokens?.refreshToken ?? "");
    const alerts: AlertData[] = [];

    for (const item of dashboard.lowStock.slice(0, 5)) {
      alerts.push({
        id: `low-${item.productId}`,
        message: `${item.product.nameFr} : stock critique (${item.quantity} unités)`,
        severity: "danger",
        actionLabel: "Commander",
      });
    }
    for (const item of dashboard.expiringSoon.slice(0, 5)) {
      alerts.push({
        id: `exp-${item.productId}`,
        message: `${item.product.nameFr} : expire le ${new Date(item.expiryDate).toLocaleDateString("fr-FR")}`,
        severity: "warning",
        actionLabel: "Voir",
      });
    }
    return alerts;
  } catch {
    return mockAlerts;
  }
};

export const getTopProducts = async (tokens?: Tokens): Promise<TopProduct[]> => {
  try {
    const accessToken = tokens?.accessToken ?? "";
    const refreshToken = tokens?.refreshToken ?? "";
    const [dashboard, inventoryRows] = await Promise.all([
      fetchDashboard(accessToken, refreshToken),
      apiRequest<ApiPharmacyProductRow[]>("/pharmacy/inventory", {
        accessToken: accessToken || undefined,
        refreshToken: refreshToken || undefined,
      }),
    ]);

    const nameById = new Map(inventoryRows.map((r) => [r.productId, r.product.nameFr]));

    return dashboard.topProductsToday.map((p) => ({
      id: p.productId,
      name: nameById.get(p.productId) ?? p.productId,
      units: p.qty,
      revenue: `${Math.round(p.amount / 1000)}k F`,
      trend: "up" as const,
      percentage: "—",
    }));
  } catch {
    return mockTopProducts;
  }
};

// 🚧 Aucun endpoint backend n'agrège encore ces données (tendance hebdo,
// répartition des moyens de paiement, P&L propriétaire). On garde le mock
// jusqu'à ce que /pharmacy/pos/dashboard soit enrichi, ou qu'on calcule ces
// chiffres côté client à partir de GET /pharmacy/pos/sales.
export const getRevenueChartData = async () => {
  return new Promise((resolve) => setTimeout(() => resolve(mockRevenueChartData), 100));
};

export const getPaymentDistribution = async () => {
  return new Promise((resolve) => setTimeout(() => resolve(mockPaymentData), 100));
};

export const getOwnerStats = async () => {
  return new Promise((resolve) => setTimeout(() => resolve(mockOwnerStats), 100));
};