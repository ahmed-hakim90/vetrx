// The full set of registered client ids. Kept as a plain string list
// (rather than derived from `registry.ts`) so it can be imported by
// Node-side tooling (the Vite config's active-client virtual-module
// plugin) without pulling every `*.config.ts` file into that context.
export const CLIENT_IDS = ['voltix', 'apex', 'lumina', 'shams'] as const;
export type ClientId = (typeof CLIENT_IDS)[number];
