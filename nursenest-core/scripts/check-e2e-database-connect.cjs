/**
 * Preflight: Next.js loads `.env.local` for `next dev`. If `DATABASE_URL` is wrong, credentials login
 * fails with Auth.js `CredentialsSignin` (same as a bad password) — this check fails fast with a clear message.
 *
 * Load order matches `scripts/load-dotenv-for-cli.mts` (package root, not `cwd`):
 * `.env.local` → `.env.playwright.local` → `.env` (`override: false` — shell / CI env always wins).
 */
const { resolve } = require("node:path");
const { existsSync } = require("node:fs");
const { config } = require("dotenv");

const packageRoot = resolve(__dirname, "..");
const envLocalPath = resolve(packageRoot, ".env.local");
const envPlaywrightPath = resolve(packageRoot, ".env.playwright.local");
const envPath = resolve(packageRoot, ".env");

if (existsSync(envLocalPath)) {
  config({ path: envLocalPath, override: false });
}
if (existsSync(envPlaywrightPath)) {
  config({ path: envPlaywrightPath, override: false });
}
if (existsSync(envPath)) {
  config({ path: envPath, override: false });
}

/** Host / port / db only — password redacted. */
function redactedConnectionHint(raw) {
  const s = String(raw ?? "").trim();
  if (!s) return "(empty)";
  try {
    const u = new URL(s.replace(/^postgres(ql)?:\/\//i, "http://"));
    const db = (u.pathname || "").replace(/^\//, "") || "(default)";
    return `host=${u.hostname} port=${u.port || "5432"} database=${db}`;
  } catch {
    return "(could not parse URL — check quoting and special characters in password)";
  }
}

const PLACEHOLDER_MARKERS = [
  "REPLACE_WITH_YOUR_PASSWORD",
  "REPLACE_ME",
  "USER:PASSWORD",
  "postgresql://USER:",
];

function looksLikePlaceholderDatabaseUrl(raw) {
  const s = String(raw ?? "");
  return PLACEHOLDER_MARKERS.some((m) => s.includes(m));
}

(async () => {
  if (!process.env.DATABASE_URL?.trim()) {
    console.error(
      "[e2e-db-check] DATABASE_URL is not set. Add it to nursenest-core/.env.local, export it in the shell, or run `npm run test:e2e:paid-local-green` (Docker Postgres + migrate + QA reset + paid E2E).",
    );
    process.exit(1);
  }

  const rawUrl = process.env.DATABASE_URL.trim();
  if (looksLikePlaceholderDatabaseUrl(rawUrl)) {
    console.error(
      [
        "[e2e-db-check] DATABASE_URL looks like a template/placeholder (not a real password).",
        `Connection target (no secrets): ${redactedConnectionHint(rawUrl)}`,
        "Paste the real connection string from your host (e.g. DigitalOcean → Databases → Connection details), or run `npm run test:e2e:paid-local-green` to use local Docker Postgres.",
      ].join("\n"),
    );
    process.exit(1);
  }

  const { PrismaClient } = require("@prisma/client");
  const prisma = new PrismaClient();
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    const pwdAuth = /password authentication failed|FATAL:\s*password authentication failed/i.test(msg);
    const sslHint =
      pwdAuth && /\.ondigitalocean\.com|amazonaws|neon\.tech|supabase/i.test(rawUrl)
        ? "\nIf the password is correct, ensure the URL includes sslmode=require (added automatically for many managed hosts in src/lib/db/env-bootstrap.ts when omitted)."
        : "";
    console.error(
      [
        "[e2e-db-check] Cannot connect to Postgres.",
        `Attempted (no secrets): ${redactedConnectionHint(rawUrl)}`,
        "Credentials login fails with Auth.js code db_url_auth when Prisma cannot open a DB connection (wrong password or TLS/URL).",
        "Fix DATABASE_URL in App Platform / .env.playwright.local (rotate password in DO if expired), or run `npm run test:e2e:paid-local-green`.",
        `Detail: ${msg.slice(0, 500)}${sslHint}`,
      ].join("\n"),
    );
    process.exit(1);
  } finally {
    await prisma.$disconnect().catch(() => {});
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
