"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { readRegisterDraft, saveRegisterDraft } from "@/features/auth/register-draft";

export function useRegister() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const draft = readRegisterDraft();
    if (!draft) return;
    setFullName(draft.fullName);
    setEmail(draft.email);
    setPassword(draft.password);
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!fullName || !email || !password) {
      setError("Merci de remplir tous les champs.");
      return;
    }
    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (!acceptTerms) {
      setError("Vous devez accepter les conditions d'utilisation.");
      return;
    }

    setIsSubmitting(true);
    saveRegisterDraft({ fullName, email, password });
    router.push("/register/pharmacy");
    setIsSubmitting(false);
  };

  return {
    fullName,
    setFullName,
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    acceptTerms,
    setAcceptTerms,
    isSubmitting,
    error,
    handleSubmit,
  };
}
