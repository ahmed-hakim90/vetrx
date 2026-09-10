import { ClientConfig, parseClientConfig } from './schema';
import { voltixConfig } from './voltix.config';
import { apexConfig } from './apex.config';
import { luminaConfig } from './lumina.config';
import { shamsConfig } from './shams.config';

const rawRegistry: Record<string, unknown> = {
  voltix: voltixConfig,
  apex: apexConfig,
  lumina: luminaConfig,
  shams: shamsConfig,
};

// Validate every registered config eagerly so a broken config file fails
// fast (at import time) instead of silently reaching production.
export const clientRegistry: Record<string, ClientConfig> = Object.fromEntries(
  Object.entries(rawRegistry).map(([id, raw]) => [id, parseClientConfig(raw, `${id}.config.ts`)])
);

export const availableClientIds = Object.keys(clientRegistry);
