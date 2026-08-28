import { Metadata } from "next";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

export const metadata: Metadata = {
  title: "Créer un compte — PharmaOS",
  description: "Configurez votre espace PharmaOS.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
