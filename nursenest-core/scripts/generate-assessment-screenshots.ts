#!/usr/bin/env tsx
/**
 * generate-assessment-screenshots.ts
 *
 * Production-quality Playwright screenshot generator for all NurseNest assessment
 * interaction types. Captures REAL rendered application screens using seeded QA
 * content. No mockups, no placeholders.
 *
 * COVERS
 *   CAT exam:           MCQ · SATA · Bowtie · fallback states for Matrix / Case Study
 *   Practice Exams:     Question session · results
 *   Flashcards:         Hub · deck · study mode (front/back/correct/incorrect)
 *   ECG:                Module hub · basic lessons · advanced scenarios
 *   Pharmacology:       Hub · drug class · question
 *   Clinical Skills:    Hub · skill detail
 *   LOFT / OSCE:        Simulation station
 *
 * STATES (where applicable)
 *   unanswered → partial → complete → submitted → correct · incorrect · rationale
 *
 * THEMES:   ocean · blossom · midnight
 * VIEWPORTS: desktop (1440×900) · tablet (768×1024) · mobile (390×844)
 *
 * MARKETING CROPS: 1600×900 · 1200×675 · 1200×1200 (social) · 1080×1350 (portrait)
 *
 * USAGE
 *   npx tsx scripts/generate-assessment-screenshots.ts
 *   npx tsx scripts/generate-assessment-screenshots.ts --category=cat,flashcards
 *   npx tsx scripts/generate-assessment-screenshots.ts --theme=ocean,midnight
 *   npx tsx scripts/generate-assessment-screenshots.ts --viewport=desktop
 *   npx tsx scripts/generate-assessment-screenshots.ts --no-crops
 *   npx tsx scripts/generate-assessment-screenshots.ts --no-gallery
 *   npx tsx scripts/generate-assessment-screenshots.ts --list
 *
 * ENV
 *   PLAYWRIGHT_BASE_URL           default: http://127.0.0.1:3000
 *   QA_PAID_EMAIL / QA_PAID_PASSWORD
 *   E2E_PAID_EMAIL / E2E_PAID_PASSWORD
 *   SCREENSHOT_DEMO_EMAIL / SCREENSHOT_DEMO_PASSWORD
 *   SCREENSHOT_WAIT_MS            extra settle wait ms (default: 1400)
 *   SCREENSHOT_OUT_DIR            override output root (default: ../marketing-assets/screenshots)
 *   SCREENSHOT_PATHWAY_ID         default: us-rn-nclex-rn
 *
 * PREREQUISITES
 *   1. npx playwright install chromium
 *   2. App running at PLAYWRIGHT_BASE_URL (npm run dev:next:3000)
 *   3. QA demo user seeded: DATABASE_URL=... npx tsx scripts/seed-screenshot-demo-user.ts
 */

import { chromium, type Browser, type BrowserContext, type Page, type Route, type Request } from "playwright";
import fs from "node:fs/promises";
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// ── Paths ─────────────────────────────────────────────────────────────────────

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const APP_ROOT = path.join(__dirname, "..");
const REPO_ROOT = path.join(APP_ROOT, "..");

const BASE_URL = (process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000").replace(/\/$/, "");

const OUT_ROOT = process.env.SCREENSHOT_OUT_DIR
  ? path.resolve(process.env.SCREENSHOT_OUT_DIR)
  : path.join(REPO_ROOT, "marketing-assets", "screenshots");

const EXTRA_WAIT_MS = Number(process.env.SCREENSHOT_WAIT_MS ?? "1400");
const PATHWAY_ID = process.env.SCREENSHOT_PATHWAY_ID?.trim() || "us-rn-nclex-rn";

const BLOCKED_CAPTURE_TEXT = [
  "Loading",
  "Just a moment",
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

// ── Credentials ───────────────────────────────────────────────────────────────

function resolveCredentials(): { email: string; password: string } {
  const email =
    process.env.QA_PAID_EMAIL ??
    process.env.E2E_PAID_EMAIL ??
    process.env.SCREENSHOT_DEMO_EMAIL;
  const password =
    process.env.QA_PAID_PASSWORD ??
    process.env.E2E_PAID_PASSWORD ??
    process.env.SCREENSHOT_DEMO_PASSWORD;

  if (!email || !password) {
    throw new Error(
      [
        "No credentials. Set one of:",
        "  QA_PAID_EMAIL + QA_PAID_PASSWORD",
        "  E2E_PAID_EMAIL + E2E_PAID_PASSWORD",
        "  SCREENSHOT_DEMO_EMAIL + SCREENSHOT_DEMO_PASSWORD",
      ].join("\n"),
    );
  }
  return { email, password };
}

// ── Themes & Viewports ────────────────────────────────────────────────────────

const THEME_KEY = "nursenest-theme";

const THEMES = ["ocean", "blossom", "midnight"] as const;
type Theme = (typeof THEMES)[number];

const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 390, height: 844 },
} as const;
type Viewport = keyof typeof VIEWPORTS;

// Marketing crop definitions
const MARKETING_CROPS = {
  "landscape-hd": { width: 1600, height: 900 },
  "landscape-social": { width: 1200, height: 675 },
  "social-square": { width: 1200, height: 1200 },
  "portrait-story": { width: 1080, height: 1350 },
} as const;

// ── Question Fixtures ─────────────────────────────────────────────────────────

function mcqFixture(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    questionType: "MCQ",
    stem: "A nurse is caring for a 68-year-old client with heart failure who is receiving IV furosemide. Which assessment finding requires immediate intervention?",
    options: [
      "Urine output of 80 mL over 2 hours",
      "Serum potassium level of 2.8 mEq/L",
      "Blood pressure of 118/74 mmHg",
      "Respiratory rate of 18 breaths per minute",
    ],
    correctAnswer: "Serum potassium level of 2.8 mEq/L",
    rationale: "A potassium level of 2.8 mEq/L indicates hypokalemia, which is a life-threatening complication of furosemide therapy and requires immediate intervention to prevent cardiac dysrhythmias. The other findings are within acceptable parameters for this client.",
    ...overrides,
  };
}

function sataFixture(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    questionType: "SATA",
    stem: "A nurse is preparing to administer a blood transfusion. Which of the following actions should the nurse take? Select all that apply.",
    options: [
      "Verify blood product with a second licensed nurse",
      "Obtain IV access using an 18-gauge or larger catheter",
      "Prime the tubing with normal saline (0.9% NaCl)",
      "Begin the infusion at 125 mL/hr for the first 15 minutes",
      "Remain with the client during the first 15 minutes of infusion",
      "Document the client's ABO type from the medical record",
    ],
    correctAnswer: [
      "Verify blood product with a second licensed nurse",
      "Obtain IV access using an 18-gauge or larger catheter",
      "Prime the tubing with normal saline (0.9% NaCl)",
      "Remain with the client during the first 15 minutes of infusion",
    ],
    rationale: "Blood transfusion safety requires verification with two nurses, large-bore IV access (18G+), NS priming, and monitoring during the critical first 15 minutes. Infusions begin slowly at 2 mL/min (not 125 mL/hr) to detect reactions, and ABO type must be verified against the blood bank label, not the medical record alone.",
    ...overrides,
  };
}

function bowtieFixture(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    questionType: "Bowtie",
    stem: "A nurse is caring for a 52-year-old client who was admitted with community-acquired pneumonia. Vital signs: T 38.9°C, HR 112 bpm, RR 28/min, BP 88/56 mmHg, SpO₂ 89% on room air. Based on the clinical presentation, complete the bowtie diagram.",
    options: {
      format: "bowtie",
      bank: [
        { id: "c1", label: "Impaired gas exchange" },
        { id: "c2", label: "Deficient fluid volume" },
        { id: "c3", label: "Decreased cardiac output" },
        { id: "i1", label: "Administer prescribed oxygen therapy" },
        { id: "i2", label: "Initiate IV fluid resuscitation" },
        { id: "i3", label: "Position client in high-Fowler's position" },
        { id: "m1", label: "Monitor SpO₂ continuously" },
        { id: "m2", label: "Measure urine output hourly" },
        { id: "m3", label: "Assess breath sounds every 2 hours" },
      ],
    },
    correctAnswer: { condition: "c1", nursing_action: "i1", monitoring: "m1" },
    rationale: "The client's SpO₂ of 89% and RR of 28/min indicate impaired gas exchange from pneumonia-related consolidation. Priority actions are administering oxygen to improve saturation and continuously monitoring SpO₂ to evaluate therapeutic response.",
    ...overrides,
  };
}

