import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { ReportTabId } from "@/types/reports";
import {
  mockSalesReport,
  mockTopProducts,
  mockMargins,
  mockStockValue,
  mockLosses,
  mockEmployees,
  mockPayments,
} from "@/mocks/reports.mock";

export function useReports() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as ReportTabId | null;
  
  const activeTab = tabParam || "sales";
  const [timeFilter, setTimeFilter] = useState<"7days" | "14days">("14days");

  // Simulate filtering the sales data based on timeFilter
  const filteredSalesHistory = timeFilter === "7days" 
    ? mockSalesReport.history.slice(-7)
    : mockSalesReport.history;
    
  const salesData = {
    ...mockSalesReport,
    history: filteredSalesHistory
  };

  return {
    activeTab,
    timeFilter,
    setTimeFilter,
    data: {
      sales: salesData,
      topProducts: mockTopProducts,
      margins: mockMargins,
      stockValue: mockStockValue,
      losses: mockLosses,
      employees: mockEmployees,
      payments: mockPayments,
    }
  };
}
