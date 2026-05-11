#!/usr/bin/env npx tsx
/**
 * Creates or updates the dedicated screenshot/demo learner account with entitled access.
 *
 * Run from the Next.js app package:
 *   cd nursenest-core && DATABASE_URL=… npx tsx scripts/seed-screenshot-demo-user.ts
 *
 * Sets `User.isDemoUser`, active Subscription (non-Stripe demo row), and `learnerPath` so CAT,
 * lessons, labs, and premium surfaces resolve like a subscribed learner — without schema changes.
 */
import "../src/lib/db/env-bootstrap";
import { randomBytes } from "node:crypto";
import { hash } from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { getExamPathwayById } from "../src/lib/exam-pathways/exam-product-registry";
import { advancedEcgPlanCode } from "../src/lib/advanced-ecg/advanced-ecg-module-config";

const prisma = new PrismaClient();

const DEMO_EMAIL =
  process.env.SCREENSHOT_DEMO_EMAIL?.trim() ?? "demo-screenshots@internal.nursenest.io";
const DEMO_PASSWORD =
  process.env.SCREENSHOT_DEMO_PASSWORD?.trim() ?? "DemoScreenshot2024!";
const DEMO_RESET = process.env.SCREENSHOT_DEMO_RESET === "true";
const PATHWAY_ID = process.env.SCREENSHOT_DEMO_PATHWAY_ID?.trim() ?? "ca-rn-nclex-rn";
const INCLUDE_ADVANCED_ECG = process.env.SCREENSHOT_DEMO_INCLUDE_ADVANCED_ECG === "true";

async function ensureDemoSubscription(userId: string) {
  const pathway = getExamPathwayById(PATHWAY_ID);
  if (!pathway) {
    throw new Error(`Unknown SCREENSHOT_DEMO_PATHWAY_ID: ${PATHWAY_ID}`);
  }

  const existing = await prisma.subscription.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  if (existing) {
    console.log(`  Subscription already present (${existing.id}) — skipping create.`);
    return;
  }

  const stripeSubscriptionId = `demo_sub_${randomBytes(12).toString("hex")}`;
  await prisma.subscription.create({
    data: {
      userId,
      status: "ACTIVE",
      stripeSubscriptionId,
      stripeCustomerId: null,
      planTier: pathway.stripeTier,
      planCountry: pathway.countryCode,
      planDuration: "demo",
      planCode: "screenshot_demo_seed",
      currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      cancelAtPeriodEnd: false,
    },
  });
  console.log("  Created demo subscription row for screenshot captures.");
}

async function ensureAdvancedEcgEntitlement(userId: string, tier: string, country: string) {
  if (!INCLUDE_ADVANCED_ECG) return;

  const existing = await prisma.subscription.findFirst({
    where: { userId, planCode: advancedEcgPlanCode() },
    orderBy: { createdAt: "desc" },
  });
  if (existing) {
    console.log(`  Advanced ECG entitlement already present (${existing.id}) — skipping create.`);
    return;
  }

  await prisma.subscription.create({
    data: {
      userId,
      status: "ACTIVE",
      stripeSubscriptionId: `demo_advanced_ecg_${randomBytes(12).toString("hex")}`,
      stripeCustomerId: null,
      planTier: tier,
      planCountry: country,
      planDuration: "lifetime",
      planCode: advancedEcgPlanCode(),
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
    },
  });
  console.log("  Created Advanced ECG entitlement row for screenshot captures.");
}

async function main() {
  const pathway = getExamPathwayById(PATHWAY_ID);
  if (!pathway) {
    console.error(`Unknown pathway ${PATHWAY_ID}`);
    process.exit(1);
  }

  console.log("Screenshot demo account seed");
  console.log("  Email:    ", DEMO_EMAIL);
  console.log("  Pathway:  ", PATHWAY_ID, `(${pathway.shortName})`);

  if (DEMO_RESET) {
    const deleted = await prisma.user.deleteMany({ where: { email: DEMO_EMAIL } });
    if (deleted.count > 0) {
      console.log(`  Deleted ${deleted.count} existing demo user(s).`);
    }
  }

  const existing = await prisma.user.findUnique({ where: { email: DEMO_EMAIL } });
  if (existing) {
    console.log(`  Demo account already exists (id: ${existing.id}).`);
    await prisma.user.update({
      where: { id: existing.id },
      data: {
        isDemoUser: true,
        learnerPath: PATHWAY_ID,
        tier: pathway.stripeTier,
        country: pathway.countryCode,
      },
    });
    console.log("  Updated pathway / demo flags.");
    await ensureDemoSubscription(existing.id);
    await ensureAdvancedEcgEntitlement(existing.id, pathway.stripeTier, pathway.countryCode);
    printCredentials();
    return;
  }

  const passwordHash = await hash(DEMO_PASSWORD, 12);

  const user = await prisma.user.create({
    data: {
      email: DEMO_EMAIL,
      name: "Screenshot demo learner",
      passwordHash,
      role: "LEARNER",
      country: pathway.countryCode,
      tier: pathway.stripeTier,
      learnerPath: PATHWAY_ID,
      isDemoUser: true,
      onboardingCompletedAt: new Date("2024-01-01T00:00:00Z"),
      studyGoal: "NCLEX preparation — screenshot demo account",
      dailyStudyMinutes: 60,
      emailVerified: true,
    },
  });

  console.log(`\n  Created demo user: ${user.id}`);
  await ensureDemoSubscription(user.id);
  await ensureAdvancedEcgEntitlement(user.id, pathway.stripeTier, pathway.countryCode);
  printCredentials();
}

function printCredentials() {
  console.log("\n  ─────────────────────────────────────────");
  console.log("  DEMO ACCOUNT CREDENTIALS");
  console.log("  ─────────────────────────────────────────");
  console.log(`  Email:    ${DEMO_EMAIL}`);
  console.log(`  Password: ${DEMO_PASSWORD}`);
  console.log("  ─────────────────────────────────────────");
  console.log("  Use with: node nursenest-core/scripts/capture-marketing-screenshots.mjs");
  console.log("  Do not use for real billing or production study data.\n");
}

main()
  .catch((e) => {
    console.error("ERROR:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
