import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { normalizeEmailForDedup } from "@/lib/auth/email-address-normalization";
import { normalizeLoginIdentifier } from "@/lib/auth/normalize-login-identifier";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const userDiagSelect = {
  id: true,
  email: true,
  passwordHash: true,
  normalizedEmail: true,
} as const;

/**
 * Temporary admin-only auth diagnostics: counts and ids for an email without exposing hashes.
 * Super-admin only (see `admin-path-policy` for `/api/debug/auth-user`).
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

  const [exactLowercaseMatches, exactCaseInsensitiveMatches, normalizedMatches] = await Promise.all([
    prisma.user.findMany({
      where: { email: lower },
      select: userDiagSelect,
    }),
    prisma.user.findMany({
      where: { email: { equals: lower, mode: "insensitive" } },
      select: userDiagSelect,
    }),
    prisma.user.findMany({
      where: { normalizedEmail: normalized },
      select: userDiagSelect,
    }),
  ]);

  const mapRow = (u: {
    id: string;
    email: string;
    passwordHash: string | null;
    normalizedEmail: string | null;
  }) => ({
    id: u.id,
    email: u.email,
    normalizedEmail: u.normalizedEmail,
    hasPasswordHash: Boolean(u.passwordHash),
  });

  return NextResponse.json({
    query: { raw: trimmed, lower, normalized },
    exactLowercaseMatchCount: exactLowercaseMatches.length,
    exactCaseInsensitiveMatchCount: exactCaseInsensitiveMatches.length,
    normalizedMatchCount: normalizedMatches.length,
    exactLowercaseMatches: exactLowercaseMatches.map(mapRow),
    exactCaseInsensitiveMatches: exactCaseInsensitiveMatches.map(mapRow),
    normalizedMatches: normalizedMatches.map(mapRow),
  });
}
