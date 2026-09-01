import { Metadata } from "next";
import { PackageCheck, Sparkles } from "lucide-react";
import { AuthPageShell } from "@/features/auth/components/AuthPageShell";
import { AuthVisualPanel } from "@/features/auth/components/AuthVisualPanel";
import { AuthFloatCard } from "@/features/auth/components/AuthFloatCard";
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Récupération — PharmaOS",
  description: "Réinitialisez votre mot de passe PharmaOS.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthPageShell
      panelKey="forgot-password"
      mobileImage="/images/login.png"
      visualPanel={
        <AuthVisualPanel
          panelKey="login"
          image="/images/login.png"
          chapter="01 / 02"
          headline={
            <>
              Moins d’administratif.
              <br />
              <span>Plus de soin.</span>
            </>
          }
          description="Tout ce qu’il faut pour piloter une pharmacie sereinement, du comptoir à la réserve."
        />
      }
    >
      <ForgotPasswordForm />
    </AuthPageShell>
  );
}