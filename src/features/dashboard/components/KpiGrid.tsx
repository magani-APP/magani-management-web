import React from "react";
import { KpiCard } from "./KpiCard";
import { TrendingUp, Activity, ReceiptText, ShoppingBag } from "lucide-react";
import { KpiData } from "../../../mocks/dashboard.mock";

interface KpiGridProps {
  kpis: Record<string, KpiData>;
}

export function KpiGrid({ kpis }: KpiGridProps) {
  if (!kpis || Object.keys(kpis).length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <KpiCard
        data={kpis.revenue}
        Icon={TrendingUp}
        iconColor="text-brand-primary"
        iconBgColor="bg-brand-primary/10"
      />
      <KpiCard
        data={kpis.margin}
        Icon={Activity}
        iconColor="text-brand-primary"
        iconBgColor="bg-brand-primary/10"
      />
      <KpiCard
        data={kpis.transactions}
        Icon={ReceiptText}
        iconColor="text-status-warning" // Orange
        iconBgColor="bg-status-warning/10"
      />
      <KpiCard
        data={kpis.basket}
        Icon={ShoppingBag}
        iconColor="text-status-info" // Blue
        iconBgColor="bg-status-info/10"
      />
    </div>
  );
}
