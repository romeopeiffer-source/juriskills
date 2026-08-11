export type CookieChoice = "accepted" | "refused" | "essential";

export const COOKIE_CONSENT_KEY = "juriskills_cookie_consent";

export function getStoredConsent(): CookieChoice | null {
  if (typeof window === "undefined") return null;
  const fromStorage = window.localStorage.getItem(COOKIE_CONSENT_KEY);
  if (fromStorage === "accepted" || fromStorage === "refused" || fromStorage === "essential") {
    return fromStorage;
  }
  return null;
}

export function storeConsent(choice: CookieChoice) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(COOKIE_CONSENT_KEY, choice);
  const maxAge = 60 * 60 * 24 * 365;
  document.cookie = `${COOKIE_CONSENT_KEY}=${choice}; path=/; max-age=${maxAge}; SameSite=Lax`;
}
