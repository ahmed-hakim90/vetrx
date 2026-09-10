import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig, loadEnv, Plugin} from 'vite';
import {availableClientIds} from './src/config/clients/registry';
import {activeClientConfigPlugin, activeDemoCatalogPlugin} from './vite-plugins/activeClientConfig';

// Fails the build/dev-server immediately with a clear message if
// VITE_STORE_ID is missing or does not match a registered client — there is
// no silent fallback to the first client.
function requireValidStoreIdPlugin(storeId: string | undefined): Plugin {
  return {
    name: 'require-valid-store-id',
    configResolved() {
      if (!storeId || !storeId.trim()) {
        throw new Error(
          `Missing VITE_STORE_ID environment variable.\n\n` +
            `This storefront is a white-label template: exactly one client must be selected ` +
            `at build/run time. Set VITE_STORE_ID to one of: ${availableClientIds.join(', ')}.\n\n` +
            `Example: VITE_STORE_ID=voltix npm run dev`
        );
      }
      if (!availableClientIds.includes(storeId)) {
        throw new Error(
          `Unknown VITE_STORE_ID "${storeId}".\n\n` +
            `Available clients: ${availableClientIds.join(', ')}. ` +
            `There is no fallback client — fix VITE_STORE_ID before building or running the storefront.`
        );
      }
    },
  };
}

// LINT.IfChange(aistudio_media_plugin)
function aistudioMediaPlugin(): Plugin {
  return {
    name: 'vite-plugin-aistudio-media',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && req.url.startsWith('/assets/aistudio/')) {
          const rawPath = req.url.split('?')[0].split('#')[0];
          try {
            const decodedPath = decodeURIComponent(rawPath);
            const relativePath = decodedPath.replace(/^\//, '');
            const aistudioDir = path.resolve(
              __dirname,
              'public',
              'assets',
              'aistudio',
            );
            const filePath = path.resolve(__dirname, 'public', relativePath);
            if (
              filePath.startsWith(aistudioDir + path.sep) &&
              fs.existsSync(filePath) &&
              fs.statSync(filePath).isFile()
            ) {
              const ext = path.extname(filePath).toLowerCase();
              const mimeMap: Record<string, string> = {
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.png': 'image/png',
                '.gif': 'image/gif',
                '.webp': 'image/webp',
                '.svg': 'image/svg+xml',
                '.bmp': 'image/bmp',
                '.ico': 'image/x-icon',
                '.mp4': 'video/mp4',
                '.webm': 'video/webm',
                '.ogv': 'video/ogg',
                '.mp3': 'audio/mpeg',
                '.wav': 'audio/wav',
                '.ogg': 'audio/ogg',
                '.pdf': 'application/pdf',
              };
              res.setHeader(
                'Content-Type',
                mimeMap[ext] || 'application/octet-stream',
              );
              res.setHeader('Cache-Control', 'no-cache');
              fs.createReadStream(filePath).pipe(res);
              return;
            }
          } catch {
            // Fall through if URI decoding or file access fails
          }
        }
        next();
      });
    },
  };
}
// LINT.ThenChange(//depot/google3/java/com/google/alkali/boq/makersuite/applet_dev_service/templates/initializers/react_theme/vite.config.ts:aistudio_media_plugin)

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const storeId = env.VITE_STORE_ID || process.env.VITE_STORE_ID;
  // The active-client virtual-module plugin reads VITE_STORE_ID from
  // process.env (see vite-plugins/activeClientConfig.ts) — populate it here
  // for the common case where it only comes from a `.env.<mode>` file.
  if (storeId) process.env.VITE_STORE_ID = storeId;

  return {
    plugins: [
      requireValidStoreIdPlugin(storeId),
      activeClientConfigPlugin(),
      activeDemoCatalogPlugin(),
      react(),
      tailwindcss(),
      aistudioMediaPlugin(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
