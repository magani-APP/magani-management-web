import { ReactNode } from "react";
import { SettingsSidebar } from "./SettingsSidebar";
import { SettingsTabId } from "@/types/settings";

interface SettingsLayoutProps {
  children: ReactNode;
  activeTab: SettingsTabId;
}

export function SettingsLayout({ children, activeTab }: SettingsLayoutProps) {
  return (
    <div className="flex flex-col lg:flex-row h-full overflow-y-auto lg:overflow-hidden no-scrollbar">
      <SettingsSidebar activeTab={activeTab} />
      <div className="flex-1 lg:overflow-y-auto p-4 lg:p-8" style={{ scrollbarWidth: "none" }}>
        {children}
      </div>
    </div>
  );
}
