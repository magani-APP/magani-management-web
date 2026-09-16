import { apiRequest, ApiError } from "@/lib/api-client";
import { persistTokens, clearTokens, getBrowserRefreshToken } from "@/lib/auth-session";
import {
  AuthProfile,
  AuthSession,
  AuthUser,
  ForgotPasswordInput,
  LoginInput,
  RegisterPharmacyInput,
  ResetPasswordInput,
} from "@/types/auth.types";

export type {
  AuthUser,
  LoginInput,
  RegisterPharmacyInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  AuthProfile,
};

function toAuthUser(user: AuthProfile): AuthUser {
  return {
    id: user.id,
    name: `${user.firstName} ${user.lastName}`.trim(),
    email: user.email ?? "",
  };
}

function splitFullName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  const firstName = parts[0] ?? "Utilisateur";
  const lastName = parts.length > 1 ? parts.slice(1).join(" ") : firstName;
  return { firstName, lastName };
}

function persistSession(session: AuthSession): AuthUser {
  persistTokens(session.accessToken, session.refreshToken);
  return toAuthUser(session.user);
}

export function authErrorMessage(error: unknown, fallback: string): string {
  if (!(error instanceof ApiError)) return fallback;

  if (error.code === "NETWORK") {
    return "Impossible de joindre le serveur. Vérifiez votre connexion.";
  }
  if (error.status === 401 || error.code === "UNAUTHORIZED") {
    return fallback;
  }
  if (error.status === 409 || error.code === "CONFLICT") {
    if (error.message.toLowerCase().includes("phone")) {
      return "Un compte existe déjà avec ce numéro.";
    }
    return "Un compte existe déjà avec cet e-mail.";
  }
  if (error.status === 403 || error.code === "FORBIDDEN") {
    return "Ce compte a été désactivé.";
  }
  if (error.status === 422 || error.code === "UNPROCESSABLE") {
    return "Veuillez vérifier les informations saisies.";
  }

  return error.message || fallback;
}

export const login = async ({ email, password }: LoginInput): Promise<AuthUser> => {
  const session = await apiRequest<AuthSession>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ identifier: email, password }),
    skipAuth: true,
    skipRefresh: true,
  });
  return persistSession(session);
};

export const registerPharmacy = async ({
  fullName,
  email,
  password,
  pharmacy,
}: RegisterPharmacyInput): Promise<AuthUser> => {
  const { firstName, lastName } = splitFullName(fullName);
  const session = await apiRequest<AuthSession>("/auth/register/pharmacy", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
      firstName,
      lastName,
      locale: "fr",
      pharmacy: {
        name: pharmacy.name,
        address: pharmacy.address,
        city: pharmacy.city,
        region: pharmacy.region,
        latitude: pharmacy.latitude,
        longitude: pharmacy.longitude,
        phone: pharmacy.phone,
        paymentMethods: ["CASH", "MTN_MOMO"],
      },
    }),
    skipAuth: true,
    skipRefresh: true,
  });
  return persistSession(session);
};

export const requestPasswordReset = async ({
  email,
}: ForgotPasswordInput): Promise<{ success: true }> => {
  await apiRequest<{ message: string }>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ identifier: email }),
    skipAuth: true,
    skipRefresh: true,
  });
  return { success: true };
};

export const resetPassword = async ({
  token,
  password,
}: ResetPasswordInput): Promise<{ success: true }> => {
  await apiRequest("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, password }),
    skipAuth: true,
    skipRefresh: true,
  });
  return { success: true };
};

export const getMe = async (
  accessToken?: string,
  refreshToken?: string,
): Promise<AuthProfile> => {
  return apiRequest<AuthProfile>("/auth/me", { accessToken, refreshToken });
};

export const logout = async (): Promise<void> => {
  const refreshToken = getBrowserRefreshToken();
  try {
    if (refreshToken) {
      await apiRequest("/auth/logout", {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
        skipAuth: true,
        skipRefresh: true,
      });
    }
  } finally {
    clearTokens();
  }
};

export const logoutAll = async (
  accessToken?: string,
  refreshToken?: string,
): Promise<void> => {
  try {
    await apiRequest("/auth/logout-all", {
      method: "POST",
      accessToken,
      refreshToken,
    });
  } finally {
    clearTokens();
  }
};
