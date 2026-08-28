"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, ArrowRight, AlertCircle } from "lucide-react";
import { register } from "@/api/auth.api";
import { AuthField } from "./AuthField";
import { AuthPasswordField } from "./AuthPasswordField";
import { AuthCopy, AuthSwitch, AuthFormWrapper } from "./AuthHeading";

export function RegisterForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!acceptedTerms) return;
    setError(null);
    setIsSubmitting(true);
    try {
      await register({ fullName, email, password });
      router.push("/");
    } catch {
      setError("Impossible de créer votre espace pour le moment. Réessayez.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth-mode-view">
      <AuthCopy
        eyebrow="Créer votre espace"
        title="Votre pharmacie, enfin fluide."
        description="Configurez PharmaOS et commencez à travailler avec votre équipe."
      />

      {error && (
        <div className="auth-error">
          <AlertCircle strokeWidth={2} aria-hidden="true" />
          {error}
        </div>
      )}

      <AuthFormWrapper onSubmit={handleSubmit}>
        <AuthField
          id="auth-name"
          label="Nom complet"
          icon={User}
          type="text"
          autoComplete="name"
          placeholder="Ex. Aïcha Kouamé"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />

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
          autoComplete="new-password"
          placeholder="8 caractères minimum"
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label className="auth-checkbox-row">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            required
          />
          J&apos;accepte les conditions d&apos;utilisation et la politique de confidentialité.
        </label>

        <button type="submit" className="auth-submit" disabled={isSubmitting || !acceptedTerms}>
          <span>{isSubmitting ? "Création..." : "Créer mon espace"}</span>
          <ArrowRight strokeWidth={2} />
        </button>
      </AuthFormWrapper>

      <AuthSwitch prompt="Déjà un compte ?" href="/login" cta="Se connecter" />
    </div>
  );
}
