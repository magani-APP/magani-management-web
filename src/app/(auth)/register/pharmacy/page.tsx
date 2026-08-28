import { Metadata } from "next";
import { PharmacyRegisterForm } from "@/features/auth/components/PharmacyRegisterForm";

export const metadata: Metadata = {
  title: "Votre officine — PharmaOS",
  description: "Renseignez votre pharmacie pour créer votre espace Magani.",
};

export default function RegisterPharmacyPage() {
  return <PharmacyRegisterForm />;
}
