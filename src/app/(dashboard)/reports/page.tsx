"use client";

import { useReports } from "@/hooks/reports/useReports";
import { ReportsLayout } from "@/features/reports/components/ReportsLayout";
import { SalesReport } from "@/features/reports/components/SalesReport";
import { TopProductsReport } from "@/features/reports/components/TopProductsReport";
import { MarginsReport } from "@/features/reports/components/MarginsReport";
import { StockValueReport } from "@/features/reports/components/StockValueReport";
import { LossesReport } from "@/features/reports/components/LossesReport";
import { EmployeesReport } from "@/features/reports/components/EmployeesReport";
import { PaymentsReport } from "@/features/reports/components/PaymentsReport";
import { Suspense } from "react";

function ReportsContent() {
  const { activeTab, timeFilter, setTimeFilter, data } = useReports();

  const renderActiveTab = () => {
    switch (activeTab) {
      case "sales":
        return <SalesReport data={data.sales} timeFilter={timeFilter} onTimeFilterChange={setTimeFilter} />;
      case "top-products":
        return <TopProductsReport data={data.topProducts} />;
      case "margins":
        return <MarginsReport data={data.margins} />;
      case "stock-value":
        return <StockValueReport data={data.stockValue} />;
      case "losses":
        return <LossesReport data={data.losses} />;
      case "employees":
        return <EmployeesReport data={data.employees} />;
      case "payments":
        return <PaymentsReport data={data.payments} />;
      default:
        return null;
    }
  };

  return (
    <ReportsLayout activeTab={activeTab}>
      {renderActiveTab()}
    </ReportsLayout>
  );
}

export default function ReportsPage() {
  return (
    <div className="h-full bg-background overflow-hidden">
      <Suspense fallback={
        <div className="flex h-full items-center justify-center">
          <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      }>
        <ReportsContent />
      </Suspense>
    </div>
  );
}
