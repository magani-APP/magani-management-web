export type SettingsTabId =
  | "pharmacy"
  | "team"
  | "pos"
  | "payments"
  | "stock"
  | "notifications"
  | "receipts"
  | "integrations"
  | "public-app"
  | "security";

export interface PharmacySettings {
  name: string;
  licenseNumber: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
}
