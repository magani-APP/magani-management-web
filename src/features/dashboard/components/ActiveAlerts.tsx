import React from "react";
import { AlertTriangle, Clock, Info } from "lucide-react";
import { AlertData } from "../../../mocks/dashboard.mock";

interface ActiveAlertsProps {
  data: AlertData[];
}

export function ActiveAlerts({ data }: ActiveAlertsProps) {
  const getAlertStyles = (severity: AlertData["severity"]) => {
    switch (severity) {
      case "danger":
        return {
          bg: "bg-[#FEF2F2]",
          border: "border-[#FECACA]",
          text: "text-[#991B1B]",
          icon: <AlertTriangle size={14} className="text-[#EF4444]" />,
          btnText: "text-brand-primary", // Or whatever primary is
        };
      case "warning":
        return {
          bg: "bg-[#FFFBEB]",
          border: "border-[#FDE68A]",
          text: "text-[#92400E]",
          icon: <Clock size={14} className="text-[#F59E0B]" />,
          btnText: "text-status-warning",
        };
      case "info":
      default:
        return {
          bg: "bg-[#EFF6FF]", // Primary light for info
          border: "border-[#BFDBFE]",
          text: "text-[#1D4ED8]",
          icon: <Info size={14} className="text-[#3B82F6]" />,
          btnText: "text-status-info",
        };
    }
  };

  return (
    <div className="p-5 rounded-2xl border border-border-card bg-white/88 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[14px] font-bold text-text-primary">
          Alertes actives
        </h3>
        <div className="w-5 h-5 rounded-full bg-[#FEF2F2] flex items-center justify-center text-[10px] font-bold text-[#EF4444]">
          {data.length}
        </div>
      </div>

      <div className="flex flex-col gap-3 flex-1 overflow-y-auto no-scrollbar">
        {data.map((alert) => {
          const styles = getAlertStyles(alert.severity);
          return (
            <div
              key={alert.id}
              className={`p-3 rounded-4xl border flex items-center justify-between gap-3 ${styles.bg} ${styles.border}`}
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="shrink-0">{styles.icon}</div>
                <span className={`text-[11px] font-medium truncate ${styles.text}`}>
                  {alert.message}
                </span>
              </div>
              <button
                className={`shrink-0 text-[10px] font-bold ${styles.btnText} hover:underline`}
              >
                {alert.actionLabel}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
