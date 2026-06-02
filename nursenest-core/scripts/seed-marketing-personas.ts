#!/usr/bin/env npx tsx
/**
 * seed-marketing-personas.ts
 *
 * Creates or resets five dedicated QA personas for marketing screenshots.
 * Each persona has realistic learner data: streaks, topic stats, exam history,
 * and practice test results — so screenshots show an active, engaged learner
 * rather than an empty or default state.
 *
 * USAGE
 *   DATABASE_URL=... npx tsx scripts/seed-marketing-personas.ts
 *   DATABASE_URL=... PERSONA_RESET=1 npx tsx scripts/seed-marketing-personas.ts
 *   DATABASE_URL=... PERSONA_IDS=rn,np npx tsx scripts/seed-marketing-personas.ts
 *
 * ENV
 *   DATABASE_URL           required
 *   PERSONA_RESET          "1" to delete + recreate all persona accounts
 *   PERSONA_IDS            comma-separated subset: rn,pn,np,allied,newgrad
 *   PERSONA_PASSWORD       shared password for all accounts (default: MarketingQA2025!)
 */

import "../src/lib/db/script-env-bootstrap";
import { randomBytes } from "node:crypto";
import { hash } from "bcryptjs";
import { PrismaClient, type Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const SHARED_PASSWORD =
  process.env.PERSONA_PASSWORD?.trim() ?? "MarketingQA2025!";
const PERSONA_RESET = process.env.PERSONA_RESET === "1";
const PERSONA_IDS_FILTER = process.env.PERSONA_IDS?.trim()
  ? new Set(process.env.PERSONA_IDS.split(",").map((s) => s.trim()))
  : null;

// ─── Persona definitions ──────────────────────────────────────────────────────

type PersonaDef = {
  id: string;
  email: string;
  name: string;
  tier: "RN" | "RPN" | "NP" | "ALLIED" | "NEW_GRAD";
  tierCode: "RN" | "LVN_LPN" | "NP" | "ALLIED" | "NEW_GRAD";
  countryCode: "CA" | "US";
  learnerPath: string;
  alliedProfessionKey?: string;
  stripeTier: "RN" | "RPN" | "NP" | "ALLIED" | "NEW_GRAD";
  studyGoal: string;
  /** How many days back the streak starts */
  streakDays: number;
  cardsReviewedTotal: number;
  /** Topics to seed with performance data */
  topics: Array<{ name: string; correct: number; wrong: number }>;
  /** Completed practice tests to seed */
  examHistory: Array<{
    score: number;
    total: number;
    topics: string[];
  }>;
};

const PERSONAS: PersonaDef[] = [
  {
    id: "rn",
    email: "screenshot-rn@internal.nursenest.io",
    name: "Alex Chen — RN Learner",
    tier: "RN",
    tierCode: "RN",
    countryCode: "CA",
    learnerPath: "ca-rn-nclex-rn",
    stripeTier: "RN",
    studyGoal: "NCLEX-RN preparation — marketing screenshot account",
    streakDays: 14,
    cardsReviewedTotal: 847,
    topics: [
      { name: "Safe & Effective Care Environment", correct: 182, wrong: 38 },
      { name: "Pharmacological Therapies", correct: 96, wrong: 52 },
      { name: "Reduction of Risk Potential", correct: 74, wrong: 29 },
      { name: "Physiological Adaptation", correct: 88, wrong: 41 },
      { name: "Psychosocial Integrity", correct: 62, wrong: 14 },
      { name: "Health Promotion and Maintenance", correct: 57, wrong: 22 },
      { name: "Management of Care", correct: 103, wrong: 45 },
      { name: "Basic Care and Comfort", correct: 44, wrong: 11 },
    ],
    examHistory: [
      { score: 72, total: 85, topics: ["Safe & Effective Care Environment", "Pharmacological Therapies"] },
      { score: 68, total: 75, topics: ["Physiological Adaptation", "Reduction of Risk Potential"] },
      { score: 81, total: 90, topics: ["Management of Care", "Health Promotion and Maintenance"] },
    ],
  },
  {
    id: "pn",
    email: "screenshot-pn@internal.nursenest.io",
    name: "Jordan Lee — RPN Learner",
    tier: "RPN",
    tierCode: "LVN_LPN",
    countryCode: "CA",
    learnerPath: "ca-rpn-rex-pn",
    stripeTier: "RPN",
    studyGoal: "REx-PN preparation — marketing screenshot account",
    streakDays: 9,
    cardsReviewedTotal: 523,
    topics: [
      { name: "Safe and Effective Nursing Care", correct: 134, wrong: 31 },
      { name: "Health and Wellness", correct: 78, wrong: 24 },
      { name: "Alterations in Health", correct: 91, wrong: 47 },
      { name: "Professional Practice", correct: 56, wrong: 18 },
      { name: "Foundations of Practice", correct: 102, wrong: 33 },
    ],
    examHistory: [
      { score: 61, total: 75, topics: ["Safe and Effective Nursing Care", "Alterations in Health"] },
      { score: 74, total: 85, topics: ["Foundations of Practice", "Health and Wellness"] },
    ],
  },
  {
    id: "np",
    email: "screenshot-np@internal.nursenest.io",
    name: "Dr. Sam Rivera — NP Learner",
    tier: "NP",
    tierCode: "NP",
    countryCode: "CA",
    learnerPath: "ca-np-cnple",
    stripeTier: "NP",
    studyGoal: "CNPLE preparation — marketing screenshot account",
    streakDays: 21,
    cardsReviewedTotal: 1142,
    topics: [
      { name: "Clinical Reasoning & Decision Making", correct: 231, wrong: 67 },
      { name: "Advanced Pharmacology", correct: 189, wrong: 84 },
      { name: "Diagnostic Reasoning", correct: 147, wrong: 59 },
      { name: "Patient Management", correct: 203, wrong: 71 },
      { name: "Scope of Practice", correct: 96, wrong: 28 },
      { name: "Health Assessment", correct: 174, wrong: 52 },
      { name: "CNPLE Core Competencies", correct: 118, wrong: 43 },
    ],
    examHistory: [
      { score: 78, total: 90, topics: ["Clinical Reasoning & Decision Making", "Advanced Pharmacology"] },
      { score: 82, total: 95, topics: ["Diagnostic Reasoning", "Patient Management"] },
      { score: 85, total: 100, topics: ["CNPLE Core Competencies", "Health Assessment"] },
    ],
  },
  {
    id: "allied",
    email: "screenshot-allied@internal.nursenest.io",
    name: "Morgan Wu — Allied Health Learner",
    tier: "ALLIED",
    tierCode: "ALLIED",
    countryCode: "CA",
    learnerPath: "ca-allied-mlt",
    alliedProfessionKey: "mlt",
    stripeTier: "ALLIED",
    studyGoal: "MLT certification — marketing screenshot account",
    streakDays: 7,
    cardsReviewedTotal: 389,
    topics: [
      { name: "Hematology", correct: 87, wrong: 23 },
      { name: "Clinical Chemistry", correct: 94, wrong: 37 },
      { name: "Microbiology", correct: 71, wrong: 29 },
      { name: "Immunology & Serology", correct: 58, wrong: 19 },
      { name: "Transfusion Medicine", correct: 63, wrong: 31 },
      { name: "Urinalysis & Body Fluids", correct: 49, wrong: 14 },
    ],
    examHistory: [
      { score: 66, total: 75, topics: ["Hematology", "Clinical Chemistry"] },
      { score: 71, total: 80, topics: ["Microbiology", "Immunology & Serology"] },
    ],
  },
  {
    id: "newgrad",
    email: "screenshot-newgrad@internal.nursenest.io",
    name: "Taylor Brooks — New Grad Learner",
    tier: "NEW_GRAD",
    tierCode: "NEW_GRAD",
    countryCode: "CA",
    learnerPath: "ca-rn-new-grad",
    stripeTier: "NEW_GRAD",
    studyGoal: "Transition to practice — marketing screenshot account",
    streakDays: 11,
    cardsReviewedTotal: 634,
    topics: [
      { name: "Shift Prioritization", correct: 118, wrong: 44 },
      { name: "Medication Safety", correct: 96, wrong: 37 },
      { name: "Delegation and Supervision", correct: 83, wrong: 28 },
      { name: "ECG & Telemetry Basics", correct: 72, wrong: 41 },
      { name: "Clinical Communication (SBAR)", correct: 91, wrong: 22 },
      { name: "Documentation", correct: 64, wrong: 18 },
      { name: "Specialty Orientation", correct: 55, wrong: 31 },
    ],
    examHistory: [
      { score: 74, total: 85, topics: ["Shift Prioritization", "Medication Safety"] },
      { score: 79, total: 90, topics: ["ECG & Telemetry Basics", "Clinical Communication (SBAR)"] },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(8, 30, 0, 0);
  return d;
}

async function ensureSubscription(userId: string, persona: PersonaDef): Promise<void> {
  const existing = await prisma.subscription.findFirst({ where: { userId } });
  if (existing) return;

  await prisma.subscription.create({
    data: {
      userId,
      status: "ACTIVE",
      stripeSubscriptionId: `demo_persona_${persona.id}_${randomBytes(8).toString("hex")}`,
      stripeCustomerId: null,
      planTier: persona.tierCode as Parameters<typeof prisma.subscription.create>[0]["data"]["planTier"],
      planCountry: persona.countryCode,
      planDuration: "demo",
      planCode: `screenshot_persona_${persona.id}`,
      currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      cancelAtPeriodEnd: false,
    },
  });
}

async function seedFlashcardStats(userId: string, persona: PersonaDef): Promise<void> {
  await prisma.flashcardUserStats.upsert({
    where: { userId },
    create: {
      userId,
      currentStreak: persona.streakDays,
      longestStreak: persona.streakDays + 3,
      lastStudyDate: daysAgo(0),
      cardsReviewedTotal: persona.cardsReviewedTotal,
    },
    update: {
      currentStreak: persona.streakDays,
      longestStreak: Math.max(persona.streakDays + 3, persona.cardsReviewedTotal / 20),
      lastStudyDate: daysAgo(0),
      cardsReviewedTotal: persona.cardsReviewedTotal,
    },
  });
}

async function seedTopicStats(userId: string, persona: PersonaDef): Promise<void> {
  for (const topic of persona.topics) {
    await prisma.userTopicStat.upsert({
      where: { userId_topic: { userId, topic: topic.name } },
      create: {
        userId,
        topic: topic.name,
        correctCount: topic.correct,
        wrongCount: topic.wrong,
        wrongStreak: topic.wrong > topic.correct ? 1 : 0,
        lastAttemptAt: daysAgo(Math.floor(Math.random() * 3)),
      },
      update: {
        correctCount: topic.correct,
        wrongCount: topic.wrong,
        lastAttemptAt: daysAgo(Math.floor(Math.random() * 3)),
      },
    });
  }
}

async function seedExamHistory(userId: string, persona: PersonaDef): Promise<void> {
  // Only seed if no exam history yet
  const existing = await prisma.practiceTest.count({ where: { userId, status: "COMPLETED" } });
  if (existing >= persona.examHistory.length) {
    console.log(`  ↳ ${persona.id}: exam history already present (${existing} records)`);
    return;
  }

  for (let i = 0; i < persona.examHistory.length; i++) {
    const h = persona.examHistory[i];
    const daysBack = (persona.examHistory.length - i) * 4;

    await prisma.practiceTest.create({
      data: {
        userId,
        title: `Practice Test ${i + 1} — ${persona.topics[0]?.name ?? "General"}`,
        config: {
          pathwayId: persona.learnerPath,
          topics: h.topics,
          selectionMode: "topic",
          questionCount: h.total,
        },
        questionIds: [],
        answers: {},
        status: "COMPLETED",
        timedMode: true,
        timeLimitSec: h.total * 90,
        elapsedMs: (h.total * 60 + Math.floor(Math.random() * 1200)) * 1000,
        startedAt: daysAgo(daysBack),
        completedAt: daysAgo(daysBack),
        results: {
          score: h.score,
          total: h.total,
          percentage: Math.round((h.score / h.total) * 100),
          weakTopics: persona.topics
            .filter((t) => t.wrong > t.correct * 0.4)
            .map((t) => t.name)
            .slice(0, 3),
          strongTopics: persona.topics
            .filter((t) => t.correct > t.wrong * 3)
            .map((t) => t.name)
            .slice(0, 2),
          topicBreakdown: h.topics.map((name) => ({
            topic: name,
            correct: Math.floor(h.score / h.topics.length),
            total: Math.floor(h.total / h.topics.length),
          })),
        },
      },
    });
  }
}

async function seedOrUpdatePersona(persona: PersonaDef): Promise<void> {
  console.log(`\n[${persona.id}] ${persona.name}`);
  console.log(`  email: ${persona.email}  tier: ${persona.tierCode}  path: ${persona.learnerPath}`);

  if (PERSONA_RESET) {
    const deleted = await prisma.user.deleteMany({ where: { email: persona.email } });
    if (deleted.count > 0) {
      console.log(`  deleted ${deleted.count} existing account(s)`);
    }
  }

  const passwordHash = await hash(SHARED_PASSWORD, 12);

  const existing = await prisma.user.findUnique({ where: { email: persona.email } });
  let userId: string;

  if (existing) {
    console.log(`  account exists (${existing.id})`);
    await prisma.user.update({
      where: { id: existing.id },
      data: {
        isDemoUser: true,
        learnerPath: persona.learnerPath,
        tier: persona.tierCode as Parameters<typeof prisma.user.update>[0]["data"]["tier"],
        country: persona.countryCode,
        alliedProfessionKey: persona.alliedProfessionKey ?? null,
      },
    });
    userId = existing.id;
  } else {
    const user = await prisma.user.create({
      data: {
        email: persona.email,
        name: persona.name,
        passwordHash,
        role: "LEARNER",
        country: persona.countryCode,
        tier: persona.tierCode as Parameters<typeof prisma.user.create>[0]["data"]["tier"],
        learnerPath: persona.learnerPath,
        alliedProfessionKey: persona.alliedProfessionKey ?? null,
        isDemoUser: true,
        onboardingCompletedAt: daysAgo(30),
        studyGoal: persona.studyGoal,
        dailyStudyMinutes: 60,
        emailVerified: true,
      },
    });
    userId = user.id;
    console.log(`  created (${userId})`);
  }

  await ensureSubscription(userId, persona);
  await seedFlashcardStats(userId, persona);
  await seedTopicStats(userId, persona);
  await seedExamHistory(userId, persona);

  console.log(`  ✓ ${persona.id} persona ready`);
  console.log(`    email: ${persona.email}`);
  console.log(`    pass:  ${SHARED_PASSWORD}`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const targets = PERSONA_IDS_FILTER
    ? PERSONAS.filter((p) => PERSONA_IDS_FILTER.has(p.id))
    : PERSONAS;

  if (targets.length === 0) {
    console.error("No personas matched PERSONA_IDS filter.");
    process.exit(1);
  }

  console.log("NurseNest — marketing persona seeder");
  console.log(`Personas  : ${targets.map((p) => p.id).join(", ")}`);
  console.log(`Reset     : ${PERSONA_RESET}`);

  for (const persona of targets) {
    await seedOrUpdatePersona(persona);
  }

  console.log("\n────────────────────────────────────────");
  console.log(`Seeded ${targets.length} persona(s)`);
  console.log("\nCapture env vars:");
  for (const p of targets) {
    const envKey = p.id.toUpperCase();
    console.log(
      `  QA_${envKey}_EMAIL="${p.email}" QA_${envKey}_PASSWORD="${SHARED_PASSWORD}"`,
    );
  }
  console.log("\nFor generate-marketing-screenshots.ts, set tier-specific accounts:");
  console.log("  QA_PAID_EMAIL=screenshot-rn@internal.nursenest.io  (default / RN)");
  for (const p of targets.filter((p) => p.id !== "rn")) {
    console.log(`  SCREENSHOT_${p.id.toUpperCase()}_EMAIL=${p.email}`);
  }
}

main()
  .catch((e) => {
    console.error("ERROR:", e instanceof Error ? e.message : e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
