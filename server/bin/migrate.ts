import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const migrate = async () => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    port: Number(process.env.PGPORT) || 5432,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    console.log("🚀 Starting database migration...");

    const schemaPath = join(__dirname, "../src/database/schema.sql");
    const schema = readFileSync(schemaPath, "utf8");

    await pool.query(schema);

    console.log("✅ Database migrated successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

migrate();
