/**
 * Pre-flight for `npm run test:e2e:learning-routes` (after credential + DB connectivity checks).
 *
 * Prints non-secret diagnostics and verifies the paid E2E user exists with an ACTIVE-like subscription
 * and completed onboarding (same gates as `tests/e2e/setup/auth.setup.ts`).
 *
 * Load order matches `scripts/check-e2e-database-connect.cjs`.
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

function redactedDatabaseHint(raw) {
  const s = String(raw ?? "").trim();
  if (!s) return "(not set)";
  try {
    const u = new URL(s.replace(/^postgres(ql)?:\/\//i, "http://"));
    const db = (u.pathname || "").replace(/^\//, "") || "(default)";
    return `host=${u.hostname} port=${u.port || "5432"} database=${db}`;
  } catch {
    return "(could not parse URL)";
  }
}

function maskEmail(email) {
  const e = String(email ?? "").trim();
  const at = e.indexOf("@");
  if (at <= 1) return e ? "***" : "(empty)";
  return `${e[0]}***@${e.slice(at + 1)}`;
}

function resolvePaidTestEmail() {
  const qa = process.env.QA_PAID_EMAIL?.trim();
  const qb = process.env.QA_PAID_PASSWORD;
  if (qa && qb !== undefined && String(qb).length > 0) return { email: qa, source: "QA_PAID_EMAIL" };
  const a = process.env.E2E_PAID_EMAIL?.trim();
  const b = process.env.E2E_PAID_PASSWORD;
  if (a && b) return { email: a, source: "E2E_PAID_EMAIL" };
  const c = process.env.PLAYWRIGHT_TEST_EMAIL?.trim();
  const d = process.env.PLAYWRIGHT_TEST_PASSWORD;
  if (c && d) return { email: c, source: "PLAYWRIGHT_TEST_EMAIL" };
  return { email: null, source: "none" };
}

function printEnvBanner() {
  const baseURL = process.env.BASE_URL?.trim() || "http://127.0.0.1:3000";
  console.log("[learning-routes-e2e-preflight] --- environment (no secrets) ---");
  console.log(`[learning-routes-e2e-preflight] BASE_URL=${baseURL}`);
  console.log(
    `[learning-routes-e2e-preflight] AUTH_URL=${process.env.AUTH_URL?.trim() ? "set" : "unset"} NEXTAUTH_URL=${process.env.NEXTAUTH_URL?.trim() ? "set" : "unset"}`,
  );
  console.log(
    `[learning-routes-e2e-preflight] AUTH_SECRET=${process.env.AUTH_SECRET?.trim() ? "set" : "unset"} NEXTAUTH_SECRET=${process.env.NEXTAUTH_SECRET?.trim() ? "set" : "unset"}`,
  );
  console.log(`[learning-routes-e2e-preflight] DATABASE_URL=${process.env.DATABASE_URL?.trim() ? "set" : "unset"}`);
  console.log(`[learning-routes-e2e-preflight] DATABASE target (no secrets): ${redactedDatabaseHint(process.env.DATABASE_URL)}`);
}

(async () => {
  printEnvBanner();

  const { email, source } = resolvePaidTestEmail();
  if (!email) {
    console.error("[learning-routes-e2e-preflight] No paid test email resolved (check QA_PAID_* / E2E_PAID_* / PLAYWRIGHT_TEST_*).");
    process.exit(1);
  }

  console.log(`[learning-routes-e2e-preflight] paid email source=${source} masked=${maskEmail(email)}`);

  const { PrismaClient } = require("@prisma/client");
  const prisma = new PrismaClient();
  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: { equals: email, mode: "insensitive" } }, { username: { equals: email, mode: "insensitive" } }],
      },
      select: {
        id: true,
        email: true,
        onboardingCompletedAt: true,
        passwordHash: true,
      },
    });

    if (!user) {
      console.error(
        [
          "[learning-routes-e2e-preflight] FAIL: no User row for paid E2E email (credentials login will never succeed).",
          "Seed / reset the QA paid learner:",
          "  ALLOW_QA_PAID_TEST_RESET=1 npx tsx scripts/qa-paid-test-account-reset.mts",
          "Use the same DATABASE_URL as `npm run dev` / Playwright webServer.",
        ].join("\n"),
      );
      process.exit(1);
    }

    const hasPassword = Boolean(user.passwordHash && String(user.passwordHash).trim().length > 0);
    console.log(
      `[learning-routes-e2e-preflight] user idPrefix=${user.id.slice(0, 8)}… onboardingCompletedAt=${user.onboardingCompletedAt ? "set" : "MISSING"} passwordHash=${hasPassword ? "set" : "MISSING"}`,
    );

    if (!user.onboardingCompletedAt) {
      console.error(
        [
          "[learning-routes-e2e-preflight] FAIL: onboardingCompletedAt is null — /app will redirect to onboarding after login.",
          "Fix: run `ALLOW_QA_PAID_TEST_RESET=1 npx tsx scripts/qa-paid-test-account-reset.mts` against this DATABASE_URL.",
        ].join("\n"),
      );
      process.exit(1);
    }

    if (!hasPassword) {
      console.error(
        "[learning-routes-e2e-preflight] FAIL: user has no passwordHash — credentials provider cannot verify password.",
      );
      process.exit(1);
    }

    const subs = await prisma.subscription.findMany({
      where: { userId: user.id, status: "ACTIVE" },
      select: { id: true, stripeSubscriptionId: true, planTier: true, planCountry: true },
      take: 5,
    });

    console.log(
      `[learning-routes-e2e-preflight] ACTIVE subscriptions count=${subs.length}` +
        (subs.length ? ` examplePlanTier=${subs[0].planTier ?? "null"}` : ""),
    );

    if (subs.length === 0) {
      console.error(
        [
          "[learning-routes-e2e-preflight] FAIL: no ACTIVE Subscription for user — /app/lessons paywall checks will fail.",
          "Fix: run `ALLOW_QA_PAID_TEST_RESET=1 npx tsx scripts/qa-paid-test-account-reset.mts` (creates synthetic Stripe sub row).",
        ].join("\n"),
      );
      process.exit(1);
    }

    console.log("[learning-routes-e2e-preflight] OK — paid user row looks eligible for credentials + learner shell.");
  } finally {
    await prisma.$disconnect().catch(() => {});
  }
})().catch((e) => {
  console.error("[learning-routes-e2e-preflight] unexpected error:", e instanceof Error ? e.message : e);
  process.exit(1);
});
