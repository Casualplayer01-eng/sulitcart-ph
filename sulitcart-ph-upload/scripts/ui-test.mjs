/**
 * Interactive UI test runner (jsdom, no browser needed):
 * bundles the JSX entry with esbuild and executes real click flows.
 * Run with: npm run ui
 */
import { build } from 'esbuild';
import { mkdirSync } from 'node:fs';

mkdirSync('node_modules/.smoke', { recursive: true });

await build({
  entryPoints: ['scripts/ui-test-entry.jsx'],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  jsx: 'automatic',
  external: ['jsdom'],
  outfile: 'node_modules/.smoke/ui-test.cjs',
  logLevel: 'silent',
});

await import('../node_modules/.smoke/ui-test.cjs');
