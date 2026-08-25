import React from "react";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { KpiData } from "../../../mocks/dashboard.mock";

interface KpiCardProps {
  data: KpiData;
  Icon: LucideIcon;
  iconColor: string; // Tailwind text color class, e.g., 'text-brand-primary'
  iconBgColor: string; // Tailwind bg color class with opacity, e.g., 'bg-brand-primary/10'
}

export function KpiCard({ data, Icon, iconColor, iconBgColor }: KpiCardProps) {
  const isUp = data.trend === "up";

  return (
    <div className="p-5 rounded-2xl border border-border-card bg-white/88 hover:shadow-card transition-all duration-200 flex flex-col gap-3">
      <div className="flex justify-between items-start">
        <span className="text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em]">
          {data.label}
        </span>
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-xl ${iconBgColor} ${iconColor}`}
        >
          <Icon size={16} />
        </div>
      </div>

      <div>
        <div className="text-[22px] font-bold text-text-primary tracking-tight leading-none mb-1">
          {data.value}
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className={`flex items-center text-[10px] font-bold ${isUp ? "text-status-success" : "text-status-danger"
              }`}
          >
            {isUp ? <TrendingUp size={12} className="mr-0.5" /> : <TrendingDown size={12} className="mr-0.5" />}
            {data.percentage}
          </span>
          <span className="text-[11px] font-medium text-text-muted">
            {data.subText}
          </span>
        </div>
      </div>
    </div>
  );
}
