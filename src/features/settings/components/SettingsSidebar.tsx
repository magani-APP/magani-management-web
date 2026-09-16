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
      className="settings-nav w-full lg:w-[218px] lg:flex-shrink-0 flex flex-col border-b lg:border-b-0 lg:border-r border-[#E8EDEA] bg-white overflow-y-auto"
      style={{ scrollbarWidth: "none" }}
    >
      <div className="hidden lg:block px-4 pt-5 pb-2">
        <span className="text-[9px] font-bold text-[#C8D5CC] uppercase tracking-[0.08em]">
          Configuration
        </span>
      </div>

      <nav className="flex lg:flex-col gap-0.5 overflow-x-auto lg:overflow-visible no-scrollbar px-4 lg:px-2 py-3 lg:py-0 lg:pb-4">
        {SETTINGS_TABS.map((tab) => {
          const isActive = tab.id === activeTab;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => router.push(`/settings?tab=${tab.id}`, { scroll: false })}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2.5 rounded-3xl text-xs font-medium transition-all text-left shrink-0 whitespace-nowrap",
                isActive
                  ? "text-white"
                  : "bg-[#F5F7F5] lg:bg-transparent text-[#4A5E54] hover:bg-[#F5F7F5] hover:text-[#0F1A15]"
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
