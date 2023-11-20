import path, { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin, loadEnv } from 'electron-vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr';
import htmlEnv from 'vite-plugin-html-env';
import dotenv from 'dotenv';
import { expand } from 'dotenv-expand';

const env = dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });
expand(env);

/**
* @type {import('electron-vite').UserConfig}
*/
export default ({ mode }) => {

  return defineConfig({
    main: {
      plugins: [externalizeDepsPlugin()],
    },
    preload: {
      plugins: [externalizeDepsPlugin()],
    },
    renderer: {
      resolve: {
        alias: {
          '@renderer': resolve('src/renderer/src'),
          '@root': resolve('src'),
          '@assets': resolve('src/renderer/src/assets')
        }
      },
      plugins: [
        htmlEnv({
          prefix: '{{',
          suffix: '}}',
          envPrefixes: 'RENDERER_VITE_'
        }),
        svgr(),
        react()
      ],
      define: defineEnv(mode, 'RENDERER_VITE_')
    }
  });
}

export const defineEnv = (mode: string, prefix: string | string[]) => {
  const vars = loadEnv(mode, path.join(__dirname, '..', '..'), prefix);
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