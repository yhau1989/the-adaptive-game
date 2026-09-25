import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required in .env file");
}

/**
 * Drizzle Kit configuration for the Adaptive Game schema.
 *
 * Drizzle Kit 0.31+ usa `dialect` y `dbCredentials` (sin cambios de nombre);
 * `driver` quedó deprecado. Para postgres-js en runtime seguimos usando
 * `drizzle-orm/postgres-js` (ver `src/db.ts`).
 *
 * Nota: este paquete solo DEFINE y MIGRA el esquema. Las queries en runtime
 * las hace `apps/site` a través de `@supabase/supabase-js` con RLS.
 */
export default defineConfig({
  schema: "./src/schema/*",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
  casing: "snake_case",
  schemaFilter: ["public"],
  tablesFilter: ["*"],
});
