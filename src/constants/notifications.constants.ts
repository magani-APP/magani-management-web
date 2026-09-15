import { NotificationTabId } from "@/types/notifications.types";

export const NOTIFICATION_TABS: { id: NotificationTabId; label: string }[] = [
  { id: "all", label: "Toutes" },
  { id: "stock", label: "Stock" },
  { id: "reservations", label: "Réservations" },
  { id: "caisse", label: "Caisse" },
  { id: "systeme", label: "Système" },
];

export const NOTIFICATION_GROUP_LABELS: Record<"today" | "yesterday" | "older", string> = {
  today: "Aujourd'hui",
  yesterday: "Hier",
  older: "Plus anciennes",
};
