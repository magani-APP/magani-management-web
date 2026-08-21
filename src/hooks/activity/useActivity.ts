"use client";

import { useEffect, useMemo, useState } from "react";
import { getActivityLog } from "@/api/activity.api";
import { ACTIVITY_FILTERS } from "@/constants/activity.constants";
import { ActivityDayGroup, ActivityFilterId } from "@/types/activity.types";

function normalizeString(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function useActivity() {
  const [groups, setGroups] = useState<ActivityDayGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<ActivityFilterId>("tout");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let isMounted = true;

    getActivityLog().then((data) => {
      if (isMounted) {
        setGroups(data);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const activeFilterConfig =
    ACTIVITY_FILTERS.find((filter) => filter.id === activeFilter) ?? ACTIVITY_FILTERS[0];

  const filteredGroups = useMemo(() => {
    const query = normalizeString(searchQuery.trim());

    return groups
      .map((group) => {
        const entries = group.entries.filter((entry) => {
          const matchesType =
            !activeFilterConfig.types || activeFilterConfig.types.includes(entry.actionType);
          if (!matchesType) return false;

          if (!query) return true;

          const employeeNameNormalized = normalizeString(entry.employeeName);
          const actionLabelNormalized = normalizeString(entry.actionLabel);
          const targetLabelNormalized = entry.targetLabel
            ? normalizeString(entry.targetLabel)
            : "";

          return (
            employeeNameNormalized.includes(query) ||
            actionLabelNormalized.includes(query) ||
            targetLabelNormalized.includes(query)
          );
        });

        return {
          group,
          entries,
          totalCount: group.entries.length,
        };
      })
      .filter((item) => item.entries.length > 0);
  }, [groups, activeFilterConfig, searchQuery]);

  return {
    isLoading,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    groups: filteredGroups,
  };
}
