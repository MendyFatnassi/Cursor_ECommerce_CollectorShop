import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  base: '/', 
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, '../src/components'),
      '@api': path.resolve(__dirname, '../src/api'),
      '@shared': path.resolve(__dirname, '../src/types'),
      '@store': path.resolve(__dirname, '../src/store')
    }
  },
  preview: {
    port: 8080,
    strictPort: true,
   },
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  },
  css: {
    postcss: './postcss.config.js'
  }
});




