import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    pool: 'threads',
    maxWorkers: 2,
    minWorkers: 1,
    setupFiles: ['./src/test-setup.ts'],
  },
});
