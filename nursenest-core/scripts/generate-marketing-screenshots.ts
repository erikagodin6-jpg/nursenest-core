#!/usr/bin/env tsx
/**
 * generate-marketing-screenshots.ts
 *
 * Comprehensive marketing screenshot generator for NurseNest.
 * Replaces all outdated screenshots across the marketing website with fresh
 * captures from the actual live learner experience using Playwright.
 *
 * USAGE
 *   npx tsx scripts/generate-marketing-screenshots.ts
 *   npx tsx scripts/generate-marketing-screenshots.ts --tier=rn
 *   npx tsx scripts/generate-marketing-screenshots.ts --tier=rn,pn,np
 *   npx tsx scripts/generate-marketing-screenshots.ts --theme=ocean,midnight
 *   npx tsx scripts/generate-marketing-screenshots.ts --viewport=desktop
 *   npx tsx scripts/generate-marketing-screenshots.ts --keys=rn-hub,cat-exam
 *   npx tsx scripts/generate-marketing-screenshots.ts --list
 *
 * ENV
 *   PLAYWRIGHT_BASE_URL           (default: http://127.0.0.1:3000)
 *   QA_PAID_EMAIL / QA_PAID_PASSWORD     default paid account (RN persona)
 *   E2E_PAID_EMAIL / E2E_PAID_PASSWORD
 *   SCREENSHOT_DEMO_EMAIL / SCREENSHOT_DEMO_PASSWORD
 *   PLAYWRIGHT_TEST_EMAIL / PLAYWRIGHT_TEST_PASSWORD
 *   SCREENSHOT_RN_EMAIL / SCREENSHOT_RN_PASSWORD      RN-specific persona
 *   SCREENSHOT_PN_EMAIL / SCREENSHOT_PN_PASSWORD      RPN/PN-specific persona
 *   SCREENSHOT_NP_EMAIL / SCREENSHOT_NP_PASSWORD      NP-specific persona
 *   SCREENSHOT_ALLIED_EMAIL / SCREENSHOT_ALLIED_PASSWORD  Allied persona
 *   SCREENSHOT_NEWGRAD_EMAIL / SCREENSHOT_NEWGRAD_PASSWORD  New Grad persona
 *   SCREENSHOT_WAIT_MS            extra hydration wait ms (default: 1200)
 *   SCREENSHOT_WEBP_QUALITY       1-100 (default: 82)
 *   SCREENSHOT_SKIP_FRAME         set "1" to skip browser-chrome compositing
 *   SCREENSHOT_INCLUDE_THEMES     comma-separated list to override default theme set
 *   SCREENSHOT_OUT_DIR            override output directory
 *
 * PREREQUISITES
 *   1. `npx playwright install chromium`
 *   2. App running at PLAYWRIGHT_BASE_URL  (npm run dev:next:3000)
 *   3. Personas seeded: DATABASE_URL=... npm run seed:marketing-personas
 *   4. `sharp` already a project dependency
 *
 * OUTPUT
 *   public/marketing/generated-screenshots/
 *     {tier}/{key}.webp              (1440-wide desktop primary)
 *     {tier}/{key}-{w}w.webp         (responsive variants: 1200, 768, 480)
 *     {tier}/{key}-tablet.webp       (768-viewport)
 *     {tier}/{key}-mobile.webp       (390-viewport)
 *     themes/{theme}/{key}.webp      (multi-theme variants for flagged keys)
 *     manifest.json
 */

import { chromium, type Page, type BrowserContext } from "playwright";
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

// ─── Paths ────────────────────────────────────────────────────────────────────

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const APP_ROOT = path.join(__dirname, "..");

const BASE_URL = (
  process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000"
).replace(/\/$/, "");

const OUT_DIR = process.env.SCREENSHOT_OUT_DIR
  ? path.resolve(process.env.SCREENSHOT_OUT_DIR)
  : path.join(APP_ROOT, "public", "marketing", "generated-screenshots");

const EXTRA_WAIT_MS = Number(process.env.SCREENSHOT_WAIT_MS ?? "1200");
const WEBP_QUALITY = Number(process.env.SCREENSHOT_WEBP_QUALITY ?? "82");
const SKIP_FRAME = process.env.SCREENSHOT_SKIP_FRAME === "1";

// ─── Credentials ─────────────────────────────────────────────────────────────

/**
 * Per-tier persona credentials. Each tier gets its own login so the dashboard,
 * analytics, and hub show tier-appropriate data.
 * Falls back to the default QA account if the tier-specific vars are not set.
 */
const TIER_CREDENTIALS: Record<string, { email: string; password: string } | null> = {
  rn:      resolveOptionalCreds("SCREENSHOT_RN_EMAIL",      "SCREENSHOT_RN_PASSWORD"),
  pn:      resolveOptionalCreds("SCREENSHOT_PN_EMAIL",      "SCREENSHOT_PN_PASSWORD"),
  np:      resolveOptionalCreds("SCREENSHOT_NP_EMAIL",      "SCREENSHOT_NP_PASSWORD"),
  allied:  resolveOptionalCreds("SCREENSHOT_ALLIED_EMAIL",  "SCREENSHOT_ALLIED_PASSWORD"),
  newgrad: resolveOptionalCreds("SCREENSHOT_NEWGRAD_EMAIL", "SCREENSHOT_NEWGRAD_PASSWORD"),
};

function resolveOptionalCreds(
  emailVar: string,
  passwordVar: string,
): { email: string; password: string } | null {
  const email = process.env[emailVar]?.trim();
  const password = process.env[passwordVar]?.trim();
  if (!email || !password) return null;
  return { email, password };
}

function resolveCredentials(): { email: string; password: string } {
  const email =
    process.env.QA_PAID_EMAIL ??
    process.env.E2E_PAID_EMAIL ??
    process.env.SCREENSHOT_DEMO_EMAIL ??
    process.env.PLAYWRIGHT_TEST_EMAIL;
  const password =
    process.env.QA_PAID_PASSWORD ??
    process.env.E2E_PAID_PASSWORD ??
    process.env.SCREENSHOT_DEMO_PASSWORD ??
    process.env.PLAYWRIGHT_TEST_PASSWORD;

  if (!email || !password) {
    throw new Error(
      [
        "No credentials found. Set one of:",
        "  QA_PAID_EMAIL + QA_PAID_PASSWORD",
        "  E2E_PAID_EMAIL + E2E_PAID_PASSWORD",
        "  SCREENSHOT_DEMO_EMAIL + SCREENSHOT_DEMO_PASSWORD",
        "  PLAYWRIGHT_TEST_EMAIL + PLAYWRIGHT_TEST_PASSWORD",
        "",
        "For richer tier-specific screenshots, also set per-persona vars:",
        "  SCREENSHOT_RN_EMAIL / SCREENSHOT_RN_PASSWORD",
        "  SCREENSHOT_PN_EMAIL / SCREENSHOT_PN_PASSWORD",
        "  SCREENSHOT_NP_EMAIL / SCREENSHOT_NP_PASSWORD",
        "  (seed with: DATABASE_URL=... npm run seed:marketing-personas)",
      ].join("\n"),
    );
  }
  return { email, password };
}

// ─── Themes ───────────────────────────────────────────────────────────────────

const THEME_STORAGE_KEY = "nursenest-theme";

/**
 * Five-theme set for marketing screenshots.
 * Ocean (light default), Midnight (dark), Blossom (pink light),
 * Aurora (purple light), Sage Garden (green light).
 */
const ALL_THEMES = [
  "ocean",
  "midnight",
  "blossom",
  "aurora",
  "sage-garden",
] as const;
type ThemeId = (typeof ALL_THEMES)[number];

const DARK_THEMES = new Set<string>(["midnight"]);

function isDark(theme: string): boolean {
  return DARK_THEMES.has(theme);
}

// ─── Viewports ────────────────────────────────────────────────────────────────

const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 390, height: 844 },
} as const;
type ViewportKey = keyof typeof VIEWPORTS;

// ─── Capture target schema ────────────────────────────────────────────────────

type AuthMode = "guest" | "paid";

