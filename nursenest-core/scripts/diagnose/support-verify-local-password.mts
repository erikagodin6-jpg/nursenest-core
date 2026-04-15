/**
 * Check whether a user row has a usable bcrypt password hash (no password input).
 *
 * Usage:
 *   DATABASE_URL=... npx tsx scripts/diagnose/support-verify-local-password.mts "user@example.com"
 */
import { PrismaClient } from "@prisma/client";

import "../../src/lib/db/env-bootstrap";

if (!process.env.DATABASE_URL?.trim()) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

const prisma = new PrismaClient();

function looksLikeBcryptHash(h: string | null | undefined): boolean {
  if (!h || h.length < 20) return false;
  return h.startsWith("$2a$") || h.startsWith("$2b$") || h.startsWith("$2y$");
}

async function main(): Promise<void> {
  const emailArg = process.argv[2]?.trim() ?? "";
  if (!emailArg.includes("@")) {
    console.error('Usage: npx tsx scripts/diagnose/support-verify-local-password.mts "user@example.com"');
    process.exit(1);
  }

  const user = await prisma.user.findFirst({
    where: { email: { equals: emailArg, mode: "insensitive" } },
    select: { id: true, email: true, passwordHash: true, authProvider: true, role: true },
  });
  if (!user) {
    console.error("No user found.");
    process.exit(1);
  }

  const hasHash = Boolean(user.passwordHash && user.passwordHash.length > 0);
  const bcryptOk = looksLikeBcryptHash(user.passwordHash);

  console.log(
    JSON.stringify(
      {
        userId: user.id,
        email: user.email,
        authProvider: user.authProvider,
        role: user.role,
        hasPasswordHash: hasHash,
        bcryptHashFormatLooksValid: bcryptOk,
        usableForCredentialsLogin: hasHash && bcryptOk,
      },
      null,
      2,
    ),
  );
}

main()
  .catch((e) => {
    console.error(e instanceof Error ? e.message : String(e));
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
