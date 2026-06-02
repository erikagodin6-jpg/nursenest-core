#!/usr/bin/env npx tsx
/**
 * Create a new admin user (only if you have no account to recover). Uses bcrypt 12 rounds like the app.
 *
 *   npx tsx scripts/create-admin-user.ts --email you@example.com --password 'SecurePass!' [--username myadmin]
 *
 * Username defaults to local-part of email; must be unique.
 */
import "../server/load-env";
import bcrypt from "bcryptjs";
import { getPool } from "../server/db";

const BCRYPT_ROUNDS = 12;

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(name);
  if (i >= 0 && process.argv[i + 1]) return process.argv[i + 1];
  return undefined;
}

async function main() {
  const email = arg("--email");
  const password = arg("--password");
  if (!email || !password) {
    console.error(`Usage: npx tsx scripts/create-admin-user.ts --email <email> --password '<pw>' [--username <unique>]`);
    process.exit(1);
  }

  const normalizedEmail = email.trim().toLowerCase();
  let username = arg("--username")?.trim() || normalizedEmail.split("@")[0] || "admin";
  const hashed = await bcrypt.hash(password, BCRYPT_ROUNDS);

  const pool = getPool();
  const dup = await pool.query(`SELECT 1 FROM users WHERE lower(trim(email)) = $1 OR username = $2`, [
    normalizedEmail,
    username,
  ]);
  if (dup.rows.length > 0) {
    console.error("A user with this email or username already exists. Use scripts/set-user-password.ts instead.");
    process.exit(1);
  }

  const u = await pool.query(
    `INSERT INTO users (username, password, email, tier, subscription_status)
     VALUES ($1, $2, $3, 'admin', 'active')
     RETURNING id, username, email, tier`,
    [username, hashed, normalizedEmail],
  );
  console.log(JSON.stringify({ ok: true, created: u.rows[0] }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
