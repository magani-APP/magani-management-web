import { ReactNode } from "react";
import { ReportsSidebar } from "./ReportsSidebar";
import { ReportTabId } from "@/types/reports";

interface ReportsLayoutProps {
  children: ReactNode;
  activeTab: ReportTabId;
}

export function ReportsLayout({ children, activeTab }: ReportsLayoutProps) {
  return (
    <div className="flex flex-col lg:flex-row h-full lg:pr-8 lg:gap-6 overflow-y-auto lg:overflow-hidden no-scrollbar">
      <ReportsSidebar activeTab={activeTab} />
      <div className="flex-1 min-w-0 px-4 lg:px-6 xl:px-8 lg:overflow-y-auto pb-6 lg:py-6 w-full no-scrollbar">
        {children}
      </div>
    </div>
  );
}
