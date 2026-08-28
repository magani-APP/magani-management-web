import { ReactNode } from "react";
import { PackageCheck, Sparkles } from "lucide-react";
import { AuthPageShell } from "@/features/auth/components/AuthPageShell";
import { AuthVisualPanel } from "@/features/auth/components/AuthVisualPanel";
import { AuthFloatCard } from "@/features/auth/components/AuthFloatCard";

export default function RegisterLayout({ children }: { children: ReactNode }) {
  return (
    <AuthPageShell
      panelKey="register"
      mobileImage="/images/register.png"
      visualPanel={
        <AuthVisualPanel
          panelKey="register"
          image="/images/register.png"
          chapter="02 / 02"
          headline={
            <>
              Du stock au comptoir.
              <br />
              <span>Tout s’aligne.</span>
            </>
          }
          description="Créez un espace commun où le catalogue, l’équipe et les opérations avancent au même rythme."
          floatCards={
            <>
              <AuthFloatCard
                icon={PackageCheck}
                label="Catalogue importé"
                value="2 847 références"
                badge="Prêt"
                variant="stock"
              />
              <AuthFloatCard
                icon={Sparkles}
                label="Équipe invitée"
                value="5 membres"
                pulse
                variant="sale"
              />
            </>
          }
        />
      }
    >
      {children}
    </AuthPageShell>
  );
}
