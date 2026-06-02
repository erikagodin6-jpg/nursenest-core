#!/usr/bin/env tsx
/**
 * Reproducible homepage product screenshot generator.
 *
 * Captures high-density PNG product demos from the running NurseNest UI and
 * writes desktop + mobile variants to public/images/homepage.
 *
 * Usage:
 *   PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 \
 *   QA_PAID_EMAIL=demo@example.com QA_PAID_PASSWORD=... \
 *   npx tsx scripts/generate-homepage-screenshots.ts
 */

import { chromium, type BrowserContext, type Page } from "playwright";
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  assertMarketingScreenshotDepth,
  marketingScreenshotReviewGate,
  type MarketingScreenshotCaptureSurface,
  type MarketingScreenshotDepthLevel,
} from "./lib/marketing-screenshot-depth";
import {
  getTopMarketingShowcaseItem,
  type MarketingShowcaseItem,
  type MarketingShowcaseKind,
} from "@/lib/marketing/marketing-showcase-content";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const APP_ROOT = path.join(__dirname, "..");
const BASE_URL = (process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000").replace(/\/$/, "");
const OUT_DIR = path.join(APP_ROOT, "public", "images", "homepage");
const WAIT_MS = Number(process.env.HOMEPAGE_SCREENSHOT_WAIT_MS ?? "1400");

type Target = {
  name: string;
  route: string;
  title: string;
  waitFor: string;
  theme: "ocean" | "midnight" | "blossom";
  depthLevel: MarketingScreenshotDepthLevel;
  captureSurface: MarketingScreenshotCaptureSurface;
  educationalState: string;
  demonstrates: readonly string[];
  preparationRequired: true;
  reviewGate: readonly string[];
  showcaseKind?: MarketingShowcaseKind;
  showcaseItem?: MarketingShowcaseItem;
  prepare: (page: Page) => Promise<void>;
};

const REVIEW_GATE = marketingScreenshotReviewGate();

function withShowcase(target: Omit<Target, "showcaseItem">): Target {
  return {
    ...target,
    showcaseItem: target.showcaseKind ? getTopMarketingShowcaseItem(target.showcaseKind) : undefined,
  };
}

const TARGETS: Target[] = [
  withShowcase({
    name: "question-bank-demo",
    route: "/app/practice-tests",
    title: "Question Bank",
    waitFor: "main",
    theme: "ocean",
    showcaseKind: "question-bank-item",
    depthLevel: 1,
    captureSurface: "learning-activity",
    educationalState: "answered NCLEX-style question with selected answer, correct answer, rationale, and clinical pearl visible",
    demonstrates: ["question stem", "answer choices", "selected answer", "correct answer", "rationale", "clinical pearl"],
    preparationRequired: true,
    reviewGate: REVIEW_GATE,
    prepare: captureAnsweredQuestion,
  }),
  withShowcase({
    name: "ngn-bowtie-demo",
    route: "/app/practice-tests",
    title: "Next Generation NCLEX",
    waitFor: "main",
    theme: "ocean",
    showcaseKind: "bowtie-question",
    depthLevel: 1,
    captureSurface: "learning-activity",
    educationalState: "completed bowtie item with condition, actions, monitoring priorities, and rationale visible",
    demonstrates: ["clinical scenario", "bowtie selections", "condition", "actions", "monitoring priorities", "rationale"],
    preparationRequired: true,
    reviewGate: REVIEW_GATE,
    prepare: captureBowtieQuestion,
  }),
  withShowcase({
    name: "ngn-matrix-demo",
    route: "/app/practice-tests",
    title: "NGN Matrix",
    waitFor: "main",
    theme: "ocean",
    showcaseKind: "matrix-question",
    depthLevel: 1,
    captureSurface: "learning-activity",
    educationalState: "completed matrix item with selections and explanation visible",
    demonstrates: ["matrix rows", "completed selections", "clinical scenario", "rationale"],
    preparationRequired: true,
    reviewGate: REVIEW_GATE,
    prepare: captureMatrixQuestion,
  }),
  withShowcase({
    name: "cat-exam-demo",
    route: "/app/practice-tests/cat-launch?pathwayId=ca-rn-nclex-rn",
    title: "CAT Exam",
    waitFor: "main",
    theme: "midnight",
    showcaseKind: "cat-question",
    depthLevel: 1,
    captureSurface: "learning-activity",
    educationalState: "CAT question in progress with timer, progress, and adaptation indicators visible",
    demonstrates: ["question in progress", "timer", "progress", "adaptive difficulty", "answer choices"],
    preparationRequired: true,
    reviewGate: REVIEW_GATE,
    prepare: captureCatQuestionInProgress,
  }),
  withShowcase({
    name: "lesson-demo",
    route: "/app/lessons",
    title: "Lessons",
    waitFor: "main",
    theme: "blossom",
    showcaseKind: "lesson",
    depthLevel: 2,
    captureSurface: "educational-content",
    educationalState: "opened lesson with clinical pearl, educational content, and knowledge check visible",
    demonstrates: ["lesson title", "educational content", "clinical pearl", "knowledge check"],
    preparationRequired: true,
    reviewGate: REVIEW_GATE,
    prepare: captureLessonLearningState,
  }),
  withShowcase({
    name: "ecg-demo",
    route: "/modules/ecg/interactive",
    title: "ECG Module",
    waitFor: "main",
    theme: "midnight",
    showcaseKind: "ecg-case",
    depthLevel: 1,
    captureSurface: "learning-activity",
    educationalState: "ECG Detective Mode with rhythm strip, interpretation workflow, and clinical reasoning visible",
    demonstrates: ["ECG strip", "rate analysis", "PR analysis", "QRS analysis", "rhythm reasoning"],
    preparationRequired: true,
    reviewGate: REVIEW_GATE,
    prepare: captureEcgDetectiveMode,
  }),
  withShowcase({
    name: "telemetry-shift-demo",
    route: "/modules/ecg/advanced/scenarios",
    title: "Telemetry Shift Simulator",
    waitFor: "main",
    theme: "midnight",
    showcaseKind: "ecg-case",
    depthLevel: 1,
    captureSurface: "learning-activity",
    educationalState: "telemetry shift scenario with monitored patients, prioritization, escalation, and decisions visible",
    demonstrates: ["monitored patients", "telemetry strips", "prioritization", "escalation", "clinical decisions"],
    preparationRequired: true,
    reviewGate: REVIEW_GATE,
    prepare: captureTelemetryShift,
  }),
  withShowcase({
    name: "lab-workstation-demo",
    route: "/app/labs",
    title: "Clinical Lab Workstation",
    waitFor: "main",
    theme: "ocean",
    showcaseKind: "lab-activity",
    depthLevel: 1,
    captureSurface: "learning-activity",
    educationalState: "abnormal lab interpretation activity with clinical analysis and nursing priorities visible",
    demonstrates: ["abnormal labs", "interpretation workflow", "clinical analysis", "nursing priorities"],
    preparationRequired: true,
    reviewGate: REVIEW_GATE,
    prepare: captureLabInterpretation,
  }),
  withShowcase({
    name: "med-math-demo",
    route: "/app/med-calculations",
    title: "Medication Math",
    waitFor: "main",
    theme: "ocean",
    showcaseKind: "medication-math-activity",
    depthLevel: 1,
    captureSurface: "learning-activity",
    educationalState: "medication calculation activity with formula setup, calculator, and answer validation visible",
    demonstrates: ["dosage problem", "formula setup", "calculator", "answer validation"],
    preparationRequired: true,
    reviewGate: REVIEW_GATE,
    prepare: captureMedicationMathActivity,
  }),
  withShowcase({
    name: "pharmacology-demo",
    route: "/app/pharmacology",
    title: "Pharmacology",
    waitFor: "main",
    theme: "ocean",
    showcaseKind: "pharmacology-activity",
    depthLevel: 1,
    captureSurface: "learning-activity",
    educationalState: "pharmacology learning workflow with nursing considerations, monitoring, and rationale visible",
    demonstrates: ["medication class", "nursing considerations", "monitoring", "rationale"],
    preparationRequired: true,
    reviewGate: REVIEW_GATE,
    prepare: capturePharmacologyWorkflow,
  }),
  withShowcase({
    name: "clinical-skills-demo",
    route: "/app/clinical-skills",
    title: "Clinical Skills",
    waitFor: "main",
    theme: "ocean",
    showcaseKind: "clinical-skill",
    depthLevel: 1,
    captureSurface: "learning-activity",
    educationalState: "interactive clinical skills scenario with assessment and decision-making visible",
    demonstrates: ["patient scenario", "assessment", "decision point", "feedback"],
    preparationRequired: true,
    reviewGate: REVIEW_GATE,
    prepare: captureClinicalSkillsScenario,
  }),
  withShowcase({
    name: "readiness-report-demo",
    route: "/app/account/readiness",
    title: "Readiness Report",
    waitFor: "main",
    theme: "ocean",
    showcaseKind: "readiness-report",
    depthLevel: 3,
    captureSurface: "analytics-report",
    educationalState: "readiness report with trends, strengths, weak areas, and recommendations populated",
    demonstrates: ["readiness score", "trends", "strengths", "weak areas", "recommendations"],
    preparationRequired: true,
    reviewGate: REVIEW_GATE,
    prepare: captureReadinessReport,
  }),
];

const VIEWPORTS = [
  { suffix: "", width: 1600, height: 1000, deviceScaleFactor: 2 },
  { suffix: "-mobile", width: 430, height: 860, deviceScaleFactor: 4 },
] as const;

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1600, height: 1000 },
    deviceScaleFactor: 2,
    colorScheme: "light",
  });

  try {
    await login(context);
    for (const target of TARGETS) {
      assertMarketingScreenshotDepth({ key: target.name, ...target });
      for (const viewport of VIEWPORTS) {
        const page = await context.newPage();
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.emulateMedia({ colorScheme: target.theme === "midnight" ? "dark" : "light" });
        await page.addInitScript(
          ({ theme }) => {
            localStorage.setItem("nursenest-theme", theme);
            document.documentElement.dataset.theme = theme;
          },
          { theme: target.theme },
        );
        if (target.showcaseItem) {
          await page.addInitScript(
            ({ showcase }) => {
              localStorage.setItem("nursenest-marketing-showcase-candidate", JSON.stringify(showcase));
            },
            {
              showcase: {
                id: target.showcaseItem.id,
                kind: target.showcaseItem.kind,
                title: target.showcaseItem.title,
                activitySlug: target.showcaseItem.activitySlug,
                marketingPriority: target.showcaseItem.flags.marketingPriority,
                marketingShowcase: target.showcaseItem.flags.marketingShowcase,
                featuredScreenshotCandidate: target.showcaseItem.flags.featuredScreenshotCandidate,
              },
            },
          );
        }
        await page.goto(`${BASE_URL}${target.route}`, { waitUntil: "networkidle" });
        await page.locator(target.waitFor).first().waitFor({ state: "visible", timeout: 45_000 });
        await target.prepare(page);
        await verifyEducationalState(page, target);
        await page.waitForTimeout(WAIT_MS);
        await hideTransientChrome(page);

        const raw = await page.screenshot({ fullPage: false, type: "png" });
        const file = path.join(OUT_DIR, `${target.name}${viewport.suffix}.png`);
        await sharp(raw)
          .png({ compressionLevel: 9, adaptiveFiltering: true, palette: false })
          .toFile(file);

        const meta = await sharp(file).metadata();
        if ((meta.width ?? 0) < 1600) {
          throw new Error(`${target.name}${viewport.suffix}.png is ${meta.width}px wide; expected at least 1600px.`);
        }
        console.log(`✓ ${target.title}: ${path.relative(APP_ROOT, file)} (${meta.width}x${meta.height})`);
        await page.close();
      }
    }
  } finally {
    await browser.close();
  }
}

