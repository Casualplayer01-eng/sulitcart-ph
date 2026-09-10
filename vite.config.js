import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Localhost-only demo app. Host is enabled so the sandbox preview can reach it.
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    // The app is localhost-only; this just lets the sandbox live-preview reach it.
    allowedHosts: true,
  },
});
