export type AuthRole =
  | "PATIENT"
  | "PHARMACY_OWNER"
  | "PHARMACIST"
  | "PHARMACY_STAFF"
  | "ADMIN"
  | "SUPER_ADMIN";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthProfile {
  id: string;
  email: string | null;
  phone: string | null;
  role: AuthRole;
  firstName: string;
  lastName: string;
  locale: "fr" | "en";
  isActive: boolean;
  pharmacyId: string | null;
  pharmacy?: {
    id: string;
    name: string;
  } | null;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: "Bearer";
  expiresIn: string;
}

export interface AuthSession extends AuthTokens {
  user: AuthProfile;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  fullName: string;
  email: string;
  password: string;
}

export interface RegisterAccountDraft {
  fullName: string;
  email: string;
  password: string;
}

export interface PharmacySignupInput {
  name: string;
  address: string;
  city: string;
  region: string;
  phone: string;
}

export interface RegisterPharmacyInput extends RegisterAccountDraft {
  pharmacy: PharmacySignupInput & {
    latitude: number;
    longitude: number;
  };
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  token: string;
  password: string;
}