type CaptureTarget = {
  /** Unique key → filename (e.g. `rn-hub` → `rn/rn-hub.webp`). */
  key: string;
  label: string;
  tier: string;
  route: string;
  theme: ThemeId;
  auth: AuthMode;
  /**
   * Which viewports to also capture. Desktop is always first.
   * For mobile-first targets, put mobile/tablet first to express intent,
   * but desktop capture always runs regardless.
   */
  viewports?: ViewportKey[];
  /** CSS selector to wait for before screenshotting. */
  waitFor?: string;
  /** Also capture in all other themes. Desktop only. */
  themeVariants?: boolean;
  extraWaitMs?: number;
  /**
   * Persona key to use for login (rn/pn/np/allied/newgrad).
   * Falls back to default QA account if the persona creds aren't set.
   */
  persona?: string;
  notes?: string;
};

type CaptureReadinessCheck = {
  name: string;
  selector: string;
  minVisible?: number;
};

const BLOCKED_CAPTURE_TEXT = [
  "Just a moment",
  "Loading",
  "Please wait",
  "Fetching",
  "Preparing",
  "Application error",
  "Something went wrong",
] as const;

const BLOCKED_CAPTURE_SELECTORS = [
  ".nn-skeleton",
  "[class*='skeleton' i]",
  "[data-testid*='skeleton' i]",
  "[aria-busy='true']",
  "[role='status']",
  "[class*='spinner' i]",
  "[class*='loading' i]",
  "[data-loading='true']",
  ".animate-pulse",
  ".animate-spin",
] as const;

// ─── All capture targets ──────────────────────────────────────────────────────

