import { Wallet, Smartphone, Phone, CreditCard } from "lucide-react";
import { ReceiptPaymentMethod, ReceiptStatus } from "@/types/receipts.types";
import { RECEIPT_PAYMENT_METHOD_CONFIG } from "@/constants/receipts.constants";

const PAYMENT_ICONS: Record<ReceiptPaymentMethod, React.ReactNode> = {
  cash: <Wallet size={11} />,
  mtn: <Smartphone size={11} />,
  orange: <Phone size={11} />,
  card: <CreditCard size={11} />,
};

export function PaymentMethodBadge({ method }: { method: ReceiptPaymentMethod }) {
  const config = RECEIPT_PAYMENT_METHOD_CONFIG[method];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border whitespace-nowrap"
      style={{ background: config.bg, color: config.text, borderColor: config.border }}
    >
      {PAYMENT_ICONS[method]}
      {config.label}
    </span>
  );
}

const STATUS_BADGE_CONFIG: Partial<Record<ReceiptStatus, { label: string; bg: string; text: string; border: string }>> = {
  annule: { label: "Annulé", bg: "#FEECEC", text: "#DC2626", border: "#FBD1D1" },
  rembourse: { label: "Remboursé", bg: "#FFFBEB", text: "#92400E", border: "#FDE68A" },
};

export function ReceiptStatusBadge({ status }: { status: ReceiptStatus }) {
  const config = STATUS_BADGE_CONFIG[status];
  if (!config) return null;

  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold border whitespace-nowrap"
      style={{ background: config.bg, color: config.text, borderColor: config.border }}
    >
      {config.label}
    </span>
  );
}
