import { config } from "dotenv";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { rol, row_status } from "../src/schema";

config();

async function testConnection() {
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL is not set in .env file");
    process.exit(1);
  }

  console.log("🔍 Testing database connection...");
  console.log(
    "📡 Database URL format:",
    process.env.DATABASE_URL.replace(/\/\/[^:]+:[^@]+@/, "//***:***@")
  );

  try {
    const connection = postgres(process.env.DATABASE_URL, {
      max: 1,
      prepare: false,
    });
    const db = drizzle(connection);

    await db
      .insert(row_status)
      .values([
        { status: "active" },
        { status: "inactive" },
        { status: "deleted" },
      ]);
    console.log("✅ tabla: (row_status) - datos iniciales insertados");

    await db.insert(rol).values([{ rol: "admin" }]);
    console.log("✅ tabla: (rol) - datos iniciales insertados");

    // Close connection
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Database connection failed:");
    console.error(error);
    process.exit(1);
  }
}

testConnection();
