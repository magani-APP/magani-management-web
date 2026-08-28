import { Metadata } from "next";
import { PackageCheck, Sparkles } from "lucide-react";
import { AuthPageShell } from "@/features/auth/components/AuthPageShell";
import { AuthVisualPanel } from "@/features/auth/components/AuthVisualPanel";
import { AuthFloatCard } from "@/features/auth/components/AuthFloatCard";
import { LoginForm } from "@/features/auth/components/LoginForm";

export const metadata: Metadata = {
  title: "Connexion — PharmaOS",
  description: "Connectez-vous à votre espace PharmaOS.",
};

export default function LoginPage() {
  return (
    <AuthPageShell
      panelKey="login"
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
          floatCards={
            <>
              <AuthFloatCard
                icon={PackageCheck}
                label="Stock synchronisé"
                value="2 847 articles"
                badge="À jour"
                variant="stock"
              />
              <AuthFloatCard
                icon={Sparkles}
                label="Vente enregistrée"
                value="+ 12 500 FCFA"
                pulse
                variant="sale"
              />
            </>
          }
        />
      }
    >
      <LoginForm />
    </AuthPageShell>
  );
}
