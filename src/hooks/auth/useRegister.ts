"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/api/auth.api";

export function useRegister() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    try {
      await register({ fullName, email, password});
      // Redirige vers le tableau de bord une fois l'espace créé
      router.push("/");
    } catch {
      setError("Impossible de créer votre espace pour le moment.");
    } finally {
      setIsSubmitting(false);
    }
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
