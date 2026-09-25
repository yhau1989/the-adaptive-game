import { config } from "dotenv";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { rol, row_status } from "../src/schema";

config();

async function seed(): Promise<void> {
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL is not set in .env file");
    process.exit(1);
  }

  console.log("🌱 Seeding initial data...");
  console.log(
    "📡 Database URL format:",
    process.env.DATABASE_URL.replace(/\/\/[^:]+:[^@]+@/, "//***:***@")
  );

  try {
    const connection = postgres(process.env.DATABASE_URL, {
      max: 1,
      prepare: false,
      connect_timeout: 10,
    });
    const db = drizzle(connection, { casing: "snake_case" });

    await db
      .insert(row_status)
      .values([
        { status: "active" },
        { status: "inactive" },
        { status: "deleted" },
      ])
      .onConflictDoNothing();
    console.log("✅ tabla: (row_status) - datos iniciales insertados");

    await db.insert(rol).values([{ rol: "admin" }]).onConflictDoNothing();
    console.log("✅ tabla: (rol) - datos iniciales insertados");

    await connection.end({ timeout: 5 });
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:");
    console.error(error);
    process.exit(1);
  }
}

seed();
