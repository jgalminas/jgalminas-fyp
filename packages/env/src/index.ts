import { z } from "zod";

export const webEnvSchema = z.object({
  // URLS
  RENDERER_VITE_PORT: z.string(),
  RENDERER_VITE_APP_URL: z.string(),
  RENDERER_VITE_API_URL: z.string()
});

export const apiEnvSchema = z.object({
  SECRET: z.string(),

  WEB_URL: z.string(),
  API_URL: z.string(),

  MODE: z.string(),

  JWT_SECRET_TOKEN: z.string(),

  // DATABASE
  MONGODB_USER: z.string(),
  MONGODB_PASS: z.string(),
  MONGODB_CLUSTER: z.string(),
  MONGODB_CONNECTION_STRING: z.string(),
  MONGODB_PORT: z.string(),
  MONGODB_DATABASE: z.string()
});