const TARGETS: CaptureTarget[] = [
  // ── Marketing pages ─────────────────────────────────────────────────────────
  {
    key: "marketing-home-desktop",
    label: "Homepage — desktop hero",
    tier: "marketing",
    route: "/",
    theme: "ocean",
    auth: "guest",
    viewports: ["desktop", "tablet", "mobile"],
    waitFor: "main",
    themeVariants: true,
    notes: "Full homepage with hero + platform preview carousel.",
  },
  {
    key: "pricing",
    label: "Pricing page",
    tier: "marketing",
    route: "/pricing",
    theme: "ocean",
    auth: "guest",
    viewports: ["desktop", "tablet"],
    waitFor: "main",
    themeVariants: true,
  },
  {
    key: "faq",
    label: "FAQ page",
    tier: "marketing",
    route: "/faq",
    theme: "ocean",
    auth: "guest",
    viewports: ["desktop"],
    waitFor: "main",
  },
  {
    key: "rn-marketing-hub",
    label: "RN pathway hub — marketing",
    tier: "marketing",
    route: "/us/rn/nclex-rn",
    theme: "ocean",
    auth: "guest",
    viewports: ["desktop"],
    waitFor: "main",
  },
  {
    key: "rn-questions-marketing",
    label: "RN Question Bank — marketing",
    tier: "marketing",
    route: "/us/rn/nclex-rn/questions",
    theme: "ocean",
    auth: "guest",
    viewports: ["desktop"],
    waitFor: "main",
  },
  {
    key: "rn-lessons-marketing",
    label: "RN Lessons — marketing",
    tier: "marketing",
    route: "/us/rn/nclex-rn/lessons",
    theme: "ocean",
    auth: "guest",
    viewports: ["desktop"],
    waitFor: "main",
  },
  {
    key: "pn-marketing-hub",
    label: "RPN/PN pathway hub — marketing",
    tier: "marketing",
    route: "/canada/pn/rex-pn",
    theme: "ocean",
    auth: "guest",
    viewports: ["desktop"],
    waitFor: "main",
  },
  {
    key: "np-marketing-hub",
    label: "NP pathway hub — marketing (CNPLE)",
    tier: "marketing",
    route: "/canada/np/cnple",
    theme: "ocean",
    auth: "guest",
    viewports: ["desktop"],
    waitFor: "main",
  },
  {
    key: "allied-marketing-hub",
    label: "Allied Health hub — marketing",
    tier: "marketing",
    route: "/allied/allied-health",
    theme: "ocean",
    auth: "guest",
    viewports: ["desktop"],
    waitFor: "main",
  },
  {
    key: "new-grad-marketing-hub",
    label: "New Grad hub — marketing",
    tier: "marketing",
    route: "/canada/new-grad",
    theme: "ocean",
    auth: "guest",
    viewports: ["desktop"],
    waitFor: "main",
  },

  // ── Core learner surfaces (maps to CDN screenshot1–15) ──────────────────────
  {
    key: "practice-rationale",
    label: "Practice Questions — rationale panel",
    tier: "core",
    route: "/app/questions/session",
    theme: "ocean",
    auth: "paid",
    viewports: ["desktop"],
    waitFor: "main",
    themeVariants: true,
    notes: "CDN slot 1. Start a short session from /app/questions if in setup state.",
  },
  {
    key: "flashcards",
    label: "Flashcard study mode",
    tier: "core",
    route: "/app/flashcards",
    theme: "ocean",
    auth: "paid",
    viewports: ["desktop", "mobile"],
    waitFor: "main",
    themeVariants: true,
    notes: "CDN slot 2.",
  },
  {
    key: "learner-dashboard",
    label: "Learner dashboard",
    tier: "core",
    route: "/app",
    theme: "ocean",
    auth: "paid",
    viewports: ["desktop", "tablet", "mobile"],
    waitFor: '[data-testid="learner-dashboard-shell"], main',
    themeVariants: true,
    notes: "CDN slot 3. Shows streak + next-step cards.",
  },
  {
    key: "question-bank-advanced",
    label: "NGN / advanced question types",
    tier: "core",
    route: "/app/questions/bank",
    theme: "ocean",
    auth: "paid",
    viewports: ["desktop"],
    waitFor: "main",
    notes: "CDN slot 4. NGN/matrix/extended reasoning formats.",
  },
  {
    key: "progress-report",
    label: "Progress report — topic accuracy",
    tier: "core",
    route: "/app/account/report",
    theme: "ocean",
    auth: "paid",
    viewports: ["desktop"],
    waitFor: "main",
    notes: "CDN slot 5.",
  },
  {
    key: "cat-exam-session",
    label: "CAT exam — adaptive session",
    tier: "core",
    route: "/app/practice-tests/cat-launch?pathwayId=ca-rn-nclex-rn",
    theme: "midnight",
    auth: "paid",
    viewports: ["desktop"],
    waitFor: "main",
    notes: "CDN slot 6. Shows CAT launch briefing.",
  },
  {
    key: "cat-results",
    label: "CAT results — readiness + weak areas",
    tier: "core",
    route: "/app/practice-tests/cat-insights",
    theme: "midnight",
    auth: "paid",
    viewports: ["desktop"],
    waitFor: "main",
    notes: "CDN slot 7. Needs graded CAT history for full chart display.",
  },
  {
    key: "study-plan",
    label: "Adaptive study plan",
    tier: "core",
    route: "/app/study-plan",
    theme: "ocean",
    auth: "paid",
    viewports: ["desktop"],
    waitFor: "main",
    themeVariants: true,
    notes: "CDN slot 8. Day-by-day plan cards.",
  },
  {
    key: "smart-review",
    label: "Smart review — grouped by confidence",
    tier: "core",
    route: "/app/review",
    theme: "ocean",
    auth: "paid",
    viewports: ["desktop"],
    waitFor: "main",
    themeVariants: true,
    notes: "CDN slot 9. Richer with answered question history.",
  },
  {
    key: "question-bank",
    label: "Question bank — browse",
    tier: "core",
    route: "/app/questions",
    theme: "ocean",
    auth: "paid",
    viewports: ["desktop"],
    waitFor: "main",
    themeVariants: true,
    notes: "CDN slot 10.",
  },
  {
    key: "confidence-analytics",
    label: "Confidence analytics",
    tier: "core",
    route: "/app/analytics",
    theme: "ocean",
    auth: "paid",
    viewports: ["desktop"],
    waitFor: "main",
    themeVariants: true,
    notes: "CDN slot 11. Needs graded history for full charts.",
  },
  {
    key: "lesson-detail",
    label: "Lesson content — detail view",
    tier: "core",
    route: "/app/lessons",
    theme: "aurora",
    auth: "paid",
    viewports: ["desktop"],
    waitFor: "main",
    notes: "CDN slot 12. Opens lesson library.",
  },
  {
    key: "lesson-library",
    label: "Lesson library — browse",
    tier: "core",
    route: "/app/lessons",
    theme: "ocean",
    auth: "paid",
    viewports: ["desktop"],
    waitFor: "main",
    notes: "CDN slot 13.",
  },
  {
    key: "ecg-workstation",
    label: "ECG & telemetry workstation",
    tier: "core",
    route: "/modules/ecg/basic/lessons",
    theme: "midnight",
    auth: "paid",
    viewports: ["desktop"],
    waitFor: "main",
    notes: "CDN slot 15. Telemetry education workspace.",
  },

  // ── RN learner experience ────────────────────────────────────────────────────
  {
    key: "rn-hub",
    label: "RN Hub — learner dashboard",
    tier: "rn",
    route: "/app",
    theme: "ocean",
    auth: "paid",
    viewports: ["desktop", "mobile"],
    waitFor: '[data-testid="learner-dashboard-shell"], main',
    themeVariants: true,
  },
  {
    key: "rn-practice-questions",
    label: "RN Practice Questions",
    tier: "rn",
    route: "/app/questions",
    theme: "ocean",
    auth: "paid",
    viewports: ["desktop"],
    waitFor: "main",
    themeVariants: true,
  },
  {
    key: "rn-ngn-questions",
    label: "RN NGN Question types",
    tier: "rn",
    route: "/app/questions/bank",
    theme: "ocean",
    auth: "paid",
    viewports: ["desktop"],
    waitFor: "main",
  },
  {
    key: "rn-flashcards",
    label: "RN Flashcards",
    tier: "rn",
    route: "/app/flashcards",
    theme: "ocean",
    auth: "paid",
    viewports: ["desktop"],
    waitFor: "main",
    themeVariants: true,
  },
  {
    key: "rn-lessons",
    label: "RN Lessons library",
    tier: "rn",
    route: "/app/lessons",
    theme: "ocean",
    auth: "paid",
    viewports: ["desktop"],
    waitFor: "main",
  },
  {
    key: "rn-cat-exam",
    label: "RN CAT Exam session",
    tier: "rn",
    route: "/app/practice-tests/cat-launch?pathwayId=ca-rn-nclex-rn",
    theme: "midnight",
    auth: "paid",
    viewports: ["desktop"],
    waitFor: "main",
  },
  {
    key: "rn-analytics",
    label: "RN Analytics — confidence & accuracy",
    tier: "rn",
    route: "/app/analytics",
    theme: "ocean",
    auth: "paid",
    viewports: ["desktop"],
    waitFor: "main",
  },
  {
    key: "rn-clinical-skills",
    label: "RN Clinical Skills",
    tier: "rn",
    route: "/app/clinical-skills",
    theme: "ocean",
    auth: "paid",
    viewports: ["desktop"],
    waitFor: "main",
  },
  {
    key: "rn-pharmacology",
    label: "RN Pharmacology",
    tier: "rn",
    route: "/app/pharmacology",
    theme: "ocean",
    auth: "paid",
    viewports: ["desktop"],
    waitFor: "main",
  },
  {
    key: "rn-ecg",
    label: "RN ECG workstation",
    tier: "rn",
    route: "/modules/ecg/basic/lessons",
    theme: "midnight",
    auth: "paid",
    viewports: ["desktop"],
    waitFor: "main",
  },
  {
    key: "rn-readiness",
    label: "RN Readiness dashboard",
    tier: "rn",
    route: "/app/account/readiness",
    theme: "ocean",
    auth: "paid",
    viewports: ["desktop"],
    waitFor: "main",
    themeVariants: true,
  },

  // ── RPN / PN learner experience ──────────────────────────────────────────────
  {
    key: "pn-hub",
    label: "RPN/PN Hub — learner dashboard",
    tier: "pn",
    route: "/app",
    theme: "ocean",
    auth: "paid",
    viewports: ["desktop", "mobile"],
    waitFor: '[data-testid="learner-dashboard-shell"], main',
    themeVariants: true,
  },
  {
    key: "pn-rex-pn",
    label: "RPN/PN — REx-PN CAT launch",
    tier: "pn",
    route: "/app/practice-tests/cat-launch?pathwayId=ca-rpn-rex-pn",
    theme: "midnight",
    auth: "paid",
    viewports: ["desktop"],
    waitFor: "main",
  },
  {
    key: "pn-questions",
    label: "RPN/PN Practice Questions",
    tier: "pn",
    route: "/app/questions",
    theme: "ocean",
    auth: "paid",
    viewports: ["desktop"],
    waitFor: "main",
  },
  {
    key: "pn-flashcards",
    label: "RPN/PN Flashcards",
    tier: "pn",
    route: "/app/flashcards",
    theme: "ocean",
    auth: "paid",
    viewports: ["desktop"],
    waitFor: "main",
  },
  {
    key: "pn-lessons",
    label: "RPN/PN Lessons",
    tier: "pn",
    route: "/app/lessons",
    theme: "ocean",
    auth: "paid",
    viewports: ["desktop"],
    waitFor: "main",
  },
  {
    key: "pn-cat",
    label: "RPN/PN CAT results & insights",
    tier: "pn",
    route: "/app/practice-tests/cat-insights",
    theme: "midnight",
    auth: "paid",
    viewports: ["desktop"],
    waitFor: "main",
  },
  {
    key: "pn-analytics",
    label: "RPN/PN Analytics",
    tier: "pn",
    route: "/app/analytics",
    theme: "ocean",
    auth: "paid",
    viewports: ["desktop"],
    waitFor: "main",
  },
  {
    key: "pn-clinical-skills",
    label: "RPN/PN Clinical Skills",
    tier: "pn",
    route: "/app/clinical-skills",
    theme: "ocean",
    auth: "paid",
    viewports: ["desktop"],
    waitFor: "main",
  },
  {
    key: "pn-pharmacology",
    label: "RPN/PN Pharmacology",
    tier: "pn",
    route: "/app/pharmacology",
    theme: "ocean",
    auth: "paid",
    viewports: ["desktop"],
    waitFor: "main",
  },

  // ── NP learner experience ────────────────────────────────────────────────────
  {
    key: "np-hub",
    label: "NP Hub — learner dashboard",
    tier: "np",
    route: "/app",
    theme: "ocean",
    auth: "paid",
    viewports: ["desktop", "mobile"],
    waitFor: '[data-testid="learner-dashboard-shell"], main',
    themeVariants: true,
  },
  {
    key: "np-cnple",
    label: "NP CNPLE cases hub",
    tier: "np",
    route: "/app/cases/cnple",
    theme: "ocean",
    auth: "paid",
    viewports: ["desktop"],
    waitFor: "main",
  },
  {
    key: "np-loft-simulation",
    label: "NP LOFT simulation — OSCE",
    tier: "np",
    route: "/app/osce",
    theme: "ocean",
    auth: "paid",
    viewports: ["desktop"],
    waitFor: "main",
  },
  {
    key: "np-clinical-reasoning",
    label: "NP Clinical reasoning — scenarios",
    tier: "np",
    route: "/app/clinical-scenarios",
    theme: "ocean",
    auth: "paid",
    viewports: ["desktop"],
    waitFor: "main",
  },
  {
    key: "np-lessons",
    label: "NP Lessons",
    tier: "np",
    route: "/app/lessons",
    theme: "ocean",
    auth: "paid",
    viewports: ["desktop"],
    waitFor: "main",
  },
  {
    key: "np-flashcards",
    label: "NP Flashcards",
    tier: "np",
    route: "/app/flashcards",
    theme: "ocean",
    auth: "paid",
    viewports: ["desktop"],
    waitFor: "main",
  },
  {
    key: "np-advanced-analytics",
    label: "NP Advanced analytics",
    tier: "np",
    route: "/app/analytics",
    theme: "ocean",
    auth: "paid",
    viewports: ["desktop"],
    waitFor: "main",
    themeVariants: true,
  },
  {
    key: "np-clinical-skills",
    label: "NP Clinical Skills",
    tier: "np",
    route: "/app/clinical-skills",
    theme: "ocean",
    auth: "paid",
    viewports: ["desktop"],
    waitFor: "main",
  },
  {
    key: "np-pharmacology",
    label: "NP Advanced Pharmacology",
    tier: "np",
    route: "/app/pharmacology",
    theme: "ocean",
    auth: "paid",
    viewports: ["desktop"],
    waitFor: "main",
  },

  // ── Allied Health learner experience ─────────────────────────────────────────
  {
    key: "allied-hub",
    label: "Allied Health Hub",
    tier: "allied",
    route: "/app",
    theme: "ocean",
    auth: "paid",
    viewports: ["desktop", "mobile"],
    waitFor: '[data-testid="learner-dashboard-shell"], main',
    themeVariants: true,
  },
  {
    key: "allied-questions",
    label: "Allied Health Questions",
    tier: "allied",
    route: "/app/questions",
    theme: "ocean",
    auth: "paid",
    viewports: ["desktop"],
    waitFor: "main",
  },
  {
    key: "allied-flashcards",
    label: "Allied Health Flashcards",
    tier: "allied",
    route: "/app/flashcards",
    theme: "ocean",
    auth: "paid",
    viewports: ["desktop"],
    waitFor: "main",
  },
  {
    key: "allied-lessons",
    label: "Allied Health Lessons",
    tier: "allied",
    route: "/app/lessons",
    theme: "ocean",
    auth: "paid",
    viewports: ["desktop"],
    waitFor: "main",
  },
  {
    key: "allied-clinical-skills",
    label: "Allied Health Clinical Skills",
    tier: "allied",
    route: "/app/clinical-skills",
    theme: "ocean",
    auth: "paid",
    viewports: ["desktop"],
    waitFor: "main",
  },
  {
    key: "allied-analytics",
    label: "Allied Health Analytics",
    tier: "allied",
    route: "/app/analytics",
    theme: "ocean",
    auth: "paid",
    viewports: ["desktop"],
    waitFor: "main",
  },
  {
    key: "allied-readiness",
    label: "Allied Health Readiness",
    tier: "allied",
    route: "/app/account/readiness",
    theme: "ocean",
    auth: "paid",
    viewports: ["desktop"],
    waitFor: "main",
  },

  // ── New Grad learner experience ──────────────────────────────────────────────
  {
    key: "newgrad-hub",
    label: "New Grad Hub — transition-to-practice",
    tier: "newgrad",
    route: "/app",
    theme: "ocean",
    auth: "paid",
    viewports: ["desktop", "mobile"],
    waitFor: '[data-testid="learner-dashboard-shell"], main',
    themeVariants: true,
  },
  {
    key: "newgrad-specialty-tracks",
    label: "New Grad Specialty Tracks — guided",
    tier: "newgrad",
    route: "/app/guided",
    theme: "ocean",
    auth: "paid",
    viewports: ["desktop"],
    waitFor: "main",
  },
  {
    key: "newgrad-clinical-skills",
    label: "New Grad Clinical Skills",
    tier: "newgrad",
    route: "/app/clinical-skills",
    theme: "ocean",
    auth: "paid",
    viewports: ["desktop"],
    waitFor: "main",
  },
  {
    key: "newgrad-pharmacology",
    label: "New Grad Advanced Pharmacology",
    tier: "newgrad",
    route: "/app/pharmacology",
    theme: "ocean",
    auth: "paid",
    viewports: ["desktop"],
    waitFor: "main",
  },
  {
    key: "newgrad-ecg",
    label: "New Grad ECG / Telemetry",
    tier: "newgrad",
    route: "/modules/ecg",
    theme: "midnight",
    auth: "paid",
    viewports: ["desktop"],
    waitFor: "main",
  },
  {
    key: "newgrad-simulations",
    label: "New Grad Clinical Simulations",
    tier: "newgrad",
    route: "/app/clinical-scenarios",
    theme: "ocean",
    auth: "paid",
    viewports: ["desktop"],
    waitFor: "main",
  },
  {
    key: "newgrad-readiness",
    label: "New Grad Readiness dashboard",
    tier: "newgrad",
    route: "/app/account/readiness",
    theme: "ocean",
    auth: "paid",
    viewports: ["desktop"],
    waitFor: "main",
    themeVariants: true,
  },
  {
    key: "newgrad-analytics",
    label: "New Grad Analytics — growth over time",
    tier: "newgrad",
    route: "/app/analytics",
    theme: "ocean",
    auth: "paid",
    viewports: ["desktop"],
    waitFor: "main",
  },

  // ── Feature deep-dives (FAQ / feature pages / authority clusters) ────────────
  {
    key: "feature-question-interface",
    label: "Feature — Question interface",
    tier: "features",
    route: "/app/questions",
    theme: "ocean",
    auth: "paid",
    viewports: ["desktop"],
    waitFor: "main",
    themeVariants: true,
  },
  {
    key: "feature-flashcard-interface",
    label: "Feature — Flashcard interface",
    tier: "features",
    route: "/app/flashcards",
    theme: "blossom",
    auth: "paid",
    viewports: ["desktop"],
    waitFor: "main",
    themeVariants: true,
  },
  {
    key: "feature-lesson-interface",
    label: "Feature — Lesson reading interface",
    tier: "features",
    route: "/app/lessons",
    theme: "aurora",
    auth: "paid",
    viewports: ["desktop"],
    waitFor: "main",
    themeVariants: true,
  },
  {
    key: "feature-analytics-interface",
    label: "Feature — Analytics dashboard",
    tier: "features",
    route: "/app/analytics",
    theme: "ocean",
    auth: "paid",
    viewports: ["desktop"],
    waitFor: "main",
    themeVariants: true,
  },
  {
    key: "feature-cat-interface",
    label: "Feature — CAT exam interface",
    tier: "features",
    route: "/app/practice-tests/cat-insights",
    theme: "midnight",
    auth: "paid",
    viewports: ["desktop"],
    waitFor: "main",
  },
  {
    key: "feature-loft-interface",
    label: "Feature — LOFT/OSCE simulation interface",
    tier: "features",
    route: "/app/osce",
    theme: "ocean",
    auth: "paid",
    viewports: ["desktop"],
    waitFor: "main",
  },
  {
    key: "feature-clinical-skills-interface",
    label: "Feature — Clinical Skills interface",
    tier: "features",
    route: "/app/clinical-skills",
    theme: "ocean",
    auth: "paid",
    viewports: ["desktop"],
    waitFor: "main",
  },
  {
    key: "feature-ecg-interface",
    label: "Feature — ECG workstation interface",
    tier: "features",
    route: "/modules/ecg/basic/lessons",
    theme: "midnight",
    auth: "paid",
    viewports: ["desktop"],
    waitFor: "main",
  },
  {
    key: "feature-clinical-scenarios",
    label: "Feature — Clinical scenarios interface",
    tier: "features",
    route: "/app/clinical-scenarios",
    theme: "ocean",
    auth: "paid",
    viewports: ["desktop"],
    waitFor: "main",
  },

  // ── Mobile-first captures (Phase 4) ──────────────────────────────────────────
  // These are dedicated mobile captures that are NOT just resized desktops.
  // Each is captured from the mobile viewport first, showing the real mobile UI.
  {
    key: "mobile-homepage",
    label: "Mobile — Homepage hero",
    tier: "mobile",
    route: "/",
    theme: "ocean",
    auth: "guest",
    viewports: ["mobile"],
    waitFor: "main",
    themeVariants: true,
    notes: "320px, 375px, 390px, 430px viewport captures.",
  },
  {
    key: "mobile-pricing",
    label: "Mobile — Pricing page",
    tier: "mobile",
    route: "/pricing",
    theme: "ocean",
    auth: "guest",
    viewports: ["mobile"],
    waitFor: "main",
  },
  {
    key: "mobile-faq",
    label: "Mobile — FAQ page",
    tier: "mobile",
    route: "/faq",
    theme: "ocean",
    auth: "guest",
    viewports: ["mobile"],
    waitFor: "main",
  },
  {
    key: "mobile-questions",
    label: "Mobile — Practice Questions",
    tier: "mobile",
    route: "/app/questions",
    theme: "ocean",
    auth: "paid",
    viewports: ["mobile"],
    waitFor: "main",
    themeVariants: true,
  },
  {
    key: "mobile-flashcards",
    label: "Mobile — Flashcard study",
    tier: "mobile",
    route: "/app/flashcards",
    theme: "ocean",
    auth: "paid",
    viewports: ["mobile"],
    waitFor: "main",
    themeVariants: true,
  },
  {
    key: "mobile-lessons",
    label: "Mobile — Lesson library",
    tier: "mobile",
    route: "/app/lessons",
    theme: "ocean",
    auth: "paid",
    viewports: ["mobile"],
    waitFor: "main",
  },
  {
    key: "mobile-clinical-skills",
    label: "Mobile — Clinical Skills",
    tier: "mobile",
    route: "/app/clinical-skills",
    theme: "ocean",
    auth: "paid",
    viewports: ["mobile"],
    waitFor: "main",
  },
  {
    key: "mobile-pharmacology",
    label: "Mobile — Pharmacology",
    tier: "mobile",
    route: "/app/pharmacology",
    theme: "ocean",
    auth: "paid",
    viewports: ["mobile"],
    waitFor: "main",
  },
  {
    key: "mobile-ecg",
    label: "Mobile — ECG module",
    tier: "mobile",
    route: "/modules/ecg",
    theme: "midnight",
    auth: "paid",
    viewports: ["mobile"],
    waitFor: "main",
  },
  {
    key: "mobile-analytics",
    label: "Mobile — Analytics dashboard",
    tier: "mobile",
    route: "/app/analytics",
    theme: "ocean",
    auth: "paid",
    viewports: ["mobile"],
    waitFor: "main",
  },
  {
    key: "mobile-readiness",
    label: "Mobile — Readiness dashboard",
    tier: "mobile",
    route: "/app/account/readiness",
    theme: "ocean",
    auth: "paid",
    viewports: ["mobile"],
    waitFor: "main",
    themeVariants: true,
  },
  // Tablet captures for key marketing surfaces
  {
    key: "tablet-homepage",
    label: "Tablet — Homepage",
    tier: "mobile",
    route: "/",
    theme: "ocean",
    auth: "guest",
    viewports: ["tablet"],
    waitFor: "main",
  },
  {
    key: "tablet-dashboard",
    label: "Tablet — Learner dashboard",
    tier: "mobile",
    route: "/app",
    theme: "ocean",
    auth: "paid",
    viewports: ["tablet"],
    waitFor: '[data-testid="learner-dashboard-shell"], main',
    themeVariants: true,
  },

  // ── New Grad flagship (Phase 5) ──────────────────────────────────────────────
  {
    key: "newgrad-transition-dashboard",
    label: "New Grad — Transition-to-Practice dashboard detail",
    tier: "newgrad-flagship",
    route: "/app",
    theme: "ocean",
    auth: "paid",
    viewports: ["desktop", "mobile"],
    waitFor: '[data-testid="learner-dashboard-shell"], main',
    themeVariants: true,
    persona: "newgrad",
    notes: "Uses New Grad persona for richer transition-to-practice data.",
  },
  {
    key: "newgrad-specialty-selection",
    label: "New Grad — Specialty Pathway Selector",
    tier: "newgrad-flagship",
    route: "/app/explore",
    theme: "ocean",
    auth: "paid",
    viewports: ["desktop", "mobile"],
    waitFor: "main",
    persona: "newgrad",
  },
  {
    key: "newgrad-telemetry-learning",
    label: "New Grad — Telemetry learning workspace",
    tier: "newgrad-flagship",
    route: "/modules/ecg/basic/lessons",
    theme: "midnight",
    auth: "paid",
    viewports: ["desktop"],
    waitFor: "main",
    persona: "newgrad",
    notes: "ECG/telemetry in midnight theme — flagship new grad differentiator.",
  },
  {
    key: "newgrad-advanced-ecg",
    label: "New Grad — Advanced ECG module hub",
    tier: "newgrad-flagship",
    route: "/modules/ecg",
    theme: "midnight",
    auth: "paid",
    viewports: ["desktop"],
    waitFor: "main",
    persona: "newgrad",
  },
  {
    key: "newgrad-simulation-experience",
    label: "New Grad — Clinical simulation experience",
    tier: "newgrad-flagship",
    route: "/app/clinical-scenarios",
    theme: "ocean",
    auth: "paid",
    viewports: ["desktop", "tablet"],
    waitFor: "main",
    persona: "newgrad",
  },
  {
    key: "newgrad-shift-prioritization",
    label: "New Grad — Shift prioritization practice",
    tier: "newgrad-flagship",
    route: "/app/questions",
    theme: "ocean",
    auth: "paid",
    viewports: ["desktop"],
    waitFor: "main",
    persona: "newgrad",
    notes: "Uses New Grad persona so topic stats show shift/delegation content.",
  },
  {
    key: "newgrad-readiness-full",
    label: "New Grad — Readiness dashboard (full data)",
    tier: "newgrad-flagship",
    route: "/app/account/readiness",
    theme: "ocean",
    auth: "paid",
    viewports: ["desktop", "mobile"],
    waitFor: "main",
    themeVariants: true,
    persona: "newgrad",
  },
  {
    key: "newgrad-clinical-skills-full",
    label: "New Grad — Clinical Skills (full data)",
    tier: "newgrad-flagship",
    route: "/app/clinical-skills",
    theme: "ocean",
    auth: "paid",
    viewports: ["desktop"],
    waitFor: "main",
    persona: "newgrad",
  },
  {
    key: "newgrad-pharmacology-full",
    label: "New Grad — Advanced Pharmacology (full data)",
    tier: "newgrad-flagship",
    route: "/app/pharmacology",
    theme: "ocean",
    auth: "paid",
    viewports: ["desktop"],
    waitFor: "main",
    persona: "newgrad",
  },
  {
    key: "newgrad-analytics-growth",
    label: "New Grad — Analytics growth timeline",
    tier: "newgrad-flagship",
    route: "/app/analytics",
    theme: "ocean",
    auth: "paid",
    viewports: ["desktop"],
    waitFor: "main",
    themeVariants: true,
    persona: "newgrad",
    notes: "Shows growth over time with New Grad persona data.",
  },

  // ── Allied Health profession-specific (Phase 6) ──────────────────────────────
  // Allied captures use the Allied persona to show profession-specific content.
  {
    key: "allied-profession-hub",
    label: "Allied Health — Profession hub (MLT example)",
    tier: "allied-profession",
    route: "/app",
    theme: "ocean",
    auth: "paid",
    viewports: ["desktop", "mobile"],
    waitFor: '[data-testid="learner-dashboard-shell"], main',
    themeVariants: true,
    persona: "allied",
    notes: "Uses Allied (MLT) persona — shows profession-specific hub.",
  },
  {
    key: "allied-profession-questions",
    label: "Allied Health — Profession-specific questions",
    tier: "allied-profession",
    route: "/app/questions",
    theme: "ocean",
    auth: "paid",
    viewports: ["desktop"],
    waitFor: "main",
    persona: "allied",
  },
  {
    key: "allied-profession-flashcards",
    label: "Allied Health — Profession-specific flashcards",
    tier: "allied-profession",
    route: "/app/flashcards",
    theme: "ocean",
    auth: "paid",
    viewports: ["desktop"],
    waitFor: "main",
    persona: "allied",
  },
  {
    key: "allied-profession-lessons",
    label: "Allied Health — Profession-specific lessons",
    tier: "allied-profession",
    route: "/app/lessons",
    theme: "ocean",
    auth: "paid",
    viewports: ["desktop"],
    waitFor: "main",
    persona: "allied",
  },
  {
    key: "allied-profession-clinical-skills",
    label: "Allied Health — Profession-specific clinical skills",
    tier: "allied-profession",
    route: "/app/clinical-skills",
    theme: "ocean",
    auth: "paid",
    viewports: ["desktop"],
    waitFor: "main",
    persona: "allied",
  },
  {
    key: "allied-profession-analytics",
    label: "Allied Health — Profession analytics",
    tier: "allied-profession",
    route: "/app/analytics",
    theme: "ocean",
    auth: "paid",
    viewports: ["desktop"],
    waitFor: "main",
    themeVariants: true,
    persona: "allied",
    notes: "Shows allied profession performance data.",
  },
  {
    key: "allied-profession-readiness",
    label: "Allied Health — Profession readiness",
    tier: "allied-profession",
    route: "/app/account/readiness",
    theme: "ocean",
    auth: "paid",
    viewports: ["desktop"],
    waitFor: "main",
    themeVariants: true,
    persona: "allied",
  },
];

