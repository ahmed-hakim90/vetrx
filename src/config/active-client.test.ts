import { describe, it, expect, beforeEach, vi } from 'vitest';

// active-client.ts resolves VITE_STORE_ID at module-evaluation time, so each
// scenario needs a fresh module registry with the env var set beforehand.
//
// Note: which config a *valid* VITE_STORE_ID resolves to is no longer unit
// -tested here. It's produced by a Vite plugin (vite-plugins/
// activeClientConfig.ts) that generates a virtual module re-exporting only
// the one config file selected by VITE_STORE_ID — by design there is no
// runtime branch to unit-test, and that is exactly what keeps one client's
// bundle free of every other client's brand names (verified by grepping a
// real `npm run build:<client>` output, not by a unit test). Each config's
// own `id` field matching its registry key is covered by registry.test.ts.
describe('active-client resolution', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  it('throws a clear error when VITE_STORE_ID is missing', async () => {
    vi.stubEnv('VITE_STORE_ID', '');
    await expect(import('./active-client')).rejects.toThrow(/Missing VITE_STORE_ID/);
  });

  it('throws a clear error when VITE_STORE_ID does not match a registered client, with no silent fallback', async () => {
    vi.stubEnv('VITE_STORE_ID', 'not-a-real-client');
    await expect(import('./active-client')).rejects.toThrow(/Unknown VITE_STORE_ID/);
  });
});
