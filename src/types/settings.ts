export type SettingsTabId =
  | "pharmacy"
  | "team"
  | "pos"
  | "payments"
  | "stock"
  | "notifications"
  | "receipts"
  | "integrations"
  | "maga"
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

export type TeamMemberStatus = "active" | "inactive";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: TeamMemberStatus;
}

export type PaymentMethodIcon = "cash" | "mtn" | "orange";

export interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: PaymentMethodIcon;
  /** Les moyens "fixed" (ex. Espèces) sont toujours actifs et non désactivables. */
  isFixed: boolean;
  enabled: boolean;
}

export interface StockSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  activeSessionsCount: number;
  activeSessionsDevices: string;
}
