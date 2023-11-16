import path, { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin, loadEnv } from 'electron-vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr';
import htmlEnv from 'vite-plugin-html-env';

/**
* @type {import('electron-vite').UserConfig}
 */

export default ({ mode }) => {
  
  const env = loadEnv(mode, path.join(__dirname, '..', '..'), 'VITE'); 
  const processEnvValues = {
    'process.env': Object.entries(env).reduce(
      (prev, [key, val]) => {
        return {
          ...prev,
          [key]: val,
        }
      },
      {},
    )
  }

  process.env = { ...process.env, ...env };

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
          suffix: '}}'
        }),
        svgr(),
        react()
      ],
      define: processEnvValues
    }
  });
}