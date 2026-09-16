"use client";

import { useMemo, useState } from "react";
import { INTEGRATIONS } from "@/mocks/integrations.mock";
import { Integration, IntegrationCategory, IntegrationTabId } from "@/types/integrations.types";

const CATEGORY_ORDER: IntegrationCategory[] = ["payments", "stock", "communication", "delivery"];

export interface IntegrationSection {
  category: IntegrationCategory;
  items: Integration[];
}

function normalizeString(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function useIntegrations() {
  const [activeTab, setActiveTabState] = useState<IntegrationTabId>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const setActiveTab = (tab: IntegrationTabId) => {
    setActiveTabState(tab);
  };

  const tabCounts = useMemo(() => {
    return {
      all: INTEGRATIONS.length,
      payments: INTEGRATIONS.filter((i) => i.category === "payments").length,
      stock: INTEGRATIONS.filter((i) => i.category === "stock").length,
      communication: INTEGRATIONS.filter((i) => i.category === "communication").length,
      delivery: INTEGRATIONS.filter((i) => i.category === "delivery").length,
    };
  }, []);

  const filteredIntegrations = useMemo(() => {
    const query = normalizeString(searchQuery.trim());

    return INTEGRATIONS.filter((integration) => {
      if (activeTab !== "all" && integration.category !== activeTab) return false;
      if (!query) return true;
      return (
        normalizeString(integration.name).includes(query) ||
        normalizeString(integration.description).includes(query)
      );
    });
  }, [activeTab, searchQuery]);

  const sections: IntegrationSection[] = useMemo(() => {
    return CATEGORY_ORDER.map((category) => ({
      category,
      items: filteredIntegrations.filter((i) => i.category === category),
    })).filter((section) => section.items.length > 0);
  }, [filteredIntegrations]);

  const selectedIntegration = INTEGRATIONS.find((i) => i.id === selectedId) ?? null;

  const toggleDetail = (id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  return {
    activeTab,
    setActiveTab,
    tabCounts,
    searchQuery,
    setSearchQuery,
    sections,
    selectedIntegration,
    toggleDetail,
    closeDetail: () => setSelectedId(null),
  };
}
