import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { config } from "dotenv";
import * as schema from "./schema";

config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required");
}

/**
 * Database connection used by Drizzle migrations and seed scripts ONLY.
 *
 * En runtime, `apps/site` NO consume este cliente: lee y escribe vía
 * `@supabase/supabase-js` para que RLS aplique. Ver AGENTS.md §6.
 */
const client = postgres(process.env.DATABASE_URL, {
  prepare: false,
  // Node 26 admite TLS 1.3 por defecto; forzamos max menor para no agotar el pool.
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(client, { schema, casing: "snake_case" });

export { client };
