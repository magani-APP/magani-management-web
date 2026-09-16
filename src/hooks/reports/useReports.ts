"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ReportTabId } from "@/types/reports";
import {
  getSalesReport,
  getTopProductsReport,
  getMarginsReport,
  getStockValueReport,
  getLossesReport,
  getEmployeesReport,
  getPaymentsReport,
} from "@/api/reports.api";
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
  const [isLoading, setIsLoading] = useState(true);

  const [data, setData] = useState({
    sales: mockSalesReport,
    topProducts: mockTopProducts,
    margins: mockMargins,
    stockValue: mockStockValue,
    losses: mockLosses,
    employees: mockEmployees,
    payments: mockPayments,
  });

  useEffect(() => {
    let isMounted = true;
    const days = timeFilter === "7days" ? 7 : 14;

    setIsLoading(true);
    Promise.all([
      getSalesReport(days),
      getTopProductsReport(days),
      getMarginsReport(),
      getStockValueReport(),
      getLossesReport(),
      getEmployeesReport(),
      getPaymentsReport(days),
    ])
      .then(([sales, topProducts, margins, stockValue, losses, employees, payments]) => {
        if (!isMounted) return;
        setData({ sales, topProducts, margins, stockValue, losses, employees, payments });
      })
      .catch(() => {
        // En cas d'erreur réseau on garde les dernières données affichées
        // (ou les mocks au premier chargement).
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [timeFilter]);

  return {
    activeTab,
    timeFilter,
    setTimeFilter,
    isLoading,
    data,
  };
}