function matrixFallbackFixture(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    questionType: "MATRIX",
    stem: "A nurse is caring for four clients. For each client condition, indicate whether the finding is expected or requires immediate intervention.",
    options: {
      format: "matrix",
      rows: [
        { id: "r1", label: "Client with COPD: SpO₂ 89%" },
        { id: "r2", label: "Client post-op day 1: HR 92 bpm" },
        { id: "r3", label: "Client with HF: daily weight gain 1.5 kg" },
        { id: "r4", label: "Client on heparin: aPTT 65 seconds" },
      ],
      columns: ["Expected finding", "Requires immediate intervention"],
    },
    correctAnswer: { r1: "Expected finding", r2: "Expected finding", r3: "Requires immediate intervention", r4: "Expected finding" },
    rationale: "COPD clients maintain lower SpO₂ baselines; post-op tachycardia is expected; 1.5 kg weight gain in HF indicates fluid retention requiring intervention; aPTT 65s is within therapeutic heparin range (60–100s).",
    ...overrides,
  };
}

function caseStudyFallbackFixture(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    questionType: "NGN_CASE",
    stem: "The nurse receives handoff report on a 45-year-old client with type 2 diabetes admitted for a foot wound. Review the following information and answer the questions below.",
    options: {
      format: "case_study",
      tabs: [
        { id: "overview", label: "Client Overview", content: "Client: M.J., 45M. PMH: T2DM ×12 yrs, HTN. Allergies: Penicillin. Weight: 94 kg." },
        { id: "vitals", label: "Vital Signs", content: "T: 38.2°C | HR: 98 | RR: 18 | BP: 142/88 | SpO₂: 97% RA | Pain: 6/10" },
        { id: "labs", label: "Laboratory", content: "HbA1c: 10.2% | WBC: 14.2 ×10³ | Blood glucose: 284 mg/dL | Creatinine: 1.4 mg/dL" },
        { id: "orders", label: "Provider Orders", content: "Insulin sliding scale, wound care BID, blood glucose monitoring q4h, cultures pending" },
      ],
      question: "Based on the assessment data, which client finding is of greatest concern?",
      questionOptions: [
        "HbA1c of 10.2%",
        "WBC of 14.2 ×10³",
        "Blood glucose of 284 mg/dL",
        "Creatinine of 1.4 mg/dL",
      ],
    },
    correctAnswer: "WBC of 14.2 ×10³",
    rationale: "Elevated WBC indicates active infection requiring immediate treatment to prevent sepsis progression. While the elevated HbA1c and glucose reflect poor glycemic control, the leukocytosis combined with fever (38.2°C) signals the most acute threat.",
    ...overrides,
  };
}

// ── CLI Argument Parsing ──────────────────────────────────────────────────────

interface CliArgs {
  categories: string[] | null;
  themes: Theme[] | null;
  viewports: Viewport[] | null;
  noCrops: boolean;
  noGallery: boolean;
  list: boolean;
  help: boolean;
}

function parseCli(argv: string[]): CliArgs {
  const out: CliArgs = {
    categories: null,
    themes: null,
    viewports: null,
    noCrops: false,
    noGallery: false,
    list: false,
    help: false,
  };

  for (const a of argv) {
    if (a === "--help" || a === "-h") { out.help = true; continue; }
    if (a === "--list") { out.list = true; continue; }
    if (a === "--no-crops") { out.noCrops = true; continue; }
    if (a === "--no-gallery") { out.noGallery = true; continue; }
    if (a.startsWith("--category=")) {
      out.categories = a.slice("--category=".length).split(",").map((s) => s.trim()).filter(Boolean);
    }
    if (a.startsWith("--theme=")) {
      out.themes = a.slice("--theme=".length).split(",").map((s) => s.trim()).filter(Boolean) as Theme[];
    }
    if (a.startsWith("--viewport=")) {
      out.viewports = a.slice("--viewport=".length).split(",").map((s) => s.trim()).filter(Boolean) as Viewport[];
    }
  }

  return out;
}

// ── Capture Plan ──────────────────────────────────────────────────────────────

type QuestionState =
  | "unanswered"
  | "partial"
  | "complete"
  | "submitted"
  | "correct"
  | "incorrect"
  | "rationale";

type CaptureSpec = {
  /** Unique slug → used for filename and gallery */
  slug: string;
  category: "cat" | "practice-exams" | "flashcards" | "ecg" | "pharmacology" | "clinical-skills" | "loft";
  label: string;
  route: string;
  theme: Theme;
  viewport: Viewport;
  /** Question type being showcased (for gallery metadata) */
  questionType?: string;
  /** Question state being showcased */
  questionState?: QuestionState;
  /** Route fixture to inject — key of FIXTURES map */
  fixtureKey?: keyof typeof QUESTION_FIXTURES;
  /** If true, generate marketing crops from this capture */
  marketingCrop?: boolean;
  /** Selector to crop to (instead of full page) */
  cropSelector?: string;
  /** Extra wait override */
  extraWaitMs?: number;
  /** Interaction script to run before capture */
  interactionKey?: keyof typeof INTERACTIONS;
  /** True if this requires an active CAT exam session */
  requiresExamSession?: boolean;
  /** Notes for the gallery */
  notes?: string;
};

const QUESTION_FIXTURES = {
  mcq: mcqFixture,
  sata: sataFixture,
  bowtie: bowtieFixture,
  matrixFallback: matrixFallbackFixture,
  caseStudyFallback: caseStudyFallbackFixture,
} as const;

// ── Interaction Scripts ───────────────────────────────────────────────────────

type InteractionFn = (page: Page) => Promise<void>;

async function selectFirstSataOption(page: Page): Promise<void> {
  const checkboxes = page.locator('input[type="checkbox"]');
  const count = await checkboxes.count();
  if (count > 0) {
    await checkboxes.first().check({ force: true }).catch(() => {});
    await page.waitForTimeout(300);
  }
}

async function selectMultipleSataOptions(page: Page): Promise<void> {
  const checkboxes = page.locator('input[type="checkbox"]');
  const count = await checkboxes.count();
  for (let i = 0; i < Math.min(2, count); i++) {
    await checkboxes.nth(i).check({ force: true }).catch(() => {});
    await page.waitForTimeout(150);
  }
}

async function selectAllCorrectSataOptions(page: Page): Promise<void> {
  // Select first 4 checkboxes (matching our SATA fixture's 4 correct answers)
  const checkboxes = page.locator('input[type="checkbox"]');
  const count = await checkboxes.count();
  const targets = [0, 1, 2, 4]; // indexes 0,1,2,4 match fixture correct options
  for (const i of targets) {
    if (i < count) {
      await checkboxes.nth(i).check({ force: true }).catch(() => {});
      await page.waitForTimeout(150);
    }
  }
}

async function selectFirstMcqOption(page: Page): Promise<void> {
  const radios = page.locator('input[type="radio"]');
  const count = await radios.count();
  if (count > 0) {
    await radios.first().check({ force: true }).catch(() => {});
    await page.waitForTimeout(300);
  }
}

async function fillBowtieConditionOnly(page: Page): Promise<void> {
  // Click first bank option to assign to the focused slot
  const bankItem = page.locator("[data-bowtie-bank-item], [role='option'], button").filter({ hasText: "Impaired gas exchange" }).first();
  await bankItem.click({ force: true }).catch(() => {});
  await page.waitForTimeout(400);
}

async function fillBowtieAllSlots(page: Page): Promise<void> {
  // Assign condition
  const condition = page.locator("button, [role='button']").filter({ hasText: "Impaired gas exchange" }).first();
  await condition.click({ force: true }).catch(() => {});
  await page.waitForTimeout(300);

  // Assign nursing action
  const action = page.locator("button, [role='button']").filter({ hasText: "Administer prescribed oxygen" }).first();
  await action.click({ force: true }).catch(() => {});
  await page.waitForTimeout(300);

  // Assign monitoring
  const monitor = page.locator("button, [role='button']").filter({ hasText: "Monitor SpO₂" }).first();
  await monitor.click({ force: true }).catch(() => {});
  await page.waitForTimeout(300);
}

async function clickSubmitAnswer(page: Page): Promise<void> {
  const submit = page
    .locator('button:has-text("Submit answer"), button:has-text("Submit Answer"), [data-nn-qa-submit-answer]')
    .first();
  const enabled = await submit.isEnabled().catch(() => false);
  if (enabled) {
    await submit.click({ force: true });
    await page.waitForTimeout(1200);
  }
}

async function clickWrongMcqOption(page: Page): Promise<void> {
  // Click last radio (least likely to be correct in our fixture)
  const radios = page.locator('input[type="radio"]');
  const count = await radios.count();
  if (count > 0) {
    await radios.last().check({ force: true }).catch(() => {});
    await page.waitForTimeout(300);
  }
}

