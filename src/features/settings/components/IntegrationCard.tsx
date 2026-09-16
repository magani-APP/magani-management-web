"use client";

import { Clock } from "lucide-react";
import { TOKENS } from "@/constants/design-tokens.constants";
import { Integration } from "@/types/integrations.types";
import { IntegrationIcon } from "./IntegrationIcon";
import { IntegrationStatusBadge } from "./IntegrationStatusBadge";

interface IntegrationCardProps {
  integration: Integration;
  isSelected: boolean;
  onClick: () => void;
}

export function IntegrationCard({ integration, isSelected, onClick }: IntegrationCardProps) {
  return (
    <div
      onClick={onClick}
      className={`flex flex-col p-4 rounded-2xl bg-white border cursor-pointer transition-shadow hover:shadow-sm ${
        isSelected ? "ring-2 ring-[#0B8F68]/30" : ""
      }`}
      style={{ borderColor: isSelected ? "rgb(11, 143, 104)" : TOKENS.borderCard }}
    >
      <div className="flex items-start gap-3">
        <IntegrationIcon type={integration.icon} color={integration.iconColor} />
        <div className="min-w-0">
          <p className="text-sm font-bold truncate" style={{ color: TOKENS.foreground }}>
            {integration.name}
          </p>
          <div className="mt-1">
            <IntegrationStatusBadge status={integration.status} />
          </div>
        </div>
      </div>

      <p className="text-xs font-medium mt-3 flex-1" style={{ color: TOKENS.mutedText }}>
        {integration.description}
      </p>

      {integration.metaLabel && (
        <p className="flex items-center gap-1.5 text-[10px] font-medium mt-3" style={{ color: TOKENS.faintText }}>
          <Clock size={11} />
          {integration.metaLabel}
        </p>
      )}

      {(integration.ctaLabel || integration.hasDetailsLink) && (
        <div
          className="flex items-center justify-between mt-3 pt-3 border-t"
          style={{ borderColor: TOKENS.divider }}
        >
          {integration.hasDetailsLink ? (
            <span className="text-[11px] font-semibold" style={{ color: TOKENS.faintText }}>
              Voir les détails
            </span>
          ) : (
            <span />
          )}
          {integration.ctaLabel && (
            <span className="text-[11px] font-bold" style={{ color: "rgb(11, 143, 104)" }}>
              {integration.ctaLabel} →
            </span>
          )}
        </div>
      )}
    </div>
  );
}
