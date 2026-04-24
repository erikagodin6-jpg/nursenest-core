/**
 * Bootstrap or reset a **dedicated** learner account for Playwright paid-user E2E (credentials login,
 * synthetic Stripe subscription row — no Checkout).
 *
 * Entitlements match production logic in `getUserAccess`: `Subscription.status = ACTIVE` plus
 * `planTier` / `planCountry` drive access scope (see `effectiveTierCountryForAccess`).
 *
 * Required env:
 *   - `DATABASE_URL`
 *   - `ALLOW_QA_PAID_TEST_RESET=1` (any non-dry-run run; prevents accidental execution)
 *
 * Password (first match — **same precedence as Playwright `resolveQaPaidCredentialsWithSource`, plus legacy TEST name**):
 *   - `QA_PAID_PASSWORD`
 *   - `QA_PAID_TEST_PASSWORD`
 *   - `E2E_PAID_PASSWORD`
 *   - `PLAYWRIGHT_TEST_PASSWORD`
 *   - stdin one line
 *
 * Email (first match):
 *   - `--email user@example.com`
 *   - `QA_PAID_EMAIL` (same as RN full-content / smoke E2E)
 *   - `QA_PAID_TEST_EMAIL` (legacy)
 *   - `E2E_PAID_EMAIL`
 *   - `PLAYWRIGHT_TEST_EMAIL`
 *
 * Optional:
 *   - `QA_PAID_TEST_NAME` — display name (default: "QA Paid E2E")
 *   - `QA_PAID_TEST_COUNTRY` — `US` | `CA` (default: US)
 *   - `QA_PAID_TEST_TIER` — Prisma `TierCode` (default: RN)
 *   - `QA_PAID_TEST_ALLIED_CAREER` — when tier is ALLIED, stored on user + subscription
 *   - `--dry-run` — print actions only (no DB writes; does not require ALLOW_QA_PAID_TEST_RESET)
 *
 * Production / shared DB safety:
 *   - Refuses if the user has any `Subscription` whose `stripeSubscriptionId` does not start with
 *     `sub_nn_qa_e2e_` (real Stripe data), unless `QA_ALLOW_CLEAR_REAL_STRIPE_SUBSCRIPTIONS=1`.
 *   - Refuses to convert staff accounts unless `QA_ALLOW_STAFF_TO_LEARNER_RESET=1`.
 *
 * Also sets `onboardingCompletedAt`, `learnerPath`, and onboarding-aligned fields (`examFocus`,
 * `targetExamPathwayId`, `examGoalSetAt`) so `/app` does not redirect to `/app/onboarding`
 * and pathway-scoped hubs (`/app/lessons`, flashcards, CAT) resolve content like real subscribers
 * (mirrors `POST /api/onboarding/complete` enough for automation).
 *
 * After reset — refresh Playwright storage (path: `tests/e2e/.auth/paid-user.json` or `PLAYWRIGHT_PAID_AUTH_STATE`):
 *
 *   rm -f tests/e2e/.auth/paid-user.json
 *   E2E_PAID_EMAIL="..." E2E_PAID_PASSWORD="..." npx playwright test \\
 *     --project=setup-paid-auth --project=chromium-paid
 *
 * Or set `PLAYWRIGHT_TEST_EMAIL` / `PLAYWRIGHT_TEST_PASSWORD` (same as `paid-test-credentials.ts`).
 */
import "./load-dotenv-for-cli.mts";
import { cliDotenvTelemetry } from "./load-dotenv-for-cli.mts";
import { createInterface } from "node:readline";
import bcrypt from "bcryptjs";
import {
  PrismaClient,
  UserRole,
  CountryCode,
  TierCode,
  SubscriptionStatus,
  TrialStatus,
} from "@prisma/client";

