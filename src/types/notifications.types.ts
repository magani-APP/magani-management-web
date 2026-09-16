export type NotificationCategory = "stock" | "reservations" | "caisse" | "systeme";

export type NotificationTabId = "all" | NotificationCategory;

export type NotificationIconType =
  | "alert"
  | "clock"
  | "calendar"
  | "calendar-check"
  | "check-circle"
  | "credit-card"
  | "user-plus"
  | "shield"
  | "refresh"
  | "arrow-down";

export type NotificationDateGroup = "today" | "yesterday" | "older";

export interface AppNotification {
  id: string;
  category: NotificationCategory;
  dateGroup: NotificationDateGroup;
  /** Libellé complet affiché à côté du titre de groupe (ex: "Dimanche 9 août 2026"). */
  dateGroupLabel: string;
  /** Date/heure affichée sur la ligne (ex: "Aujourd'hui, 07:42" ou "7 août 2026, 21:14"). */
  displayDate: string;
  /** Temps relatif affiché à droite (ex: "Il y a 8 min"). */
  relativeTime: string;
  title: string;
  description: string;
  icon: NotificationIconType;
  iconColor: string;
  iconBg: string;
  actionLabel?: string;
}
