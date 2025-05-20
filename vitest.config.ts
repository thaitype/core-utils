import { defineConfig } from 'vitest/config';
import path from 'path';

const aliasEntries = [
  ['@thaitype/core-utils', './src/index.ts'],
  ['@thaitype/core-utils/error', './src/error/index.ts'],
  ['@thaitype/core-utils/logger', './src/logger/index.ts'],
  ['@thaitype/core-utils/middleware', './src/middleware/index.ts'],
];

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
  },
  resolve: {
    alias: Object.fromEntries(
      aliasEntries.map(([alias, relPath]) => [alias, path.resolve(__dirname, relPath)])
    ),
  },
});