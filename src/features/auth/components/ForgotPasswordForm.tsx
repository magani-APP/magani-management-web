"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight, AlertCircle } from "lucide-react";
import { authErrorMessage, requestPasswordReset } from "@/api/auth.api";
import { AuthField } from "./AuthField";
import { AuthCopy, AuthBackLink, AuthFormWrapper } from "./AuthHeading";
import { authContainerVariants, authItemVariants } from "./authMotion";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await requestPasswordReset({ email });
    } catch (error) {
      setError(authErrorMessage(error, "Impossible d'envoyer le lien pour le moment. Réessayez."));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <motion.div
      className="auth-mode-view"
      variants={authContainerVariants}
      initial="hidden"
      animate="show"
    >
      <AuthBackLink href="/login" label="Retour à la connexion" />

      <AuthCopy
        eyebrow="Récupération"
        title="Retrouvez votre accès."
        description="Nous vous enverrons un lien sécurisé pour choisir un nouveau mot de passe."
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

        <motion.button
          type="submit"
          className="auth-submit"
          variants={authItemVariants}
          disabled={isSubmitting}
        >
          <span>{isSubmitting ? "Envoi..." : "Envoyer le lien"}</span>
          <ArrowRight strokeWidth={2} />
        </motion.button>
      </AuthFormWrapper>
    </motion.div>
  );
}