async function login(context: BrowserContext) {
  const email = firstEnv("QA_PAID_EMAIL", "E2E_PAID_EMAIL", "SCREENSHOT_DEMO_EMAIL", "PLAYWRIGHT_TEST_EMAIL");
  const password = firstEnv("QA_PAID_PASSWORD", "E2E_PAID_PASSWORD", "SCREENSHOT_DEMO_PASSWORD", "PLAYWRIGHT_TEST_PASSWORD");
  if (!email || !password) {
    throw new Error("Set QA_PAID_EMAIL/QA_PAID_PASSWORD or SCREENSHOT_DEMO_EMAIL/SCREENSHOT_DEMO_PASSWORD before generating homepage screenshots.");
  }

  const page = await context.newPage();
  await page.goto(`${BASE_URL}/login`, { waitUntil: "networkidle" });
  await page.locator('input[type="email"], input[name="email"]').first().fill(email);
  await page.locator('input[type="password"], input[name="password"]').first().fill(password);
  await page.getByRole("button", { name: /sign in|log in|continue/i }).first().click();
  await page.waitForURL(/\/app|\/dashboard|\/$/i, { timeout: 45_000 }).catch(() => {});
  await page.close();
}

async function captureAnsweredQuestion(page: Page) {
  await openFirstActivity(page);
  await submitFirstPracticeQuestion(page);
  await revealEducationalExplanations(page);
}