import "../src/lib/db/script-env-bootstrap";
import { databaseUrlSource } from "../src/lib/db/env-bootstrap";
import { parsePostgresUrlTargetSafe } from "./cli-db-url-snapshot.mts";
import { normalizeEmailForDedup } from "../src/lib/auth/email-address-normalization";
import { isStaffRole } from "../src/lib/auth/staff-roles";
import { strongPasswordSchema } from "../src/lib/auth/password-policy";
import { resolveDefaultPathwayIdForOnboarding } from "../src/lib/onboarding/resolve-default-pathway-for-onboarding";

const SYNTHETIC_STRIPE_SUB_PREFIX = "sub_nn_qa_e2e_";

function examGoalSlugForTier(tier: TierCode): "rn" | "rpn" | "np" | "allied" {
  if (tier === TierCode.NP) return "np";
  if (tier === TierCode.ALLIED) return "allied";
  if (tier === TierCode.RPN || tier === TierCode.LVN_LPN) return "rpn";
  return "rn";
}

{
  const raw = process.env.DATABASE_URL?.trim();
  const t = raw ? parsePostgresUrlTargetSafe(raw) : null;
  console.log(`[qa-cli-env] after_env_bootstrap: databaseUrlSource=${databaseUrlSource}`);
  if (t) {
    console.log(
      `[qa-cli-env] effective_DATABASE_URL_for_Prisma (tuned; no secrets): host=${t.hostname} port=${t.port} database=${t.database}`,
    );
  } else {
    console.log("[qa-cli-env] effective_DATABASE_URL_for_Prisma: could_not_parse_host_port_db (non-fatal)");
  }
}

const prisma = new PrismaClient();

function parseArgs(): { email?: string; dryRun: boolean } {
  const argv = process.argv.slice(2);
  const dryRun = argv.includes("--dry-run");
  const idx = argv.indexOf("--email");
  const email = idx >= 0 && argv[idx + 1] ? argv[idx + 1].trim().toLowerCase() : undefined;
  return { email, dryRun };
}

async function readPasswordFromStdin(): Promise<string> {
  return await new Promise((resolve, reject) => {
    const rl = createInterface({ input: process.stdin, terminal: false });
    let buf = "";
    rl.on("line", (line) => {
      buf = line;
      rl.close();
    });
    rl.on("close", () => resolve(buf));
    rl.on("error", reject);
  });
}

function parseCountry(raw: string | undefined): CountryCode {
  const u = raw?.trim().toUpperCase();
  return u === "CA" ? CountryCode.CA : CountryCode.US;
}

function parseTier(raw: string | undefined): TierCode {
  const u = raw?.trim().toUpperCase();
  const allowed = Object.values(TierCode) as string[];
  if (u && allowed.includes(u)) return u as TierCode;
  return TierCode.RN;
}

function syntheticStripeSubscriptionId(userId: string): string {
  return `${SYNTHETIC_STRIPE_SUB_PREFIX}${userId}`;
}

function resolveResetEmail(cliEmail: string | undefined): string | undefined {
  const fromCli = cliEmail?.trim().toLowerCase();
  if (fromCli?.includes("@")) return fromCli;
  const fromEnv =
    process.env.QA_PAID_EMAIL?.trim().toLowerCase() ||
    process.env.QA_PAID_TEST_EMAIL?.trim().toLowerCase() ||
    process.env.E2E_PAID_EMAIL?.trim().toLowerCase() ||
    process.env.PLAYWRIGHT_TEST_EMAIL?.trim().toLowerCase();
  return fromEnv?.includes("@") ? fromEnv : undefined;
}

function resolveResetPasswordFromEnv(): string | undefined {
  const candidates = [
    process.env.QA_PAID_PASSWORD,
    process.env.QA_PAID_TEST_PASSWORD,
    process.env.E2E_PAID_PASSWORD,
    process.env.PLAYWRIGHT_TEST_PASSWORD,
  ];
  for (const p of candidates) {
    if (p !== undefined && String(p).trim().length > 0) return String(p).trim();
  }
  return undefined;
}

