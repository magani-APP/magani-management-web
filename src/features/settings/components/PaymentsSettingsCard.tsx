"use client";

import { usePaymentMethods } from "@/hooks/settings/usePaymentMethods";
import { PaymentMethodRow } from "./PaymentMethodRow";

export function PaymentsSettingsCard() {
  const { methods, isLoading, toggle } = usePaymentMethods();

  return (
    <div className="max-w-xl space-y-5">
      {/* En-tête */}
      <div>
        <h2 className="text-base font-bold text-[#0F1A15]">Modes de paiement</h2>
        <p className="text-xs text-[#9AAEA3] mt-1 font-medium">
          Activez les modes de paiement acceptés à la caisse.
        </p>
      </div>

      {/* Carte des moyens de paiement */}
      {isLoading ? (
        <div className="flex h-[220px] items-center justify-center rounded-2xl border border-[#E8EDEA] bg-white">
          <div className="w-8 h-8 border-4 border-[#0B8F68] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E8EDEA] overflow-hidden divide-y divide-[#F0F5F2]">
          {methods.map((method, index) => (
            <PaymentMethodRow
              key={method.id}
              method={method}
              isLast={index === methods.length - 1}
              onToggle={toggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}
