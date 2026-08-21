"use client";

import { ReactNode, useState } from "react";
import { cn } from "@/lib/utils";

interface ComingSoonCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export function ComingSoonCard({ icon, title, description }: ComingSoonCardProps) {
  const [isNotified, setIsNotified] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center max-w-xs mx-auto">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 border border-emerald-100"
        style={{ background: "rgb(240, 250, 246)" }}
      >
        <span style={{ color: "rgb(11, 143, 104)" }}>{icon}</span>
      </div>

      <h3 className="text-sm font-bold text-[#0F1A15] mb-1.5">{title}</h3>
      <p className="text-xs text-[#9AAEA3] font-medium leading-relaxed">{description}</p>

      <button
        type="button"
        onClick={() => setIsNotified(true)}
        disabled={isNotified}
        className={cn(
          "mt-5 px-4 py-2 rounded-xl text-xs font-bold border transition-colors",
          isNotified
            ? "border-[#E8EDEA] text-[#9AAEA3] cursor-default"
            : "border-emerald-100 hover:bg-emerald-50"
        )}
        style={
          isNotified
            ? undefined
            : { color: "rgb(11, 143, 104)", background: "rgb(240, 250, 246)" }
        }
      >
        {isNotified ? "Vous serez notifié(e)" : "Me notifier à la sortie"}
      </button>
    </div>
  );
}