async function captureBowtieQuestion(page: Page) {
  await openQuestionType(page, /bowtie|next generation|ngn/i);
  await selectVisibleChoices(page, ".nn-bowtie-option, [data-testid*='bowtie' i] button, button[aria-pressed]");
  await submitFirstPracticeQuestion(page);
  await revealEducationalExplanations(page);
}

async function captureMatrixQuestion(page: Page) {
  await openQuestionType(page, /matrix|next generation|ngn/i);
  await selectVisibleChoices(page, ".nn-matrix-option-row, .nn-matrix-radio, [data-testid*='matrix' i] button, [role='radio']");
  await submitFirstPracticeQuestion(page);
  await revealEducationalExplanations(page);
}

async function captureCatQuestionInProgress(page: Page) {
  await clickFirstVisible(page, [/start cat|begin cat|start exam|begin exam|start/i]);
  await page.waitForTimeout(1500);
  await clickFirstVisible(page, [/adaptive|difficulty|next question/i]).catch(() => {});
}

async function captureLessonLearningState(page: Page) {
  await openFirstActivity(page);
  await scrollToLearningSignal(page, /clinical pearl|knowledge check|pathophysiology|assessment|interventions/i);
  await clickFirstVisible(page, [/knowledge check|show answer|reveal|check/i]).catch(() => {});
}

