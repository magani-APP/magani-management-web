import { ReportTabId } from "@/types/reports";

export const REPORT_TABS: { id: ReportTabId; label: string; description: string }[] = [
  { id: "sales", label: "Ventes", description: "CA par période" },
  { id: "top-products", label: "Top produits", description: "Meilleures ventes" },
  { id: "margins", label: "Marges", description: "Rentabilité" },
  { id: "stock-value", label: "Valeur stock", description: "Total & catégories" },
  { id: "losses", label: "Pertes", description: "Expirés & cassés" },
  { id: "employees", label: "Employés", description: "Ventes par caissier" },
  { id: "payments", label: "Paiements", description: "Modes de règlement" },
];
