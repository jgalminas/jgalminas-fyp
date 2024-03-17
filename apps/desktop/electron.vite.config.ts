import path, { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin, splitVendorChunkPlugin } from 'electron-vite'
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
export default () => {

  return defineConfig({
    main: {
      plugins: [externalizeDepsPlugin(), splitVendorChunkPlugin()],
      envPrefix: 'RENDERER_VITE_'
    },
    preload: {
      plugins: [externalizeDepsPlugin(), splitVendorChunkPlugin()],
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
        react(),
        splitVendorChunkPlugin()
      ],
    }
  });
}
