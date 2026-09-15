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

// ---- Revenus / paiements : calculés côté client à partir des vraies ventes ----
// GET /pharmacy/pos/sales renvoie items + payments + cashier ; on les agrège
// nous-mêmes puisque /pharmacy/pos/dashboard ne fournit qu'un instantané du
// jour. La marge (coût d'achat) n'est en revanche pas exposée par l'API :
// elle reste à 0 tant que PharmacyProduct n'a pas de champ de coût.
const PAYMENT_LABEL: Record<string, string> = {
  CASH: "Espèces",
  MTN_MOMO: "MTN MoMo",
  ORANGE_MONEY: "Orange Money",
  CARD: "Carte bancaire",
};

const PAYMENT_COLOR: Record<string, string> = {
  CASH: "#0B8F68",
  MTN_MOMO: "#FFC107",
  ORANGE_MONEY: "#FF6200",
  CARD: "#3B82F6",
};

export const getRevenueChartData = async (tokens?: Tokens) => {
  try {
    const { listDetailedPosSales } = await import("@/api/pos.api");
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - 55); // ~8 semaines glissantes
    from.setHours(0, 0, 0, 0);

    const sales = await listDetailedPosSales(from.toISOString(), to.toISOString(), tokens);

    const byWeek = new Map<number, number>();
    for (const sale of sales) {
      const daysAgo = Math.floor((Date.now() - new Date(sale.createdAt).getTime()) / (24 * 60 * 60 * 1000));
      const weekIndex = 7 - Math.min(7, Math.floor(daysAgo / 7));
      byWeek.set(weekIndex, (byWeek.get(weekIndex) ?? 0) + sale.totalXaf);
    }

    return Array.from({ length: 8 }, (_, i) => {
      const weekNumber = i + 1;
      return {
        name: `S.${weekNumber}`,
        ca: Math.round((byWeek.get(weekNumber) ?? 0) / 1000) / 1000, // en millions FCFA
        marge: 0, // 🚧 pas de coût d'achat exposé par l'API pour calculer la marge
      };
    });
  } catch {
    return mockRevenueChartData;
  }
};

export const getPaymentDistribution = async (tokens?: Tokens) => {
  try {
    const { listDetailedPosSales } = await import("@/api/pos.api");
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - 30);
    from.setHours(0, 0, 0, 0);

    const sales = await listDetailedPosSales(from.toISOString(), to.toISOString(), tokens);

    const byMode = new Map<string, number>();
    for (const sale of sales) {
      for (const payment of sale.payments) {
        byMode.set(payment.provider, (byMode.get(payment.provider) ?? 0) + payment.amountXaf);
      }
    }

    const total = [...byMode.values()].reduce((s, v) => s + v, 0);
    if (total === 0) return mockPaymentData;

    return [...byMode.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([provider, amount]) => ({
        name: PAYMENT_LABEL[provider] ?? provider,
        value: Math.round((amount / total) * 100),
        color: PAYMENT_COLOR[provider] ?? "#8B5CF6",
      }));
  } catch {
    return mockPaymentData;
  }
};

// 🚧 Bénéfice net, objectif mensuel, employés actifs et taux de service ne
// sont adossés à aucun endpoint aujourd'hui (pas de coût d'achat, pas
// d'objectif configurable, pas de liste d'employés côté pharmacie). On
// garde ce bloc mocké jusqu'à ce que le backend expose ces données.
export const getOwnerStats = async () => {
  return new Promise((resolve) => setTimeout(() => resolve(mockOwnerStats), 100));
};