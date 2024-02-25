import { defineConfig } from "vitest/config";
import { loadEnv } from "electron-vite";
import { resolve, join } from 'path'
import dotenv from 'dotenv';
import { expand } from 'dotenv-expand';

const env = dotenv.config({ path: join(__dirname, '..', '..', '.env') });
expand(env);

export default ({ mode }) => defineConfig({
  test: {
    include: ['src/renderer/__tests__/**/*.test.{ts,tsx}'],
    exclude: ['*'],
    globals: true,
    setupFiles: ['jest-dom.config.ts'],
    environment: 'jsdom',
    css: true
  },
  resolve: {
    alias: {
      '@renderer': resolve('src/renderer/src'),
      '@root': resolve('src'),
      '@assets': resolve('src/renderer/src/assets')
    }
  },
  define: defineEnv(mode, 'RENDERER_VITE_')
})

export const defineEnv = (mode: string, prefix: string | string[]) => {
  const vars = loadEnv(mode, join(__dirname, '..', '..'), prefix);
  return {
    'process.env': Object.entries(vars).reduce(
      (prev, [key, val]) => {
        return {
          ...prev,
          [key]: val,
        }
      },
      {},
    )
  }
};