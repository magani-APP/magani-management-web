import { PublicAppTabId } from "@/types/public-app.types";

export const PUBLIC_APP_TABS: { id: PublicAppTabId; label: string }[] = [
  { id: "general", label: "Général" },
  { id: "products", label: "Produits" },
  { id: "reservations", label: "Réservations" },
  { id: "info", label: "Informations" },
  { id: "preview", label: "Aperçu" },
];

export const PUBLIC_APP_BASE_URL = "https://pharmaos.cm";

export const PUBLIC_APP_COLOR_OPTIONS: string[] = ["#16A34A", "#0B8F68", "#2563EB", "#7C3AED", "#DB2777", "#EA580C"];
export const PUBLIC_APP_SECONDARY_COLOR_OPTIONS: string[] = ["#D1FAE5", "#DBEAFE", "#EDE9FE", "#FCE7F3", "#FFEDD5", "#F5F7F5"];
