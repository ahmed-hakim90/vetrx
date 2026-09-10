/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STORE_ID: string;
  readonly VITE_WOOCOMMERCE_BASE_URL?: string;
  readonly VITE_WOOCOMMERCE_CONSUMER_KEY_VAR?: string;
  readonly VITE_WOOCOMMERCE_CONSUMER_SECRET_VAR?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// See vite-plugins/activeClientConfig.ts — generated at build/dev-server
// time to re-export only the one client config selected by VITE_STORE_ID.
declare module 'virtual:active-client-config' {
  const activeClientConfig: unknown;
  export { activeClientConfig };
}

// See vite-plugins/activeClientConfig.ts — generated at build/dev-server
// time to re-export only the demo catalog for the active client (Shams's
// own separate dataset, or the shared voltix/apex/lumina one).
declare module 'virtual:active-demo-catalog' {
  import type { Product, Category } from './types/store';
  const ACTIVE_PRODUCTS: Product[];
  const ACTIVE_CATEGORIES: Category[];
  export { ACTIVE_PRODUCTS, ACTIVE_CATEGORIES };
}
