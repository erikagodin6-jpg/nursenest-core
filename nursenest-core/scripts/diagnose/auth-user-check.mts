/**
 * Read-only lookup for one email / identifier (mirrors credentials dimensions).
 *
 * Usage:
 *   DATABASE_URL=... npx tsx scripts/diagnose/auth-user-check.mts "user@example.com"
 */
import { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

import "../../src/lib/db/script-env-bootstrap";
import { normalizeEmailForDedup } from "../../src/lib/auth/email-address-normalization";
import { normalizeLoginIdentifier } from "../../src/lib/auth/normalize-login-identifier";
import { isStaffRole } from "../../src/lib/auth/staff-roles";

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const raw = process.argv[2]?.trim() ?? "";
  if (!raw) {
    console.error('Usage: npx tsx scripts/diagnose/auth-user-check.mts "<email>"');
    process.exit(1);
  }

  const lower = normalizeLoginIdentifier(raw);
  const normalized = normalizeEmailForDedup(lower);

  const [exactMatches, normalizedMatches, trimmedIds] = await Promise.all([
    prisma.user.findMany({
      where: { email: { equals: lower, mode: "insensitive" } },
      select: {
        id: true,
        email: true,
        normalizedEmail: true,
        passwordHash: true,
        role: true,
      },
    }),
    prisma.user.findMany({
      where: { normalizedEmail: normalized },
      select: {
        id: true,
        email: true,
        normalizedEmail: true,
        passwordHash: true,
        role: true,
      },
    }),
    prisma.$queryRaw<{ id: string }[]>(
      Prisma.sql`
        SELECT id FROM "User"
        WHERE lower(btrim(email)) = lower(btrim(${lower}))
      `,
    ),
  ]);

  const trimmedUsers =
    trimmedIds.length > 0
      ? await prisma.user.findMany({
          where: { id: { in: [...new Set(trimmedIds.map((r) => r.id))] } },
          select: {
            id: true,
            email: true,
            normalizedEmail: true,
            passwordHash: true,
            role: true,
          },
        })
      : [];

  const row = (u: (typeof exactMatches)[0]) => ({
    userId: u.id,
    canonicalEmail: u.email,
    normalizedEmail: u.normalizedEmail,
    passwordHashPresent: Boolean(u.passwordHash),
    bcryptLooksValid: Boolean(u.passwordHash?.startsWith("$2")),
    staffOrAdminEligible: isStaffRole(u.role),
    role: u.role,
  });

  console.log(
    JSON.stringify(
      {
        query: { raw, lower, normalizedDedup: normalized },
        exactMatchCount: exactMatches.length,
        normalizedMatchCount: normalizedMatches.length,
        trimmedMatchCount: trimmedUsers.length,
        exactMatches: exactMatches.map(row),
        normalizedMatches: normalizedMatches.map(row),
        trimmedMatches: trimmedUsers.map(row),
        lockoutNote:
          "Progressive login lockout is in-memory per app instance — not stored in Postgres.",
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
