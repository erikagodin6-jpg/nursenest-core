#!/usr/bin/env tsx
/**
 * Homepage marketing screenshot generator.
 *
 * Produces retina PNG desktop, tablet, and mobile screenshots from live
 * NurseNest UI routes for public homepage marketing use.
 *
 * Output:
 *   public/images/marketing/{key}.png
 *   public/images/marketing/{key}-tablet.png
 *   public/images/marketing/{key}-mobile.png
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
const OUT_DIR = path.join(APP_ROOT, "public", "images", "marketing");
const WAIT_MS = Number(process.env.MARKETING_SCREENSHOT_WAIT_MS ?? "1400");

type Target = {
  key: string;
  route: string;
  theme: "ocean" | "midnight" | "blossom";
  waitFor?: string;
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
    key: "answered-nclex-question",
    route: "/app/practice-tests",
    theme: "ocean",
    showcaseKind: "question-bank-item",
    depthLevel: 1,
    captureSurface: "learning-activity",
    educationalState: "answered NCLEX question with rationale and clinical pearl visible",
    demonstrates: ["question stem", "selected answer", "correct answer", "rationale", "clinical pearl"],
    preparationRequired: true,
    reviewGate: REVIEW_GATE,
    prepare: captureAnsweredQuestion,
  }),
  withShowcase({
    key: "ngn-bowtie",
    route: "/app/practice-tests",
    theme: "ocean",
    showcaseKind: "bowtie-question",
    depthLevel: 1,
    captureSurface: "learning-activity",
    educationalState: "completed bowtie question with selections and rationale visible",
    demonstrates: ["bowtie", "condition", "actions", "monitoring", "rationale"],
    preparationRequired: true,
    reviewGate: REVIEW_GATE,
    prepare: captureBowtieQuestion,
  }),
  withShowcase({
    key: "ngn-matrix",
    route: "/app/practice-tests",
    theme: "ocean",
    showcaseKind: "matrix-question",
    depthLevel: 1,
    captureSurface: "learning-activity",
    educationalState: "completed matrix question with selections and rationale visible",
    demonstrates: ["matrix", "selections", "clinical scenario", "rationale"],
    preparationRequired: true,
    reviewGate: REVIEW_GATE,
    prepare: captureMatrixQuestion,
  }),
  withShowcase({
    key: "cat-exam",
    route: "/app/practice-tests/cat-launch?pathwayId=ca-rn-nclex-rn",
    theme: "midnight",
    showcaseKind: "cat-question",
    depthLevel: 1,
    captureSurface: "learning-activity",
    educationalState: "CAT question in progress with timer, progress, and adaptation indicators visible",
    demonstrates: ["question", "timer", "progress", "difficulty", "adaptive"],
    preparationRequired: true,
    reviewGate: REVIEW_GATE,
    prepare: captureCatQuestionInProgress,
  }),
  withShowcase({
    key: "lesson-page",
    route: "/app/lessons",
    theme: "blossom",
    showcaseKind: "lesson",
    depthLevel: 2,
    captureSurface: "educational-content",
    educationalState: "opened lesson with educational content, clinical pearl, and knowledge check visible",
    demonstrates: ["lesson", "clinical pearl", "knowledge check", "pathophysiology"],
    preparationRequired: true,
    reviewGate: REVIEW_GATE,
    prepare: captureLessonLearningState,
  }),
  withShowcase({
    key: "ecg-detective-mode",
    route: "/modules/ecg/interactive",
    theme: "midnight",
    showcaseKind: "ecg-case",
    depthLevel: 1,
    captureSurface: "learning-activity",
    educationalState: "ECG Detective Mode with strip, interpretation workflow, and reasoning visible",
    demonstrates: ["ECG", "rate", "PR", "QRS", "rhythm", "reasoning"],
    preparationRequired: true,
    reviewGate: REVIEW_GATE,
    prepare: captureEcgDetectiveMode,
  }),
  withShowcase({
    key: "telemetry-shift-simulator",
    route: "/modules/ecg/advanced/scenarios",
    theme: "midnight",
    showcaseKind: "ecg-case",
    depthLevel: 1,
    captureSurface: "learning-activity",
    educationalState: "telemetry shift scenario with monitored patients and prioritization decisions visible",
    demonstrates: ["telemetry", "patients", "prioritization", "escalation", "decision"],
    preparationRequired: true,
    reviewGate: REVIEW_GATE,
    prepare: captureTelemetryShift,
  }),
  withShowcase({
    key: "clinical-lab-workstation",
    route: "/app/labs",
    theme: "ocean",
    showcaseKind: "lab-activity",
    depthLevel: 1,
    captureSurface: "learning-activity",
    educationalState: "abnormal lab interpretation activity with clinical analysis visible",
    demonstrates: ["abnormal", "lab", "interpretation", "clinical analysis"],
    preparationRequired: true,
    reviewGate: REVIEW_GATE,
    prepare: captureLabInterpretation,
  }),
  withShowcase({
    key: "medication-math",
    route: "/app/med-calculations",
    theme: "ocean",
    showcaseKind: "medication-math-activity",
    depthLevel: 1,
    captureSurface: "learning-activity",
    educationalState: "medication calculation activity with formula setup and answer validation visible",
    demonstrates: ["dosage", "formula", "calculator", "answer"],
    preparationRequired: true,
    reviewGate: REVIEW_GATE,
    prepare: captureMedicationMathActivity,
  }),
  withShowcase({
    key: "pharmacology",
    route: "/app/pharmacology",
    theme: "ocean",
    showcaseKind: "pharmacology-activity",
    depthLevel: 1,
    captureSurface: "learning-activity",
    educationalState: "pharmacology workflow with nursing considerations and monitoring visible",
    demonstrates: ["medication", "nursing considerations", "monitoring", "rationale"],
    preparationRequired: true,
    reviewGate: REVIEW_GATE,
    prepare: capturePharmacologyWorkflow,
  }),
  withShowcase({
    key: "clinical-skills",
    route: "/app/clinical-skills",
    theme: "ocean",
    showcaseKind: "clinical-skill",
    depthLevel: 1,
    captureSurface: "learning-activity",
    educationalState: "clinical skills scenario with assessment and decision-making visible",
    demonstrates: ["assessment", "decision", "feedback", "scenario"],
    preparationRequired: true,
    reviewGate: REVIEW_GATE,
    prepare: captureClinicalSkillsScenario,
  }),
  withShowcase({
    key: "readiness-dashboard",
    route: "/app/account/readiness",
    theme: "ocean",
    showcaseKind: "readiness-report",
    depthLevel: 3,
    captureSurface: "analytics-report",
    educationalState: "readiness report with real trends, weak areas, strengths, and recommendations visible",
    demonstrates: ["readiness", "trend", "weak areas", "recommendations"],
    preparationRequired: true,
    reviewGate: REVIEW_GATE,
    prepare: captureReadinessReport,
  }),
];

const VIEWPORTS = [
  { suffix: "", width: 1600, height: 1000, deviceScaleFactor: 2 },
  { suffix: "-tablet", width: 900, height: 1100, deviceScaleFactor: 3 },
  { suffix: "-mobile", width: 430, height: 860, deviceScaleFactor: 4 },
] as const;

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  try {
    const authContext = await browser.newContext();
    await login(authContext);
    const storageState = await authContext.storageState();
    await authContext.close();
    for (const target of TARGETS) {
      assertMarketingScreenshotDepth(target);
      for (const viewport of VIEWPORTS) {
        const context = await browser.newContext({
          viewport: { width: viewport.width, height: viewport.height },
          deviceScaleFactor: viewport.deviceScaleFactor,
          storageState,
        });
        const page = await context.newPage();
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
        await page.locator(target.waitFor ?? "main").first().waitFor({ state: "visible", timeout: 45_000 });
        await target.prepare(page);
        await verifyEducationalState(page, target);
        await page.waitForTimeout(WAIT_MS);
        await page.addStyleTag({ content: `[data-testid*="toast" i], [role="status"], .nextjs-toast { display: none !important; }` });
        const raw = await page.screenshot({ fullPage: false, type: "png" });
        const file = path.join(OUT_DIR, `${target.key}${viewport.suffix}.png`);
        await sharp(raw).png({ compressionLevel: 9, adaptiveFiltering: true, palette: false }).toFile(file);
        const meta = await sharp(file).metadata();
        if ((meta.width ?? 0) < 1600) throw new Error(`${path.basename(file)} is below 1600px wide.`);
        console.log(`✓ ${path.relative(APP_ROOT, file)} (${meta.width}x${meta.height})`);
        await context.close();
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
    throw new Error("Set QA_PAID_EMAIL/QA_PAID_PASSWORD or SCREENSHOT_DEMO_EMAIL/SCREENSHOT_DEMO_PASSWORD before generating marketing screenshots.");
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
    throw new Error(`${target.key} did not reach a visually meaningful educational state before capture.`);
  }
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
