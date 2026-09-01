import { InputHTMLAttributes, ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface AuthFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: LucideIcon;
  trailing?: ReactNode;
}

export function AuthField({ label, icon: Icon, trailing, id, ...inputProps }: AuthFieldProps) {
  return (
    <div className="auth-field">
      <label htmlFor={id}>{label}</label>
      <span className="auth-input-wrap">
        <Icon strokeWidth={2} aria-hidden="true" />
        <input id={id} {...inputProps} />
        {trailing}
      </span>
    </div>
  );
}