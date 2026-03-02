/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './app/tests/setupTests.ts',
    include: ['app/tests/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      include: ['app/**/*.{ts,tsx}'],
      exclude: ['app/tests/**', 'app/layout.tsx', 'app/providers.tsx'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
