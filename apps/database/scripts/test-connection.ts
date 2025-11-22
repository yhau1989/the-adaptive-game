import { config } from "dotenv";
import postgres from "postgres";

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
    const sql = postgres(process.env.DATABASE_URL, {
      max: 1,
      prepare: false,
    });

    // Test simple query
    const result = await sql`SELECT NOW() as current_time`;
    console.log("✅ Database connection successful!");
    console.log("🕐 Server time:", result[0].current_time);

    // Close connection
    await sql.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Database connection failed:");
    console.error(error);
    process.exit(1);
  }
}

testConnection();
