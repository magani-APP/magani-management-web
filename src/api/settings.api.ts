import {
  mockPaymentMethods,
  mockSecuritySettings,
  mockStockSettings,
} from "@/mocks/settings.mock";
import {
  PaymentMethod,
  PharmacySettings,
  SecuritySettings,
  StockSetting,
  TeamMember,
  TeamMemberStatus,
} from "@/types/settings";
import { logoutAll, getMe } from "@/api/auth.api";
import { apiRequest } from "@/lib/api-client";

export type { PaymentMethod, PharmacySettings, SecuritySettings, StockSetting, TeamMember, TeamMemberStatus };

// ---- Pharmacie (réel : GET via /auth/me + /pharmacies/:id, PATCH /pharmacies/me, PUT /pharmacies/me/hours) ----

interface ApiHour {
  dayOfWeek: number; // 0 = dimanche ... 6 = samedi
  openTime: string | null;
  closeTime: string | null;
  isClosed: boolean;
}

interface ApiPharmacy {
  id: string;
  name: string;
  address: string;
  phone: string;
  email?: string | null;
  licenseNumber?: string | null;
  hours: ApiHour[];
}

const DAY_LABELS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

function formatHoursSummary(hours: ApiHour[]): string {
  if (!hours.length) return "Non renseigné";
  const open = hours
    .filter((h) => !h.isClosed && h.openTime && h.closeTime)
    .sort((a, b) => a.dayOfWeek - b.dayOfWeek);
  if (!open.length) return "Fermé";
  return open.map((h) => `${DAY_LABELS[h.dayOfWeek]} ${h.openTime}-${h.closeTime}`).join(" · ");
}

export const getPharmacySettings = async (): Promise<PharmacySettings> => {
  const profile = await getMe();
  if (!profile.pharmacyId) {
    throw new Error("Aucune pharmacie associée à ce compte.");
  }
  const pharmacy = await apiRequest<ApiPharmacy>(`/pharmacies/${profile.pharmacyId}`);
  return {
    name: pharmacy.name,
    licenseNumber: pharmacy.licenseNumber ?? "",
    address: pharmacy.address,
    phone: pharmacy.phone,
    email: pharmacy.email ?? profile.email ?? "",
    hours: formatHoursSummary(pharmacy.hours),
  };
};

export const updatePharmacySettings = async (
  data: PharmacySettings
): Promise<PharmacySettings> => {
  // ⚠️ "hours" reste en lecture seule ici : c'est un texte formaté côté front,
  // alors que l'API attend un tableau structuré (PUT /pharmacies/me/hours).
  // Il faudra une UI dédiée (jour par jour) pour éditer les horaires.
  const pharmacy = await apiRequest<ApiPharmacy>("/pharmacies/me", {
    method: "PATCH",
    body: JSON.stringify({
      name: data.name,
      address: data.address,
      phone: data.phone,
      email: data.email,
      licenseNumber: data.licenseNumber,
    }),
  });
  return {
    name: pharmacy.name,
    licenseNumber: pharmacy.licenseNumber ?? "",
    address: pharmacy.address,
    phone: pharmacy.phone,
    email: pharmacy.email ?? "",
    hours: formatHoursSummary(pharmacy.hours),
  };
};

// ---- Équipe : seule l'invitation est réelle (POST /pharmacy/pos/staff). ----
// 🚧 Il n'existe pas encore d'endpoint pour LISTER, DÉSACTIVER ou SUPPRIMER
// les membres de l'équipe d'une pharmacie (GET /users est admin-only).
// On garde donc la liste en mock en attendant que le backend l'expose.

export interface InviteTeamMemberInput {
  name: string;
  email: string;
  role: string;
}

const ROLE_TO_API: Record<string, "PHARMACIST" | "PHARMACY_STAFF"> = {
  "Pharmacien(ne)": "PHARMACIST",
};

function splitName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  const firstName = parts[0] ?? "Employé";
  const lastName = parts.length > 1 ? parts.slice(1).join(" ") : firstName;
  return { firstName, lastName };
}

function generateTempPassword(): string {
  // Mot de passe provisoire en attendant un vrai flux d'invitation par e-mail
  // (lien d'activation) côté backend.
  return `Magani-${Math.random().toString(36).slice(2, 8)}${Math.floor(Math.random() * 10)}!`;
}

export const getTeamMembers = async (): Promise<TeamMember[]> => {
  const { mockTeamMembers } = await import("@/mocks/settings.mock");
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockTeamMembers;
};

export const inviteTeamMember = async (
  input: InviteTeamMemberInput
): Promise<TeamMember> => {
  const { firstName, lastName } = splitName(input.name);
  const role = ROLE_TO_API[input.role] ?? "PHARMACY_STAFF";

  const created = await apiRequest<{ id: string }>("/pharmacy/pos/staff", {
    method: "POST",
    body: JSON.stringify({
      email: input.email,
      password: generateTempPassword(),
      firstName,
      lastName,
      role,
    }),
  });

  return {
    id: created.id,
    name: input.name,
    email: input.email,
    role: input.role,
    status: "active",
  };
};

// Pas d'endpoint backend pour ces deux actions pour l'instant.
export const updateTeamMemberStatus = async (
  _id: string,
  _status: TeamMemberStatus
): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
};

export const removeTeamMember = async (_id: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
};

// ---- Paiements / Stock : pas encore d'endpoint dédié, restent mockés ----

export const getPaymentMethods = async (): Promise<PaymentMethod[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockPaymentMethods;
};

export const updatePaymentMethodStatus = async (
  _id: string,
  _enabled: boolean
): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
};

export const getStockSettings = async (): Promise<StockSetting[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockStockSettings;
};

export const updateStockSetting = async (_id: string, _enabled: boolean): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
};

// ---- Sécurité : déjà réel pour la déconnexion globale ----

export const getSecuritySettings = async (): Promise<SecuritySettings> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockSecuritySettings;
};

export const updateTwoFactorStatus = async (_enabled: boolean): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 400));
};

export const disconnectAllSessions = async (): Promise<void> => {
  await logoutAll();
};