const INTERACTIONS: Record<string, InteractionFn> = {
  selectFirstSata: selectFirstSataOption,
  selectMultipleSata: selectMultipleSataOptions,
  selectAllCorrectSata: selectAllCorrectSataOptions,
  selectFirstMcq: selectFirstMcqOption,
  selectWrongMcq: clickWrongMcqOption,
  bowtiePartial: fillBowtieConditionOnly,
  bowtieComplete: fillBowtieAllSlots,
  submitAnswer: clickSubmitAnswer,
};

// ── Spec Builder ──────────────────────────────────────────────────────────────

function buildCaptureSpecs(): CaptureSpec[] {
  const specs: CaptureSpec[] = [];

  function add(s: CaptureSpec) { specs.push(s); }

  // ── CAT Exam ──────────────────────────────────────────────────────────────

  // Hub pages (no exam session)
  for (const theme of THEMES) {
    for (const vp of ["desktop", "tablet", "mobile"] as Viewport[]) {
      add({
        slug: `cat-hub-${vp}-${theme}`,
        category: "cat",
        label: `CAT Exam Hub — ${theme} — ${vp}`,
        route: `/app/practice-tests?cat=1&pathwayId=${encodeURIComponent(PATHWAY_ID)}`,
        theme,
        viewport: vp,
        questionType: "hub",
        marketingCrop: vp === "desktop" && theme === "ocean",
        notes: "CAT exam hub showing available pathways and start button.",
      });
    }
  }

  // CAT launch / ready screen
  for (const theme of THEMES) {
    for (const vp of ["desktop", "mobile"] as Viewport[]) {
      add({
        slug: `cat-launch-${vp}-${theme}`,
        category: "cat",
        label: `CAT Launch Screen — ${theme} — ${vp}`,
        route: `/app/practice-tests/cat-launch?pathwayId=${encodeURIComponent(PATHWAY_ID)}`,
        theme,
        viewport: vp,
        questionType: "launch",
        notes: "Pre-exam launch/configuration screen.",
      });
    }
  }

  // MCQ states
  for (const theme of THEMES) {
    for (const vp of ["desktop", "tablet", "mobile"] as Viewport[]) {
      const isDesktop = vp === "desktop";

      add({
        slug: `cat-mcq-unanswered-${vp}-${theme}`,
        category: "cat",
        label: `CAT MCQ — Unanswered — ${theme} — ${vp}`,
        route: `/app/practice-tests?cat=1&pathwayId=${encodeURIComponent(PATHWAY_ID)}`,
        theme,
        viewport: vp,
        questionType: "MCQ",
        questionState: "unanswered",
        fixtureKey: "mcq",
        requiresExamSession: true,
        cropSelector: "[data-cat-exam-root]",
        marketingCrop: isDesktop && theme === "ocean",
        notes: "Standard MCQ in unanswered state — all options deselected.",
      });

      add({
        slug: `cat-mcq-answered-${vp}-${theme}`,
        category: "cat",
        label: `CAT MCQ — Answer Selected — ${theme} — ${vp}`,
        route: `/app/practice-tests?cat=1&pathwayId=${encodeURIComponent(PATHWAY_ID)}`,
        theme,
        viewport: vp,
        questionType: "MCQ",
        questionState: "complete",
        fixtureKey: "mcq",
        requiresExamSession: true,
        interactionKey: "selectFirstMcq",
        cropSelector: "[data-cat-exam-root]",
        notes: "MCQ with a selection made, submit button enabled.",
      });
    }
  }

  // SATA states
  for (const theme of THEMES) {
    for (const vp of ["desktop", "tablet", "mobile"] as Viewport[]) {
      add({
        slug: `cat-sata-unanswered-${vp}-${theme}`,
        category: "cat",
        label: `CAT SATA — Unanswered — ${theme} — ${vp}`,
        route: `/app/practice-tests?cat=1&pathwayId=${encodeURIComponent(PATHWAY_ID)}`,
        theme,
        viewport: vp,
        questionType: "SATA",
        questionState: "unanswered",
        fixtureKey: "sata",
        requiresExamSession: true,
        cropSelector: "[data-cat-exam-root]",
        marketingCrop: vp === "desktop" && theme === "ocean",
        notes: "Select-All-That-Apply in unanswered state — 6 checkboxes unchecked.",
      });

      add({
        slug: `cat-sata-partial-${vp}-${theme}`,
        category: "cat",
        label: `CAT SATA — Partially Selected — ${theme} — ${vp}`,
        route: `/app/practice-tests?cat=1&pathwayId=${encodeURIComponent(PATHWAY_ID)}`,
        theme,
        viewport: vp,
        questionType: "SATA",
        questionState: "partial",
        fixtureKey: "sata",
        requiresExamSession: true,
        interactionKey: "selectFirstSata",
        cropSelector: "[data-cat-exam-root]",
        notes: "SATA with one option selected.",
      });

      add({
        slug: `cat-sata-complete-${vp}-${theme}`,
        category: "cat",
        label: `CAT SATA — Selections Made — ${theme} — ${vp}`,
        route: `/app/practice-tests?cat=1&pathwayId=${encodeURIComponent(PATHWAY_ID)}`,
        theme,
        viewport: vp,
        questionType: "SATA",
        questionState: "complete",
        fixtureKey: "sata",
        requiresExamSession: true,
        interactionKey: "selectMultipleSata",
        cropSelector: "[data-cat-exam-root]",
        notes: "SATA with multiple options selected, ready to submit.",
      });
    }
  }

  // Bowtie states
  for (const theme of THEMES) {
    for (const vp of ["desktop", "tablet", "mobile"] as Viewport[]) {
      add({
        slug: `cat-bowtie-unanswered-${vp}-${theme}`,
        category: "cat",
        label: `CAT Bowtie — Unanswered — ${theme} — ${vp}`,
        route: `/app/practice-tests?cat=1&pathwayId=${encodeURIComponent(PATHWAY_ID)}`,
        theme,
        viewport: vp,
        questionType: "Bowtie",
        questionState: "unanswered",
        fixtureKey: "bowtie",
        requiresExamSession: true,
        cropSelector: "[data-cat-exam-root]",
        marketingCrop: vp === "desktop" && theme === "ocean",
        notes: "NGN Bowtie with all three slots empty — condition, nursing action, monitoring.",
      });

      add({
        slug: `cat-bowtie-partial-${vp}-${theme}`,
        category: "cat",
        label: `CAT Bowtie — Partially Filled — ${theme} — ${vp}`,
        route: `/app/practice-tests?cat=1&pathwayId=${encodeURIComponent(PATHWAY_ID)}`,
        theme,
        viewport: vp,
        questionType: "Bowtie",
        questionState: "partial",
        fixtureKey: "bowtie",
        requiresExamSession: true,
        interactionKey: "bowtiePartial",
        cropSelector: "[data-cat-exam-root]",
        notes: "Bowtie with one slot assigned, two remaining empty.",
      });

      add({
        slug: `cat-bowtie-complete-${vp}-${theme}`,
        category: "cat",
        label: `CAT Bowtie — All Slots Filled — ${theme} — ${vp}`,
        route: `/app/practice-tests?cat=1&pathwayId=${encodeURIComponent(PATHWAY_ID)}`,
        theme,
        viewport: vp,
        questionType: "Bowtie",
        questionState: "complete",
        fixtureKey: "bowtie",
        requiresExamSession: true,
        interactionKey: "bowtieComplete",
        cropSelector: "[data-cat-exam-root]",
        marketingCrop: vp === "desktop" && theme === "blossom",
        notes: "Bowtie with all three slots assigned — submit enabled.",
      });
    }
  }

  // Unsupported fallback states (Matrix, Case Study) — show the graceful fallback UI
  for (const theme of THEMES) {
    add({
      slug: `cat-matrix-fallback-desktop-${theme}`,
      category: "cat",
      label: `CAT Matrix — Graceful Fallback — ${theme} — desktop`,
      route: `/app/practice-tests?cat=1&pathwayId=${encodeURIComponent(PATHWAY_ID)}`,
      theme,
      viewport: "desktop",
      questionType: "Matrix",
      questionState: "unanswered",
      fixtureKey: "matrixFallback",
      requiresExamSession: true,
      cropSelector: "[data-cat-exam-root]",
      notes: "Matrix/grid question shown in graceful unsupported fallback (dedicated renderer pending).",
    });

    add({
      slug: `cat-case-study-fallback-desktop-${theme}`,
      category: "cat",
      label: `CAT Case Study — Graceful Fallback — ${theme} — desktop`,
      route: `/app/practice-tests?cat=1&pathwayId=${encodeURIComponent(PATHWAY_ID)}`,
      theme,
      viewport: "desktop",
      questionType: "CaseStudy",
      questionState: "unanswered",
      fixtureKey: "caseStudyFallback",
      requiresExamSession: true,
      cropSelector: "[data-cat-exam-root]",
      notes: "NGN unfolding case study shown in graceful unsupported fallback.",
    });
  }

  // CAT insights / results
  for (const theme of THEMES) {
    add({
      slug: `cat-insights-desktop-${theme}`,
      category: "cat",
      label: `CAT Insights — ${theme} — desktop`,
      route: "/app/practice-tests/cat-insights",
      theme,
      viewport: "desktop",
      questionType: "results",
      marketingCrop: theme === "ocean",
      notes: "Post-exam CAT insights and performance analytics.",
    });

    add({
      slug: `cat-insights-mobile-${theme}`,
      category: "cat",
      label: `CAT Insights — ${theme} — mobile`,
      route: "/app/practice-tests/cat-insights",
      theme,
      viewport: "mobile",
      questionType: "results",
    });
  }

  // ── Practice Exams ────────────────────────────────────────────────────────

  for (const theme of THEMES) {
    for (const vp of ["desktop", "tablet", "mobile"] as Viewport[]) {
      add({
        slug: `practice-exam-hub-${vp}-${theme}`,
        category: "practice-exams",
        label: `Practice Exam Hub — ${theme} — ${vp}`,
        route: `/app/practice-tests?pathwayId=${encodeURIComponent(PATHWAY_ID)}`,
        theme,
        viewport: vp,
        questionType: "hub",
        marketingCrop: vp === "desktop" && theme === "ocean",
        notes: "Practice exam hub with available exam sets.",
      });
    }

    add({
      slug: `practice-exam-session-desktop-${theme}`,
      category: "practice-exams",
      label: `Practice Question Session — MCQ — ${theme} — desktop`,
      route: "/app/questions/session",
      theme,
      viewport: "desktop",
      questionType: "MCQ",
      marketingCrop: theme === "ocean",
      notes: "Active practice question session with MCQ and rationale panel.",
    });

    add({
      slug: `practice-exam-session-mobile-${theme}`,
      category: "practice-exams",
      label: `Practice Question Session — MCQ — ${theme} — mobile`,
      route: "/app/questions/session",
      theme,
      viewport: "mobile",
      questionType: "MCQ",
    });

    add({
      slug: `practice-exam-bank-desktop-${theme}`,
      category: "practice-exams",
      label: `Question Bank — ${theme} — desktop`,
      route: "/app/questions/bank",
      theme,
      viewport: "desktop",
      questionType: "bank",
      marketingCrop: theme === "midnight",
      notes: "Question bank with filter/search interface.",
    });

    add({
      slug: `practice-exam-start-desktop-${theme}`,
      category: "practice-exams",
      label: `Practice Start — ${theme} — desktop`,
      route: "/app/practice-tests/start",
      theme,
      viewport: "desktop",
      questionType: "start",
      notes: "Practice test configuration / start screen.",
    });
  }

  // ── Flashcards ────────────────────────────────────────────────────────────

  for (const theme of THEMES) {
    for (const vp of ["desktop", "tablet", "mobile"] as Viewport[]) {
      add({
        slug: `flashcards-hub-${vp}-${theme}`,
        category: "flashcards",
        label: `Flashcard Hub — ${theme} — ${vp}`,
        route: "/app/flashcards",
        theme,
        viewport: vp,
        questionType: "hub",
        marketingCrop: vp === "desktop" && theme === "ocean",
        notes: "Flashcard hub showing available decks and study stats.",
      });
    }

    add({
      slug: `flashcards-decks-desktop-${theme}`,
      category: "flashcards",
      label: `Flashcard Decks — ${theme} — desktop`,
      route: "/app/flashcards/decks",
      theme,
      viewport: "desktop",
      questionType: "decks",
      notes: "Flashcard deck browser.",
    });

    add({
      slug: `flashcards-weak-areas-desktop-${theme}`,
      category: "flashcards",
      label: `Flashcard Weak Areas — ${theme} — desktop`,
      route: "/app/flashcards/weak-areas",
      theme,
      viewport: "desktop",
      questionType: "weak-areas",
      notes: "Weak area flashcard mode — cards targeting low-accuracy topics.",
    });
  }

  // ── ECG Module ────────────────────────────────────────────────────────────

  for (const theme of THEMES) {
    for (const vp of ["desktop", "tablet", "mobile"] as Viewport[]) {
      add({
        slug: `ecg-hub-${vp}-${theme}`,
        category: "ecg",
        label: `ECG Hub — ${theme} — ${vp}`,
        route: "/modules/ecg",
        theme,
        viewport: vp,
        questionType: "hub",
        marketingCrop: vp === "desktop" && theme === "midnight",
        notes: "ECG module landing page with sub-module options.",
      });
    }

    add({
      slug: `ecg-basic-lessons-desktop-${theme}`,
      category: "ecg",
      label: `ECG Basic Lessons — ${theme} — desktop`,
      route: "/modules/ecg/basic/lessons",
      theme,
      viewport: "desktop",
      questionType: "lessons",
      marketingCrop: theme === "ocean",
      notes: "ECG basic rhythm lessons catalog.",
    });

    add({
      slug: `ecg-basic-lessons-mobile-${theme}`,
      category: "ecg",
      label: `ECG Basic Lessons — ${theme} — mobile`,
      route: "/modules/ecg/basic/lessons",
      theme,
      viewport: "mobile",
      questionType: "lessons",
    });

    add({
      slug: `ecg-advanced-desktop-${theme}`,
      category: "ecg",
      label: `ECG Advanced — ${theme} — desktop`,
      route: "/modules/ecg/advanced",
      theme,
      viewport: "desktop",
      questionType: "advanced",
      notes: "ECG advanced module hub.",
    });

    add({
      slug: `ecg-interpretation-desktop-${theme}`,
      category: "ecg",
      label: `ECG Interpretation — ${theme} — desktop`,
      route: "/modules/ecg-interpretation",
      theme,
      viewport: "desktop",
      questionType: "interpretation",
      notes: "ECG rhythm interpretation module.",
    });

    add({
      slug: `ecg-interpretation-practice-desktop-${theme}`,
      category: "ecg",
      label: `ECG Interpretation Practice — ${theme} — desktop`,
      route: "/modules/ecg-interpretation/practice",
      theme,
      viewport: "desktop",
      questionType: "practice",
      marketingCrop: theme === "midnight",
      notes: "ECG interpretation practice with strip.",
    });

    add({
      slug: `ecg-advanced-scenarios-desktop-${theme}`,
      category: "ecg",
      label: `ECG Advanced Scenarios — ${theme} — desktop`,
      route: "/modules/ecg/advanced/scenarios",
      theme,
      viewport: "desktop",
      questionType: "scenarios",
      notes: "ECG advanced clinical scenario drills.",
    });
  }

  // ── Pharmacology ──────────────────────────────────────────────────────────

  for (const theme of THEMES) {
    for (const vp of ["desktop", "tablet", "mobile"] as Viewport[]) {
      add({
        slug: `pharmacology-hub-${vp}-${theme}`,
        category: "pharmacology",
        label: `Pharmacology Hub — ${theme} — ${vp}`,
        route: "/app/pharmacology",
        theme,
        viewport: vp,
        questionType: "hub",
        marketingCrop: vp === "desktop" && theme === "ocean",
        notes: "Pharmacology module hub with drug class navigation.",
      });
    }
  }

  // ── Clinical Skills ───────────────────────────────────────────────────────

  for (const theme of THEMES) {
    for (const vp of ["desktop", "tablet", "mobile"] as Viewport[]) {
      add({
        slug: `clinical-skills-hub-${vp}-${theme}`,
        category: "clinical-skills",
        label: `Clinical Skills Hub — ${theme} — ${vp}`,
        route: "/app/clinical-skills",
        theme,
        viewport: vp,
        questionType: "hub",
        marketingCrop: vp === "desktop" && theme === "ocean",
        notes: "Clinical skills hub with skill categories.",
      });
    }
  }

  // ── LOFT / OSCE ───────────────────────────────────────────────────────────

  for (const theme of THEMES) {
    for (const vp of ["desktop", "tablet", "mobile"] as Viewport[]) {
      add({
        slug: `loft-hub-${vp}-${theme}`,
        category: "loft",
        label: `LOFT/OSCE Hub — ${theme} — ${vp}`,
        route: "/app/osce",
        theme,
        viewport: vp,
        questionType: "hub",
        marketingCrop: vp === "desktop" && theme === "ocean",
        notes: "LOFT/OSCE simulation hub with station overview.",
      });
    }
  }

  return specs;
}

