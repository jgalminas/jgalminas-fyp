import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ['src/main/__tests__/**/*.test.ts'],
    exclude: ['*'],
    globals: true,
    environment: 'node'
  }
})