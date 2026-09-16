"use client";

import { useEffect, useMemo, useState } from "react";
import { Receipt, ReceiptPaymentMethod, ReceiptTabId } from "@/types/receipts.types";
import { getReceipts } from "@/api/receipts.api";
import { RECEIPTS_PAGE_SIZE } from "@/constants/receipts.constants";

function normalizeString(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

const TAB_TO_STATUS: Record<ReceiptTabId, Receipt["status"] | null> = {
  all: null,
  sales: "vente",
  refunds: "rembourse",
  cancellations: "annule",
};

export function useReceipts() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTabState] = useState<ReceiptTabId>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [monthFilter, setMonthFilter] = useState("Août 2026");
  const [paymentFilter, setPaymentFilter] = useState<ReceiptPaymentMethod | "all">("all");
  const [cashierFilter, setCashierFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedReceiptId, setSelectedReceiptId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    getReceipts()
      .then((data) => {
        if (isMounted) setReceipts(data);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const setActiveTab = (tab: ReceiptTabId) => {
    setActiveTabState(tab);
    setPage(1);
  };

  const setSearch = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  const setPayment = (value: ReceiptPaymentMethod | "all") => {
    setPaymentFilter(value);
    setPage(1);
  };

  const setCashier = (value: string) => {
    setCashierFilter(value);
    setPage(1);
  };

  const setMonth = (value: string) => {
    setMonthFilter(value);
    setPage(1);
  };

  const tabCounts = useMemo(() => {
    return {
      all: receipts.length,
      sales: receipts.filter((r) => r.status === "vente").length,
      refunds: receipts.filter((r) => r.status === "rembourse").length,
      cancellations: receipts.filter((r) => r.status === "annule").length,
    };
  }, [receipts]);

  const filteredReceipts = useMemo(() => {
    const targetStatus = TAB_TO_STATUS[activeTab];
    const query = normalizeString(searchQuery.trim());

    return receipts.filter((receipt) => {
      if (targetStatus && receipt.status !== targetStatus) return false;
      if (paymentFilter !== "all" && receipt.paymentMethod !== paymentFilter) return false;
      if (cashierFilter !== "all" && receipt.cashier.initials !== cashierFilter) return false;

      if (query) {
        const matchesQuery =
          normalizeString(receipt.receiptNumber).includes(query) ||
          normalizeString(receipt.client.name).includes(query);
        if (!matchesQuery) return false;
      }

      return true;
    });
  }, [receipts, activeTab, searchQuery, paymentFilter, cashierFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredReceipts.length / RECEIPTS_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const paginatedReceipts = useMemo(() => {
    const start = (currentPage - 1) * RECEIPTS_PAGE_SIZE;
    return filteredReceipts.slice(start, start + RECEIPTS_PAGE_SIZE);
  }, [filteredReceipts, currentPage]);

  const rangeStart = filteredReceipts.length === 0 ? 0 : (currentPage - 1) * RECEIPTS_PAGE_SIZE + 1;
  const rangeEnd = Math.min(currentPage * RECEIPTS_PAGE_SIZE, filteredReceipts.length);

  const selectedReceipt = receipts.find((r) => r.id === selectedReceiptId) ?? null;

  const toggleReceiptDetail = (id: string) => {
    setSelectedReceiptId((prev) => (prev === id ? null : id));
  };

  return {
    isLoading,
    activeTab,
    setActiveTab,
    tabCounts,
    searchQuery,
    setSearch,
    monthFilter,
    setMonth,
    paymentFilter,
    setPayment,
    cashierFilter,
    setCashier,
    filteredReceipts,
    paginatedReceipts,
    currentPage,
    totalPages,
    setPage,
    rangeStart,
    rangeEnd,
    selectedReceipt,
    toggleReceiptDetail,
    closeDetail: () => setSelectedReceiptId(null),
  };
}
