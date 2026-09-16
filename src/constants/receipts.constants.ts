import { ReceiptPaymentMethod, ReceiptTabId } from "@/types/receipts.types";

export const RECEIPT_TABS: { id: ReceiptTabId; label: string }[] = [
  { id: "all", label: "Tous" },
  { id: "sales", label: "Ventes" },
  { id: "refunds", label: "Remboursements" },
  { id: "cancellations", label: "Annulations" },
];

export const RECEIPT_MONTH_OPTIONS: string[] = [
  "Août 2026",
  "Juillet 2026",
  "Juin 2026",
];

export const RECEIPT_PAYMENT_FILTER_OPTIONS: { id: ReceiptPaymentMethod | "all"; label: string }[] = [
  { id: "all", label: "Tous les moyens" },
  { id: "cash", label: "Espèces" },
  { id: "mtn", label: "MTN MoMo" },
  { id: "orange", label: "Orange Money" },
  { id: "card", label: "Carte bancaire" },
];

export const RECEIPT_CASHIER_FILTER_OPTIONS: { id: string; label: string }[] = [
  { id: "all", label: "Tous les caissiers" },
  { id: "AK", label: "Aminata K." },
  { id: "IT", label: "Ibrahim T." },
  { id: "KD", label: "Dr. Kofi Diallo" },
];

export const RECEIPTS_PAGE_SIZE = 10;

export const RECEIPT_PAYMENT_METHOD_CONFIG: Record<
  ReceiptPaymentMethod,
  { label: string; bg: string; text: string; border: string }
> = {
  cash: { label: "Espèces", bg: "#E3F9EE", text: "#059669", border: "#BFEAD3" },
  mtn: { label: "MTN MoMo", bg: "rgba(255, 193, 7, 0.14)", text: "#92400E", border: "rgba(255, 193, 7, 0.4)" },
  orange: { label: "Orange Money", bg: "rgba(255, 98, 0, 0.12)", text: "#C2410C", border: "rgba(255, 98, 0, 0.35)" },
  card: { label: "Carte bancaire", bg: "rgba(59, 130, 246, 0.12)", text: "#1D4ED8", border: "rgba(59, 130, 246, 0.32)" },
};

/** Identité de la pharmacie affichée sur le détail du reçu et à l'impression. */
export const RECEIPT_PHARMACY_INFO = {
  name: "Pharmacie Centrale d'Abidjan",
  address: "Rue du Commerce, Plateau, Abidjan",
  license: "PHA-CI-2019-0847",
};
