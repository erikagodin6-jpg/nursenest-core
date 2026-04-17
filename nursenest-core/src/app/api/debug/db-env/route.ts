import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";

export const dynamic = "force-dynamic";

function trimEnv(key: "DATABASE_URL" | "DIRECT_URL"): string | undefined {
  const v = process.env[key]?.trim();
  return v && v.length > 0 ? v : undefined;
}

/**
 * Staff-only: confirms Prisma datasource env is present (no connection strings or secrets).
 *
 * - `hasDatabaseUrl` / `hasDirectUrl` — non-empty `DATABASE_URL` / `DIRECT_URL` after trim.
 * - `usingDirectUrl` — both set; matches `prisma/schema.prisma` `url` + `directUrl` production pattern
 *   (pooled `DATABASE_URL` + non-pooler `DIRECT_URL` for migrate/introspect).
 */
export async function GET(req: Request) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const hasDatabaseUrl = Boolean(trimEnv("DATABASE_URL"));
  const hasDirectUrl = Boolean(trimEnv("DIRECT_URL"));
  const usingDirectUrl = hasDatabaseUrl && hasDirectUrl;

  return NextResponse.json({
    hasDatabaseUrl,
    hasDirectUrl,
    usingDirectUrl,
  });
}
