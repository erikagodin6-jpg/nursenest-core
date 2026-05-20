/**
 * Set a user's role to ADMIN (staff) by email. Requires DATABASE_URL.
 *
 * Usage (from nursenest-core directory):
 *   npx tsx scripts/admin/create-admin-user.ts user@example.com
 */
import { UserRole } from "@prisma/client";
import { prisma } from "../lib/prisma-script-client";

if (!process.env.DATABASE_URL?.trim()) {
  console.error("DATABASE_URL is not set. Configure Postgres and retry.");
  process.exit(1);
}

async function main(): Promise<void> {
  const emailRaw = process.argv[2]?.trim();
  if (!emailRaw || !emailRaw.includes("@")) {
    console.error("Usage: npx tsx scripts/admin/create-admin-user.ts <email>");
    process.exit(1);
  }
  const email = emailRaw.toLowerCase();

  const existing = await prisma.user.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
    select: { id: true, email: true, name: true, role: true },
  });

  if (!existing) {
    console.error(`No user found with email: ${email}`);
    process.exit(1);
  }

  const updated = await prisma.user.update({
    where: { id: existing.id },
    data: { role: UserRole.ADMIN },
    select: { email: true, name: true, role: true, id: true },
  });

  console.log("OK — user is now ADMIN (staff).");
  console.log(`  id:    ${updated.id}`);
  console.log(`  email: ${updated.email}`);
  console.log(`  name:  ${updated.name ?? "(none)"}`);
  console.log(`  role:  ${updated.role}`);
  console.log("Ask the user to sign out and sign back in so the session JWT picks up the new role.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