async function captureEcgDetectiveMode(page: Page) {
  await clickFirstVisible(page, [/detective|start|practice|rhythm|interpret/i]);
  await selectVisibleChoices(page, "button, [role='button'], input");
  await clickFirstVisible(page, [/reveal|submit|check|interpretation|reasoning/i]).catch(() => {});
}

async function captureTelemetryShift(page: Page) {
  await clickFirstVisible(page, [/telemetry|shift|scenario|start|begin/i]);
  await selectVisibleChoices(page, "button, [role='button']");
  await clickFirstVisible(page, [/escalate|notify|prioritize|submit|continue/i]).catch(() => {});
}

async function captureLabInterpretation(page: Page) {
  await openFirstActivity(page);
  await selectVisibleChoices(page, "button, [role='button'], input");
  await clickFirstVisible(page, [/interpret|submit|check|analyze|reveal/i]).catch(() => {});
}

async function captureMedicationMathActivity(page: Page) {
  await openFirstActivity(page);
  const input = page.locator("input[type='number'], input[inputmode='decimal'], input[name*='answer' i]").first();
  if (await input.isVisible().catch(() => false)) await input.fill("2");
  await clickFirstVisible(page, [/calculate|submit|check|validate|answer/i]).catch(() => {});
}

async function capturePharmacologyWorkflow(page: Page) {
  await openFirstActivity(page);
  await scrollToLearningSignal(page, /nursing considerations|monitoring|contraindication|side effects|rationale/i);
  await clickFirstVisible(page, [/reveal|check|start|practice/i]).catch(() => {});
}

async function captureClinicalSkillsScenario(page: Page) {
  await openFirstActivity(page);
  await selectVisibleChoices(page, "button, [role='button'], input");
  await clickFirstVisible(page, [/assess|intervene|submit|continue|feedback/i]).catch(() => {});
}

async function captureReadinessReport(page: Page) {
  await scrollToLearningSignal(page, /weak areas|recommendations|readiness|trend|strengths/i);
}

async function openQuestionType(page: Page, name: RegExp) {
  await clickFirstVisible(page, [name, /start|begin|practice/i]).catch(async () => {
    await openFirstActivity(page);
  });
}

