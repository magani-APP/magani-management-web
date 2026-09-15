import { Smartphone, Phone, FileText, Database, Monitor, MessageCircle, Mail, Package } from "lucide-react";
import { IntegrationIconType } from "@/types/integrations.types";

const ICON_MAP: Record<IntegrationIconType, React.ElementType> = {
  smartphone: Smartphone,
  phone: Phone,
  "file-text": FileText,
  database: Database,
  monitor: Monitor,
  "message-circle": MessageCircle,
  mail: Mail,
  package: Package,
};

interface IntegrationIconProps {
  type: IntegrationIconType;
  color: string;
  size?: number;
}

export function IntegrationIcon({ type, color, size = 40 }: IntegrationIconProps) {
  const Icon = ICON_MAP[type];
  return (
    <div
      className="rounded-xl flex items-center justify-center text-white flex-shrink-0"
      style={{ width: size, height: size, background: color }}
    >
      <Icon size={size * 0.45} />
    </div>
  );
}
