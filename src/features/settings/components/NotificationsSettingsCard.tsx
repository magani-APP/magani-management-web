"use client";

import { CheckCheck } from "lucide-react";
import { TOKENS } from "@/constants/design-tokens.constants";
import { NOTIFICATION_TABS } from "@/constants/notifications.constants";
import { NotificationTabId } from "@/types/notifications.types";
import { useNotifications } from "@/hooks/settings/useNotifications";
import { NotificationRow } from "./NotificationRow";

export function NotificationsSettingsCard() {
  const { activeTab, setActiveTab, tabCounts, groups, markAllAsRead, markOneAsRead } = useNotifications();

  return (
    <div className="w-full">
      {/* EN-TÊTE */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h2 className="text-base font-bold text-[#0F1A15]">Notifications</h2>
          <p className="text-xs text-[#9AAEA3] mt-1 font-medium">
            Suivez les événements importants de votre pharmacie.
          </p>
        </div>
        <button
          type="button"
          onClick={markAllAsRead}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs font-bold whitespace-nowrap transition-colors hover:bg-[#F0FAF6]"
          style={{ borderColor: "rgba(11, 143, 104, 0.35)", color: "rgb(11, 143, 104)" }}
        >
          <CheckCheck size={14} />
          Tout marquer comme lu
        </button>
      </div>

      {/* ONGLETS */}
      <div className="flex gap-2 mb-5 overflow-x-auto no-scrollbar" style={{ scrollbarWidth: "none" }}>
        {NOTIFICATION_TABS.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as NotificationTabId)}
              className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold transition-colors ${
                isActive ? "text-white" : "bg-white border border-[#E8EDEA] text-[#6B7A6F] hover:text-[#0F1A15]"
              }`}
              style={isActive ? { background: "rgb(11, 143, 104)" } : undefined}
            >
              {tab.label}
              <span
                className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${
                  isActive ? "bg-white/20 text-white" : "bg-[#F5F7F5] text-[#9AAEA3]"
                }`}
              >
                {tabCounts[tab.id]}
              </span>
            </button>
          );
        })}
      </div>

      {/* LISTE GROUPÉE PAR DATE */}
      <div className="space-y-6">
        {groups.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-sm font-bold" style={{ color: TOKENS.mutedText }}>
              Aucune notification
            </p>
          </div>
        ) : (
          groups.map((group) => (
            <div key={group.key}>
              <div className="flex items-baseline gap-2 mb-2.5">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.06em]" style={{ color: TOKENS.foreground }}>
                  {group.label}
                </h3>
                {group.dateLabel && (
                  <span className="text-[11px] font-medium" style={{ color: TOKENS.faintText }}>
                    {group.dateLabel}
                  </span>
                )}
              </div>

              <div className="space-y-2.5">
                {group.items.map((notification) => (
                  <NotificationRow
                    key={notification.id}
                    notification={notification}
                    onMarkRead={markOneAsRead}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
