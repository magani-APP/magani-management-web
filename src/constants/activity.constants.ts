import { ActivityActionType, ActivityFilterId } from "@/types/activity.types";

interface ActivityFilterConfig {
  id: ActivityFilterId;
  label: string;
  // null = pas de filtrage par type (onglet "Tout")
  types: ActivityActionType[] | null;
}

export const ACTIVITY_FILTERS: ActivityFilterConfig[] = [
  { id: "tout", label: "Tout", types: null },
  { id: "ventes", label: "Ventes", types: ["vente"] },
  { id: "prix", label: "Prix", types: ["prix"] },
  { id: "stock", label: "Stock", types: ["stock"] },
  { id: "annulations", label: "Annulations", types: ["annulation"] },
  { id: "appro", label: "Appro.", types: ["appro"] },
  { id: "admin", label: "Admin", types: ["admin"] },
];

interface ActivityTypeStyle {
  badgeLabel: string;
  // Couleur du point, de l'avatar, et du texte du badge
  color: string;
  // Fond du badge
  badgeBg: string;
  // Bordure du badge
  badgeBorder: string;
}

export const ACTIVITY_TYPE_STYLES: Record<ActivityActionType, ActivityTypeStyle> = {
  vente: {
    badgeLabel: "Vente",
    color: "rgb(11, 143, 104)",
    badgeBg: "rgb(240, 250, 246)",
    badgeBorder: "rgb(167, 243, 208)",
  },
  prix: {
    badgeLabel: "Prix",
    color: "rgb(249, 115, 22)",
    badgeBg: "rgb(255, 247, 237)",
    badgeBorder: "rgb(254, 215, 170)",
  },
  stock: {
    badgeLabel: "Stock",
    color: "rgb(59, 130, 246)",
    badgeBg: "rgb(239, 246, 255)",
    badgeBorder: "rgb(191, 219, 254)",
  },
  annulation: {
    badgeLabel: "Annulation",
    color: "rgb(239, 68, 68)",
    badgeBg: "rgb(254, 242, 242)",
    badgeBorder: "rgb(254, 202, 202)",
  },
  appro: {
    badgeLabel: "Appro.",
    color: "rgb(20, 184, 166)",
    badgeBg: "rgb(240, 253, 250)",
    badgeBorder: "rgb(153, 246, 228)",
  },
  admin: {
    badgeLabel: "Admin",
    color: "rgb(139, 92, 246)",
    badgeBg: "rgb(245, 243, 255)",
    badgeBorder: "rgb(221, 214, 254)",
  },
  systeme: {
    badgeLabel: "Système",
    color: "rgb(156, 163, 175)",
    badgeBg: "rgb(249, 250, 251)",
    badgeBorder: "rgb(229, 231, 235)",
  },
};
