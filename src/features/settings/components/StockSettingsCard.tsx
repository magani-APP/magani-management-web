"use client";

import { useStockSettings } from "@/hooks/settings/useStockSettings";
import { StockSettingRow } from "./StockSettingRow";

const GRID_COLS = "minmax(0,1fr) minmax(0,1.6fr) 90px";

export function StockSettingsCard() {
  const { settings, isLoading, toggle } = useStockSettings();

  return (
    <div className="w-full space-y-5">
      {/* En-tête */}
      <div>
        <h2 className="text-[20px] font-bold text-[#0F1A15]">Stock &amp; Alertes</h2>
        <p className="text-xs text-[#9AAEA3] mt-1 font-medium">
          Seuils et règles d&apos;alerte automatiques.
        </p>
      </div>

      {/* Carte des réglages */}
      {isLoading ? (
        <div className="flex h-[220px] items-center justify-center rounded-2xl border border-[#E8EDEA] bg-white">
          <div className="w-8 h-8 border-4 border-[#0B8F68] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E8EDEA] overflow-hidden">
          {/* En-tête de tableau */}
          <div
            className="hidden md:grid gap-4 px-6 py-3 border-b border-[#F0F5F2]"
            style={{ gridTemplateColumns: GRID_COLS }}
          >
            <span className="text-[10px] font-bold text-[#9AAEA3] uppercase tracking-[0.07em]">Fonctionnalité</span>
            <span className="text-[10px] font-bold text-[#9AAEA3] uppercase tracking-[0.07em]">Description</span>
            <span className="text-[10px] font-bold text-[#9AAEA3] uppercase tracking-[0.07em] text-right">Statut</span>
          </div>

          <div className="divide-y divide-[#F0F5F2]">
            {settings.map((setting) => (
              <StockSettingRow
                key={setting.id}
                setting={setting}
                gridCols={GRID_COLS}
                onToggle={toggle}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
