"use client";

import Link from "next/link";
import {
  Building2,
  Users,
  Receipt,
  CreditCard,
  Package,
  Bell,
  Printer,
  Zap,
  Globe,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SETTINGS_TABS } from "@/constants/settings.constants";
import { SettingsTabId } from "@/types/settings";

const TAB_ICONS: Record<SettingsTabId, React.ReactNode> = {
  pharmacy: <Building2 size={14} />,
  team: <Users size={14} />,
  pos: <Receipt size={14} />,
  payments: <CreditCard size={14} />,
  stock: <Package size={14} />,
  notifications: <Bell size={14} />,
  receipts: <Printer size={14} />,
  integrations: <Zap size={14} />,
  "public-app": <Globe size={14} />,
  security: <Shield size={14} />,
};

interface SettingsSidebarProps {
  activeTab: SettingsTabId;
}

export function SettingsSidebar({ activeTab }: SettingsSidebarProps) {
  return (
    <div className="w-[200px] shrink-0 flex flex-col py-6 pr-4">
      <h3 className="text-[9px] font-bold text-text-hairline uppercase tracking-[0.08em] mb-3 px-3">
        Configuration
      </h3>

      <nav className="flex flex-col gap-1">
        {SETTINGS_TABS.map((tab) => {
          const isActive = tab.id === activeTab;

          return (
            <Link
              key={tab.id}
              href={`/settings?tab=${tab.id}`}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-4xl text-[13px] font-semibold transition-all duration-150",
                isActive
                  ? "bg-brand-primary text-white shadow-button"
                  : "text-text-secondary hover:bg-surface-muted hover:text-brand-primary"
              )}
            >
              <span className={cn("shrink-0", isActive ? "text-white" : "text-text-muted")}>
                {TAB_ICONS[tab.id]}
              </span>
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
