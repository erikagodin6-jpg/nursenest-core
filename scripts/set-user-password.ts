#!/usr/bin/env npx tsx
/**
 * Set a user's password in Postgres using the same algorithm as server/admin-auth.ts
 * (bcryptjs, 12 rounds). Optionally grant admin tier.
 *
 * Usage:
 *   npx tsx scripts/set-user-password.ts --email you@example.com --password 'Admin123!'
 *   npx tsx scripts/set-user-password.ts --email you@example.com --password 'Admin123!' --admin
 *
 * Requires DATABASE_URL (or your env as used by server/load-env + server/db).
 */
import "../server/load-env";
import bcrypt from "bcryptjs";
import { getPool } from "../server/db";

/** Must match server/admin-auth.ts */
const BCRYPT_ROUNDS = 12;

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(name);
  if (i >= 0 && process.argv[i + 1]) return process.argv[i + 1];
  return undefined;
}

async function main() {
  const email = arg("--email");
  const password = arg("--password");
  const grantAdmin = process.argv.includes("--admin");

  if (!email || !password) {
    console.error(`
Usage:
  npx tsx scripts/set-user-password.ts --email <email> --password '<plaintext>' [--admin]

--admin   Also sets tier = 'admin' (same table; admins are users with tier admin).
`);
    process.exit(1);
  }

  const normalized = email.trim().toLowerCase();
  const hashed = await bcrypt.hash(password, BCRYPT_ROUNDS);

  const pool = getPool();
  const sel = await pool.query(`SELECT id, username, tier, email FROM users WHERE lower(trim(email)) = $1`, [normalized]);
  if (sel.rows.length === 0) {
    console.error(`No user found with email: ${normalized}`);
    process.exit(1);
  }

  const u = sel.rows[0] as { id: string; username: string; tier: string; email: string };
  if (grantAdmin) {
    await pool.query(`UPDATE users SET password = $1, tier = 'admin' WHERE id = $2`, [hashed, u.id]);
    console.log(`Updated password and set tier=admin for ${u.username} (${u.email}) id=${u.id}`);
  } else {
    await pool.query(`UPDATE users SET password = $1 WHERE id = $2`, [hashed, u.id]);
    console.log(`Updated password for ${u.username} (${u.email}) id=${u.id} tier=${u.tier}`);
  }
  console.log("You can log in with that email (or username) and the new password.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
