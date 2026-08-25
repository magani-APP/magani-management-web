"use client";

import { StockSetting } from "@/types/settings";
import { Toggle } from "./Toggle";

interface StockSettingRowProps {
  setting: StockSetting;
  isLast: boolean;
  onToggle: (id: string) => void;
}

export function StockSettingRow({ setting, onToggle }: StockSettingRowProps) {
  return (
    <div className="flex items-center gap-4 px-5 py-4 hover:bg-[#F9FBFA] transition-colors">
      <div className="flex-1">
        <p className="text-sm font-semibold text-[#0F1A15]">{setting.label}</p>
        <p className="text-[10px] text-[#9AAEA3] mt-0.5 font-medium">{setting.description}</p>
      </div>

      <Toggle
        checked={setting.enabled}
        onChange={() => onToggle(setting.id)}
        label={setting.label}
      />
    </div>
  );
}
