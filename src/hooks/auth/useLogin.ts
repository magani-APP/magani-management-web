"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/api/auth.api";

export function useLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Veuillez renseigner votre e-mail et votre mot de passe.");
      return;
    }

    setIsSubmitting(true);
    try {
      await login({ email, password });
      // Redirige vers le tableau de bord une fois connecté
      router.push("/");
    } catch {
      setError("Impossible de vous connecter. Vérifiez vos identifiants.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    isSubmitting,
    error,
    handleSubmit,
  };
}
