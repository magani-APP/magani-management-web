import React from "react";
import { DashboardHeader } from "../../features/dashboard/components/DashboardHeader";
import { KpiGrid } from "../../features/dashboard/components/KpiGrid";
import { RevenueChart } from "../../features/dashboard/components/RevenueChart";
import { PaymentDonut } from "../../features/dashboard/components/PaymentDonut";
import { ActiveAlerts } from "../../features/dashboard/components/ActiveAlerts";
import { TopProducts } from "../../features/dashboard/components/TopProducts";
import { OwnerView } from "../../features/dashboard/components/OwnerView";
import {
  getDashboardKpis,
  getRevenueChartData,
  getPaymentDistribution,
  getActiveAlerts,
  getTopProducts,
  getOwnerStats
} from "../../api/dashboard.api";

export default async function DashboardPage() {
  const [
    kpis,
    revenueData,
    paymentData,
    alertsData,
    topProductsData,
    ownerStatsData
  ] = await Promise.all([
    getDashboardKpis(),
    getRevenueChartData(),
    getPaymentDistribution(),
    getActiveAlerts(),
    getTopProducts(),
    getOwnerStats()
  ]);

  return (
    <div className="p-4 md:p-4 overflow-y-auto no-scrollbar h-full">
      <DashboardHeader />

      <KpiGrid kpis={kpis as any} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        <div className="lg:col-span-8">
          <RevenueChart data={revenueData as any} />
        </div>
        <div className="lg:col-span-4">
          <PaymentDonut data={paymentData as any} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-6">
        <div className="lg:col-span-4 h-full">
          <ActiveAlerts data={alertsData as any} />
        </div>
        <div className="lg:col-span-5 h-full">
          <TopProducts data={topProductsData as any} />
        </div>
        <div className="lg:col-span-3 h-full">
          <OwnerView data={ownerStatsData as any} />
        </div>
      </div>
    </div>
  );
}
