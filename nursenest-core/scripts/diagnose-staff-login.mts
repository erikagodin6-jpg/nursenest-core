/**
 * Targeted diagnostics for staff/admin login against the database pointed to by DATABASE_URL.
 *
 * Does not print secrets. Optional password check uses STAFF_DIAGNOSE_PASSWORD (never logged).
 *
 * Usage:
 *   DATABASE_URL=... npx tsx scripts/diagnose-staff-login.mts admin@example.com
 *   STAFF_DIAGNOSE_PASSWORD='...' DATABASE_URL=... npx tsx scripts/diagnose-staff-login.mts admin@example.com
 *
 * Or (non-interactive email):
 *   STAFF_DIAGNOSE_EMAIL=admin@example.com STAFF_DIAGNOSE_PASSWORD='...' npx tsx scripts/diagnose-staff-login.mts
 */
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

import { databaseUrlSource } from "../src/lib/db/env-bootstrap";
import { isStaffRole, staffTierFromRole } from "../src/lib/auth/staff-roles";

if (!process.env.DATABASE_URL?.trim()) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

const prisma = new PrismaClient();

function argEmail(): string | undefined {
  const fromEnv = process.env.STAFF_DIAGNOSE_EMAIL?.trim();
  const fromArgv = process.argv[2]?.trim();
  return fromArgv || fromEnv || undefined;
}

async function main(): Promise<void> {
  const emailRaw = argEmail();
  if (!emailRaw?.includes("@")) {
    console.error("Provide an email: npx tsx scripts/diagnose-staff-login.mts <email>");
    process.exit(1);
  }
  const email = emailRaw.toLowerCase();

  console.log("--- NurseNest staff login diagnostics ---");
  console.log(`databaseUrlSource: ${databaseUrlSource}`);
  console.log(`lookup (case-insensitive): ${email.slice(0, 3)}***@${email.split("@")[1] ?? "?"}`);

  const row = await prisma.user.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
      passwordHash: true,
      credentialVersion: true,
      authProvider: true,
      emailVerified: true,
    },
  });

  if (!row) {
    console.log("user_found: no");
    console.log("password_hash_present: n/a");
    console.log("bcrypt_compare: n/a");
    console.log("staff_role_ok: n/a");
    console.log("staff_tier: n/a");
    console.log("\nNext: create a super admin (only when no staff exists) or fix email in DB.");
    return;
  }

  console.log("user_found: yes");
  console.log(`user_id_prefix: ${row.id.slice(0, 8)}…`);
  console.log(`email_stored_exactly: ${row.email}`);
  console.log(`username: ${row.username ?? "(null)"}`);
  console.log(`role: ${row.role}`);
  console.log(`credentialVersion: ${row.credentialVersion}`);
  console.log(`authProvider: ${row.authProvider}`);
  console.log(`emailVerified: ${row.emailVerified}`);

  const hashPresent = Boolean(row.passwordHash && row.passwordHash.length > 0);
  console.log(`password_hash_present: ${hashPresent ? "yes" : "no"}`);
  if (row.passwordHash) {
    console.log(`password_hash_length: ${row.passwordHash.length}`);
    console.log(`password_hash_prefix: ${row.passwordHash.slice(0, 4)}… (bcrypt)`);
  }

  const staffOk = isStaffRole(row.role);
  console.log(`staff_role_ok: ${staffOk ? "yes" : "no"}`);
  if (staffOk) {
    console.log(`staff_tier: ${staffTierFromRole(row.role)}`);
  } else {
    console.log(
      "staff_tier: n/a — JWT/session role is LEARNER; /admin uses DB role via getStaffSession()",
    );
    console.log("Fix: npx tsx scripts/admin-staff-users.mts promote <email>");
  }

  const probe = process.env.STAFF_DIAGNOSE_PASSWORD;
  if (probe !== undefined && probe.length > 0) {
    if (!row.passwordHash) {
      console.log("bcrypt_compare: skipped (no hash)");
    } else {
      const ok = await bcrypt.compare(probe, row.passwordHash);
      console.log(`bcrypt_compare: ${ok ? "success" : "failed"}`);
    }
  } else {
    console.log("bcrypt_compare: not_run (set STAFF_DIAGNOSE_PASSWORD to test hash)");
  }

  console.log("\n--- Interpretation ---");
  if (!hashPresent) {
    console.log("- Sign-in fails at authorize(): reason no_password_hash");
  }
  if (!staffOk) {
    console.log("- Sign-in may succeed, but /admin redirects to /app (role not staff in DB)");
  }
}

main()
  .catch((e) => {
    console.error(e instanceof Error ? e.message : String(e));
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
