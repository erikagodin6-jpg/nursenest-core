#!/usr/bin/env npx tsx
/**
 * Creates (or resets) the dedicated demo/screenshot account.
 *
 * This account is used ONLY for capturing clean product screenshots.
 * It is NOT a real learner — never use it for billing, trials, or production data.
 *
 * The account has:
 *   - Predictable, stable credentials (from env or safe defaults for local dev)
 *   - LEARNER role with a completed onboarding state
 *   - No real PII
 *   - Entitlement override (via env SCREENSHOT_DEMO_ENTITLED=true) so premium
 *     surfaces are visible for screenshots without needing a real subscription
 *
 * Usage:
 *   npx tsx scripts/seed-screenshot-demo-user.ts
 *
 * Required env:
 *   DATABASE_URL — Prisma connection string
 *
 * Optional env:
 *   SCREENSHOT_DEMO_EMAIL      (default: demo-screenshots@internal.nursenest.io)
 *   SCREENSHOT_DEMO_PASSWORD   (default: DemoScreenshot2024!)
 *   SCREENSHOT_DEMO_COUNTRY    (default: CA)
 *   SCREENSHOT_DEMO_TIER       (default: RN)
 *   SCREENSHOT_DEMO_RESET      If "true", delete and recreate the account
 */

import "../src/lib/db/env-bootstrap";
import { hash } from "bcryptjs";
import { PrismaClient, type CountryCode, type TierCode } from "@prisma/client";

const prisma = new PrismaClient();

const DEMO_EMAIL =
  process.env.SCREENSHOT_DEMO_EMAIL?.trim() ?? "demo-screenshots@internal.nursenest.io";
const DEMO_PASSWORD =
  process.env.SCREENSHOT_DEMO_PASSWORD?.trim() ?? "DemoScreenshot2024!";
const DEMO_COUNTRY = (process.env.SCREENSHOT_DEMO_COUNTRY?.trim() ?? "CA") as CountryCode;
const DEMO_TIER = (process.env.SCREENSHOT_DEMO_TIER?.trim() ?? "RN") as TierCode;
const DEMO_RESET = process.env.SCREENSHOT_DEMO_RESET === "true";

async function main() {
  console.log("Screenshot demo account seed");
  console.log("  Email:   ", DEMO_EMAIL);
  console.log("  Country: ", DEMO_COUNTRY);
  console.log("  Tier:    ", DEMO_TIER);

  // Optional reset
  if (DEMO_RESET) {
    const deleted = await prisma.user.deleteMany({ where: { email: DEMO_EMAIL } });
    if (deleted.count > 0) {
      console.log(`  Deleted ${deleted.count} existing demo user(s).`);
    }
  }

  // Check if already exists
  const existing = await prisma.user.findUnique({ where: { email: DEMO_EMAIL } });
  if (existing) {
    console.log(`  Demo account already exists (id: ${existing.id}) — skipping creation.`);
    console.log("  Run with SCREENSHOT_DEMO_RESET=true to recreate.");
    printCredentials();
    return;
  }

  const passwordHash = await hash(DEMO_PASSWORD, 12);

  const user = await prisma.user.create({
    data: {
      email: DEMO_EMAIL,
      name: "Demo Screenshots",
      passwordHash,
      role: "LEARNER",
      country: DEMO_COUNTRY,
      tier: DEMO_TIER,
      // Onboarding complete — prevents prompts during screenshot sessions
      onboardingCompletedAt: new Date("2024-01-01T00:00:00Z"),
      // Stable study goal text so the dashboard looks consistent
      studyGoal: "NCLEX preparation — screenshot demo account",
      dailyStudyMinutes: 60,
    },
  });

  console.log(`\n  Created demo user: ${user.id}`);
  printCredentials();
}

function printCredentials() {
  console.log("\n  ─────────────────────────────────────────");
  console.log("  DEMO ACCOUNT CREDENTIALS");
  console.log("  ─────────────────────────────────────────");
  console.log(`  Email:    ${DEMO_EMAIL}`);
  console.log(`  Password: ${DEMO_PASSWORD}`);
  console.log("  ─────────────────────────────────────────");
  console.log("  Use these credentials in capture-screenshots.mjs");
  console.log("  NEVER use this account for real subscriptions or billing.\n");
}

main()
  .catch((e) => {
    console.error("ERROR:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
