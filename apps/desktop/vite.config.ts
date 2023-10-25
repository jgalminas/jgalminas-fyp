import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react';
import svgr from "vite-plugin-svgr";
import path from 'path';

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};

  return defineConfig({
    plugins: [svgr(), react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    clearScreen: false, // prevent vite from obscuring rust errors
    server: {
      proxy: {
        '/api': {
          target: process.env.VITE_API_URL,
          secure: false,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        }
      },
      port: 1420, // tauri expects a fixed port, fail if that port is not available
      strictPort: true,
    },
    // to make use of `TAURI_DEBUG` and other env variables
    envPrefix: ["VITE_", "TAURI_"]
  })
}