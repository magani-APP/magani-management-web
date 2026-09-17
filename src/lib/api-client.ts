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

/**
 * Message générique, professionnel, affiché au public quel que soit le type
 * d'erreur technique reçu du serveur (base de données injoignable, exception
 * non gérée, timeout, etc.). On ne montre jamais de stack trace, de nom de
 * classe (PrismaClientKnownRequestError...) ou de chemin de fichier à
 * l'utilisateur final.
 */
const GENERIC_PUBLIC_ERROR_MESSAGE = "Une erreur est survenue. Veuillez réessayer.";

const MAINTENANCE_PUBLIC_ERROR_MESSAGE =
  "Le service est temporairement indisponible. Réessayez dans quelques instants.";

/**
 * Détecte les messages d'erreur "bruts" qui ne devraient jamais être exposés
 * tels quels à un utilisateur (traces Prisma/SQL, chemins de fichiers,
 * exceptions non catchées côté serveur, etc.).
 */
function looksLikeTechnicalError(message: string): boolean {
  if (!message) return false;
  if (message.length > 180) return true;

  const technicalPatterns = [
    /prisma/i,
    /invalid `/i,
    /at `?[\w.-]+:\d+:\d+/i,
    /\.(ts|js|tsx|jsx):\d+/i,
    /stack trace/i,
    /unhandled/i,
    /internal server error/i,
    /sqlstate/i,
    /econnrefused/i,
    /column .* does not exist/i,
    /relation .* does not exist/i,
    /\n/, // un message multi-lignes n'est jamais un message métier
  ];

  return technicalPatterns.some((pattern) => pattern.test(message));
}

/**
 * Construit le message à afficher à l'utilisateur : les messages métier
 * (validations, conflits, droits...) renvoyés volontairement par l'API
 * passent tels quels ; tout le reste (erreurs serveur, exceptions brutes)
 * est remplacé par un message professionnel générique.
 */
function toPublicErrorMessage(status: number, rawMessage: string | undefined): string {
  if (status === 0) return "Impossible de joindre le serveur. Vérifiez votre connexion.";
  if (status === 429) return "Trop de requêtes. Réessayez dans un instant.";
  if (status >= 500) return MAINTENANCE_PUBLIC_ERROR_MESSAGE;

  if (!rawMessage || looksLikeTechnicalError(rawMessage)) {
    return GENERIC_PUBLIC_ERROR_MESSAGE;
  }

  return rawMessage;
}

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
    const publicMessage = toPublicErrorMessage(response.status, payload.error?.message);

    if (process.env.NODE_ENV !== "production" && payload.error?.message !== publicMessage) {
      // Le message technique reste visible en développement pour déboguer,
      // sans jamais être exposé à l'utilisateur final. On utilise `warn`
      // (et non `error`) car Next.js affiche un overlay "Runtime Error"
      // intrusif pour tout console.error en dev, alors que cette erreur
      // est déjà correctement interceptée et gérée ci-dessous.
      console.warn("[API]", path, payload.error?.message);
    }

    throw new ApiError(
      response.status,
      payload.error?.code ?? (response.status === 429 ? "RATE_LIMITED" : "ERROR"),
      publicMessage,
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
