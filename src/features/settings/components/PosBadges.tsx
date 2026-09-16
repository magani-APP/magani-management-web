import { Wallet, Smartphone, Phone, CreditCard, Layers } from "lucide-react";
import { PosSalePaymentMethod, PosSaleStatus } from "@/types/pos-sales.types";
import { POS_SALE_PAYMENT_METHOD_CONFIG, POS_SALE_STATUS_CONFIG } from "@/constants/pos-sales.constants";

const PAYMENT_ICONS: Record<PosSalePaymentMethod, React.ReactNode> = {
  cash: <Wallet size={10} />,
  mtn: <Smartphone size={10} />,
  orange: <Phone size={10} />,
  card: <CreditCard size={10} />,
  mixed: <Layers size={10} />,
};

export function PosPaymentMethodBadge({ method }: { method: PosSalePaymentMethod }) {
  const config = POS_SALE_PAYMENT_METHOD_CONFIG[method];
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold border whitespace-nowrap"
      style={{ background: config.bg, color: config.text, borderColor: config.border }}
    >
      {PAYMENT_ICONS[method]}
      {config.label}
    </span>
  );
}

export function PosSaleStatusBadge({ status }: { status: PosSaleStatus }) {
  const config = POS_SALE_STATUS_CONFIG[status];
  return (
    <span
      className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full border whitespace-nowrap"
      style={{ background: config.bg, color: config.text, borderColor: config.border }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: config.dot }} />
      {config.label}
    </span>
  );
}
