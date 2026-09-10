import '@testing-library/jest-dom/vitest';

// This jsdom environment ships a non-functional Web Storage stub (writes are
// dropped and `clear()` is missing), which every storage-backed feature —
// cart, wishlist, language preference, demo orders — depends on. Install a
// minimal in-memory implementation when that's the case, so tests exercise
// the real read/write paths instead of silently reading fallbacks.
function installMemoryStorage(key: 'localStorage' | 'sessionStorage') {
  const existing = window[key] as Storage | undefined;
  const works = (() => {
    try {
      if (!existing || typeof existing.clear !== 'function') return false;
      existing.setItem('__probe__', '1');
      const ok = existing.getItem('__probe__') === '1';
      existing.removeItem('__probe__');
      return ok;
    } catch {
      return false;
    }
  })();
  if (works) return;

  const store = new Map<string, string>();
  const storage: Storage = {
    get length() {
      return store.size;
    },
    clear: () => store.clear(),
    getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
    key: (index: number) => Array.from(store.keys())[index] ?? null,
    removeItem: (k: string) => void store.delete(k),
    setItem: (k: string, v: string) => void store.set(k, String(v)),
  };

  Object.defineProperty(window, key, { value: storage, configurable: true, writable: true });
}

installMemoryStorage('localStorage');
installMemoryStorage('sessionStorage');
