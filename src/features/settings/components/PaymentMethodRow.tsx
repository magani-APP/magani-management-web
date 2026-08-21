"use client";

import { ReactNode } from "react";
import { Wallet, Phone, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";
import { PaymentMethod } from "@/types/settings";
import { Toggle } from "./Toggle";

const METHOD_ICON: Record<PaymentMethod["icon"], ReactNode> = {
  cash: <Wallet size={15} />,
  mtn: <Smartphone size={15} />,
  orange: <Phone size={15} />,
};

const METHOD_ICON_BG: Record<PaymentMethod["icon"], string> = {
  cash: "rgba(11, 143, 104, 0.08)",
  mtn: "rgba(255, 193, 7, 0.094)",
  orange: "rgba(255, 98, 0, 0.094)",
};

const METHOD_ICON_COLOR: Record<PaymentMethod["icon"], string> = {
  cash: "rgb(11, 143, 104)",
  mtn: "rgb(255, 193, 7)",
  orange: "rgb(255, 98, 0)",
};

interface PaymentMethodRowProps {
  method: PaymentMethod;
  isLast: boolean;
  onToggle: (id: string) => void;
}

export function PaymentMethodRow({ method, onToggle }: PaymentMethodRowProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 px-5 py-4",
        !method.isFixed && "hover:bg-[#F9FBFA] transition-colors"
      )}
    >
      {/* Icône */}
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: METHOD_ICON_BG[method.icon] }}
      >
        <span style={{ color: METHOD_ICON_COLOR[method.icon] }}>
          {METHOD_ICON[method.icon]}
        </span>
      </div>

      {/* Libellé */}
      <div className="flex-1">
        <p className="text-sm font-semibold text-[#0F1A15]">{method.name}</p>
        <p className="text-[10px] text-[#9AAEA3] mt-0.5">{method.description}</p>
      </div>

      {/* Action : badge fixe pour Espèces, interrupteur pour le reste */}
      {method.isFixed ? (
        <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
          Actif
        </span>
      ) : (
        <Toggle
          checked={method.enabled}
          onChange={() => onToggle(method.id)}
          label={`Activer ${method.name}`}
        />
      )}
    </div>
  );
}
