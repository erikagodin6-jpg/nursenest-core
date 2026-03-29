#!/usr/bin/env node
import pg from "pg";

const connectionString = process.env.DATABASE_URL || process.env.PROD_DATABASE_URL;

if (!connectionString) {
  console.error("DB CHECK FAILED: DATABASE_URL/PROD_DATABASE_URL is not set.");
  process.exit(1);
}

const pool = new pg.Pool({
  connectionString,
  connectionTimeoutMillis: 5000,
  statement_timeout: 5000,
  ssl: /render\.com|supabase\.co|neon\.tech|railway\.app|amazonaws\.com|azure\.com|ondigitalocean\.com/i.test(
    connectionString,
  )
    ? { rejectUnauthorized: false }
    : false,
});

try {
  await pool.query("SELECT 1");
  console.log("DB OK");
  await pool.end();
  process.exit(0);
} catch (err) {
  const msg = err instanceof Error ? err.message : String(err);
  console.error(`DB CHECK FAILED: ${msg}`);
  try {
    await pool.end();
  } catch {}
  process.exit(1);
}
