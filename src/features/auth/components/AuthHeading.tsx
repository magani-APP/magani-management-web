"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShieldCheck } from "lucide-react";

interface AuthBackLinkProps {
  href: string;
  label: string;
  className?: string;
}

export function AuthBackLink({ href, label, className }: AuthBackLinkProps) {
  const router = useRouter();
  return (
    <button
      type="button"
      className={`auth-back-link ${className ?? ""}`.trim()}
      onClick={() => router.push(href)}
    >
      <ArrowLeft strokeWidth={2} aria-hidden="true" />
      {label}
    </button>
  );
}

interface AuthCopyProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function AuthCopy({ eyebrow, title, description }: AuthCopyProps) {
  return (
    <div className="auth-copy">
      <p className="auth-eyebrow">
        <span />
        {eyebrow}
      </p>
      <h1 id="auth-title">{title}</h1>
      <p className="auth-description">{description}</p>
    </div>
  );
}

interface AuthSwitchProps {
  prompt: string;
  href: string;
  cta: string;
}

export function AuthSwitch({ prompt, href, cta }: AuthSwitchProps) {
  const router = useRouter();

  return (
    <div className="auth-switch">
      <span />
      <p>{prompt}</p>
      <span />
      <button type="button" onClick={() => router.push(href)}>
        {cta}
      </button>
    </div>
  );
}

export function AuthSecureNote() {
  return (
    <p className="auth-secure-note">
      <ShieldCheck strokeWidth={2} aria-hidden="true" />
      Données chiffrées et hébergées en toute sécurité
    </p>
  );
}

interface AuthFormWrapperProps {
  children: ReactNode;
  onSubmit: (e: React.FormEvent) => void;
}

export function AuthFormWrapper({ children, onSubmit }: AuthFormWrapperProps) {
  return (
    <form className="auth-form" onSubmit={onSubmit}>
      {children}
    </form>
  );
}