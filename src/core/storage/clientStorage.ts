// Namespaced, versioned localStorage helpers for non-sensitive UI state
// (cart, wishlist, preferences). Every key is scoped by clientId so that
// switching VITE_STORE_ID on the same browser/origin — e.g. a developer
// testing voltix then apex on localhost:3000 — never leaks one client's
// cart or wishlist into another's.
const STORAGE_VERSION = 1;

function buildKey(clientId: string, key: string): string {
  return `ecommerce:${clientId}:${key}`;
}

export function readClientStorage<T>(clientId: string, key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(buildKey(clientId, key));
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || parsed.version !== STORAGE_VERSION) {
      return fallback;
    }
    return parsed.value as T;
  } catch {
    // Corrupted or foreign data in this slot — never let it crash the app.
    return fallback;
  }
}

export function writeClientStorage<T>(clientId: string, key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(
      buildKey(clientId, key),
      JSON.stringify({ version: STORAGE_VERSION, value })
    );
  } catch {
    // Storage full or disabled (private browsing) — non-fatal, state just
    // won't persist across reloads.
  }
}
