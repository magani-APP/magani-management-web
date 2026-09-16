import { PosSalePaymentMethod, PosSaleStatus, PosSaleTabId } from "@/types/pos-sales.types";

export const POS_SALE_TABS: { id: PosSaleTabId; label: string }[] = [
  { id: "all", label: "Toutes" },
  { id: "collected", label: "Encaissées" },
  { id: "refunded", label: "Remboursées" },
  { id: "cancelled", label: "Annulées" },
];

export const POS_SALE_PAYMENT_PILLS: { id: PosSalePaymentMethod | "all"; label: string }[] = [
  { id: "all", label: "Tous" },
  { id: "cash", label: "Espèces" },
  { id: "mtn", label: "MTN MoMo" },
  { id: "orange", label: "Orange Money" },
  { id: "card", label: "Carte bancaire" },
  { id: "mixed", label: "Mixte" },
];

export const POS_SALE_PAYMENT_FILTER_OPTIONS: { id: PosSalePaymentMethod | "all"; label: string }[] = [
  { id: "all", label: "Tous les moyens" },
  { id: "cash", label: "Espèces" },
  { id: "mtn", label: "MTN MoMo" },
  { id: "orange", label: "Orange Money" },
  { id: "card", label: "Carte bancaire" },
  { id: "mixed", label: "Mixte" },
];

export const POS_SALE_DATE_FILTER_OPTIONS: string[] = ["Aujourd'hui", "Cette semaine", "Ce mois-ci", "Toutes les dates"];

export const POS_SALE_CASHIER_FILTER_OPTIONS: { id: string; label: string }[] = [
  { id: "all", label: "Tous les caissiers" },
  { id: "AK", label: "Aminata Kouassi" },
  { id: "IT", label: "Ibrahim Traoré" },
  { id: "WT", label: "Wilson Tapamo" },
  { id: "FB", label: "Fatou Bamba" },
];

export const POS_SALES_PAGE_SIZE = 10;

export const POS_SALE_PAYMENT_METHOD_CONFIG: Record<
  PosSalePaymentMethod,
  { label: string; bg: string; text: string; border: string }
> = {
  cash: { label: "Espèces", bg: "rgb(236, 253, 245)", text: "rgb(6, 95, 70)", border: "rgb(167, 243, 208)" },
  mtn: { label: "MTN MoMo", bg: "rgb(255, 251, 235)", text: "rgb(146, 64, 14)", border: "rgb(253, 230, 138)" },
  orange: { label: "Orange Money", bg: "rgb(255, 247, 237)", text: "rgb(154, 52, 18)", border: "rgb(254, 215, 170)" },
  card: { label: "Carte bancaire", bg: "rgb(239, 246, 255)", text: "rgb(30, 64, 175)", border: "rgb(191, 219, 254)" },
  mixed: { label: "Mixte", bg: "rgb(250, 245, 255)", text: "rgb(109, 40, 217)", border: "rgb(221, 214, 254)" },
};

export const POS_SALE_STATUS_CONFIG: Record<
  PosSaleStatus,
  { label: string; bg: string; text: string; border: string; dot: string }
> = {
  encaisse: {
    label: "Encaissé",
    bg: "rgb(220, 252, 231)",
    text: "rgb(22, 163, 74)",
    border: "rgba(34, 197, 94, 0.25)",
    dot: "rgb(34, 197, 94)",
  },
  rembourse: {
    label: "Remboursé",
    bg: "rgb(254, 243, 199)",
    text: "rgb(217, 119, 6)",
    border: "rgba(245, 158, 11, 0.25)",
    dot: "rgb(245, 158, 11)",
  },
  annule: {
    label: "Annulé",
    bg: "rgb(254, 226, 226)",
    text: "rgb(220, 38, 38)",
    border: "rgba(239, 68, 68, 0.25)",
    dot: "rgb(239, 68, 68)",
  },
};
