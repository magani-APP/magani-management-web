import { getMe } from "@/api/auth.api";
import type { AuthProfile } from "@/types/auth.types";
import type { User, Pharmacy } from "../mocks/core.mock";

export type { User, Pharmacy };

const ROLE_LABELS: Record<string, string> = {
  PATIENT: "Patient",
  PHARMACY_OWNER: "Propriétaire",
  PHARMACIST: "Pharmacien",
  PHARMACY_STAFF: "Collaborateur",
  ADMIN: "Administrateur",
  SUPER_ADMIN: "Super admin",
};

function initialsOf(firstName: string, lastName: string): string {
  const first = firstName.trim().charAt(0);
  const last = lastName.trim().charAt(0);
  return `${first}${last}`.toUpperCase() || "??";
}

export function mapCurrentUser(profile: AuthProfile): User {
  return {
    id: profile.id,
    name: `${profile.firstName} ${profile.lastName}`.trim(),
    role: ROLE_LABELS[profile.role] ?? profile.role,
    initials: initialsOf(profile.firstName, profile.lastName),
  };
}

export function mapPharmacyInfo(profile: AuthProfile): Pharmacy {
  if (profile.pharmacy) {
    return { id: profile.pharmacy.id, name: profile.pharmacy.name };
  }
  return { id: profile.pharmacyId ?? "", name: "Magani" };
}

export const getCurrentUser = async (
  accessToken?: string,
  refreshToken?: string,
): Promise<User> => {
  const profile = await getMe(accessToken, refreshToken);
  return mapCurrentUser(profile);
};

export const getPharmacyInfo = async (
  accessToken?: string,
  refreshToken?: string,
): Promise<Pharmacy> => {
  const profile = await getMe(accessToken, refreshToken);
  return mapPharmacyInfo(profile);
};
