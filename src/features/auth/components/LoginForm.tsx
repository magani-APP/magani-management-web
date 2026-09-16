"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, ArrowRight, AlertCircle } from "lucide-react";
import { authErrorMessage, login } from "@/api/auth.api";
import { AuthField } from "./AuthField";
import { AuthPasswordField } from "./AuthPasswordField";
import { AuthCopy, AuthSwitch, AuthFormWrapper } from "./AuthHeading";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login({ email, password });
      router.replace("/");
    } catch (error) {
      setError(authErrorMessage(error, "Adresse e-mail ou mot de passe incorrect."));
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth-mode-view auth-mode-login">
      <AuthCopy
        eyebrow="Accès sécurisé"
        title="Ravi de vous revoir."
        description="Retrouvez votre caisse, votre stock et votre équipe en un instant."
      />

      {error && (
        <div className="auth-error">
          <AlertCircle strokeWidth={2} aria-hidden="true" />
          {error}
        </div>
      )}

      <AuthFormWrapper onSubmit={handleSubmit}>
        <AuthField
          id="auth-email"
          label="Adresse e-mail"
          icon={Mail}
          type="email"
          autoComplete="email"
          placeholder="vous@pharmacie.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <AuthPasswordField
          id="auth-password"
          label="Mot de passe"
          labelExtra={
            <button type="button" onClick={() => router.push("/forgot-password")}>
              Mot de passe oublié ?
            </button>
          }
          autoComplete="current-password"
          placeholder="Votre mot de passe"
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="auth-submit" disabled={isSubmitting}>
          <span>{isSubmitting ? "Connexion..." : "Se connecter"}</span>
          <ArrowRight strokeWidth={2} />
        </button>
      </AuthFormWrapper>

      <AuthSwitch prompt="Nouveau sur PharmaOS ?" href="/register" cta="Créer un compte" />

      
    </div>
  );
}