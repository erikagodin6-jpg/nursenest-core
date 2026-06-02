/**
 * Set a new bcrypt password for an existing user (by email). Increments credentialVersion to invalidate old JWTs.
 *
 * Safety:
 * - Does not print the password.
 * - By default only targets users who already have a staff role (ADMIN, SUPER_ADMIN, …).
 *   Set STAFF_PASSWORD_RESET_ALLOW_LEARNER=1 to reset a learner account (emergency unlock only).
 *
 * Password source (first match):
 *   STAFF_PASSWORD_RESET — non-interactive (avoid shell history; prefer stdin in production)
 *   stdin — one line (use: `printf '%s' 'newpass' | npx tsx ...`)
 *
 * Usage:
 *   DATABASE_URL=... npx tsx scripts/reset-staff-user-password.mts admin@example.com
 *   STAFF_PASSWORD_RESET='...' DATABASE_URL=... npx tsx scripts/reset-staff-user-password.mts admin@example.com
 */
import { createInterface } from "node:readline";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

import "../src/lib/db/script-env-bootstrap";
import { isStaffRole } from "../src/lib/auth/staff-roles";
import { strongPasswordSchema } from "../src/lib/auth/password-policy";

const prisma = new PrismaClient();

async function readPasswordFromStdin(): Promise<string> {
  return await new Promise((resolve, reject) => {
    const rl = createInterface({ input: process.stdin, terminal: false });
    let buf = "";
    rl.on("line", (line) => {
      buf = line;
      rl.close();
    });
    rl.on("close", () => resolve(buf));
    rl.on("error", reject);
  });
}

async function main(): Promise<void> {
  const emailArg = process.argv[2]?.trim().toLowerCase();
  if (!emailArg?.includes("@")) {
    console.error("Usage: npx tsx scripts/reset-staff-user-password.mts <email>");
    process.exit(1);
  }

  const user = await prisma.user.findFirst({
    where: { email: { equals: emailArg, mode: "insensitive" } },
    select: { id: true, email: true, role: true },
  });
  if (!user) {
    console.error(`No user found for email (case-insensitive): ${emailArg}`);
    process.exit(1);
  }

  const allowLearner = process.env.STAFF_PASSWORD_RESET_ALLOW_LEARNER === "1";
  if (!isStaffRole(user.role) && !allowLearner) {
    console.error(
      `User ${user.email} has role ${user.role} (not staff). Refusing. To override: STAFF_PASSWORD_RESET_ALLOW_LEARNER=1`,
    );
    process.exit(1);
  }

  let plain = process.env.STAFF_PASSWORD_RESET?.trim();
  if (!plain) {
    plain = (await readPasswordFromStdin()).trim();
  }
  if (!plain) {
    console.error("No password provided (set STAFF_PASSWORD_RESET or pipe one line on stdin).");
    process.exit(1);
  }

  const parsed = strongPasswordSchema.safeParse(plain);
  if (!parsed.success) {
    console.error(parsed.error.issues[0]?.message ?? "Invalid password");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(plain, 12);
  // Scrub local reference (best-effort; cannot force GC)
  plain = "";

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      credentialVersion: { increment: 1 },
    },
    select: { email: true, credentialVersion: true },
  });

  console.log(`OK — password updated for ${updated.email}`);
  console.log(`credentialVersion is now ${updated.credentialVersion}.`);
  console.log("User should sign in again with the new password.");
}

main()
  .catch((e) => {
    console.error(e instanceof Error ? e.message : String(e));
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
