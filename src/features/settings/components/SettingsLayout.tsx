import { ReactNode } from "react";
import { SettingsSidebar } from "./SettingsSidebar";
import { SettingsTabId } from "@/types/settings";

interface SettingsLayoutProps {
  children: ReactNode;
  activeTab: SettingsTabId;
}

export function SettingsLayout({ children, activeTab }: SettingsLayoutProps) {
  return (
    <div className="flex h-full">
      <SettingsSidebar activeTab={activeTab} />
      <div className="flex-1 min-w-0 overflow-y-auto py-6 pr-8 no-scrollbar">
        {children}
      </div>
    </div>
  );
}