async function openFirstActivity(page: Page) {
  const activityLink = page
    .locator(
      [
        "a[href*='/session']",
        "a[href*='/practice']",
        "a[href*='/lessons/']",
        "a[href*='/labs/'][href*='/']",
        "a[href*='/clinical-skills/']",
        "a[href*='/med-calculations/'][href*='/']",
        "a[href*='/flashcards/'][href*='/']",
      ].join(", "),
    )
    .first();
  if (await activityLink.isVisible().catch(() => false)) {
    await activityLink.click();
    await page.waitForLoadState("networkidle").catch(() => {});
    await page.waitForTimeout(1000);
    return;
  }
  await clickFirstVisible(page, [/start|begin|practice|continue|open|study/i]).catch(() => {});
}

async function submitFirstPracticeQuestion(page: Page) {
  const start = page.getByRole("button", { name: /start|begin|practice/i }).first();
  if (await start.isVisible().catch(() => false)) {
    await start.click().catch(() => {});
    await page.waitForTimeout(1500);
  }

  const firstOption = page.locator(".nn-nclex-answer-card, button.nn-cat-opt, label.nn-cat-opt, [data-testid*='answer' i]").first();
  if (await firstOption.isVisible().catch(() => false)) {
    await firstOption.click().catch(() => {});
    await page.getByRole("button", { name: /submit answer|check answer|submit/i }).first().click().catch(() => {});
    await page.waitForTimeout(1200);
  }
}

async function revealEducationalExplanations(page: Page) {
  await clickFirstVisible(page, [/show rationale|view rationale|rationale|clinical pearl|explanation|why/i]).catch(() => {});
  await scrollToLearningSignal(page, /rationale|clinical pearl|why this is correct|why incorrect|takeaway/i).catch(() => {});
}

async function selectVisibleChoices(page: Page, selector: string) {
  const choices = page.locator(selector);
  const count = Math.min(await choices.count().catch(() => 0), 4);
  for (let i = 0; i < count; i += 1) {
    const choice = choices.nth(i);
    if (await choice.isVisible().catch(() => false)) {
      await choice.click().catch(() => {});
      await page.waitForTimeout(150);
    }
  }
}

async function clickFirstVisible(page: Page, names: RegExp[]) {
  for (const name of names) {
    const button = page.getByRole("button", { name }).first();
    if (await button.isVisible().catch(() => false)) {
      await button.click();
      await page.waitForTimeout(600);
      return;
    }
    const link = page.getByRole("link", { name }).first();
    if (await link.isVisible().catch(() => false)) {
      await link.click();
      await page.waitForLoadState("networkidle").catch(() => {});
      await page.waitForTimeout(600);
      return;
    }
  }
  throw new Error("No visible learning action matched");
}

async function scrollToLearningSignal(page: Page, signal: RegExp) {
  const locator = page.getByText(signal).first();
  if (await locator.isVisible().catch(() => false)) {
    await locator.scrollIntoViewIfNeeded().catch(() => {});
    await page.waitForTimeout(500);
  }
}

async function verifyEducationalState(page: Page, target: Target) {
  const escapedSignals = target.demonstrates.map((value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const signal = new RegExp(escapedSignals.join("|"), "i");
  const hasTextSignal = await page.getByText(signal).first().isVisible().catch(() => false);
  const hasVisualSignal = await page
    .locator(".nn-bowtie-workspace, .nn-matrix-workspace, .nn-flashcard-rationale-panel, canvas, svg, table, [data-testid*='rationale' i]")
    .first()
    .isVisible()
    .catch(() => false);
  if (!hasTextSignal && !hasVisualSignal) {
    throw new Error(`${target.name} did not reach a visually meaningful educational state before capture.`);
  }
}

async function hideTransientChrome(page: Page) {
  await page.addStyleTag({
    content: `
      [data-testid*="toast" i],
      [role="status"],
      .nextjs-toast,
      .vercel-live-feedback,
      [data-nextjs-dialog-overlay] {
        display: none !important;
      }
    `,
  });
}

function firstEnv(...keys: string[]): string | undefined {
  for (const key of keys) {
    const value = process.env[key]?.trim();
    if (value) return value;
  }
  return undefined;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
