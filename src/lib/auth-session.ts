export const ACCESS_COOKIE = "magani_access_token";
export const REFRESH_COOKIE = "magani_refresh_token";

export const ACCESS_MAX_AGE_SECONDS = 15 * 60;
export const REFRESH_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

function cookieFlags(maxAge: number): string {
  return `Path=/; Max-Age=${maxAge}; SameSite=Lax`;
}

export function getBrowserCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const prefix = `${name}=`;
  const match = document.cookie.split("; ").find((part) => part.startsWith(prefix));
  if (!match) return null;
  return decodeURIComponent(match.slice(prefix.length));
}

export function persistTokens(accessToken: string, refreshToken: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${ACCESS_COOKIE}=${encodeURIComponent(accessToken)}; ${cookieFlags(ACCESS_MAX_AGE_SECONDS)}`;
  document.cookie = `${REFRESH_COOKIE}=${encodeURIComponent(refreshToken)}; ${cookieFlags(REFRESH_MAX_AGE_SECONDS)}`;
}

export function clearTokens(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${ACCESS_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
  document.cookie = `${REFRESH_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function getBrowserAccessToken(): string | null {
  return getBrowserCookie(ACCESS_COOKIE);
}

export function getBrowserRefreshToken(): string | null {
  return getBrowserCookie(REFRESH_COOKIE);
}
