/**
 * Bundles the JSX smoke entry with esbuild (already a Vite dependency)
 * and runs it in Node: npm run smoke
 */
import { build } from 'esbuild';
import { mkdirSync } from 'node:fs';

mkdirSync('node_modules/.smoke', { recursive: true });

await build({
  entryPoints: ['scripts/smoke-entry.jsx'],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  jsx: 'automatic',
  outfile: 'node_modules/.smoke/smoke.cjs',
  logLevel: 'silent',
});

await import('../node_modules/.smoke/smoke.cjs');
