import { IntegrationStatus, IntegrationTabId } from "@/types/integrations.types";

export const INTEGRATION_TABS: { id: IntegrationTabId; label: string }[] = [
  { id: "all", label: "Toutes" },
  { id: "payments", label: "Paiements" },
  { id: "stock", label: "Stock & données" },
  { id: "communication", label: "Communication" },
  { id: "delivery", label: "Livraison" },
];

export const INTEGRATION_CATEGORY_LABELS: Record<Exclude<IntegrationTabId, "all">, string> = {
  payments: "Paiements",
  stock: "Stock & données",
  communication: "Communication",
  delivery: "Livraison",
};

export const INTEGRATION_STATUS_CONFIG: Record<
  IntegrationStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  operational: { label: "Opérationnelle", bg: "#E3F9EE", text: "#059669", dot: "#059669" },
  "not-connected": { label: "Non connecté", bg: "#FEECEC", text: "#DC2626", dot: "#DC2626" },
  available: { label: "Disponible", bg: "#F1F3F2", text: "#5B6B61", dot: "#9AAEA3" },
  "needs-attention": { label: "Attention requise", bg: "#FFFBEB", text: "#92400E", dot: "#F59E0B" },
  "not-configured": { label: "Non configuré", bg: "#F1F3F2", text: "#5B6B61", dot: "#9AAEA3" },
  "not-installed": { label: "Non installé", bg: "#FEECEC", text: "#DC2626", dot: "#DC2626" },
  "coming-soon": { label: "Bientôt disponible", bg: "rgba(139, 92, 246, 0.12)", text: "#7C3AED", dot: "#8B5CF6" },
};
