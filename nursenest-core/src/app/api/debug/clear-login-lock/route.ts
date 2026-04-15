import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { hashLoginIdentifierForLog } from "@/lib/auth/log-auth-identifier";
import {
  normalizeLoginIdentifier,
  sanitizeRawLoginIdentifier,
} from "@/lib/auth/normalize-login-identifier";
import { clearLoginFailures } from "@/lib/auth/login-lockout";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  identifier: z.string().min(1).max(512),
});

/**
 * Clears in-memory progressive lockout for the same key used by credentials login.
 * Super-admin only; does not affect rate limits or other instances.
 */
export async function POST(req: Request) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Missing or invalid identifier" }, { status: 400 });
  }

  const normalized = normalizeLoginIdentifier(sanitizeRawLoginIdentifier(parsed.data.identifier));
  const idHash = normalized ? hashLoginIdentifierForLog(normalized) : "";
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";
  const lockKey = `login-lock:${idHash || ip}`;
  clearLoginFailures(lockKey);

  return NextResponse.json({
    ok: true,
    clearedKeySuffix: lockKey.slice(-24),
  });
}
