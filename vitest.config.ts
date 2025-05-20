import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node', // หรือ 'jsdom' แล้วแต่โปรเจกต์
  },
  resolve: {
    alias: {
      '@thaitype/core-utils': path.resolve(__dirname, './src/index.ts'),
    },
  },
});