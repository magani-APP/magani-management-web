"use client";

import { useStockSettings } from "@/hooks/settings/useStockSettings";
import { StockSettingRow } from "./StockSettingRow";

export function StockSettingsCard() {
  const { settings, isLoading, toggle } = useStockSettings();

  return (
    <div className="max-w-xl space-y-5">
      {/* En-tête */}
      <div>
        <h2 className="text-base font-bold text-[#0F1A15]">Stock &amp; Alertes</h2>
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
        <div className="bg-white rounded-2xl border border-[#E8EDEA] overflow-hidden divide-y divide-[#F0F5F2]">
          {settings.map((setting, index) => (
            <StockSettingRow
              key={setting.id}
              setting={setting}
              isLast={index === settings.length - 1}
              onToggle={toggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}
