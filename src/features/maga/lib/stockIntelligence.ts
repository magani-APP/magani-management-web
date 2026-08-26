import { mockInventoryProducts } from "@/mocks/inventory.mock";
import {
  AS_OF,
  CURRENT_QUARTER,
  DAYS_ELAPSED_IN_Q3,
  mockQuarterlySales,
  type QuarterlySales,
} from "@/mocks/consumption.mock";
import type { InventoryProduct } from "@/types/inventory.types";

export type CoverRisk = "rupture" | "tendu" | "ok" | "inactif";

export type ConsumptionRow = {
  product: InventoryProduct;
  sales: QuarterlySales;
  daily: number;
  daysCover: number | null;
  risk: CoverRisk;
  orderQty: number;
  q3vsQ2Pct: number | null;
};

const TARGET_COVER_DAYS = 45;
const RUPTURE_DAYS = 7;
const TENDU_DAYS = 21;

function salesFor(productId: string): QuarterlySales {
  return (
    mockQuarterlySales.find((s) => s.productId === productId) ?? {
      productId,
      q1: 0,
      q2: 0,
      q3: 0,
    }
  );
}

function riskOf(daily: number, daysCover: number | null, stock: number): CoverRisk {
  if (stock <= 0) return "rupture";
  if (daily <= 0) return "inactif";
  if (daysCover === null) return "inactif";
  if (daysCover <= RUPTURE_DAYS) return "rupture";
  if (daysCover <= TENDU_DAYS) return "tendu";
  return "ok";
}

export function consumptionRows(): ConsumptionRow[] {
  return mockInventoryProducts.map((product) => {
    const sales = salesFor(product.id);
    const q3 = sales[CURRENT_QUARTER];
    const daily = q3 > 0 ? q3 / DAYS_ELAPSED_IN_Q3 : 0;
    const daysCover = daily > 0 ? product.stock / daily : product.stock > 0 ? null : 0;
    const orderQty = daily > 0 ? Math.max(0, Math.ceil(daily * TARGET_COVER_DAYS - product.stock)) : 0;
    const q3vsQ2Pct = sales.q2 > 0 ? Math.round(((sales.q3 - sales.q2) / sales.q2) * 100) : null;
    return {
      product,
      sales,
      daily,
      daysCover,
      risk: riskOf(daily, daysCover, product.stock),
      orderQty,
      q3vsQ2Pct,
    };
  });
}

export function mostConsumed(limit = 6): ConsumptionRow[] {
  return [...consumptionRows()].sort((a, b) => b.sales.q3 - a.sales.q3).slice(0, limit);
}

export function likelyToFinish(limit = 6): ConsumptionRow[] {
  return [...consumptionRows()]
    .filter((r) => r.risk === "rupture" || r.risk === "tendu")
    .sort((a, b) => (a.daysCover ?? 0) - (b.daysCover ?? 0))
    .slice(0, limit);
}

export function rowForProduct(productId: string): ConsumptionRow | undefined {
  return consumptionRows().find((r) => r.product.id === productId);
}

export function formatDays(days: number | null) {
  if (days === null) return "pas assez d’historique";
  if (days <= 0) return "stock à 0";
  if (days < 1) return "moins d’un jour";
  const n = Math.round(days);
  return n === 1 ? "1 jour" : `${n} jours`;
}

export function formatDaily(n: number) {
  if (n < 1) return `${n.toFixed(1)} u./j`;
  return `${n.toFixed(1)} u./j`;
}

export function quarterCaption() {
  return `T3 2026 (1er juil. → ${AS_OF.slice(8)} août, ${DAYS_ELAPSED_IN_Q3} j)`;
}

export function riskLabel(risk: CoverRisk) {
  if (risk === "rupture") return "Va finir";
  if (risk === "tendu") return "Tendu";
  if (risk === "inactif") return "Peu de ventes";
  return "Couvert";
}