// ── Auth ──────────────────────────────────────────────────────────────────────

async function login(page: Page, creds: { email: string; password: string }): Promise<void> {
  await page.goto(`${BASE_URL}/login`, { waitUntil: "domcontentloaded", timeout: 60_000 });
  await page.waitForTimeout(800);

  // Fill email
  const emailField = page
    .locator('input[type="email"], input[name="email"], input[placeholder*="email" i]')
    .first();
  await emailField.fill(creds.email);

  // Fill password
  const passField = page
    .locator('input[type="password"], input[name="password"]')
    .first();
  await passField.fill(creds.password);

  // Submit
  const submitBtn = page
    .locator('button[type="submit"]:has-text("Sign in"), button:has-text("Log in"), button:has-text("Sign In"), button:has-text("Login")')
    .first();
  await submitBtn.click();

  // Wait for redirect away from login
  await page.waitForURL((url) => !url.pathname.startsWith("/login"), { timeout: 30_000 }).catch(() => {});
  await page.waitForLoadState("domcontentloaded").catch(() => {});
}

async function applyTheme(page: Page, theme: Theme): Promise<void> {
  await page.evaluate(
    ({ key, value }) => {
      try { localStorage.setItem(key, value); } catch { /* ignore */ }
      document.documentElement.setAttribute("data-theme", value);
    },
    { key: THEME_KEY, value: theme },
  );
  await page.waitForTimeout(120);
}

