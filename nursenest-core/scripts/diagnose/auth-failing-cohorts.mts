/**
 * Read-only cohort statistics for auth incident triage.
 *
 * Usage:
 *   DATABASE_URL=... npx tsx scripts/diagnose/auth-failing-cohorts.mts
 */
import { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

import "../../src/lib/db/env-bootstrap";

if (!process.env.DATABASE_URL?.trim()) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const [
    usersMissingPasswordHash,
    duplicateEmailsCaseInsensitive,
    duplicateNormalizedEmail,
    emailsWithEdgeSpaces,
    staffWithoutPasswordHash,
    emailDiffersFromNormalizedSample,
    recentUsersByDay,
  ] = await Promise.all([
    prisma.user.count({ where: { OR: [{ passwordHash: null }, { passwordHash: "" }] } }),
    prisma.$queryRaw<{ c: bigint }[]>(Prisma.sql`
      SELECT COUNT(*)::bigint AS c
      FROM "User" u
      INNER JOIN (
        SELECT lower(email) AS le
        FROM "User"
        GROUP BY lower(email)
        HAVING COUNT(*) > 1
      ) d ON lower(u.email) = d.le
    `).then((r) => Number(r[0]?.c ?? 0)),
    prisma.$queryRaw<{ c: bigint }[]>(Prisma.sql`
      SELECT COUNT(*)::bigint AS c FROM (
        SELECT "normalizedEmail" AS ne
        FROM "User"
        WHERE "normalizedEmail" IS NOT NULL
        GROUP BY "normalizedEmail"
        HAVING COUNT(*) > 1
      ) t
    `).then((r) => Number(r[0]?.c ?? 0)),
    prisma.$queryRaw<{ c: bigint }[]>(Prisma.sql`
      SELECT COUNT(*)::bigint AS c FROM "User"
      WHERE btrim(email) <> email
    `).then((r) => Number(r[0]?.c ?? 0)),
    prisma.$queryRaw<{ c: bigint }[]>(Prisma.sql`
      SELECT COUNT(*)::bigint AS c FROM "User"
      WHERE role IN ('ADMIN','SUPER_ADMIN','CONTENT_ADMIN','SUPPORT_ADMIN')
        AND ("passwordHash" IS NULL OR "passwordHash" = '')
    `).then((r) => Number(r[0]?.c ?? 0)),
    prisma.$queryRaw<{ c: bigint }[]>(Prisma.sql`
      SELECT COUNT(*)::bigint AS c FROM "User"
      WHERE "normalizedEmail" IS NOT NULL
        AND lower(btrim(email)) <> lower(btrim("normalizedEmail"))
    `).then((r) => Number(r[0]?.c ?? 0)),
    prisma.$queryRaw<{ day: string; count: bigint }[]>(Prisma.sql`
      SELECT to_char(date_trunc('day', "createdAt" AT TIME ZONE 'UTC'), 'YYYY-MM-DD') AS day, COUNT(*)::bigint AS count
      FROM "User"
      WHERE "createdAt" >= NOW() - INTERVAL '30 days'
      GROUP BY 1
      ORDER BY 1 ASC
    `),
  ]);

  let passwordResetTokensByDay: { day: string; count: string }[] = [];
  try {
    passwordResetTokensByDay = await prisma.$queryRaw<{ day: string; count: bigint }[]>(Prisma.sql`
      SELECT to_char(date_trunc('day', "createdAt" AT TIME ZONE 'UTC'), 'YYYY-MM-DD') AS day, COUNT(*)::bigint AS count
      FROM "PasswordResetToken"
      WHERE "createdAt" >= NOW() - INTERVAL '30 days'
      GROUP BY 1
      ORDER BY 1 ASC
    `).then((rows) => rows.map((r) => ({ day: r.day, count: String(r.count) })));
  } catch {
    passwordResetTokensByDay = [];
  }

  console.log(
    JSON.stringify(
      {
        event: "auth_failing_cohorts",
        usersWithNullOrEmptyPasswordHash: usersMissingPasswordHash,
        usersInCaseInsensitiveDuplicateEmailGroups: duplicateEmailsCaseInsensitive,
        duplicateNormalizedEmailGroups: duplicateNormalizedEmail,
        usersWithLeadingOrTrailingSpacesInEmailColumn: emailsWithEdgeSpaces,
        staffUsersWithoutPasswordHash: staffWithoutPasswordHash,
        usersEmailDiffersFromNormalizedEmail: emailDiffersFromNormalizedSample,
        recentUsersByDayUtc: recentUsersByDay.map((r) => ({ day: r.day, count: String(r.count) })),
        passwordResetTokensByDayUtcLast30Days: passwordResetTokensByDay,
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
