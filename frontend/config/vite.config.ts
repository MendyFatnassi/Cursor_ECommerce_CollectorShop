import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const apiTarget = process.env.VITE_API_URL || 'http://localhost:8080';
const coverageProfile = process.env.COVERAGE_PROFILE ?? 'business';
const coverageTargets =
  coverageProfile === 'infra'
    ? {
        include: ['src/api/**', 'src/store/**', 'src/main.tsx'],
        thresholds: {
          lines: 60
        }
      }
    : {
        include: ['src/components/**', 'src/App.tsx'],
        thresholds: {
          lines: 80
        }
      };

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
        target: apiTarget,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  },
  css: {
    postcss: './postcss.config.js'
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'src/**/*.spec.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      all: true,
      include: coverageTargets.include,
      exclude: ['src/**/*.d.ts', 'src/test/**', 'src/**/*.stories.*'],
      thresholds: coverageTargets.thresholds
    }
  }
});




