import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { config } from "dotenv";
import { schema } from "./schema";

config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required");
}

// Create the connection
const client = postgres(process.env.DATABASE_URL, {
  prepare: false,
});

// Create the database instance with schema
export const db = drizzle(client, { schema });

// Export the client for closing connections if needed
export { client };
