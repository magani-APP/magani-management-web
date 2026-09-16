"use client";

import { useEffect, useRef, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { TOKENS } from "@/constants/design-tokens.constants";
import { AppNotification } from "@/types/notifications.types";
import { NotificationIcon } from "./NotificationIcon";

interface NotificationRowProps {
  notification: AppNotification;
  onMarkRead?: (id: string) => void;
}

export function NotificationRow({ notification, onMarkRead }: NotificationRowProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <div
      className="flex items-start gap-4 p-4 rounded-2xl bg-white border hover:shadow-sm transition-shadow"
      style={{ borderColor: TOKENS.borderCard }}
    >
      <NotificationIcon type={notification.icon} color={notification.iconColor} bg={notification.iconBg} />

      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-bold" style={{ color: TOKENS.foreground }}>
          {notification.title}
        </p>
        <p className="text-xs font-medium mt-0.5" style={{ color: TOKENS.mutedText }}>
          {notification.description}
        </p>
        <p className="text-[10px] font-medium mt-1.5" style={{ color: TOKENS.faintText }}>
          {notification.displayDate}
        </p>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        <span className="text-[10px] font-medium whitespace-nowrap" style={{ color: TOKENS.faintText }}>
          {notification.relativeTime}
        </span>

        {notification.actionLabel && (
          <button
            type="button"
            className="px-3 py-1.5 rounded-full border text-[11px] font-bold whitespace-nowrap transition-colors hover:bg-[#F0FAF6]"
            style={{ borderColor: "rgba(11, 143, 104, 0.35)", color: "rgb(11, 143, 104)" }}
          >
            {notification.actionLabel}
          </button>
        )}

        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="text-[#C8D5CC] hover:text-[#6B7A6F] transition-colors"
            aria-label="Plus d'actions"
            aria-expanded={menuOpen}
          >
            <MoreHorizontal size={15} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-6 z-20 w-44 rounded-xl border border-[#E8EDEA] bg-white shadow-lg py-1">
              <button
                type="button"
                onClick={() => {
                  onMarkRead?.(notification.id);
                  setMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-xs font-medium text-[#4A5E54] hover:bg-[#F5F7F5] transition-colors"
              >
                Marquer comme lu
              </button>
              <button
                type="button"
                disabled
                title="Suppression pas encore disponible côté serveur"
                onClick={() => setMenuOpen(false)}
                className="w-full text-left px-3 py-2 text-xs font-medium text-red-300 cursor-not-allowed"
              >
                Supprimer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
