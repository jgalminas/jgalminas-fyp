import { z } from "zod";

export const webEnvSchema = z.object({
  // URLS
  RENDERER_VITE_CDN_URL: z.string(),
  RENDERER_VITE_PORT: z.string(),
  RENDERER_VITE_APP_URL: z.string(),
  RENDERER_VITE_API_URL: z.string(),
  RENDERER_VITE_SOCKET_URL: z.string()
});

export const serverEnvSchema = z.object({
  SECRET: z.string(),

  WEB_URL: z.string(),
  API_URL: z.string(),
  RIOT_KEY: z.string(),

  AI_PATH: z.string(),

  MODE: z.string(),

  // DATABASE
  MONGODB_USER: z.string(),
  MONGODB_PASS: z.string(),
  MONGODB_CLUSTER: z.string(),
  MONGODB_CONNECTION_STRING: z.string(),
  MONGODB_PORT: z.string(),
  MONGODB_DATABASE: z.string()
});