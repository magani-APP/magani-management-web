"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/api/notifications.api";
import { NOTIFICATION_GROUP_LABELS } from "@/constants/notifications.constants";
import { AppNotification, NotificationDateGroup, NotificationTabId } from "@/types/notifications.types";

const GROUP_ORDER: NotificationDateGroup[] = ["today", "yesterday", "older"];

export interface NotificationGroup {
  key: NotificationDateGroup;
  label: string;
  dateLabel: string;
  items: AppNotification[];
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<NotificationTabId>("all");
  const [isAllRead, setIsAllRead] = useState(false);

  useEffect(() => {
    let isMounted = true;

    getNotifications()
      .then((data) => {
        if (isMounted) setNotifications(data);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const tabCounts = useMemo(() => {
    return {
      all: notifications.length,
      stock: notifications.filter((n) => n.category === "stock").length,
      reservations: notifications.filter((n) => n.category === "reservations").length,
      caisse: notifications.filter((n) => n.category === "caisse").length,
      systeme: notifications.filter((n) => n.category === "systeme").length,
    };
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    if (activeTab === "all") return notifications;
    return notifications.filter((n) => n.category === activeTab);
  }, [activeTab, notifications]);

  const groups: NotificationGroup[] = useMemo(() => {
    return GROUP_ORDER.map((groupKey) => {
      const items = filteredNotifications.filter((n) => n.dateGroup === groupKey);
      const dateLabel = items[0]?.dateGroupLabel ?? "";
      return { key: groupKey, label: NOTIFICATION_GROUP_LABELS[groupKey], dateLabel, items };
    }).filter((group) => group.items.length > 0);
  }, [filteredNotifications]);

  const markAllAsRead = useCallback(async () => {
    setIsAllRead(true);
    try {
      await markAllNotificationsAsRead();
    } catch {
      // La liste reste affichée telle quelle même si l'appel échoue ;
      // on retentera à la prochaine ouverture de la page.
    }
  }, []);

  const markOneAsRead = useCallback(async (id: string) => {
    try {
      await markNotificationAsRead(id);
    } catch {
      // silencieux : pas critique pour l'UI
    }
  }, []);

  return {
    isLoading,
    activeTab,
    setActiveTab,
    tabCounts,
    groups,
    isAllRead,
    markAllAsRead,
    markOneAsRead,
  };
}
