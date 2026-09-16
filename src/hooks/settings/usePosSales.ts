"use client";

import { useEffect, useMemo, useState } from "react";
import { PosSale, PosSalePaymentMethod, PosSaleTabId } from "@/types/pos-sales.types";
import { getPosSales } from "@/api/pos-sales.api";
import { POS_SALES_PAGE_SIZE } from "@/constants/pos-sales.constants";

function normalizeString(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

const TAB_TO_STATUS: Record<PosSaleTabId, PosSale["status"] | null> = {
  all: null,
  collected: "encaisse",
  refunded: "rembourse",
  cancelled: "annule",
};

export function usePosSales() {
  const [sales, setSales] = useState<PosSale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTabState] = useState<PosSaleTabId>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilterState] = useState("Aujourd'hui");
  const [paymentFilter, setPaymentFilterState] = useState<PosSalePaymentMethod | "all">("all");
  const [cashierFilter, setCashierFilterState] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedSaleId, setSelectedSaleId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    getPosSales()
      .then((data) => {
        if (isMounted) setSales(data);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const setActiveTab = (tab: PosSaleTabId) => {
    setActiveTabState(tab);
    setPage(1);
  };

  const setSearch = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  const setDateFilter = (value: string) => {
    setDateFilterState(value);
    setPage(1);
  };

  const setPaymentFilter = (value: PosSalePaymentMethod | "all") => {
    setPaymentFilterState(value);
    setPage(1);
  };

  const setCashierFilter = (value: string) => {
    setCashierFilterState(value);
    setPage(1);
  };

  const tabCounts = useMemo(() => {
    return {
      all: sales.length,
      collected: sales.filter((s) => s.status === "encaisse").length,
      refunded: sales.filter((s) => s.status === "rembourse").length,
      cancelled: sales.filter((s) => s.status === "annule").length,
    };
  }, [sales]);

  const filteredSales = useMemo(() => {
    const targetStatus = TAB_TO_STATUS[activeTab];
    const query = normalizeString(searchQuery.trim());

    return sales.filter((sale) => {
      if (targetStatus && sale.status !== targetStatus) return false;
      if (paymentFilter !== "all" && sale.paymentMethod !== paymentFilter) return false;
      if (cashierFilter !== "all" && sale.cashier.initials !== cashierFilter) return false;

      if (query) {
        const matchesQuery =
          normalizeString(sale.reference).includes(query) || normalizeString(sale.client.name).includes(query);
        if (!matchesQuery) return false;
      }

      return true;
    });
  }, [sales, activeTab, searchQuery, paymentFilter, cashierFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredSales.length / POS_SALES_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const paginatedSales = useMemo(() => {
    const start = (currentPage - 1) * POS_SALES_PAGE_SIZE;
    return filteredSales.slice(start, start + POS_SALES_PAGE_SIZE);
  }, [filteredSales, currentPage]);

  const rangeStart = filteredSales.length === 0 ? 0 : (currentPage - 1) * POS_SALES_PAGE_SIZE + 1;
  const rangeEnd = Math.min(currentPage * POS_SALES_PAGE_SIZE, filteredSales.length);

  const selectedSale = sales.find((s) => s.id === selectedSaleId) ?? null;

  const toggleSaleDetail = (id: string) => {
    setSelectedSaleId((prev) => (prev === id ? null : id));
  };

  const handleExport = () => {
    const header = ["Référence", "Client", "Montant", "Moyen de paiement", "Date", "Heure", "Caissier", "Statut"];
    const rows = filteredSales.map((s) => [
      s.reference,
      s.client.name,
      String(s.amount),
      s.paymentMethod,
      s.date,
      s.time,
      s.cashier.name,
      s.status,
    ]);
    const csv = [header, ...rows].map((r) => r.join(";")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "caisse-encaissements.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return {
    isLoading,
    activeTab,
    setActiveTab,
    tabCounts,
    searchQuery,
    setSearch,
    dateFilter,
    setDateFilter,
    paymentFilter,
    setPaymentFilter,
    cashierFilter,
    setCashierFilter,
    filteredSales,
    paginatedSales,
    currentPage,
    totalPages,
    setPage,
    rangeStart,
    rangeEnd,
    selectedSale,
    toggleSaleDetail,
    closeDetail: () => setSelectedSaleId(null),
    handleExport,
  };
}
