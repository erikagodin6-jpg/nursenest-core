/**
 * List staff users or promote a learner to SUPER_ADMIN (requires DATABASE_URL).
 *
 * Usage:
 *   npx tsx scripts/admin-staff-users.mts list
 *   npx tsx scripts/admin-staff-users.mts promote user@example.com
 */
import { PrismaClient, UserRole } from "@prisma/client";

import "../src/lib/db/env-bootstrap";

if (!process.env.DATABASE_URL?.trim()) {
  console.error("DATABASE_URL is not set. Configure Postgres and retry.");
  process.exit(1);
}

const prisma = new PrismaClient();

const STAFF_ROLES: UserRole[] = [
  UserRole.ADMIN,
  UserRole.SUPER_ADMIN,
  UserRole.CONTENT_ADMIN,
  UserRole.SUPPORT_ADMIN,
];

async function listStaff(): Promise<void> {
  const users = await prisma.user.findMany({
    where: { role: { in: STAFF_ROLES } },
    select: { id: true, email: true, name: true, role: true, updatedAt: true },
    orderBy: { email: "asc" },
  });
  if (users.length === 0) {
    console.log("No staff users found (roles: ADMIN, SUPER_ADMIN, CONTENT_ADMIN, SUPPORT_ADMIN).");
    return;
  }
  console.log(`Staff users (${users.length}):\n`);
  for (const u of users) {
    console.log(`  ${u.email}\t${u.role}\t${u.name}\t${u.id}`);
  }
}

async function promote(emailRaw: string): Promise<void> {
  const email = emailRaw.trim().toLowerCase();
  if (!email.includes("@")) {
    console.error("Invalid email.");
    process.exit(1);
  }
  const existing = await prisma.user.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
    select: { id: true, email: true, role: true },
  });
  if (!existing) {
    console.error(`No user found with email matching: ${email}`);
    process.exit(1);
  }
  if (STAFF_ROLES.includes(existing.role)) {
    console.log(`Already staff: ${existing.email} role=${existing.role}`);
    return;
  }
  const updated = await prisma.user.update({
    where: { id: existing.id },
    data: { role: UserRole.SUPER_ADMIN },
    select: { email: true, role: true },
  });
  console.log(`OK — promoted to SUPER_ADMIN: ${updated.email} (role=${updated.role})`);
  console.log("User must sign out and sign in again (or use session update) for JWT role to refresh.");
}

async function main(): Promise<void> {
  const cmd = process.argv[2]?.trim();
  const arg = process.argv[3]?.trim();
  if (!cmd || cmd === "help" || cmd === "-h") {
    console.log(`Usage:
  npx tsx scripts/admin-staff-users.mts list
  npx tsx scripts/admin-staff-users.mts promote <email>`);
    process.exit(cmd ? 0 : 1);
  }
  if (cmd === "list") {
    await listStaff();
    return;
  }
  if (cmd === "promote") {
    if (!arg) {
      console.error("Usage: npx tsx scripts/admin-staff-users.mts promote <email>");
      process.exit(1);
    }
    await promote(arg);
    return;
  }
  console.error(`Unknown command: ${cmd}`);
  process.exit(1);
}

main()
  .catch((e) => {
    console.error(e instanceof Error ? e.message : String(e));
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
