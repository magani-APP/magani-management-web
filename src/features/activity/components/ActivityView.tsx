"use client";

import { Download, Search } from "lucide-react";
import { useActivity } from "@/hooks/activity/useActivity";
import { ACTIVITY_FILTERS } from "@/constants/activity.constants";
import { ActivityLogRow } from "./ActivityLogRow";

export function ActivityView() {
  const { isLoading, activeFilter, setActiveFilter, searchQuery, setSearchQuery, groups } =
    useActivity();

  return (
    <div className="h-full flex flex-col">
      {/* En-tête */}
      <div className="px-6 pt-5 pb-3 shrink-0 border-b border-[#F0F5F2] bg-white/60">
        <div className="flex items-center gap-3 mb-3">
          <h2 className="text-base font-bold text-[#0F1A15]">Journal d&apos;activité</h2>
          <span className="text-xs text-[#9AAEA3] font-medium">· Toute l&apos;équipe</span>

          {/* Recherche */}
          <div className="ml-auto relative">
            <Search
              size={12}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9AAEA3] pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Rechercher un employé, une action…"
              className="pl-8 pr-3 py-2 rounded-2xl text-xs font-medium outline-none bg-white border border-[#E8EDEA] placeholder:text-[#9AAEA3] text-[#0F1A15] focus:border-[#0B8F68]/40 transition-colors w-[260px]"
            />
          </div>

          {/* Export */}
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl border border-[#E8EDEA] bg-white text-[10px] font-bold text-[#6B7A6F] hover:text-[#0B8F68] hover:border-[#0B8F68]/30 transition-colors"
          >
            <Download size={11} />
            Exporter
          </button>
        </div>

        {/* Filtres par type d'action */}
        <div className="flex gap-1.5">
          {ACTIVITY_FILTERS.map((filter) => {
            const isActive = activeFilter === filter.id;
            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => setActiveFilter(filter.id)}
                className={`px-3 py-1.5 rounded-2xl text-[10px] font-bold transition-all border ${
                  isActive
                    ? "text-white border-transparent"
                    : "bg-white text-[#6B7A6F] border-[#E8EDEA] hover:border-[#0B8F68]/30"
                }`}
                style={isActive ? { background: "rgb(11, 143, 104)" } : undefined}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Liste groupée par jour */}
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
        {isLoading ? (
          <div className="flex items-center justify-center h-[240px]">
            <div className="w-7 h-7 border-4 border-[#0B8F68] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : groups.length === 0 ? (
          <div className="flex items-center justify-center h-[240px]">
            <p className="text-xs font-medium text-[#9AAEA3]">
              Aucune activité ne correspond à votre recherche.
            </p>
          </div>
        ) : (
          groups.map(({ group, entries, totalCount }) => (
            <div key={group.id}>
              {/* Bandeau de date */}
              <div
                className="px-6 py-3 sticky top-0 z-10"
                style={{ background: "rgba(245, 247, 245, 0.95)", backdropFilter: "blur(8px)" }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-[#0F1A15] uppercase tracking-[0.07em]">
                    {group.dayLabel}
                  </span>
                  <span className="text-[9px] text-[#9AAEA3] font-medium">{group.dateLabel}</span>
                  {group.dayLabel === "Aujourd'hui" && (
                    <span className="px-2 py-0.5 rounded-full bg-[#0B8F68] text-white text-[9px] font-bold">
                      {totalCount}
                    </span>
                  )}
                </div>
              </div>

              {/* Lignes du journal */}
              <div className="bg-white">
                {entries.map((entry) => (
                  <ActivityLogRow key={entry.id} entry={entry} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
