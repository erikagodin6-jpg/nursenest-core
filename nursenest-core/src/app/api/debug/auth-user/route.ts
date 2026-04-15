import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { normalizeEmailForDedup } from "@/lib/auth/email-address-normalization";
import { normalizeLoginIdentifier } from "@/lib/auth/normalize-login-identifier";
import { isStaffRole } from "@/lib/auth/staff-roles";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const userDiagSelect = {
  id: true,
  email: true,
  passwordHash: true,
  normalizedEmail: true,
  role: true,
} as const;

/**
 * Temporary super-admin auth diagnostics: user lookup dimensions without exposing hashes/tokens.
 */
export async function GET(req: Request) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const { searchParams } = new URL(req.url);
  const raw = searchParams.get("email") ?? "";
  const trimmed = raw.trim();
  if (!trimmed) {
    return NextResponse.json({ error: "Missing email query param" }, { status: 400 });
  }

  const lower = normalizeLoginIdentifier(trimmed);
  const normalized = normalizeEmailForDedup(lower);

  const [exactCaseInsensitiveMatches, normalizedMatches, trimmedIds] = await Promise.all([
    prisma.user.findMany({
      where: { email: { equals: lower, mode: "insensitive" } },
      select: userDiagSelect,
    }),
    prisma.user.findMany({
      where: { normalizedEmail: normalized },
      select: userDiagSelect,
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
          select: userDiagSelect,
        })
      : [];

  const mapRow = (u: {
    id: string;
    email: string;
    passwordHash: string | null;
    normalizedEmail: string | null;
    role: string;
  }) => ({
    userId: u.id,
    email: u.email,
    normalizedEmail: u.normalizedEmail,
    hasPasswordHash: Boolean(u.passwordHash),
    staffEligible: isStaffRole(u.role),
  });

  return NextResponse.json({
    query: { raw: trimmed, lower, normalized },
    exactMatchCount: exactCaseInsensitiveMatches.length,
    normalizedMatchCount: normalizedMatches.length,
    trimmedMatchCount: trimmedUsers.length,
    exactMatches: exactCaseInsensitiveMatches.map(mapRow),
    normalizedMatches: normalizedMatches.map(mapRow),
    trimmedMatches: trimmedUsers.map(mapRow),
  });
}
