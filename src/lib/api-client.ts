import {
  getBrowserAccessToken,
  getBrowserRefreshToken,
  persistTokens,
  clearTokens,
} from "@/lib/auth-session";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

type ApiErrorBody = {
  code?: string;
  message?: string;
  details?: unknown;
};

type ApiEnvelope<T> = {
  success?: boolean;
  data?: T;
  error?: ApiErrorBody;
};

export class ApiError extends Error {
  status: number;
  code: string;
  details?: unknown;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export type ApiRequestOptions = RequestInit & {
  accessToken?: string;
  refreshToken?: string;
  skipAuth?: boolean;
  skipRefresh?: boolean;
};

async function readEnvelope<T>(response: Response): Promise<ApiEnvelope<T>> {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text) as ApiEnvelope<T>;
  } catch {
    return {};
  }
}

async function rotateSession(refreshToken?: string): Promise<string | null> {
  const token = refreshToken ?? getBrowserRefreshToken();
  if (!token) return null;

  try {
    const session = await apiRequest<{
      accessToken: string;
      refreshToken: string;
    }>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken: token }),
      skipAuth: true,
      skipRefresh: true,
    });
    persistTokens(session.accessToken, session.refreshToken);
    return session.accessToken;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      clearTokens();
    }
    return null;
  }
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const {
    accessToken,
    refreshToken,
    skipAuth = false,
    skipRefresh = false,
    headers,
    ...init
  } = options;

  const hdrs = new Headers(headers);
  hdrs.set("Accept", "application/json");
  if (init.body && !hdrs.has("Content-Type")) {
    hdrs.set("Content-Type", "application/json");
  }

  const bearer = skipAuth
    ? undefined
    : accessToken || getBrowserAccessToken() || undefined;
  if (bearer) {
    hdrs.set("Authorization", `Bearer ${bearer}`);
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: hdrs,
      cache: "no-store",
    });
  } catch {
    throw new ApiError(0, "NETWORK", "Impossible de joindre le serveur.");
  }

  if (response.status === 401 && !skipAuth && !skipRefresh) {
    const nextAccess = await rotateSession(refreshToken);
    if (nextAccess) {
      return apiRequest<T>(path, {
        ...options,
        accessToken: nextAccess,
        skipRefresh: true,
      });
    }
  }

  const payload = await readEnvelope<T>(response);
  if (!response.ok || payload.success === false) {
    const message =
      payload.error?.message ??
      (response.status === 429
        ? "Trop de requêtes. Réessayez dans un instant."
        : "Une erreur est survenue.");
    throw new ApiError(
      response.status,
      payload.error?.code ?? (response.status === 429 ? "RATE_LIMITED" : "ERROR"),
      message,
      payload.error?.details,
    );
  }

  return payload.data as T;
}

export function isAuthFailure(error: unknown): boolean {
  return (
    error instanceof ApiError &&
    (error.status === 401 ||
      error.code === "UNAUTHORIZED" ||
      error.code === "TOKEN_EXPIRED" ||
      error.code === "INVALID_TOKEN")
  );
}
