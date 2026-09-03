"use client";

import { Bot } from "lucide-react";
import { useMagaVisibility } from "@/hooks/settings/useMagaVisibility";
import { Toggle } from "./Toggle";

export function MagaSettingsCard() {
  const { enabled, toggle } = useMagaVisibility();

  return (
    <div className="max-w-xl space-y-5">
      {/* En-tête */}
      <div>
        <h2 className="text-base font-bold text-[#0F1A15]">Assistant Maga</h2>
        <p className="text-xs text-[#9AAEA3] mt-1 font-medium">
          Gérez l&apos;affichage de l&apos;assistant Maga dans l&apos;application.
        </p>
      </div>

      {/* Carte du réglage */}
      <div className="bg-white rounded-2xl border border-[#E8EDEA] overflow-hidden divide-y divide-[#F0F5F2]">
        <div className="flex items-center gap-4 px-5 py-4 hover:bg-[#F9FBFA] transition-colors">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(11, 143, 104, 0.08)" }}
          >
            <Bot size={16} style={{ color: "rgb(11, 143, 104)" }} />
          </div>

          <div className="flex-1">
            <p className="text-sm font-semibold text-[#0F1A15]">Maga — officine</p>
            <p className="text-[10px] text-[#9AAEA3] mt-0.5 font-medium">
              Affiche le raccourci de l&apos;assistant Maga dans le menu latéral.
            </p>
          </div>

          <Toggle
            checked={enabled}
            onChange={toggle}
            label="Afficher Maga — officine dans le menu latéral"
          />
        </div>
      </div>

      <p className="text-[10px] text-[#9AAEA3] font-medium px-1">
        {enabled
          ? "Maga — officine est actuellement visible dans le menu latéral."
          : "Maga — officine est masqué du menu latéral. Vous pouvez le réactiver à tout moment."}
      </p>
    </div>
  );
}
