import path, { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr';
import htmlEnv from 'vite-plugin-html-env';
import dotenv from 'dotenv';
import { expand } from 'dotenv-expand';
import { chunkSplitPlugin } from 'vite-plugin-chunk-split';

const env = dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });
expand(env);

/**
* @type {import('electron-vite').UserConfig}
*/
export default () => {

  return defineConfig({
    main: {
      plugins: [externalizeDepsPlugin(), chunkSplitPlugin()],
      envPrefix: 'RENDERER_VITE_',
      build: {
        minify: 'terser'
      },
    },
    preload: {
      plugins: [externalizeDepsPlugin(), chunkSplitPlugin()],
      build: {
        minify: 'terser'
      },
    },
    renderer: {
      resolve: {
        alias: {
          '@renderer': resolve('src/renderer/src'),
          '@root': resolve('src'),
          '@assets': resolve('src/renderer/src/assets')
        }
      },
      build: {
        minify: 'terser'
      },
      plugins: [
        htmlEnv({
          prefix: '{{',
          suffix: '}}',
          envPrefixes: 'RENDERER_VITE_'
        }),
        svgr(),
        react(),
        chunkSplitPlugin({
          strategy: 'single-vendor',
          customChunk: (args) => {
            let { file } = args;
            if (file.startsWith('src/pages/')) {
              file = file.substring(4);
              file = file.replace(/\.[^.$]+$/, '');
              return file;
            }
            return null;
          },
        })
      ],
    }
  });
}
