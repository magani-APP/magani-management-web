"use client";

import { ReactNode } from "react";
import { Wallet, Phone, Smartphone, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { PaymentMethod } from "@/types/settings";
import { Toggle } from "./Toggle";
import { StatusBadge } from "./StatusBadge";

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
  gridCols: string;
  onToggle: (id: string) => void;
}

export function PaymentMethodRow({ method, gridCols, onToggle }: PaymentMethodRowProps) {
  return (
    <div
      className={cn(
        "grid items-center gap-4 px-6 py-4",
        !method.isFixed && "hover:bg-[#F9FBFA] transition-colors"
      )}
      style={{ gridTemplateColumns: gridCols }}
    >
      {/* Icône + nom */}
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: METHOD_ICON_BG[method.icon] }}
        >
          <span style={{ color: METHOD_ICON_COLOR[method.icon] }}>
            {METHOD_ICON[method.icon]}
          </span>
        </div>
        <p className="text-sm font-semibold text-[#0F1A15] truncate">{method.name}</p>
      </div>

      {/* Description */}
      <p className="text-[11px] text-[#9AAEA3] font-medium truncate">{method.description}</p>

      {/* Statut */}
      <div>
        <StatusBadge active />
      </div>

      {/* Actions : verrou pour Espèces, interrupteur pour le reste */}
      <div className="flex justify-end">
        {method.isFixed ? (
          <Lock size={14} className="text-[#C8D5CC]" />
        ) : (
          <Toggle
            checked={method.enabled}
            onChange={() => onToggle(method.id)}
            label={`Activer ${method.name}`}
          />
        )}
      </div>
    </div>
  );
}