async function main(): Promise<void> {
  const { email: emailArg, dryRun } = parseArgs();
  const email = resolveResetEmail(emailArg);
  if (!email?.includes("@")) {
    console.error(
      "Usage: set QA_PAID_EMAIL + QA_PAID_PASSWORD (or E2E_* / PLAYWRIGHT_TEST_*), or QA_PAID_TEST_*, or pass --email. " +
        "Example: ALLOW_QA_PAID_TEST_RESET=1 QA_PAID_EMAIL=... QA_PAID_PASSWORD=... npx tsx scripts/qa-paid-test-account-reset.mts [--dry-run]",
    );
    process.exit(1);
  }

  if (!dryRun && process.env.ALLOW_QA_PAID_TEST_RESET !== "1") {
    console.error("Refusing: set ALLOW_QA_PAID_TEST_RESET=1 for non-dry-run runs.");
    process.exit(1);
  }

  let plain = resolveResetPasswordFromEnv();
  if (!plain && !dryRun) plain = (await readPasswordFromStdin()).trim();
  if (!dryRun) {
    if (!plain) {
      console.error("Set QA_PAID_PASSWORD (or QA_PAID_TEST_PASSWORD / E2E_PAID_PASSWORD / PLAYWRIGHT_TEST_PASSWORD) or pipe one line on stdin.");
      process.exit(1);
    }
    const parsed = strongPasswordSchema.safeParse(plain);
    if (!parsed.success) {
      console.error(parsed.error.issues[0]?.message ?? "Invalid password");
      process.exit(1);
    }
  }

  const name = process.env.QA_PAID_TEST_NAME?.trim() || "QA Paid E2E";
  const country = parseCountry(process.env.QA_PAID_TEST_COUNTRY);
  const tier = parseTier(process.env.QA_PAID_TEST_TIER);
  const alliedCareerRaw = process.env.QA_PAID_TEST_ALLIED_CAREER?.trim();
  const alliedCareer = tier === TierCode.ALLIED ? alliedCareerRaw || "paramedic" : null;

  const existing = await prisma.user.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
    select: { id: true, email: true, role: true },
  });

  if (existing && isStaffRole(existing.role) && process.env.QA_ALLOW_STAFF_TO_LEARNER_RESET !== "1") {
    console.error(
      `Refusing: ${existing.email} has staff role ${existing.role}. Set QA_ALLOW_STAFF_TO_LEARNER_RESET=1 to convert to LEARNER for E2E.`,
    );
    process.exit(1);
  }

  const subsCheck =
    existing &&
    (await prisma.subscription.findMany({
      where: { userId: existing.id },
      select: { stripeSubscriptionId: true },
    }));

  const allowReal = process.env.QA_ALLOW_CLEAR_REAL_STRIPE_SUBSCRIPTIONS === "1";
  if (subsCheck?.length) {
    const foreign = subsCheck.filter((s) => !s.stripeSubscriptionId.startsWith(SYNTHETIC_STRIPE_SUB_PREFIX));
    if (foreign.length && !allowReal) {
      console.error(
        [
          "Refusing: user has subscription row(s) that look like real Stripe ids (not",
          `${SYNTHETIC_STRIPE_SUB_PREFIX}*).`,
          "Use a dedicated QA email or set QA_ALLOW_CLEAR_REAL_STRIPE_SUBSCRIPTIONS=1 (dangerous).",
        ].join(" "),
      );
      process.exit(1);
    }
  }

  const periodEnd = new Date();
  periodEnd.setUTCFullYear(periodEnd.getUTCFullYear() + 1);

  const examGoalSlug = examGoalSlugForTier(tier);
  const learnerPathDefault =
    resolveDefaultPathwayIdForOnboarding(examGoalSlug, country) ?? "us-rn-nclex-rn";

  if (dryRun) {
    console.log("[dry-run] Would upsert learner user:", {
      email,
      name,
      country,
      tier,
      alliedCareer,
      role: UserRole.LEARNER,
      authProvider: "credentials",
      emailVerified: true,
      trialStatus: TrialStatus.NONE,
      onboardingCompletedAt: "(now)",
      learnerPath: learnerPathDefault,
      examFocus: examGoalSlug,
      targetExamPathwayId: learnerPathDefault,
      examGoalSetAt: "(now)",
    });
    if (existing) {
      console.log("[dry-run] Would replace subscriptions with one synthetic ACTIVE row:", {
        status: SubscriptionStatus.ACTIVE,
        stripeSubscriptionId: syntheticStripeSubscriptionId(existing.id),
        planTier: tier,
        planCountry: country,
        planCode: "qa_synthetic_monthly",
        currentPeriodEnd: periodEnd.toISOString(),
      });
    } else {
      console.log("[dry-run] Would create user then add subscription as above.");
    }
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(plain!, 12);
  plain = "";

  const userId = await prisma.$transaction(async (tx) => {
    let uid: string;

    if (existing) {
      const u = await tx.user.update({
        where: { id: existing.id },
        data: {
          email,
          normalizedEmail: normalizeEmailForDedup(email),
          name,
          passwordHash,
          role: UserRole.LEARNER,
          country,
          tier,
          authProvider: "credentials",
          emailVerified: true,
          credentialVersion: { increment: 1 },
          trialStatus: TrialStatus.NONE,
          trialEndsAt: null,
          trialStartedAt: null,
          trialUsedAt: null,
          alliedProfessionKey: alliedCareer,
          onboardingCompletedAt: new Date(),
          learnerPath: learnerPathDefault,
          examFocus: examGoalSlug,
          targetExamPathwayId: learnerPathDefault,
          examGoalSetAt: new Date(),
        },
        select: { id: true },
      });
      uid = u.id;
    } else {
      const u = await tx.user.create({
        data: {
          email,
          normalizedEmail: normalizeEmailForDedup(email),
          name,
          passwordHash,
          role: UserRole.LEARNER,
          country,
          tier,
          authProvider: "credentials",
          emailVerified: true,
          credentialVersion: 0,
          trialStatus: TrialStatus.NONE,
          alliedProfessionKey: alliedCareer,
          onboardingCompletedAt: new Date(),
          learnerPath: learnerPathDefault,
          examFocus: examGoalSlug,
          targetExamPathwayId: learnerPathDefault,
          examGoalSetAt: new Date(),
        },
        select: { id: true },
      });
      uid = u.id;
    }

    await tx.subscription.deleteMany({ where: { userId: uid } });

    const stripeSubscriptionId = syntheticStripeSubscriptionId(uid);
    await tx.subscription.create({
      data: {
        userId: uid,
        status: SubscriptionStatus.ACTIVE,
        stripeSubscriptionId,
        stripeCustomerId: `cus_nn_qa_e2e_${uid.slice(-16)}`,
        planTier: tier,
        planCountry: country,
        planDuration: "month",
        planCode: "qa_synthetic_monthly",
        currentPeriodEnd: periodEnd,
        cancelAtPeriodEnd: false,
        alliedCareer: tier === TierCode.ALLIED ? alliedCareer : null,
      },
    });

    return uid;
  });

  console.log(`OK — QA paid test account ready for ${email} (user id ${userId.slice(0, 8)}…).`);
  console.log("Premium: ACTIVE subscription row (synthetic Stripe id), planTier/planCountry set.");
  console.log(`Onboarding: completed; learnerPath=${learnerPathDefault} (matches /app dashboard + pathway hubs).`);
  console.log(
    "Sign in at /login with email + password; Playwright: QA_PAID_EMAIL / QA_PAID_PASSWORD (or E2E_* / PLAYWRIGHT_TEST_*).",
  );
}

main()
  .catch((e: unknown) => {
    const msg = e instanceof Error ? e.message : String(e);
    if (/password authentication failed|FATAL:.*password/i.test(msg)) {
      console.error("[qa-cli-env] postgres_auth: failed (password mismatch or stale credential in chosen env source — rotate DB password in DO dashboard and align the same variable the script used, without committing secrets)");
    }
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
