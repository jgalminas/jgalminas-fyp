import path, { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr';
import htmlEnv from 'vite-plugin-html-env';
import dotenv from 'dotenv';
import { expand } from 'dotenv-expand';
import { chunkSplitPlugin } from 'vite-plugin-chunk-split';
import EnvironmentPlugin from 'vite-plugin-environment';

/**
* @type {import('electron-vite').UserConfig}
*/
export default ({ mode }) => {

  const env = dotenv.config({ path: path.join(__dirname, '..', '..', mode === 'production' ? '.env.production' : '.env') });
  expand(env);

  return defineConfig({
    main: {
      plugins: [externalizeDepsPlugin(), chunkSplitPlugin(), EnvironmentPlugin('all', { prefix: 'RENDERER_VITE_' })],
      envPrefix: 'RENDERER_VITE_',
      build: {
        minify: 'terser'
      },
    },
    preload: {
      plugins: [externalizeDepsPlugin(), chunkSplitPlugin(), EnvironmentPlugin('all', { prefix: 'RENDERER_VITE_' })],
      build: {
        minify: 'terser'
      },
      envPrefix: 'RENDERER_VITE_',
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
        EnvironmentPlugin('all', { prefix: 'RENDERER_VITE_' }),
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