// ─── Browser frame ────────────────────────────────────────────────────────────

/**
 * Composites a minimal browser chrome (traffic-light dots + URL bar) onto the
 * top of the screenshot, giving a consistent premium "inside a browser" look
 * for all marketing placements. Theme-aware: dark chrome for midnight theme.
 */
async function addBrowserFrame(
  pngBuffer: Buffer,
  theme: string,
  viewport: ViewportKey,
): Promise<Buffer> {
  // Skip frame on mobile (native app context) and when disabled
  if (SKIP_FRAME || viewport === "mobile") return pngBuffer;

  const meta = await sharp(pngBuffer).metadata();
  const w = meta.width ?? 1440;
  const h = meta.height ?? 900;
  const topH = 36;

  const dark = isDark(theme);
  const chromeBg = dark ? "#1b2235" : "#f0f2f4";
  const urlBg = dark ? "#2a3347" : "#dde1e6";
  const urlText = dark ? "#6b7a96" : "#6b7280";
  const dotRed = "#ff5f57";
  const dotYellow = "#ffbd2e";
  const dotGreen = "#28c840";

  const svg = `<svg width="${w}" height="${topH}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${w}" height="${topH}" fill="${chromeBg}"/>
  <circle cx="20" cy="18" r="5.5" fill="${dotRed}"/>
  <circle cx="37" cy="18" r="5.5" fill="${dotYellow}"/>
  <circle cx="54" cy="18" r="5.5" fill="${dotGreen}"/>
  <rect x="78" y="7" width="${w - 156}" height="22" rx="4" fill="${urlBg}"/>
  <text x="${w / 2}" y="23.5" font-size="11"
        fill="${urlText}" text-anchor="middle"
        font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif">
    nursenest.io
  </text>
</svg>`;

  const svgBuf = Buffer.from(svg);
  const totalH = topH + h;

  return sharp({
    create: {
      width: w,
      height: totalH,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      { input: svgBuf, top: 0, left: 0 },
      { input: pngBuffer, top: topH, left: 0 },
    ])
    .png()
    .toBuffer();
}

// ─── Image optimization ───────────────────────────────────────────────────────

const RESPONSIVE_WIDTHS: Record<ViewportKey, number[]> = {
  desktop: [1440, 1200, 768, 480],
  tablet: [768, 480],
  mobile: [390],
};

async function saveWebp(
  pngBuffer: Buffer,
  outPath: string,
  viewport: ViewportKey,
): Promise<string[]> {
  const widths = RESPONSIVE_WIDTHS[viewport];
  const saved: string[] = [];

  // Primary (full width)
  await sharp(pngBuffer)
    .resize({ width: widths[0], withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY })
    .toFile(outPath);
  saved.push(outPath);

  // Responsive variants
  for (const w of widths.slice(1)) {
    const varPath = outPath.replace(/\.webp$/, `-${w}w.webp`);
    await sharp(pngBuffer)
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toFile(varPath);
    saved.push(varPath);
  }

  return saved;
}

// ─── Login ────────────────────────────────────────────────────────────────────

async function login(page: Page, email: string, password: string): Promise<void> {
  console.log(`  → logging in as ${email}`);
  await page.goto(`${BASE_URL}/login`, {
    waitUntil: "domcontentloaded",
    timeout: 30_000,
  });

  await page
    .locator('#login-identifier, input[name="email"], input[type="email"]')
    .first()
    .fill(email);
  await page
    .locator('#login-password, input[name="password"], input[type="password"]')
    .first()
    .fill(password);

  await Promise.all([
    page.waitForURL(/\/app(\/|$)/, { timeout: 60_000 }),
    page
      .locator(
        'button[type="submit"], button:has-text("Log in"), button:has-text("Sign in")',
      )
      .first()
      .click(),
  ]);
  console.log("  ✓ logged in");
}

// ─── Theme application ────────────────────────────────────────────────────────

async function applyTheme(page: Page, theme: string): Promise<void> {
  const key = JSON.stringify(THEME_STORAGE_KEY);
  const value = JSON.stringify(theme);
  const script = `(() => {
    const key = ${key};
    const value = ${value};
    try { localStorage.setItem(key, value); } catch {}
    document.documentElement.setAttribute("data-theme", value);
  })();`;
  await page.addInitScript({ content: script });
  await page.evaluate(script).catch(() => {});
}

// ─── Page hydration ───────────────────────────────────────────────────────────

async function settle(page: Page, extraMs: number): Promise<void> {
  await page.waitForLoadState("domcontentloaded");
  await page.waitForLoadState("networkidle").catch(() => {});
  // Dismiss onboarding overlays / tooltips that obscure the UI
  await page
    .locator(
      '[data-testid="onboarding-dismiss"], [data-dismiss], [aria-label="Close"][role="button"]',
    )
    .first()
    .click({ timeout: 1500 })
    .catch(() => {});
  await page.evaluate(() => window.scrollTo(0, 0));
  if (extraMs > 0) await page.waitForTimeout(extraMs);
}

function targetReadinessChecks(target: CaptureTarget): CaptureReadinessCheck[] {
  if (target.auth === "guest" || target.tier === "marketing") {
    return [{ name: "marketing page content", selector: "main h1, main h2, main p, main a, main button" }];
  }
  const keyRoute = `${target.key} ${target.route}`.toLowerCase();
  if (keyRoute.includes("flashcard")) {
    return [
      { name: "flashcard prompt", selector: ".nn-flashcard-rich, [data-nn-premium-flashcard-active-session], .nn-question-stem" },
      { name: "flashcard controls", selector: "button:has-text('Reveal answer'), button:has-text('Next'), [aria-label*='confidence' i], .nn-flashcard-rating-dock" },
    ];
  }
  if (keyRoute.includes("question") || keyRoute.includes("/app/questions")) {
    return [
      { name: "practice question stem", selector: ".nn-question-stem, [data-testid*='question' i], [data-nn-question-card]" },
      { name: "answer options", selector: ".nn-qopt-list button, .nn-qopt-list label, [data-testid*='answer' i] button, button.nn-cat-opt, label.nn-cat-opt", minVisible: 2 },
    ];
  }
  if (keyRoute.includes("cat") || keyRoute.includes("practice-tests")) {
    return [
      { name: "CAT interface", selector: ".nn-cat, .nn-exam-session, [data-nn-qa-practice-hub-start-test], [data-testid*='cat' i]" },
      { name: "CAT question or launch content", selector: ".nn-question-stem, .nn-premium-practice-hub-hero, h1, h2" },
    ];
  }
  if (keyRoute.includes("lesson")) {
    return [
      { name: "lesson title", selector: "h1, h2, [data-lesson-title]" },
      { name: "lesson content", selector: "article, [data-lesson-content], main p, main li" },
    ];
  }
  if (keyRoute.includes("clinical-skill")) {
    return [{ name: "clinical skills activity", selector: "[data-clinical-skills], .nn-clinical-skills, main h1, main h2" }];
  }
  if (keyRoute.includes("pharmacology")) {
    return [{ name: "pharmacology activity", selector: "[data-pharmacology], .nn-pharmacology, main h1, main h2" }];
  }
  if (keyRoute.includes("ecg") || keyRoute.includes("/modules/ecg")) {
    return [
      { name: "ECG strip or module", selector: "canvas, svg, [data-ecg-strip], .ecg-strip, main h1, main h2" },
      { name: "ECG interpretation content", selector: "[data-ecg-interpretation], main p, main li" },
    ];
  }
  return [{ name: "page content", selector: "main h1, main h2, main p, main a, main button" }];
}

async function countVisible(page: Page, selector: string): Promise<number> {
  const loc = page.locator(selector);
  const total = await loc.count().catch(() => 0);
  let visible = 0;
  for (let i = 0; i < Math.min(total, 80); i++) {
    if (await loc.nth(i).isVisible().catch(() => false)) visible++;
  }
  return visible;
}

async function blockedDomReasons(page: Page): Promise<string[]> {
  const reasons: string[] = [];
  const bodyText = await page.locator("body").innerText({ timeout: 5000 }).catch(() => "");
  for (const text of BLOCKED_CAPTURE_TEXT) {
    const re = new RegExp(`\\b${text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
    if (re.test(bodyText)) reasons.push(`blocked text: ${text}`);
  }
  for (const selector of BLOCKED_CAPTURE_SELECTORS) {
    const count = await countVisible(page, selector);
    if (count > 0) reasons.push(`blocked selector: ${selector} (${count})`);
  }
  const currentUrl = page.url();
  try {
    const pathname = new URL(currentUrl).pathname;
    if (/\/login|\/signup/i.test(pathname)) reasons.push(`authentication redirect: ${pathname}`);
  } catch {
    /* ignore unparsable URLs */
  }
  if (bodyText.trim().length < 120) reasons.push("blank or near-empty page text");
  return reasons;
}

async function waitForScreenshotReady(page: Page, target: CaptureTarget): Promise<void> {
  await page.waitForLoadState("domcontentloaded");
  await page.waitForLoadState("load").catch(() => {});

  const checks = targetReadinessChecks(target);
  for (const check of checks) {
    await page.waitForSelector(check.selector, { state: "visible", timeout: 30_000 });
    const count = await countVisible(page, check.selector);
    if (count < (check.minVisible ?? 1)) {
      throw new Error(`readiness check failed: ${check.name} (${count} visible for ${check.selector})`);
    }
  }

  const clearStartedAt = Date.now();
  while (Date.now() - clearStartedAt < 20_000) {
    const reasons = await blockedDomReasons(page);
    if (reasons.length === 0) break;
    await page.waitForTimeout(250);
  }

  const reasons = await blockedDomReasons(page);
  if (reasons.length > 0) {
    throw new Error(`screenshot rejected: ${reasons.join("; ")}`);
  }
}

// ─── Single capture ───────────────────────────────────────────────────────────

type ManifestEntry = {
  key: string;
  tier: string;
  label: string;
  theme: string;
  viewport: string;
  route: string;
  files: string[];
  qualityGate: {
    passed: true;
    readinessChecks: string[];
    blockedStatesRejected: readonly string[];
  };
  generatedAt: string;
};

async function writeValidationReport(
  manifest: ManifestEntry[],
  errors: Array<{ key: string; theme: string; viewport: string; error: string }>,
): Promise<string> {
  const reportPath = path.join(OUT_DIR, "screenshot-validation-report.md");
  const report = [
    "# NurseNest Marketing Screenshot Validation Report",
    "",
    `Generated: ${new Date().toISOString()}`,
    `Base URL: ${BASE_URL}`,
    `Total valid captures: ${manifest.length}`,
    `Rejected captures: ${errors.length}`,
    "",
    "## Gate",
    "",
    "- No skeleton loaders visible before capture.",
    "- No spinners visible before capture.",
    "- No loading, suspense, auth redirect, or blank content states visible before capture.",
    "- Route-specific content selectors must be visible before capture.",
    `- Blocked text: ${BLOCKED_CAPTURE_TEXT.join(", ")}`,
    "",
    "## Valid Captures",
    "",
    "| Key | Tier | Theme | Viewport | Route | Readiness Checks | Files |",
    "| --- | --- | --- | --- | --- | --- | --- |",
    ...manifest.map((entry) =>
      [
        entry.key,
        entry.tier,
        entry.theme,
        entry.viewport,
        entry.route,
        entry.qualityGate.readinessChecks.join(", "),
        entry.files.join(", "),
      ].map((value) => String(value).replace(/\|/g, "\\|")).join(" | "),
    ).map((row) => `| ${row} |`),
    "",
    "## Rejected Captures",
    "",
    errors.length === 0
      ? "None."
      : [
          "| Key | Theme | Viewport | Reason |",
          "| --- | --- | --- | --- |",
          ...errors.map((error) =>
            `| ${error.key} | ${error.theme} | ${error.viewport} | ${error.error.replace(/\|/g, "\\|")} |`,
          ),
        ].join("\n"),
    "",
  ].join("\n");

  await fs.writeFile(reportPath, report);
  return reportPath;
}

async function captureOne(
  page: Page,
  target: CaptureTarget,
  theme: string,
  viewport: ViewportKey,
  outSubDir: string,
): Promise<ManifestEntry> {
  await page.setViewportSize(VIEWPORTS[viewport]);
  await applyTheme(page, theme);

  await page.goto(`${BASE_URL}${target.route}`, {
    waitUntil: "domcontentloaded",
    timeout: 90_000,
  });

  // Re-apply theme — SSR may reset data-theme attribute
  await applyTheme(page, theme);

  if (target.waitFor) {
    await page
      .waitForSelector(target.waitFor, { timeout: 20_000 })
      .catch(() =>
        console.warn(`    ⚠ waitFor '${target.waitFor}' not matched — continuing`),
      );
  }

  await settle(page, target.extraWaitMs ?? EXTRA_WAIT_MS);
  await waitForScreenshotReady(page, target);
  const readinessChecks = targetReadinessChecks(target).map((check) => check.name);

  const rawPng = await page.screenshot({
    fullPage: false,
    animations: "disabled",
  });
  const framed = await addBrowserFrame(rawPng, theme, viewport);

  const suffix = viewport === "desktop" ? "" : `-${viewport}`;
  const filename = `${target.key}${suffix}.webp`;
  const outPath = path.join(outSubDir, filename);

  const saved = await saveWebp(framed, outPath, viewport);

  return {
    key: target.key,
    tier: target.tier,
    label: target.label,
    theme,
    viewport,
    route: target.route,
    files: saved.map((f) => path.relative(APP_ROOT, f)),
    qualityGate: {
      passed: true,
      readinessChecks,
      blockedStatesRejected: BLOCKED_CAPTURE_TEXT,
    },
    generatedAt: new Date().toISOString(),
  };
}

// ─── CLI parsing ──────────────────────────────────────────────────────────────

type CliArgs = {
  help: boolean;
  list: boolean;
  tiers: Set<string> | null;
  keys: Set<string> | null;
  themes: ThemeId[] | null;
  viewports: ViewportKey[] | null;
  themeVariantsOnly: boolean;
};

function parseCli(argv: string[]): CliArgs {
  const args: CliArgs = {
    help: false,
    list: false,
    tiers: null,
    keys: null,
    themes: null,
    viewports: null,
    themeVariantsOnly: false,
  };

  for (const a of argv) {
    if (a === "--help" || a === "-h") args.help = true;
    else if (a === "--list" || a === "-l") args.list = true;
    else if (a === "--theme-variants-only") args.themeVariantsOnly = true;
    else if (a.startsWith("--tier="))
      args.tiers = new Set(
        a.slice("--tier=".length)
          .split(",")
          .map((s) => s.trim()),
      );
    else if (a.startsWith("--keys="))
      args.keys = new Set(
        a.slice("--keys=".length)
          .split(",")
          .map((s) => s.trim()),
      );
    else if (a.startsWith("--theme=")) {
      const raw = a
        .slice("--theme=".length)
        .split(",")
        .map((s) => s.trim()) as ThemeId[];
      args.themes = raw.filter((t): t is ThemeId =>
        (ALL_THEMES as readonly string[]).includes(t),
      );
    } else if (a.startsWith("--viewport=")) {
      const raw = a
        .slice("--viewport=".length)
        .split(",")
        .map((s) => s.trim()) as ViewportKey[];
      args.viewports = raw.filter((v): v is ViewportKey => v in VIEWPORTS);
    }
  }

  if (process.env.SCREENSHOT_INCLUDE_THEMES) {
    const raw = process.env.SCREENSHOT_INCLUDE_THEMES.split(",").map(
      (s) => s.trim(),
    ) as ThemeId[];
    args.themes = raw.filter((t): t is ThemeId =>
      (ALL_THEMES as readonly string[]).includes(t),
    );
  }

  return args;
}

function printHelp(): void {
  console.log(`
NurseNest marketing screenshot generator (Playwright + sharp)

USAGE
  npx tsx scripts/generate-marketing-screenshots.ts [options]

OPTIONS
  --tier=rn,pn,np,allied,newgrad,core,marketing,features
  --keys=rn-hub,cat-exam
  --theme=ocean,midnight,blossom,aurora,sage-garden
  --viewport=desktop,tablet,mobile
  --theme-variants-only   Only run multi-theme variant captures
  --list                  List all targets and exit
  --help                  Show this help

ENV
  PLAYWRIGHT_BASE_URL          (default: http://127.0.0.1:3000)
  QA_PAID_EMAIL + QA_PAID_PASSWORD   (or E2E_* / SCREENSHOT_* / PLAYWRIGHT_TEST_*)
  SCREENSHOT_WAIT_MS           settle wait per capture (default: 1200)
  SCREENSHOT_WEBP_QUALITY      1-100 (default: 82)
  SCREENSHOT_SKIP_FRAME        "1" to disable browser-chrome overlay
  SCREENSHOT_OUT_DIR           override output directory

PREREQUISITES
  1. npx playwright install chromium
  2. Running app:  npm run dev:next:3000
  3. Paid account: npm run seed:auth-qa
`);
}

function printList(targets: CaptureTarget[]): void {
  const tiers = [...new Set(targets.map((t) => t.tier))].sort();
  let total = 0;
  for (const tier of tiers) {
    const group = targets.filter((x) => x.tier === tier);
    console.log(`\n── ${tier} (${group.length}) ──`);
    for (const t of group) {
      const vps = ["desktop", ...(t.viewports?.filter((v) => v !== "desktop") ?? [])].join("+");
      const tv = t.themeVariants ? " +themes" : "";
      console.log(`  ${t.key.padEnd(42)} ${t.auth.padEnd(6)} ${vps}${tv}`);
      total++;
    }
  }
  console.log(`\nTotal: ${total} targets`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const cli = parseCli(process.argv.slice(2));

  if (cli.help) {
    printHelp();
    return;
  }

  let targets = TARGETS.slice();
  if (cli.tiers) targets = targets.filter((t) => cli.tiers!.has(t.tier));
  if (cli.keys) targets = targets.filter((t) => cli.keys!.has(t.key));
  if (cli.themeVariantsOnly) targets = targets.filter((t) => t.themeVariants);

  if (cli.list) {
    printList(targets);
    return;
  }

  if (targets.length === 0) {
    console.error("No targets matched filters. Use --list to see available targets.");
    process.exit(1);
  }

  const hasPaidTargets = targets.some((t) => t.auth === "paid");
  const creds = hasPaidTargets ? resolveCredentials() : null;

  const themeVariantSet: ThemeId[] =
    cli.themes ?? [...ALL_THEMES];

  console.log("\nNurseNest — marketing screenshot generator");
  console.log(`Base URL  : ${BASE_URL}`);
  console.log(`Output    : ${OUT_DIR}`);
  console.log(`Targets   : ${targets.length}`);
  console.log(`Themes    : ${themeVariantSet.join(", ")}`);
  console.log(`Wait ms   : ${EXTRA_WAIT_MS}`);
  console.log(`Frame     : ${SKIP_FRAME ? "off" : "on"}`);
  if (creds) console.log(`Auth      : ${creds.email}`);
  console.log();

  // Ensure output subdirectories
  const allTiers = [...new Set(targets.map((t) => t.tier))];
  for (const tier of allTiers) {
    await fs.mkdir(path.join(OUT_DIR, tier), { recursive: true });
  }
  for (const theme of themeVariantSet) {
    await fs.mkdir(path.join(OUT_DIR, "themes", theme), { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });

  /**
   * Create a fresh context per persona so cookies/auth state don't bleed between accounts.
   * All personas share the same browser process for efficiency.
   */
  const CONTEXT_UA =
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
    "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 NurseNestScreenshotBot/2.0";

  async function createFreshContext(): Promise<{ context: BrowserContext; page: Page }> {
    const ctx = await browser.newContext({
      viewport: VIEWPORTS.desktop,
      reducedMotion: "reduce",
      userAgent: CONTEXT_UA,
    });
    return { context: ctx, page: await ctx.newPage() };
  }

  // Track which (email, personaKey) combinations are logged in
  const loggedInContexts = new Map<
    string,
    { context: BrowserContext; page: Page }
  >();

  async function getPageForPersona(
    auth: AuthMode,
    persona?: string,
  ): Promise<Page> {
    if (auth === "guest") {
      // Reuse a single guest context
      const key = "__guest__";
      if (!loggedInContexts.has(key)) {
        const { context, page } = await createFreshContext();
        loggedInContexts.set(key, { context, page });
      }
      return loggedInContexts.get(key)!.page;
    }

    // Determine which credentials to use
    const personaCreds =
      persona ? (TIER_CREDENTIALS[persona] ?? null) : null;
    const activeCreds = personaCreds ?? creds;
    if (!activeCreds) {
      throw new Error(
        "Paid auth required — set QA_PAID_EMAIL + QA_PAID_PASSWORD" +
        (persona ? ` (or SCREENSHOT_${persona.toUpperCase()}_EMAIL + SCREENSHOT_${persona.toUpperCase()}_PASSWORD)` : ""),
      );
    }

    const key = activeCreds.email;
    if (!loggedInContexts.has(key)) {
      const { context, page } = await createFreshContext();
      await login(page, activeCreds.email, activeCreds.password);
      loggedInContexts.set(key, { context, page });
    }
    return loggedInContexts.get(key)!.page;
  }

  const manifest: ManifestEntry[] = [];
  const errors: Array<{
    key: string;
    theme: string;
    viewport: string;
    error: string;
  }> = [];

  for (const target of targets) {
    console.log(`\n[${target.tier}] ${target.key}`);
    console.log(`  ${target.label}`);
    const personaLabel = target.persona ? ` [${target.persona}]` : "";
    console.log(`  ${target.route}  (${target.auth}${personaLabel})`);

    let page: Page;
    try {
      page = await getPageForPersona(target.auth, target.persona);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error(`  ✗ auth: ${msg}`);
      errors.push({ key: target.key, theme: "all", viewport: "all", error: msg });
      continue;
    }

    // Mobile-first targets: only capture the declared viewports (no forced desktop)
    const isMobileFirst = target.tier === "mobile";
    const rawViewports: ViewportKey[] = isMobileFirst
      ? (target.viewports ?? ["mobile"])
      : [
          "desktop",
          ...(target.viewports?.filter((v) => v !== "desktop") ?? []),
        ];
    const viewportsTodo: ViewportKey[] = cli.viewports
      ? rawViewports.filter((v) => cli.viewports!.includes(v))
      : rawViewports;

    const uniqueViewports = [...new Set(viewportsTodo)];
    const tierDir = path.join(OUT_DIR, target.tier);

    // Primary captures (default theme, all configured viewports)
    for (const vp of uniqueViewports) {
      process.stdout.write(`  ${vp.padEnd(8)} ${target.theme} … `);
      try {
        const entry = await captureOne(page, target, target.theme, vp, tierDir);
        manifest.push(entry);
        console.log(`✓  ${entry.files[0]}`);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        console.error(`✗  ${msg}`);
        errors.push({ key: target.key, theme: target.theme, viewport: vp, error: msg });
      }
    }

    // Multi-theme variants (desktop only, skips the default theme)
    if (target.themeVariants && !isMobileFirst) {
      const variantThemes = themeVariantSet.filter((t) => t !== target.theme);
      for (const theme of variantThemes) {
        process.stdout.write(`  desktop  ${theme} … `);
        try {
          const themeDir = path.join(OUT_DIR, "themes", theme);
          const entry = await captureOne(page, target, theme, "desktop", themeDir);
          manifest.push(entry);
          console.log(`✓  ${entry.files[0]}`);
        } catch (e) {
          const msg = e instanceof Error ? e.message : String(e);
          console.error(`✗  ${msg}`);
          errors.push({ key: target.key, theme, viewport: "desktop", error: msg });
        }
      }
    }
  }

  // Close all browser contexts
  for (const { context } of loggedInContexts.values()) {
    await context.close().catch(() => {});
  }
  await browser.close();

  // Manifest
  const manifestPath = path.join(OUT_DIR, "manifest.json");
  await fs.writeFile(
    manifestPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        baseUrl: BASE_URL,
        outputDir: OUT_DIR,
        totalCaptured: manifest.length,
        totalErrors: errors.length,
        captures: manifest,
        errors,
      },
      null,
      2,
    ),
  );
  const validationReportPath = await writeValidationReport(manifest, errors);

  console.log("\n────────────────────────────────────────────");
  console.log(`Captured  : ${manifest.length}`);
  console.log(`Errors    : ${errors.length}`);
  console.log(`Manifest  : ${manifestPath}`);
  console.log(`Validation: ${validationReportPath}`);
  console.log();
  console.log(
    "Review captures before uploading to CDN (see docs/SCREENSHOT_CAPTURE_TO_CDN.md).",
  );

  if (errors.length > 0) {
    console.error("\nFailed:");
    for (const e of errors) {
      console.error(`  [${e.key}] ${e.theme}/${e.viewport}: ${e.error}`);
    }
    process.exit(1);
  }

  console.log("✓ Done.");
}

main().catch((e) => {
  console.error("FATAL:", e instanceof Error ? e.message : e);
  process.exit(1);
});
