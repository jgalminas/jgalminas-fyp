import { z } from "zod";

export const webEnvSchema = z.object({
  // URLS
  VITE_PORT: z.string(),
  VITE_APP_URL: z.string(),
  VITE_API_URL: z.string(),
});

export const apiEnvSchema = z.object({
  SECRET: z.string(),

  WEB_URL: z.string(),
  API_URL: z.string(),

  JWT_SECRET_TOKEN: z.string(),

  // DATABASE
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DB: z.string(),
  POSTGRES_URL: z.string(),
  POSTGRESQL_CONNECTION_URI: z.string(),

  // DATABASE
  MONGODB_USER: z.string(),
  MONGODB_PASS: z.string(),
  MONGODB_CONNECTION_STRING: z.string(),
  MONGODB_PORT: z.string(),
  MONGODB_DATABASE: z.string()
});