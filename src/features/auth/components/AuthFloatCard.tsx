import { LucideIcon, Check } from "lucide-react";

interface AuthFloatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  badge?: string;
  pulse?: boolean;
  /** Positioning variant, mapped to the auth-float-{variant} modifier class */
  variant: "stock" | "sale";
}

export function AuthFloatCard({ icon: Icon, label, value, badge, pulse = false, variant }: AuthFloatCardProps) {
  return (
    <div className={`auth-float-card auth-float-${variant}`}>
      <span className={pulse ? "auth-pulse" : undefined}>
        <Icon strokeWidth={2} />
      </span>
      <div className="auth-float-card-copy">
        <small>{label}</small>
        <strong>{value}</strong>
      </div>
      {badge && (
        <b>
          <Check strokeWidth={2} />
          {badge}
        </b>
      )}
    </div>
  );
}
