"use client";

import { X, Clock } from "lucide-react";
import { TOKENS } from "@/constants/design-tokens.constants";
import { Integration } from "@/types/integrations.types";
import { IntegrationIcon } from "./IntegrationIcon";
import { IntegrationStatusBadge } from "./IntegrationStatusBadge";

interface IntegrationDetailDrawerProps {
  integration: Integration;
  onClose: () => void;
}

export function IntegrationDetailDrawer({ integration, onClose }: IntegrationDetailDrawerProps) {
  return (
    <>
      <div className="lg:hidden fixed inset-0 z-30 bg-black/30 backdrop-blur-[1px]" onClick={onClose} />
      <aside
        className="fixed inset-x-0 bottom-0 z-40 max-h-[90vh] rounded-t-3xl border shadow-[0_-8px_32px_rgba(0,0,0,0.12)] lg:static lg:z-auto lg:inset-auto lg:max-h-none lg:w-[340px] xl:w-[360px] lg:flex-shrink-0 lg:rounded-2xl lg:shadow-none overflow-y-auto no-scrollbar flex flex-col bg-white"
        style={{ borderColor: TOKENS.borderCard }}
      >
        {/* EN-TÊTE */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b" style={{ borderColor: TOKENS.divider }}>
          <h3 className="text-sm font-bold" style={{ color: TOKENS.foreground }}>
            {integration.name}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[#F0F5F2] transition-colors"
            style={{ color: TOKENS.faintText }}
            aria-label="Fermer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 no-scrollbar" style={{ scrollbarWidth: "none" }}>
          {/* RÉSUMÉ */}
          <div className="flex items-start gap-3">
            <IntegrationIcon type={integration.icon} color={integration.iconColor} size={36} />
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-bold" style={{ color: TOKENS.foreground }}>
                  {integration.name}
                </p>
                <IntegrationStatusBadge status={integration.status} />
              </div>
              <p className="text-xs font-medium mt-1" style={{ color: TOKENS.mutedText }}>
                {integration.description}
              </p>
            </div>
          </div>

          {integration.metaLabel && (
            <p className="flex items-center gap-1.5 text-[10px] font-medium mt-3" style={{ color: TOKENS.faintText }}>
              <Clock size={11} />
              {integration.metaLabel}
            </p>
          )}

          {/* BLOC CENTRAL */}
          <div className="flex flex-col items-center text-center mt-8 mb-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: `${integration.iconColor}1F` }}
            >
              <IntegrationIcon type={integration.icon} color={integration.iconColor} size={28} />
            </div>
            <p className="text-sm font-bold" style={{ color: TOKENS.foreground }}>
              {integration.status === "operational" || integration.status === "available"
                ? integration.status === "available"
                  ? "Disponible"
                  : "Opérationnelle"
                : integration.status === "not-connected"
                ? "Non connecté"
                : integration.status === "needs-attention"
                ? "Attention requise"
                : integration.status === "not-configured"
                ? "Non configuré"
                : integration.status === "not-installed"
                ? "Non installé"
                : "Bientôt disponible"}
            </p>
            <p className="text-xs font-medium mt-1.5 max-w-[280px]" style={{ color: TOKENS.mutedText }}>
              {integration.description}
            </p>
          </div>
        </div>

        {integration.ctaLabel && (
          <div className="px-5 py-4 border-t" style={{ borderColor: TOKENS.divider }}>
            <button
              type="button"
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-2xl text-white text-xs font-bold hover:opacity-90 transition-opacity"
              style={{ background: "rgb(11, 143, 104)" }}
            >
              {integration.ctaLabel} →
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
