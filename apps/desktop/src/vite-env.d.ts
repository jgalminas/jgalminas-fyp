/// <reference types="vite/client" />

interface ImportMetaEnv {
  RENDERER_VITE_APP_URL: string,
  RENDERER_VITE_VIDEO_SERVER_URL: string,
  RENDERER_VITE_API_URL: string,
  RENDERER_VITE_PORT: string,
  RENDERER_VITE_SOCKET_URL: string,
  RENDERER_VITE_CDN_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
