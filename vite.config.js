import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';


export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    headers: {
      'Cross-Origin-Embedder-Policy': 'cross-origin',
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
    },
    allowedHosts: [
      'localhost',
      'playcanvas.tenant-7654b5-asrpods.ord1.ingress.coreweave.cloud',
      'amjad-pod-frontend.tenant-7654b5-asrpods.ord1.ingress.coreweave.cloud',
      'hiryali.tenant-7654b5-asrpods.ord1.ingress.coreweave.cloud',
    ],
  },
});
