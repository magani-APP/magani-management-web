import Link from "next/link";
import { ReportTabId } from "@/types/reports";
import { Package2, TrendingUp, ChartNoAxesColumn, Archive, Download, FileSpreadsheet, TrendingDown, UserCheck, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { REPORT_TABS } from "@/constants/reports";

const tabIcons: Record<ReportTabId, React.ReactNode> = {
  sales: <TrendingUp size={14} />,
  "top-products": <Package2 size={14} />,
  margins: <ChartNoAxesColumn size={14} />,
  "stock-value": <Archive size={14} />,
  losses: <TrendingDown size={14} />,
  employees: <UserCheck size={14} />,
  payments: <Wallet size={14} />,
};

interface ReportsSidebarProps {
  activeTab: ReportTabId;
}

export function ReportsSidebar({ activeTab }: ReportsSidebarProps) {
  return (
    <div className="w-[218px] h-full flex flex-col justify-between py-6 px-2 bg-white/88">
      <div className="flex flex-col gap-1 pr-4">
        <h3 className="text-[9px] font-bold text-text-hairline uppercase tracking-[0.08em] mb-4 pl-3">
          Rapports disponibles
        </h3>

        {REPORT_TABS.map((tab) => {
          const isActive = tab.id === activeTab;

          return (
            <Link
              key={tab.id}
              href={`/reports?tab=${tab.id}`}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-4xl transition-all duration-150",
                isActive
                  ? "bg-brand-primary text-white shadow-[0_2px_8px_rgba(11,143,104,0.28)]"
                  : "text-text-muted hover:bg-surface-alt hover:text-brand-primary"
              )}
            >
              <span className={cn(
                "flex-shrink-0",
                isActive ? "text-white" : "text-text-muted"
              )}>
                {tabIcons[tab.id]}
              </span>
              <div className="flex flex-col">
                <span className="text-[12px] font-bold leading-none">{tab.label}</span>
                <span className={cn(
                  "text-[10px] mt-1 leading-none",
                  isActive ? "text-white/80" : "text-text-placeholder"
                )}>
                  {tab.description}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="flex flex-col gap-2 pr-4 pt-4 border-t border-border-divider mt-auto">
        <button className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-[12px] font-bold text-text-muted hover:bg-surface-alt transition-colors w-full border border-transparent hover:border-border-card">
          <Download size={14} />
          Exporter en PDF
        </button>
        <button className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-[12px] font-bold text-text-muted hover:bg-surface-alt transition-colors w-full border border-transparent hover:border-border-card">
          <FileSpreadsheet size={14} />
          Exporter en Excel
        </button>
      </div>
    </div>
  );
}
