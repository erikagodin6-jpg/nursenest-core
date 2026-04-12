/**
 * Reset the password for an admin user by email.
 *
 * Usage:
 *   npx tsx scripts/reset-admin.ts --email=you@example.com --password='NewPass1'
 *
 * Password must be at least 8 characters and include a letter and a number.
 * The user's role is promoted to SUPER_ADMIN if it was a lower role.
 * Existing sessions are invalidated (credentialVersion bumped).
 */
import "../src/lib/db/env-bootstrap";

import { hash } from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function parseArgs(): { email: string; password: string } {
  const args: Record<string, string> = {};
  for (const a of process.argv.slice(2)) {
    const m = /^--([\w-]+)=(.+)$/.exec(a);
    if (m) args[m[1]] = m[2];
  }
  const email = (args.email ?? process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
  const password = args.password ?? process.env.ADMIN_PASSWORD ?? "";
  return { email, password };
}

function validatePassword(pw: string): string | null {
  if (pw.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Za-z]/.test(pw)) return "Password must include a letter.";
  if (!/[0-9]/.test(pw)) return "Password must include a number.";
  return null;
}

async function main() {
  const { email, password } = parseArgs();

  if (!email || !email.includes("@")) {
    console.error("Error: provide --email=you@example.com");
    console.error("Usage: npx tsx scripts/reset-admin.ts --email=you@example.com --password='NewPass1'");
    process.exit(1);
  }

  const pwErr = validatePassword(password);
  if (pwErr) {
    console.error(`Error: ${pwErr}`);
    process.exit(1);
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, username: true, role: true },
  });

  if (!user) {
    console.error(`Error: No user found with email "${email}"`);
    console.error("Check the email address. To create a new admin, use: npm run db:ensure-admin");
    process.exit(1);
  }

  const passwordHash = await hash(password, 12);

  const adminRoles = new Set(["ADMIN", "SUPER_ADMIN", "CONTENT_ADMIN", "SUPPORT_ADMIN"]);
  const shouldPromote = !adminRoles.has(user.role);

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      ...(shouldPromote ? { role: "SUPER_ADMIN" } : {}),
      credentialVersion: { increment: 1 },
    },
    select: { email: true, username: true, role: true },
  });

  console.log("\n✓ Password reset successfully");
  console.log(`  email:    ${updated.email}`);
  console.log(`  username: ${updated.username ?? "(none)"}`);
  console.log(`  role:     ${updated.role}`);
  if (shouldPromote) console.log("  ℹ  Role was promoted to SUPER_ADMIN");
  console.log("\nExisting sessions have been invalidated. Log in at /login.\n");
}

main()
  .catch((e) => {
    console.error("Script failed:", e instanceof Error ? e.message : e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
