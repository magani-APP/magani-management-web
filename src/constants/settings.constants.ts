import { SettingsTabId } from "../types/settings";

export const SETTINGS_TABS: { id: SettingsTabId; label: string }[] = [
  { id: "pharmacy", label: "Pharmacie" },
  { id: "team", label: "Équipe & Rôles" },
  { id: "pos", label: "Caisse" },
  { id: "payments", label: "Paiements" },
  { id: "stock", label: "Stock & Alertes" },
  { id: "notifications", label: "Notifications" },
  { id: "receipts", label: "Tickets & Reçus" },
  { id: "integrations", label: "Intégrations" },
  { id: "public-app", label: "App publique" },
  { id: "security", label: "Sécurité" },
];

/** Champs affichés dans la carte "Informations de la pharmacie" (dans l'ordre). */
export const PHARMACY_FIELDS: { key: keyof import("../types/settings").PharmacySettings; label: string }[] = [
  { key: "name", label: "Nom" },
  { key: "licenseNumber", label: "N° agrément" },
  { key: "address", label: "Adresse" },
  { key: "phone", label: "Téléphone" },
  { key: "email", label: "Email" },
  { key: "hours", label: "Horaires" },
];
