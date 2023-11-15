import path, { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin, loadEnv } from 'electron-vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr';

/**
* @type {import('electron-vite').UserConfig}
 */

export default ({ mode }) => {
  
  const env = loadEnv(mode, path.join(process.cwd(), '..', '..'), 'VITE'); 
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
      plugins: [externalizeDepsPlugin()]
    },
    preload: {
      plugins: [externalizeDepsPlugin()],
    },
    renderer: {
      resolve: {
        alias: {
          '@renderer': resolve('src/renderer/src')
        }
      },
      plugins: [svgr(), react()],
      define: processEnvValues,
    }
  });
}