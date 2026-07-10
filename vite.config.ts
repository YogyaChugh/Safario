import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/Safario/',
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
