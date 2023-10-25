import type { Config } from "drizzle-kit";
import env from "./src/env";

export default {
  schema: "./src/schema/*.ts",
  out: "./drizzle/generated",
  driver: "pg",
  dbCredentials: {
    connectionString: env.POSTGRESQL_CONNECTION_URI
  }
} satisfies Config;