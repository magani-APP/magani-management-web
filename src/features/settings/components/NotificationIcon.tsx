import {
  TriangleAlert,
  Clock,
  Calendar,
  CalendarCheck,
  CheckCircle2,
  CreditCard,
  UserPlus,
  Shield,
  RefreshCw,
  ArrowDown,
} from "lucide-react";
import { NotificationIconType } from "@/types/notifications.types";

const ICON_MAP: Record<NotificationIconType, React.ElementType> = {
  alert: TriangleAlert,
  clock: Clock,
  calendar: Calendar,
  "calendar-check": CalendarCheck,
  "check-circle": CheckCircle2,
  "credit-card": CreditCard,
  "user-plus": UserPlus,
  shield: Shield,
  refresh: RefreshCw,
  "arrow-down": ArrowDown,
};

interface NotificationIconProps {
  type: NotificationIconType;
  color: string;
  bg: string;
}

export function NotificationIcon({ type, color, bg }: NotificationIconProps) {
  const Icon = ICON_MAP[type];
  return (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
      style={{ background: bg, color }}
    >
      <Icon size={17} />
    </div>
  );
}
