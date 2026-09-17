import { apiRequest } from "@/lib/api-client";
import {
  AppNotification,
  NotificationCategory,
  NotificationDateGroup,
  NotificationIconType,
} from "@/types/notifications.types";
import { NOTIFICATIONS } from "@/mocks/notifications.mock";

// ---- Shape brute renvoyée par GET /notifications (backend: modules/notifications) ----
// Le modèle Prisma `Notification` expose : id, userId, type, titleFr, titleEn,
// bodyFr, bodyEn, data, readAt, createdAt.
type ApiNotificationType =
  | "RESERVATION"
  | "EXPRESS_REQUEST"
  | "PRODUCT_AVAILABLE"
  | "PAYMENT"
  | "PRESCRIPTION"
  | "SYSTEM"
  | string;

interface ApiNotification {
  id: string;
  type: ApiNotificationType;
  titleFr: string;
  titleEn: string;
  bodyFr: string;
  bodyEn: string;
  data?: unknown;
  readAt: string | null;
  createdAt: string;
}

// ---- Mapping type backend -> présentation front (catégorie, icône, couleurs) ----
// Le backend ne connaît que 3 valeurs de `type` à ce jour (RESERVATION,
// EXPRESS_REQUEST, PRODUCT_AVAILABLE). On mappe les autres valeurs possibles
// par prudence, avec un fallback générique "systeme".
const TYPE_META: Record<
  string,
  { category: NotificationCategory; icon: NotificationIconType; iconColor: string; iconBg: string; actionLabel?: string }
> = {
  RESERVATION: {
    category: "reservations",
    icon: "calendar-check",
    iconColor: "rgb(11, 143, 104)",
    iconBg: "#E7F7F0",
    actionLabel: "Voir",
  },
  EXPRESS_REQUEST: {
    category: "reservations",
    icon: "clock",
    iconColor: "#F59E0B",
    iconBg: "#FEF3E2",
    actionLabel: "Répondre",
  },
  PRODUCT_AVAILABLE: {
    category: "stock",
    icon: "alert",
    iconColor: "#EF4444",
    iconBg: "#FEE7E7",
    actionLabel: "Voir",
  },
  PAYMENT: {
    category: "caisse",
    icon: "credit-card",
    iconColor: "#3B82F6",
    iconBg: "#EAF1FE",
  },
  PRESCRIPTION: {
    category: "reservations",
    icon: "check-circle",
    iconColor: "rgb(11, 143, 104)",
    iconBg: "#E7F7F0",
    actionLabel: "Voir",
  },
};

const DEFAULT_META = {
  category: "systeme" as NotificationCategory,
  icon: "shield" as NotificationIconType,
  iconColor: "#6B7A6F",
  iconBg: "#F0F2F1",
};

function startOfDay(date: Date): number {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function dateGroupOf(createdAt: string): NotificationDateGroup {
  const created = startOfDay(new Date(createdAt));
  const today = startOfDay(new Date());
  const yesterday = today - 24 * 60 * 60 * 1000;
  if (created === today) return "today";
  if (created === yesterday) return "yesterday";
  return "older";
}

function formatDateGroupLabel(createdAt: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(createdAt));
}

function formatDisplayDate(createdAt: string): string {
  const date = new Date(createdAt);
  const group = dateGroupOf(createdAt);
  const time = new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit" }).format(date);
  if (group === "today") return `Aujourd'hui, ${time}`;
  return `${new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(date)}, ${time}`;
}

function formatRelativeTime(createdAt: string): string {
  const diffMs = Date.now() - new Date(createdAt).getTime();
  const diffMin = Math.max(0, Math.round(diffMs / 60000));
  if (diffMin < 1) return "À l'instant";
  if (diffMin < 60) return `Il y a ${diffMin} min`;
  const diffH = Math.round(diffMin / 60);
  if (diffH < 24) return `Il y a ${diffH} h`;
  const diffD = Math.round(diffH / 24);
  return `Il y a ${diffD} j`;
}

function toAppNotification(row: ApiNotification): AppNotification {
  const meta = TYPE_META[row.type] ?? DEFAULT_META;
  return {
    id: row.id,
    category: meta.category,
    dateGroup: dateGroupOf(row.createdAt),
    dateGroupLabel: formatDateGroupLabel(row.createdAt),
    displayDate: formatDisplayDate(row.createdAt),
    relativeTime: formatRelativeTime(row.createdAt),
    title: row.titleFr,
    description: row.bodyFr,
    icon: meta.icon,
    iconColor: meta.iconColor,
    iconBg: meta.iconBg,
    actionLabel: meta.actionLabel,
  };
}

export const getNotifications = async (): Promise<AppNotification[]> => {
  try {
    const rows = await apiRequest<ApiNotification[]>("/notifications");
    return rows.map(toAppNotification);
  } catch {
    // Route indisponible côté backend : on retombe sur des notifications de
    // démonstration pour ne pas bloquer l'affichage de la page.
    return NOTIFICATIONS;
  }
};

export const getUnreadNotificationIds = async (): Promise<Set<string>> => {
  try {
    const rows = await apiRequest<ApiNotification[]>("/notifications");
    return new Set(rows.filter((r) => !r.readAt).map((r) => r.id));
  } catch {
    return new Set();
  }
};

export const markNotificationAsRead = async (id: string): Promise<void> => {
  await apiRequest<{ updated: number }>(`/notifications/${id}/read`, { method: "POST" });
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
  await apiRequest<{ updated: number }>("/notifications/read-all", { method: "POST" });
};
