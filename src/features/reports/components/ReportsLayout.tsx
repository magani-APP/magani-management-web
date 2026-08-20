import { ReactNode } from "react";
import { ReportsSidebar } from "./ReportsSidebar";
import { ReportTabId } from "@/types/reports";

interface ReportsLayoutProps {
  children: ReactNode;
  activeTab: ReportTabId;
}

export function ReportsLayout({ children, activeTab }: ReportsLayoutProps) {
  return (
    <div className="flex h-full pr-8 gap-6">
      <ReportsSidebar activeTab={activeTab} />
      <div className="flex-1 min-w-0 overflow-y-auto pr-2 py-6 no-scrollbar">
        {children}
      </div>
    </div>
  );
}
