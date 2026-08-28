"use client";

import { InputHTMLAttributes, ReactNode, useState } from "react";
import { LockKeyhole, Eye, EyeOff } from "lucide-react";

interface AuthPasswordFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  /** Rendered next to the label, e.g. a "Mot de passe oublié ?" button */
  labelExtra?: ReactNode;
}

export function AuthPasswordField({ label, labelExtra, id, ...inputProps }: AuthPasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="auth-field">
      {labelExtra ? (
        <div className="auth-label-row">
          <label htmlFor={id}>{label}</label>
          {labelExtra}
        </div>
      ) : (
        <label htmlFor={id}>{label}</label>
      )}
      <span className="auth-input-wrap">
        <LockKeyhole strokeWidth={2} aria-hidden="true" />
        <input id={id} type={visible ? "text" : "password"} {...inputProps} />
        <button
          type="button"
          className="auth-password-toggle"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
        >
          {visible ? <EyeOff strokeWidth={2} /> : <Eye strokeWidth={2} />}
        </button>
      </span>
    </div>
  );
}
