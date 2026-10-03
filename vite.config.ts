import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // the app lives at /play; the comic landing page in site/ sits at the root
  base: './',
  build: { outDir: 'dist/play' },
  plugins: [react()],
  define: {
    'global': 'window'
  },
  resolve: {
    alias: {
      buffer: 'buffer/',
      process: 'process/browser'
    }
  },
  optimizeDeps: {
    include: ['buffer']
  }
});
