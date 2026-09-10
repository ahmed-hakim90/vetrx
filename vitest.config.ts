import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';
import { activeClientConfigPlugin, activeDemoCatalogPlugin } from './vite-plugins/activeClientConfig';

// The active-client/demo-catalog plugins resolve their virtual modules from
// process.env in the Vite process itself (not the test worker), so the
// default has to be set here as well as in `test.env` below. Override it per
// run with e.g. `VITE_STORE_ID=voltix npx vitest`.
process.env.VITE_STORE_ID = process.env.VITE_STORE_ID || 'shams';

export default defineConfig({
  plugins: [react(), activeClientConfigPlugin(), activeDemoCatalogPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  test: {
    // Only this app's tests. wordpress/ ships its own suite written for
    // Node's built-in runner (`node --test`), which vitest cannot collect.
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    // A white-label build always has exactly one client selected; tests that
    // exercise client-bound modules (active-client, the commerce provider)
    // run against Shams by default. Tests that need another value stub it
    // themselves with vi.stubEnv + vi.resetModules.
    env: {
      VITE_STORE_ID: 'shams',
    },
  },
});
