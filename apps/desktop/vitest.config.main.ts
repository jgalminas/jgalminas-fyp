import { defineConfig } from "vitest/config";
import { loadEnv } from "electron-vite";
import { join } from 'path'
import dotenv from 'dotenv';
import { expand } from 'dotenv-expand';

const env = dotenv.config({ path: join(__dirname, '..', '..', '.env') });
expand(env);

export default ({ mode }) => defineConfig({
  test: {
    include: [
      'src/main/(__tests__|__mocks__)/**/*.test.ts'
    ],
    exclude: ['*'],
    globals: true,
    environment: 'node'
  },
  define: defineEnv(mode, 'RENDERER_VITE_')
})

const defineEnv = (mode: string, prefix: string | string[]) => {
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