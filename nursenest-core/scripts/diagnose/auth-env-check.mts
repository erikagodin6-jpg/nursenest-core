/**
 * Safe auth-related environment presence check (no secret values).
 *
 * Usage (from nursenest-core/):
 *   npx tsx scripts/diagnose/auth-env-check.mts
 */
import "../../src/lib/db/script-env-bootstrap";

function has(k: string): boolean {
  return Boolean(typeof process.env[k] === "string" && process.env[k]!.trim().length > 0);
}

function summarizeUrl(k: string): { present: boolean; originOnly?: boolean; hint?: string } {
  if (!has(k)) return { present: false };
  const raw = process.env[k]!.trim();
  try {
    const u = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
    const pathname = u.pathname;
    const originOnly = !pathname || pathname === "/" || pathname === "";
    return {
      present: true,
      originOnly,
      hint: originOnly ? "ok" : "should be origin-only (no /login path)",
    };
  } catch {
    return { present: true, hint: "unparseable URL" };
  }
}

const authUrl = summarizeUrl("AUTH_URL");
const nextAuthUrl = summarizeUrl("NEXTAUTH_URL");

console.log(
  JSON.stringify(
    {
      event: "auth_env_check",
      AUTH_URL: { present: has("AUTH_URL"), ...authUrl },
      NEXTAUTH_URL: { present: has("NEXTAUTH_URL"), ...nextAuthUrl },
      AUTH_SECRET: { present: has("AUTH_SECRET") },
      NEXTAUTH_SECRET: { present: has("NEXTAUTH_SECRET") },
      DATABASE_URL: { present: has("DATABASE_URL") },
      NODE_ENV: process.env.NODE_ENV ?? null,
      VERCEL_ENV: process.env.VERCEL_ENV ?? null,
      NEXT_PUBLIC_APP_URL: has("NEXT_PUBLIC_APP_URL"),
      RESEND_API_KEY: has("RESEND_API_KEY"),
    },
    null,
    2,
  ),
);
