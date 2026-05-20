#!/usr/bin/env npx tsx
/**
 * List all users with tier = 'admin' (id, email, username, tier).
 *
 *   npx tsx scripts/list-admin-users.ts
 *   npx tsx scripts/list-admin-users.ts --email erikagodin6@gmail.com
 */
import "../server/load-env";
import { getPool } from "../server/db";

async function main() {
  const emailArgIdx = process.argv.indexOf("--email");
  const filterEmail =
    emailArgIdx >= 0 && process.argv[emailArgIdx + 1] ? process.argv[emailArgIdx + 1]!.trim().toLowerCase() : null;

  const pool = getPool();
  if (filterEmail) {
    const r = await pool.query(
      `SELECT id, email, username, tier FROM users WHERE lower(trim(email)) = $1`,
      [filterEmail],
    );
    console.log(JSON.stringify({ type: "user_by_email", count: r.rows.length, rows: r.rows }, null, 2));
  }

  const admins = await pool.query(
    `SELECT id, email, username, tier FROM users WHERE tier = 'admin' ORDER BY username`,
  );
  console.log(JSON.stringify({ type: "admin_users", count: admins.rows.length, rows: admins.rows }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
