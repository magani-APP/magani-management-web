"use client";

import { ReactNode } from "react";
import { PackageCheck, Clock3, Database } from "lucide-react";
import { StockSetting } from "@/types/settings";
import { Toggle } from "./Toggle";

interface StockSettingRowProps {
  setting: StockSetting;
  gridCols: string;
  onToggle: (id: string) => void;
}

const ICON_BY_ID: Record<string, ReactNode> = {
  stock_low_alert: <PackageCheck size={17} />,
  stock_expiry_alert: <Clock3 size={17} />,
  stock_auto_backup: <Database size={17} />,
};

const ICON_BG_BY_ID: Record<string, string> = {
  stock_low_alert: "rgba(11, 143, 104, 0.08)",
  stock_expiry_alert: "rgba(255, 159, 10, 0.1)",
  stock_auto_backup: "rgba(139, 92, 246, 0.1)",
};

const ICON_COLOR_BY_ID: Record<string, string> = {
  stock_low_alert: "rgb(11, 143, 104)",
  stock_expiry_alert: "rgb(255, 159, 10)",
  stock_auto_backup: "rgb(139, 92, 246)",
};

export function StockSettingRow({ setting, gridCols, onToggle }: StockSettingRowProps) {
  return (
    <div
      className="grid items-center gap-4 px-6 py-4 hover:bg-[#F9FBFA] transition-colors"
      style={{ gridTemplateColumns: gridCols }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: ICON_BG_BY_ID[setting.id] ?? "rgba(11, 143, 104, 0.08)",
            color: ICON_COLOR_BY_ID[setting.id] ?? "rgb(11, 143, 104)",
          }}
        >
          {ICON_BY_ID[setting.id] ?? <PackageCheck size={17} />}
        </div>
        <p className="text-sm font-semibold text-[#0F1A15] truncate">{setting.label}</p>
      </div>

      <p className="text-[11px] text-[#9AAEA3] font-medium">{setting.description}</p>

      <div className="flex justify-end">
        <Toggle
          checked={setting.enabled}
          onChange={() => onToggle(setting.id)}
          label={setting.label}
        />
      </div>
    </div>
  );
}