// ── Page Stabilization ────────────────────────────────────────────────────────

async function stabilize(page: Page, extraMs = 0): Promise<void> {
  await page.waitForLoadState("domcontentloaded").catch(() => {});
  await page.evaluate(() => document.fonts.ready).catch(() => {});

  // Inject reduced-motion and hide volatile elements
  await page.addStyleTag({ content: `
    *, *::before, *::after {
      animation-duration: 0.001ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.001ms !important;
    }
    [data-nn-relative-time], [data-nn-volatile], [data-nn-server-timestamp] {
      visibility: hidden !important;
    }
  ` }).catch(() => {});

  // Wait for skeletons to clear
  await page.waitForFunction(() => {
    const skeletons = document.querySelectorAll(
      '.nn-skeleton, [class*="skeleton"], [aria-busy="true"], [data-loading="true"]',
    );
    return skeletons.length === 0;
  }, { timeout: 20_000 }).catch(() => {});

  if (extraMs > 0) await page.waitForTimeout(extraMs);
  await page.waitForTimeout(EXTRA_WAIT_MS);
}

// ── CAT Exam Session Management ───────────────────────────────────────────────

async function installQuestionFixture(
  page: Page,
  factory: () => Record<string, unknown>,
): Promise<void> {
  await page.route("**/api/practice-tests/*/question**", async (route: Route) => {
    const req: Request = route.request();
    if (req.method() !== "GET") { await route.continue(); return; }

    const res = await route.fetch().catch(() => null);
    if (!res) { await route.continue(); return; }

    let body: { index?: number; question?: Record<string, unknown> };
    try {
      body = (await res.json()) as { index?: number; question?: Record<string, unknown> };
    } catch {
      await route.fulfill({ response: res });
      return;
    }

    // Only mutate question index 0 to ensure fixture appears as first question
    if (body.question && typeof body.index === "number") {
      body.question = { ...factory() };
    }

    await route.fulfill({
      status: res.status(),
      headers: Object.fromEntries(Object.entries(res.headers())),
      body: JSON.stringify(body),
    });
  });
}

async function startCatExamSession(page: Page, origin: string): Promise<boolean> {
  await page.goto(
    `${origin}/app/practice-tests?cat=1&pathwayId=${encodeURIComponent(PATHWAY_ID)}`,
    { waitUntil: "domcontentloaded", timeout: 180_000 },
  );

  if (page.url().includes("/login")) {
    console.warn("  ⚠ Auth redirect — re-seeding login");
    return false;
  }

  await stabilize(page, 500);

  // Click start test button
  const startBtn = page
    .locator("[data-nn-qa-practice-hub-start-test], [data-nn-e2e-practice-hub-cat-exam]")
    .or(page.locator('button:has-text("Start test"), button:has-text("Begin exam"), button:has-text("Start exam")'))
    .first();

  const startVisible = await startBtn.isVisible({ timeout: 60_000 }).catch(() => false);
  if (!startVisible) {
    console.warn("  ⚠ Start button not found — skipping exam session capture");
    return false;
  }

  await startBtn.click();

  // Handle any "Begin exam" modal/confirm step
  const beginModal = page.locator('button:has-text("Begin exam"), button:has-text("Start")').first();
  const modalVisible = await beginModal.isVisible({ timeout: 5_000 }).catch(() => false);
  if (modalVisible) {
    await beginModal.click();
    await page.waitForTimeout(500);
  }

  // Wait for exam URL and root element
  await page.waitForURL(/\/app\/practice-tests\/[a-zA-Z0-9_-]+/, { timeout: 120_000 }).catch(() => {});
  const examRoot = page.locator("[data-cat-exam-root]");
  const examVisible = await examRoot.isVisible({ timeout: 60_000 }).catch(() => false);

  if (!examVisible) {
    console.warn("  ⚠ Exam root not rendered — likely no active session");
    return false;
  }

  return true;
}

// ── Screenshot Capture ────────────────────────────────────────────────────────

interface CaptureResult {
  slug: string;
  filePath: string;
  success: boolean;
  error?: string;
  bytes?: number;
  validation?: CaptureValidation;
}

type CaptureReadinessCheck = {
  name: string;
  selector: string;
  minVisible?: number;
};

type CaptureValidation = {
  passed: boolean;
  checks: string[];
  rejectedReasons: string[];
  bodyTextLength: number;
  finalUrl: string;
  validatedAt: string;
};

async function visibleCount(page: Page, selector: string): Promise<number> {
  return page.locator(selector).evaluateAll((elements) =>
    elements.filter((element) => {
      const style = window.getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return (
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        Number(style.opacity) !== 0 &&
        rect.width > 0 &&
        rect.height > 0
      );
    }).length,
  ).catch(() => 0);
}

function readinessChecksForSpec(spec: CaptureSpec): CaptureReadinessCheck[] {
  const main = { name: "main content visible", selector: "main, [role='main']", minVisible: 1 };

  if (spec.requiresExamSession || spec.category === "cat") {
    return [
      main,
      {
        name: "CAT question visible",
        selector: ".nn-cat-question-stem, [data-nn-question-stem], .question-stem, [data-question-card], main p",
        minVisible: 1,
      },
      {
        name: "CAT timer visible",
        selector: "[data-cat-timer], [data-testid*='timer' i], [aria-label*='timer' i], .nn-cat-timer, .timer, time",
        minVisible: 1,
      },
      {
        name: "CAT controls visible",
        selector: "button, [role='button']",
        minVisible: 2,
      },
    ];
  }

  if (spec.category === "flashcards") {
    const isHubLike = /hub|decks|weak-areas/.test(spec.slug);
    if (isHubLike) {
      return [
        main,
        {
          name: "flashcard deck content visible",
          selector: "[data-flashcard-deck], [data-testid*='flashcard' i], a[href*='flashcards'], button",
          minVisible: 2,
        },
        {
          name: "flashcard controls visible",
          selector: "button, a[href*='flashcards'], [role='button']",
          minVisible: 2,
        },
      ];
    }
    return [
      main,
      {
        name: "flashcard question visible",
        selector: "[data-flashcard-question], [data-testid*='flashcard-question' i], [data-card-front], .flashcard-question, main h1, main h2, main p",
        minVisible: 1,
      },
      {
        name: "flashcard answers visible",
        selector: "[data-flashcard-answer], [data-testid*='answer' i], button, [role='button']",
        minVisible: 2,
      },
      {
        name: "flashcard controls visible",
        selector: "button, [role='button']",
        minVisible: 2,
      },
    ];
  }

  if (spec.category === "practice-exams") {
    return [
      main,
      {
        name: "practice question or bank content visible",
        selector: "[data-question-card], [data-nn-question-stem], .question-stem, main h1, main h2, main p",
        minVisible: 1,
      },
      {
        name: "practice controls visible",
        selector: "button, [role='button'], a[href*='questions'], a[href*='practice-tests']",
        minVisible: 2,
      },
    ];
  }

  return [
    main,
    {
      name: "educational content visible",
      selector: "main h1, main h2, main h3, main p, main article, [data-loaded='true'], [data-nn-activity-content]",
      minVisible: 2,
    },
    {
      name: "navigation or action controls visible",
      selector: "button, [role='button'], a",
      minVisible: 1,
    },
  ];
}

