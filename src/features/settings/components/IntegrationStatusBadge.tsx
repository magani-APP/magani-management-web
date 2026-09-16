import { IntegrationStatus } from "@/types/integrations.types";
import { INTEGRATION_STATUS_CONFIG } from "@/constants/integrations.constants";

export function IntegrationStatusBadge({ status }: { status: IntegrationStatus }) {
  const config = INTEGRATION_STATUS_CONFIG[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap"
      style={{ background: config.bg, color: config.text }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: config.dot }} />
      {config.label}
    </span>
  );
}
