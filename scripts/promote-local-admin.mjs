import fs from "node:fs";
import pg from "pg";

const env = fs.readFileSync(".env", "utf8");
const m = env.match(/^DATABASE_URL=(.+)$/m);
if (!m) {
  throw new Error("DATABASE_URL missing in .env");
}
const userId = process.argv[2];
if (!userId) {
  throw new Error("Usage: node scripts/promote-local-admin.mjs <userId>");
}

const pool = new pg.Pool({
  connectionString: m[1].trim(),
  ssl: { rejectUnauthorized: false },
});

await pool.query(
  "UPDATE users SET tier='admin', admin_role='super_admin' WHERE id=$1",
  [userId],
);
await pool.end();
console.log(`promoted:${userId}`);