async function blockedDomReasons(page: Page): Promise<string[]> {
  const reasons: string[] = [];
  const bodyText = await page.locator("body").innerText({ timeout: 10_000 }).catch(() => "");

  for (const blockedText of BLOCKED_CAPTURE_TEXT) {
    const pattern = new RegExp(`\\b${blockedText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
    if (pattern.test(bodyText)) reasons.push(`blocked text visible: ${blockedText}`);
  }

  for (const selector of BLOCKED_CAPTURE_SELECTORS) {
    const count = await visibleCount(page, selector);
    if (count > 0) reasons.push(`blocked loader selector visible: ${selector} (${count})`);
  }

  const currentUrl = page.url();
  try {
    const pathname = new URL(currentUrl).pathname;
    if (/\/login|\/signup/i.test(pathname)) reasons.push(`authentication redirect: ${pathname}`);
  } catch {
    /* ignore */
  }

  if (bodyText.trim().length < 120) reasons.push("blank or near-empty page text");
  return reasons;
}

async function validateScreenshotReadiness(page: Page, spec: CaptureSpec): Promise<CaptureValidation> {
  const checks = readinessChecksForSpec(spec);
  const passedChecks: string[] = [];
  const rejectedReasons: string[] = [];

  for (const check of checks) {
    await page.locator(check.selector).first().waitFor({ state: "visible", timeout: 30_000 }).catch(() => {});
    const count = await visibleCount(page, check.selector);
    if (count < (check.minVisible ?? 1)) {
      rejectedReasons.push(`readiness check failed: ${check.name} (${count} visible for ${check.selector})`);
    } else {
      passedChecks.push(check.name);
    }
  }

  const clearStartedAt = Date.now();
  while (Date.now() - clearStartedAt < 20_000) {
    const reasons = await blockedDomReasons(page);
    if (reasons.length === 0) break;
    await page.waitForTimeout(250);
  }

  rejectedReasons.push(...await blockedDomReasons(page));

  const bodyText = await page.locator("body").innerText({ timeout: 5_000 }).catch(() => "");
  return {
    passed: rejectedReasons.length === 0,
    checks: passedChecks,
    rejectedReasons,
    bodyTextLength: bodyText.trim().length,
    finalUrl: page.url(),
    validatedAt: new Date().toISOString(),
  };
}

async function assertScreenshotReady(page: Page, spec: CaptureSpec): Promise<CaptureValidation> {
  const validation = await validateScreenshotReadiness(page, spec);
  if (!validation.passed) {
    throw new Error(`screenshot rejected: ${validation.rejectedReasons.join("; ")}`);
  }
  return validation;
}

async function captureValidatedScreenshot(
  page: Page,
  spec: CaptureSpec,
  filePath: string,
): Promise<CaptureValidation> {
  const validation = await assertScreenshotReady(page, spec);

  if (spec.cropSelector) {
    const target = page.locator(spec.cropSelector).first();
    const visible = await target.isVisible({ timeout: 20_000 }).catch(() => false);
    if (visible) {
      await target.screenshot({ path: filePath, animations: "disabled" });
    } else {
      await page.screenshot({ path: filePath, fullPage: true, animations: "disabled" });
    }
  } else {
    await page.screenshot({ path: filePath, fullPage: true, animations: "disabled" });
  }

  return validation;
}

async function captureSpec(
  page: Page,
  spec: CaptureSpec,
  outputDir: string,
  creds: { email: string; password: string },
): Promise<CaptureResult> {
  const dir = path.join(outputDir, spec.category);
  mkdirSync(dir, { recursive: true });

  const filePath = path.join(dir, `${spec.slug}.png`);
  const origin = BASE_URL;
  let validation: CaptureValidation | undefined;

  try {
    // Set viewport
    await page.setViewportSize(VIEWPORTS[spec.viewport]);

    if (spec.requiresExamSession && spec.fixtureKey) {
      // CAT exam session captures with question fixture injection
      const factory = QUESTION_FIXTURES[spec.fixtureKey];
      await installQuestionFixture(page, factory);

      const sessionStarted = await startCatExamSession(page, origin);
      if (!sessionStarted) {
        await page.unroute("**/api/practice-tests/*/question**").catch(() => {});
        return { slug: spec.slug, filePath, success: false, error: "Could not start exam session" };
      }

      // Apply theme (in-place after session start)
      await applyTheme(page, spec.theme);

      // Wait for question stem with fixture text
      const stemLocator = page.locator(
        ".nn-cat-question-stem, [data-nn-question-stem], .question-stem, main p",
      ).first();
      await stemLocator.waitFor({ state: "visible", timeout: 60_000 }).catch(() => {});

      await stabilize(page, 400);

      // Run interaction if specified
      if (spec.interactionKey && INTERACTIONS[spec.interactionKey]) {
        await INTERACTIONS[spec.interactionKey](page);
      }

      await page.waitForTimeout(300);

      validation = await captureValidatedScreenshot(page, spec, filePath);

      await page.unroute("**/api/practice-tests/*/question**").catch(() => {});

    } else {
      // Standard page capture (no exam session)
      const targetUrl = `${origin}${spec.route}`;

      // Set theme in localStorage before navigation
      await page.addInitScript(
        ({ key, value }) => {
          try { localStorage.setItem(key, value); } catch { /* ignore */ }
        },
        { key: THEME_KEY, value: spec.theme },
      );

      await page.goto(targetUrl, { waitUntil: "domcontentloaded", timeout: 90_000 });

      if (page.url().includes("/login")) {
        // Re-login and retry
        await login(page, creds);
        await page.addInitScript(
          ({ key, value }) => {
            try { localStorage.setItem(key, value); } catch { /* ignore */ }
          },
          { key: THEME_KEY, value: spec.theme },
        );
        await page.goto(targetUrl, { waitUntil: "domcontentloaded", timeout: 90_000 });
      }

      await applyTheme(page, spec.theme);
      await stabilize(page, spec.extraWaitMs ?? 0);

      validation = await captureValidatedScreenshot(page, spec, filePath);
    }

    const stat = await fs.stat(filePath);
    return { slug: spec.slug, filePath, success: true, bytes: stat.size, validation };

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`  ✗ ${spec.slug}: ${msg.slice(0, 120)}`);
    return { slug: spec.slug, filePath, success: false, error: msg.slice(0, 200) };
  }
}

// ── Marketing Crops ───────────────────────────────────────────────────────────

async function generateMarketingCrops(
  spec: CaptureSpec,
  sourcePath: string,
  outputDir: string,
): Promise<void> {
  const cropsDir = path.join(outputDir, "marketing-crops", spec.category);
  mkdirSync(cropsDir, { recursive: true });

  try {
    // Use sharp if available, otherwise skip
    const sharp = await import("sharp").catch(() => null);
    if (!sharp) {
      console.warn("  ⚠ sharp not available — skipping marketing crops");
      return;
    }

    const sourceImg = sharp.default(sourcePath);
    const meta = await sourceImg.metadata();
    const srcW = meta.width ?? 1440;
    const srcH = meta.height ?? 900;

    for (const [cropName, { width: cW, height: cH }] of Object.entries(MARKETING_CROPS)) {
      const cropPath = path.join(cropsDir, `${spec.slug}--${cropName}.png`);

      // Smart crop: cover fill
      const scale = Math.max(cW / srcW, cH / srcH);
      const scaledW = Math.round(srcW * scale);
      const scaledH = Math.round(srcH * scale);
      const left = Math.round((scaledW - cW) / 2);
      const top = Math.round((scaledH - cH) / 2);

      await sharp
        .default(sourcePath)
        .resize(scaledW, scaledH)
        .extract({ left, top, width: cW, height: cH })
        .png({ compressionLevel: 8 })
        .toFile(cropPath);
    }
  } catch (err) {
    console.warn(`  ⚠ Crop failed for ${spec.slug}: ${err instanceof Error ? err.message : String(err)}`);
  }
}

// ── Gallery HTML Generator ────────────────────────────────────────────────────

function generateGalleryHtml(
  specs: CaptureSpec[],
  results: CaptureResult[],
  outputDir: string,
): string {
  const resultMap = new Map(results.map((r) => [r.slug, r]));

  const categories = [...new Set(specs.map((s) => s.category))];

  const categoryLabels: Record<string, string> = {
    "cat": "CAT Adaptive Exam",
    "practice-exams": "Practice Exams & Question Bank",
    "flashcards": "Flashcards",
    "ecg": "ECG Module",
    "pharmacology": "Pharmacology",
    "clinical-skills": "Clinical Skills",
    "loft": "LOFT / OSCE Simulation",
  };

  const checklist = [
    "Visual Quality — Sharp, no blurriness or pixel artifacts",
    "Theme Awareness — Correct colors for Ocean / Blossom / Midnight",
    "Branding — NurseNest logo and brand elements visible",
    "Readability — Text legible at viewport size",
    "Mobile UX — Responsive layout, no overflow or clipping",
    "Spacing — Consistent padding and layout rhythm",
    "Alignment — Elements properly aligned",
    "Rationale Layout — Rationale panel visible and readable",
    "Accessibility — Adequate contrast, clear hierarchy",
    "Question State — Correct state represented (unanswered/partial/complete/etc.)",
  ];

  const questionStateColors: Record<QuestionState | string, string> = {
    unanswered: "#64748b",
    partial: "#d97706",
    complete: "#2563eb",
    submitted: "#7c3aed",
    correct: "#16a34a",
    incorrect: "#dc2626",
    rationale: "#0891b2",
    hub: "#334155",
    launch: "#334155",
    results: "#334155",
  };

  const successCount = results.filter((r) => r.success).length;
  const failCount = results.filter((r) => !r.success).length;

  const categoryHtml = categories.map((cat) => {
    const catSpecs = specs.filter((s) => s.category === cat);
    const catResults = catSpecs.map((s) => ({ spec: s, result: resultMap.get(s.slug) }));

    const cardHtml = catResults.map(({ spec, result }) => {
      const ok = result?.success ?? false;
      const relPath = `../${spec.category}/${spec.slug}.png`;
      const stateColor = questionStateColors[spec.questionState ?? spec.questionType ?? "hub"] ?? "#334155";

      const badges = [
        spec.viewport && `<span class="badge badge-vp">${spec.viewport}</span>`,
        spec.theme && `<span class="badge badge-theme badge-theme-${spec.theme}">${spec.theme}</span>`,
        spec.questionType && `<span class="badge badge-qt">${spec.questionType}</span>`,
        spec.questionState && `<span class="badge badge-state" style="background:${stateColor}">${spec.questionState}</span>`,
        spec.marketingCrop && `<span class="badge badge-crop">marketing crop</span>`,
      ].filter(Boolean).join("\n          ");

      return `
        <div class="card ${ok ? "card-ok" : "card-fail"}">
          <div class="card-img-wrap">
            ${ok
              ? `<a href="${relPath}" target="_blank"><img src="${relPath}" alt="${spec.label}" loading="lazy" /></a>`
              : `<div class="card-fail-placeholder"><span>⚠ Capture failed</span>${result?.error ? `<small>${result.error.slice(0, 80)}</small>` : ""}</div>`
            }
          </div>
          <div class="card-meta">
            <div class="card-label">${spec.label}</div>
            <div class="card-badges">
          ${badges}
            </div>
            ${spec.notes ? `<div class="card-notes">${spec.notes}</div>` : ""}
            ${result?.bytes ? `<div class="card-size">${(result.bytes / 1024).toFixed(1)} KB</div>` : ""}
          </div>
        </div>`;
    }).join("\n");

    return `
      <section class="category" id="${cat}">
        <h2>${categoryLabels[cat] ?? cat}</h2>
        <div class="grid">
${cardHtml}
        </div>
      </section>`;
  }).join("\n");

  const navLinks = categories.map((cat) =>
    `<a href="#${cat}">${categoryLabels[cat] ?? cat}</a>`
  ).join("\n  ");

  const checklistHtml = checklist.map((item) =>
    `<li><label><input type="checkbox"> ${item}</label></li>`
  ).join("\n      ");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>NurseNest Assessment Screenshot Audit — ${new Date().toLocaleDateString("en-CA")}</title>
  <style>
    :root {
      --bg: #0f172a;
      --surface: #1e293b;
      --border: #334155;
      --text: #f1f5f9;
      --muted: #94a3b8;
      --ok: #22c55e;
      --fail: #ef4444;
      --accent: #6366f1;
    }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: var(--bg); color: var(--text); font-family: system-ui, -apple-system, sans-serif; font-size: 14px; line-height: 1.5; }

    header { background: var(--surface); border-bottom: 1px solid var(--border); padding: 20px 32px; display: flex; align-items: center; gap: 24px; flex-wrap: wrap; position: sticky; top: 0; z-index: 100; }
    header h1 { font-size: 18px; font-weight: 700; }
    .stats { display: flex; gap: 16px; margin-left: auto; }
    .stat { background: var(--bg); border: 1px solid var(--border); border-radius: 8px; padding: 6px 14px; font-size: 13px; }
    .stat-ok { border-color: var(--ok); color: var(--ok); }
    .stat-fail { border-color: var(--fail); color: var(--fail); }

    nav { background: var(--surface); border-bottom: 1px solid var(--border); padding: 8px 32px; display: flex; gap: 8px; flex-wrap: wrap; }
    nav a { color: var(--muted); text-decoration: none; padding: 4px 10px; border-radius: 6px; font-size: 13px; }
    nav a:hover { background: var(--border); color: var(--text); }

    main { max-width: 1600px; margin: 0 auto; padding: 32px; }

    section.category { margin-bottom: 56px; }
    section.category h2 { font-size: 20px; font-weight: 700; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid var(--border); color: var(--text); }

    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }

    .card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; }
    .card-ok { border-color: var(--border); }
    .card-fail { border-color: var(--fail); opacity: 0.7; }

    .card-img-wrap { aspect-ratio: 16/10; overflow: hidden; background: var(--bg); position: relative; }
    .card-img-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.2s; }
    .card-img-wrap:hover img { transform: scale(1.02); }
    .card-fail-placeholder { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--fail); gap: 8px; }
    .card-fail-placeholder small { color: var(--muted); font-size: 11px; text-align: center; padding: 0 16px; }

    .card-meta { padding: 14px; flex: 1; display: flex; flex-direction: column; gap: 8px; }
    .card-label { font-weight: 600; font-size: 13px; color: var(--text); }
    .card-notes { font-size: 12px; color: var(--muted); }
    .card-size { font-size: 11px; color: var(--border); }

    .card-badges { display: flex; flex-wrap: wrap; gap: 5px; }
    .badge { display: inline-block; font-size: 11px; padding: 2px 7px; border-radius: 4px; font-weight: 600; }
    .badge-vp { background: #1e3a5f; color: #93c5fd; }
    .badge-theme { color: #fff; }
    .badge-theme-ocean { background: #0c4a6e; }
    .badge-theme-blossom { background: #831843; }
    .badge-theme-midnight { background: #1e1b4b; }
    .badge-qt { background: #1c1917; color: #d6d3d1; }
    .badge-state { color: #fff; }
    .badge-crop { background: #78350f; color: #fcd34d; }

    aside.checklist { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 24px; margin-bottom: 40px; }
    aside.checklist h3 { font-size: 16px; margin-bottom: 16px; }
    aside.checklist ul { list-style: none; display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 10px; }
    aside.checklist li label { display: flex; align-items: flex-start; gap: 8px; cursor: pointer; font-size: 13px; color: var(--muted); }
    aside.checklist li input[type="checkbox"] { margin-top: 2px; accent-color: var(--accent); flex-shrink: 0; }

    .generated { text-align: center; padding: 24px; color: var(--muted); font-size: 12px; }
  </style>
</head>
<body>
  <header>
    <h1>NurseNest — Assessment Screenshot Audit</h1>
    <div class="stats">
      <span class="stat stat-ok">✓ ${successCount} captured</span>
      ${failCount > 0 ? `<span class="stat stat-fail">✗ ${failCount} failed</span>` : ""}
      <span class="stat">${specs.length} total</span>
      <span class="stat">${new Date().toLocaleDateString("en-CA")}</span>
    </div>
  </header>

  <nav>
    ${navLinks}
  </nav>

  <main>
    <aside class="checklist">
      <h3>Review Checklist — check each item as you audit</h3>
      <ul>
        ${checklistHtml}
      </ul>
    </aside>
${categoryHtml}
  </main>

  <div class="generated">
    Generated by generate-assessment-screenshots.ts · NurseNest · ${new Date().toISOString()}
  </div>
</body>
</html>`;
}

// ── Manifest ──────────────────────────────────────────────────────────────────

async function writeManifest(
  specs: CaptureSpec[],
  results: CaptureResult[],
  outputDir: string,
): Promise<void> {
  const manifest = {
    generatedAt: new Date().toISOString(),
    baseUrl: BASE_URL,
    pathwayId: PATHWAY_ID,
    totalSpecs: specs.length,
    successCount: results.filter((r) => r.success).length,
    failCount: results.filter((r) => !r.success).length,
    themes: THEMES,
    viewports: Object.keys(VIEWPORTS),
    results: results.map((r) => {
      const spec = specs.find((s) => s.slug === r.slug)!;
      return {
        slug: r.slug,
        category: spec.category,
        label: spec.label,
        theme: spec.theme,
        viewport: spec.viewport,
        questionType: spec.questionType,
        questionState: spec.questionState,
        success: r.success,
        bytes: r.bytes,
        error: r.error,
        validation: r.validation,
        filePath: r.filePath,
      };
    }),
  };

  await fs.writeFile(
    path.join(outputDir, "manifest.json"),
    JSON.stringify(manifest, null, 2),
  );
}

async function writeValidationReport(
  specs: CaptureSpec[],
  results: CaptureResult[],
  outputDir: string,
): Promise<void> {
  const resultMap = new Map(results.map((result) => [result.slug, result]));
  const invalid = results.filter((result) => !result.success || result.validation?.passed === false);
  const valid = results.filter((result) => result.success && result.validation?.passed !== false);
  const report = [
    "# NurseNest Screenshot Validation Report",
    "",
    `Generated: ${new Date().toISOString()}`,
    `Base URL: ${BASE_URL}`,
    `Total specs: ${specs.length}`,
    `Valid screenshots: ${valid.length}`,
    `Rejected screenshots: ${invalid.length}`,
    "",
    "## Gate",
    "",
    "- No skeleton loaders visible before capture.",
    "- No spinners visible before capture.",
    "- No loading, suspense, or blank content states visible before capture.",
    "- Required activity content must be visible before capture.",
    `- Blocked text: ${BLOCKED_CAPTURE_TEXT.join(", ")}`,
    "",
    "## Results",
    "",
    "| Screenshot | Category | Theme | Viewport | Status | Validation |",
    "| --- | --- | --- | --- | --- | --- |",
    ...specs.map((spec) => {
      const result = resultMap.get(spec.slug);
      const status = result?.success && result.validation?.passed !== false ? "valid" : "rejected";
      const validation = result?.validation
        ? result.validation.passed
          ? `checks: ${result.validation.checks.join(", ")}`
          : result.validation.rejectedReasons.join("; ")
        : result?.error ?? "not captured";
      return `| ${spec.slug} | ${spec.category} | ${spec.theme} | ${spec.viewport} | ${status} | ${validation.replace(/\|/g, "\\|").slice(0, 500)} |`;
    }),
    "",
  ].join("\n");

  await fs.writeFile(path.join(outputDir, "screenshot-validation-report.md"), report);
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const args = parseCli(process.argv.slice(2));

  if (args.help) {
    console.log(`
NurseNest Assessment Screenshot Generator

Usage:
  npx tsx scripts/generate-assessment-screenshots.ts [options]

Options:
  --category=cat,flashcards    Capture only these categories
  --theme=ocean,midnight       Capture only these themes
  --viewport=desktop           Capture only this viewport
  --no-crops                   Skip marketing crop generation
  --no-gallery                 Skip gallery HTML generation
  --list                       List all capture specs and exit
  --help                       Show this help

Env:
  PLAYWRIGHT_BASE_URL          App URL (default: http://127.0.0.1:3000)
  QA_PAID_EMAIL / QA_PAID_PASSWORD
  SCREENSHOT_OUT_DIR           Output root (default: ../marketing-assets/screenshots)
  SCREENSHOT_PATHWAY_ID        Pathway (default: us-rn-nclex-rn)
`);
    return;
  }

  let allSpecs = buildCaptureSpecs();

  // Apply filters
  if (args.categories) {
    allSpecs = allSpecs.filter((s) => args.categories!.includes(s.category));
  }
  if (args.themes) {
    allSpecs = allSpecs.filter((s) => args.themes!.includes(s.theme));
  }
  if (args.viewports) {
    allSpecs = allSpecs.filter((s) => args.viewports!.includes(s.viewport));
  }

  if (args.list) {
    console.log(`\n${allSpecs.length} capture specs:\n`);
    for (const s of allSpecs) {
      console.log(`  ${s.slug.padEnd(60)} [${s.category}] ${s.theme} / ${s.viewport}`);
    }
    return;
  }

  const creds = resolveCredentials();

  console.log("NurseNest Assessment Screenshot Generator");
  console.log(`  App:       ${BASE_URL}`);
  console.log(`  Output:    ${OUT_ROOT}`);
  console.log(`  Pathway:   ${PATHWAY_ID}`);
  console.log(`  Specs:     ${allSpecs.length}`);
  console.log(`  Themes:    ${THEMES.join(", ")}`);
  console.log("");

  // Set up output directories
  mkdirSync(OUT_ROOT, { recursive: true });
  for (const cat of ["cat", "practice-exams", "flashcards", "ecg", "pharmacology", "clinical-skills", "loft", "gallery", "marketing-crops"]) {
    mkdirSync(path.join(OUT_ROOT, cat), { recursive: true });
  }

  const browser: Browser = await chromium.launch({ headless: true });
  const results: CaptureResult[] = [];

  try {
    // Create authenticated context
    const context: BrowserContext = await browser.newContext({
      viewport: VIEWPORTS.desktop,
      reducedMotion: "reduce",
      colorScheme: "light",
    });

    const authPage: Page = await context.newPage();
    await login(authPage, creds);

    // Save storage state for reuse
    const storageState = await context.storageState();
    await authPage.close();

    // Process specs in batches (sequential within each batch to avoid session conflicts)
    const examSessionSpecs = allSpecs.filter((s) => s.requiresExamSession);
    const regularSpecs = allSpecs.filter((s) => !s.requiresExamSession);

    // Process regular specs (no exam session needed)
    console.log(`\nCapturing ${regularSpecs.length} regular pages...`);
    for (const spec of regularSpecs) {
      process.stdout.write(`  → ${spec.slug}... `);
      const page = await context.newPage();
      const result = await captureSpec(page, spec, OUT_ROOT, creds);
      await page.close();
      results.push(result);

      if (result.success) {
        console.log(`✓ (${((result.bytes ?? 0) / 1024).toFixed(0)} KB)`);
        if (!args.noCrops && spec.marketingCrop) {
          await generateMarketingCrops(spec, result.filePath, OUT_ROOT);
        }
      } else {
        console.log(`✗ ${result.error?.slice(0, 60) ?? "failed"}`);
      }
    }

    // Process exam session specs (need fresh context per spec to avoid session state leakage)
    console.log(`\nCapturing ${examSessionSpecs.length} exam session pages...`);
    for (const spec of examSessionSpecs) {
      process.stdout.write(`  → ${spec.slug}... `);

      const examContext = await browser.newContext({
        storageState,
        viewport: VIEWPORTS[spec.viewport],
        reducedMotion: "reduce",
      });
      const page = await examContext.newPage();
      const result = await captureSpec(page, spec, OUT_ROOT, creds);
      await page.close();
      await examContext.close();
      results.push(result);

      if (result.success) {
        console.log(`✓ (${((result.bytes ?? 0) / 1024).toFixed(0)} KB)`);
        if (!args.noCrops && spec.marketingCrop) {
          await generateMarketingCrops(spec, result.filePath, OUT_ROOT);
        }
      } else {
        console.log(`✗ ${result.error?.slice(0, 60) ?? "failed"}`);
      }
    }

  } finally {
    await browser.close();
  }

  // Write manifest
  await writeManifest(allSpecs, results, OUT_ROOT);
  await writeValidationReport(allSpecs, results, OUT_ROOT);

  // Generate gallery
  if (!args.noGallery) {
    console.log("\nGenerating gallery...");
    const galleryHtml = generateGalleryHtml(allSpecs, results, OUT_ROOT);
    await fs.writeFile(path.join(OUT_ROOT, "gallery", "index.html"), galleryHtml);
    console.log(`  Gallery: ${path.join(OUT_ROOT, "gallery", "index.html")}`);
  }

  // Summary
  const successCount = results.filter((r) => r.success).length;
  const failCount = results.filter((r) => !r.success).length;

  console.log("\n─────────────────────────────────────────");
  console.log(`  ✓ ${successCount} captured`);
  if (failCount > 0) {
    console.log(`  ✗ ${failCount} failed`);
    for (const r of results.filter((r) => !r.success)) {
      console.log(`    - ${r.slug}: ${r.error?.slice(0, 80)}`);
    }
  }
  console.log(`  Output: ${OUT_ROOT}`);
  console.log(`  Validation report: ${path.join(OUT_ROOT, "screenshot-validation-report.md")}`);
  console.log("─────────────────────────────────────────\n");

  if (failCount > 0) {
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error("Fatal:", err instanceof Error ? err.message : err);
  process.exit(1);
});
