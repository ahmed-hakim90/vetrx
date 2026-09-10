import type { Plugin } from 'vite';
import path from 'node:path';
import { CLIENT_IDS } from '../src/config/clients/clientIds';

function toPosixPath(absPath: string): string {
  return absPath.split(path.sep).join('/');
}

const CONFIG_VIRTUAL_ID = 'virtual:active-client-config';
const RESOLVED_CONFIG_VIRTUAL_ID = '\0' + CONFIG_VIRTUAL_ID;

// A single client's bundle must never contain another client's brand
// names, currencies, or market copy (see docs/SHAMS-LAUNCH-CHECKLIST.md —
// verified by grepping a build's output for other clients' terms). Rather
// than statically import all four `*.config.ts` files and trust a
// minifier to tree-shake the unused three back out, this plugin generates
// the body of a virtual module at build/dev-server-start time containing
// only ONE re-export — the config selected by VITE_STORE_ID. The other
// three config files are never part of the module graph in the first
// place, so there is nothing for any bundler pass to fail to remove.
export function activeClientConfigPlugin(): Plugin {
  return {
    name: 'active-client-config',
    resolveId(id) {
      if (id !== CONFIG_VIRTUAL_ID) return;
      // Suffixing the resolved id with the *current* env value means a
      // changed VITE_STORE_ID (e.g. between test cases that stub the env
      // var) resolves to a genuinely different module id, so it can never
      // reuse another value's cached `load()` result — important for
      // active-client.test.ts, which re-imports this module under several
      // different VITE_STORE_ID values within one process.
      const storeId = process.env.VITE_STORE_ID ?? '';
      return `${RESOLVED_CONFIG_VIRTUAL_ID}:${storeId}`;
    },
    load(id) {
      if (!id.startsWith(RESOLVED_CONFIG_VIRTUAL_ID + ':')) return;
      const storeId = id.slice((RESOLVED_CONFIG_VIRTUAL_ID + ':').length);

      if (!storeId || !(CLIENT_IDS as readonly string[]).includes(storeId)) {
        // active-client.ts performs its own validation with a clearer,
        // user-facing error message — this only needs to not crash module
        // resolution before that check runs.
        return 'export const activeClientConfig = undefined;';
      }

      const configPath = toPosixPath(path.resolve(process.cwd(), 'src/config/clients', `${storeId}.config.ts`));
      return `export { ${storeId}Config as activeClientConfig } from '${configPath}';`;
    },
  };
}

const CATALOG_VIRTUAL_ID = 'virtual:active-demo-catalog';
const RESOLVED_CATALOG_VIRTUAL_ID = '\0' + CATALOG_VIRTUAL_ID;

// Shams ships a fully separate demo dataset (src/data/demo/shams/*) and
// must never pull in src/data/mockData.ts, which holds the voltix/apex/
// lumina demo catalog (including Gulf-market copy: GCC warranty text,
// AED/SAR pricing, Dubai/Riyadh delivery mentions). voltix/apex/lumina
// intentionally continue to share that one file, filtered by `storeId` —
// only Shams needs isolating.
export function activeDemoCatalogPlugin(): Plugin {
  return {
    name: 'active-demo-catalog',
    resolveId(id) {
      if (id !== CATALOG_VIRTUAL_ID) return;
      const storeId = process.env.VITE_STORE_ID ?? '';
      return `${RESOLVED_CATALOG_VIRTUAL_ID}:${storeId}`;
    },
    load(id) {
      if (!id.startsWith(RESOLVED_CATALOG_VIRTUAL_ID + ':')) return;
      const storeId = id.slice((RESOLVED_CATALOG_VIRTUAL_ID + ':').length);

      if (storeId === 'shams') {
        const productsPath = toPosixPath(path.resolve(process.cwd(), 'src/data/demo/shams/products.ts'));
        const categoriesPath = toPosixPath(path.resolve(process.cwd(), 'src/data/demo/shams/categories.ts'));
        return (
          `export { SHAMS_PRODUCTS as ACTIVE_PRODUCTS } from '${productsPath}';\n` +
          `export { SHAMS_CATEGORIES as ACTIVE_CATEGORIES } from '${categoriesPath}';\n`
        );
      }

      // voltix / apex / lumina / an unrecognized id (validated elsewhere) —
      // fall back to the shared Gulf-clients demo catalog, unchanged.
      const mockDataPath = toPosixPath(path.resolve(process.cwd(), 'src/data/mockData.ts'));
      return `export { PRODUCTS as ACTIVE_PRODUCTS, CATEGORIES as ACTIVE_CATEGORIES } from '${mockDataPath}';`;
    },
  };
}
