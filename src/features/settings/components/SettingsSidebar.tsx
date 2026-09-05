"use client";

import { useRouter } from "next/navigation";
import {
  Building2,
  Users,
  Receipt,
  CreditCard,
  Package2,
  Bell,
  Printer,
  Zap,
  Bot,
  Globe,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SETTINGS_TABS } from "@/constants/settings.constants";
import { SettingsTabId } from "@/types/settings";

const TAB_ICONS: Record<SettingsTabId, React.ReactNode> = {
  pharmacy: <Building2 size={13} />,
  team: <Users size={13} />,
  pos: <Receipt size={13} />,
  payments: <CreditCard size={13} />,
  stock: <Package2 size={13} />,
  notifications: <Bell size={13} />,
  receipts: <Printer size={13} />,
  integrations: <Zap size={13} />,
  maga: <Bot size={13} />,
  "public-app": <Globe size={13} />,
  security: <Shield size={13} />,
};

interface SettingsSidebarProps {
  activeTab: SettingsTabId;
}

export function SettingsSidebar({ activeTab }: SettingsSidebarProps) {
  const router = useRouter();

  return (
    <div
      className="settings-nav w-[218px] flex-shrink-0 flex flex-col border-r border-[#E8EDEA] bg-white overflow-y-auto"
      style={{ scrollbarWidth: "none" }}
    >
      <div className="px-4 pt-5 pb-2">
        <span className="text-[9px] font-bold text-[#C8D5CC] uppercase tracking-[0.08em]">
          Configuration
        </span>
      </div>

      <nav className="px-2 pb-4 space-y-0.5">
        {SETTINGS_TABS.map((tab) => {
          const isActive = tab.id === activeTab;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => router.push(`/settings?tab=${tab.id}`, { scroll: false })}
              className={cn(
                "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-3xl text-xs font-medium transition-all text-left",
                isActive
                  ? "text-white"
                  : "text-[#4A5E54] hover:bg-[#F5F7F5] hover:text-[#0F1A15]"
              )}
              style={isActive ? { background: "rgb(11, 143, 104)" } : undefined}
            >
              <span className={isActive ? "text-white" : "text-[#9AAEA3]"}>
                {TAB_ICONS[tab.id]}
              </span>
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
