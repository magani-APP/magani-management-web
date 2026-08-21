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
      <div className="flex-1 overflow-y-auto p-8" style={{ scrollbarWidth: "none" }}>
        {children}
      </div>
    </div>
  );
}
