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
    <div className="w-full lg:w-[218px] lg:h-full flex-shrink-0 flex flex-col justify-between py-3 lg:py-6 px-4 lg:px-2 bg-white/88 border-b lg:border-b-0 border-border-card">
      <div className="flex flex-col gap-1 lg:pr-4">
        <h3 className="hidden lg:block text-[9px] font-bold text-text-hairline uppercase tracking-[0.08em] mb-4 pl-3">
          Rapports disponibles
        </h3>

        <div className="flex lg:flex-col gap-1.5 lg:gap-1 overflow-x-auto lg:overflow-visible no-scrollbar -mx-1 px-1 lg:mx-0 lg:px-0">
          {REPORT_TABS.map((tab) => {
            const isActive = tab.id === activeTab;

            return (
              <Link
                key={tab.id}
                href={`/reports?tab=${tab.id}`}
                className={cn(
                  "flex items-center gap-2 lg:gap-3 px-3.5 py-2 lg:py-2.5 rounded-4xl transition-all duration-150 shrink-0 whitespace-nowrap",
                  isActive
                    ? "bg-brand-primary text-white shadow-[0_2px_8px_rgba(11,143,104,0.28)]"
                    : "bg-surface-alt lg:bg-transparent text-text-muted hover:bg-surface-alt hover:text-brand-primary"
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
                    "hidden lg:block text-[10px] mt-1 leading-none",
                    isActive ? "text-white/80" : "text-text-placeholder"
                  )}>
                    {tab.description}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="hidden lg:flex flex-col gap-2 pr-4 pt-4 border-t border-border-divider mt-auto">
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
