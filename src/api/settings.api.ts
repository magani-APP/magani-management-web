import {
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

// ---- Pharmacie ----

interface ApiHour {
  dayOfWeek: number;
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

// ---- Équipe ----

export interface InviteTeamMemberInput {
  name: string;
  email: string;
  role: string;
}

type ApiStaff = {
  id: string;
  email: string | null;
  firstName: string;
  lastName: string;
  role: "PHARMACY_OWNER" | "PHARMACIST" | "PHARMACY_STAFF" | string;
  isActive: boolean;
};

const ROLE_TO_API: Record<string, "PHARMACIST" | "PHARMACY_STAFF"> = {
  "Pharmacien(ne)": "PHARMACIST",
};

const ROLE_FROM_API: Record<string, string> = {
  PHARMACY_OWNER: "Propriétaire",
  PHARMACIST: "Pharmacien(ne)",
  PHARMACY_STAFF: "Employé",
};

function splitName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  const firstName = parts[0] ?? "Employé";
  const lastName = parts.length > 1 ? parts.slice(1).join(" ") : firstName;
  return { firstName, lastName };
}

function generateTempPassword(): string {
  return `Magani-${Math.random().toString(36).slice(2, 8)}${Math.floor(Math.random() * 10)}!`;
}

function mapStaff(row: ApiStaff): TeamMember {
  return {
    id: row.id,
    name: `${row.firstName} ${row.lastName}`.trim(),
    email: row.email ?? "",
    role: ROLE_FROM_API[row.role] ?? row.role,
    status: row.isActive ? "active" : "inactive",
  };
}

export const getTeamMembers = async (): Promise<TeamMember[]> => {
  const rows = await apiRequest<ApiStaff[]>("/pharmacy/pos/staff");
  return rows.map(mapStaff);
};

export const inviteTeamMember = async (
  input: InviteTeamMemberInput
): Promise<TeamMember> => {
  const { firstName, lastName } = splitName(input.name);
  const role = ROLE_TO_API[input.role] ?? "PHARMACY_STAFF";

  const created = await apiRequest<ApiStaff>("/pharmacy/pos/staff", {
    method: "POST",
    body: JSON.stringify({
      email: input.email,
      password: generateTempPassword(),
      firstName,
      lastName,
      role,
    }),
  });

  return mapStaff({
    ...created,
    email: created.email ?? input.email,
    firstName: created.firstName ?? firstName,
    lastName: created.lastName ?? lastName,
    role: created.role ?? role,
    isActive: created.isActive ?? true,
  });
};

export const updateTeamMemberStatus = async (
  id: string,
  status: TeamMemberStatus
): Promise<void> => {
  await apiRequest(`/pharmacy/pos/staff/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ isActive: status === "active" }),
  });
};

export const removeTeamMember = async (id: string): Promise<void> => {
  await apiRequest(`/pharmacy/pos/staff/${id}`, { method: "DELETE" });
};

// ---- Paiements ----

export const getPaymentMethods = async (): Promise<PaymentMethod[]> => {
  const rows = await apiRequest<PaymentMethod[]>("/pharmacies/me/payment-methods");
  return rows;
};

export const updatePaymentMethodStatus = async (
  id: string,
  enabled: boolean
): Promise<void> => {
  const current = await getPaymentMethods();
  const methods = current
    .filter((m) => {
      if (m.isFixed) return true;
      if (m.id === id) return enabled;
      return m.enabled;
    })
    .map((m) => m.id);

  await apiRequest("/pharmacies/me/payment-methods", {
    method: "PUT",
    body: JSON.stringify({ methods }),
  });
};

// ---- Stock : pas encore d'endpoint dédié ----

export const getStockSettings = async (): Promise<StockSetting[]> => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return mockStockSettings;
};

export const updateStockSetting = async (_id: string, _enabled: boolean): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 200));
};

// ---- Sécurité ----

export const getSecuritySettings = async (): Promise<SecuritySettings> => {
  try {
    const data = await apiRequest<{
      twoFactorEnabled: boolean;
      activeSessionsCount: number;
      activeSessionsDevices: string;
    }>("/auth/sessions");
    return {
      twoFactorEnabled: data.twoFactorEnabled,
      activeSessionsCount: data.activeSessionsCount,
      activeSessionsDevices: data.activeSessionsDevices || "Aucun appareil",
    };
  } catch {
    return mockSecuritySettings;
  }
};

export const updateTwoFactorStatus = async (_enabled: boolean): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 200));
};

export const disconnectAllSessions = async (): Promise<void> => {
  await logoutAll();
};
