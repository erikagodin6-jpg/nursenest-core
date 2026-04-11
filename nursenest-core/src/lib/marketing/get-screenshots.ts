/**
 * Page-aware screenshot lookup helpers.
 *
 * These functions sit on top of the central screenshot-registry.ts and answer
 * higher-level questions like "which screenshots belong on the FAQ page?" or
 * "what is the canonical single shot for the study-plan feature?"
 *
 * Usage:
 *   import { getScreenshotsForPage, FAQ_VISUAL_QA } from "@/lib/marketing/get-screenshots";
 *
 *   const shots = getScreenshotsForPage("faq");
 *   const best  = getBestScreenshotForFeature("cat-exam");
 */

import {
  SCREENSHOT_REGISTRY,
  SCREENSHOT_GROUPS,
  getScreenshotsByIds,
  type ScreenshotRecord,
  type ScreenshotFeature,
  type ScreenshotId,
} from "@/lib/marketing/screenshot-registry";

// ── Page taxonomy ─────────────────────────────────────────────────────────────

/**
 * Every marketing / help surface that can consume screenshots.
 * Add new page keys here when a new surface needs curated screenshot selection.
 */
export type ScreenshotPage =
  | "home"
  | "pricing"
  | "faq"
  | "about"
  | "cat"
  | "practice"
  | "results"
  | "study-plan"
  | "smart-review"
  | "analytics";

// ── Page → feature relevance map ─────────────────────────────────────────────
//
// Controls fallback ordering when no curated ID list is available.
// First feature in the array = highest priority.

const PAGE_FEATURE_MAP: Readonly<Record<ScreenshotPage, ScreenshotFeature[]>> = {
  home: ["general", "question-bank", "rationale", "lesson", "reports"],
  pricing: ["question-bank", "cat-exam", "study-plan", "smart-review", "cat-results"],
  faq: ["cat-exam", "cat-results", "rationale", "study-plan", "smart-review", "lesson"],
  about: ["general", "dashboard", "question-bank", "lesson", "reports"],
  cat: ["cat-exam", "cat-results"],
  practice: ["question-bank", "rationale", "confidence"],
  results: ["cat-results", "reports", "confidence"],
  "study-plan": ["study-plan"],
  "smart-review": ["smart-review", "confidence"],
  analytics: ["reports", "confidence", "dashboard"],
};

// ── Page → curated screenshot ID list ────────────────────────────────────────
//
// Order is intentional: hero/most-representative shot first.
// Update IDs here (not in individual page components) when screenshots change.

const PAGE_SCREENSHOT_MAP: Readonly<Record<ScreenshotPage, readonly ScreenshotId[]>> = {
  home:          SCREENSHOT_GROUPS.homepageHero,
  pricing:       SCREENSHOT_GROUPS.pricingPreview,
  faq:           SCREENSHOT_GROUPS.faqAbout,
  about:         [14, 10, 1, 12, 6, 8, 9, 11, 3] as const,
  cat:           SCREENSHOT_GROUPS.catExam,
  practice:      SCREENSHOT_GROUPS.practice,
  results:       SCREENSHOT_GROUPS.results,
  "study-plan":  SCREENSHOT_GROUPS.studyPlan,
  "smart-review": SCREENSHOT_GROUPS.smartReview,
  analytics:     SCREENSHOT_GROUPS.confidence,
};

// ── Core lookup functions ─────────────────────────────────────────────────────

/**
 * Get all screenshots curated for a specific marketing page.
 * Returns records in their recommended display order for that page.
 */
export function getScreenshotsForPage(page: ScreenshotPage): ScreenshotRecord[] {
  return getScreenshotsByIds(PAGE_SCREENSHOT_MAP[page]);
}

/**
 * Get the screenshot IDs curated for a page (use when you need IDs, not records).
 */
export function getScreenshotIdsForPage(page: ScreenshotPage): readonly ScreenshotId[] {
  return PAGE_SCREENSHOT_MAP[page];
}

/**
 * Get screenshots that match a specific feature AND appear in a page's curated list.
 * Falls back to all screenshots for that feature when the intersection is empty.
 */
export function getScreenshotsForFeatureAndPage(
  feature: ScreenshotFeature,
  page: ScreenshotPage,
): ScreenshotRecord[] {
  const pageIds = PAGE_SCREENSHOT_MAP[page];
  const featureRecords = SCREENSHOT_REGISTRY.filter((s) => s.feature === feature);
  const inPage = featureRecords.filter((s) => (pageIds as readonly number[]).includes(s.id));
  return inPage.length > 0 ? inPage : featureRecords;
}

/**
 * Get the single best (most representative) screenshot for a feature.
 * Preference order: exact feature match → registry position.
 */
export function getBestScreenshotForFeature(
  feature: ScreenshotFeature,
): ScreenshotRecord | undefined {
  return SCREENSHOT_REGISTRY.find((s) => s.feature === feature);
}

/**
 * Get the stable 1-based screenshot ID for the canonical shot of a feature.
 * Use when a component needs just one ID (e.g. ScreenshotSingle).
 */
export function getFeatureHeroScreenshotId(
  feature: ScreenshotFeature,
): ScreenshotId | undefined {
  return getBestScreenshotForFeature(feature)?.id;
}

/**
 * Get screenshots for features relevant to a page, ordered by page priority.
 * Each feature contributes at most one screenshot (its best match).
 */
export function getTopScreenshotsForPage(
  page: ScreenshotPage,
  limit = 4,
): ScreenshotRecord[] {
  const features = PAGE_FEATURE_MAP[page];
  const seen = new Set<number>();
  const out: ScreenshotRecord[] = [];
  for (const feat of features) {
    if (out.length >= limit) break;
    const best = getBestScreenshotForFeature(feat);
    if (best && !seen.has(best.id)) {
      seen.add(best.id);
      out.push(best);
    }
  }
  return out;
}

// ── FAQ visual Q&A ────────────────────────────────────────────────────────────
//
// Each entry maps a common product question to the screenshot that best
// illustrates the answer. Rendered by FaqProductScreenshotsSection on the
// /faq page to make abstract product features immediately tangible.

export type FaqVisualQA = {
  readonly id: string;
  readonly question: string;
  readonly answer: string;
  readonly screenshotId: ScreenshotId;
  readonly featureTag: ScreenshotFeature;
};

export const FAQ_VISUAL_QA: readonly FaqVisualQA[] = [
  {
    id: "faq-practice-interface",
    question: "What does the practice question interface look like?",
    answer:
      "Practice questions use a two-column layout: the question and answer options on the left, full rationale on the right. After you answer, you instantly see why the correct option is right and why each incorrect option is wrong — all on one screen without scrolling.",
    screenshotId: 1,
    featureTag: "rationale",
  },
  {
    id: "faq-cat-exam",
    question: "What does the CAT exam experience look like?",
    answer:
      "The CAT exam uses a minimal single-column layout — one question at a time, a slim progress bar, and no distractions. It's designed to feel as close to the real NCLEX environment as possible, with item difficulty adjusting automatically based on your answers.",
    screenshotId: 6,
    featureTag: "cat-exam",
  },
  {
    id: "faq-cat-results",
    question: "What do my CAT results show?",
    answer:
      "After each CAT session you receive a readiness score and band (e.g. 'Approaching Readiness'), a 3-card summary of accuracy, difficulty handling, and consistency, a weak-areas breakdown with topic bars, and a clear 'What to do next' action plan.",
    screenshotId: 7,
    featureTag: "cat-results",
  },
  {
    id: "faq-study-plan",
    question: "What does the adaptive study plan look like?",
    answer:
      "Your study plan is a day-by-day schedule built from your CAT score and confidence patterns. Each day card lists study blocks with direct links to lessons and practice sets, and the plan ends with a recommended retest window.",
    screenshotId: 8,
    featureTag: "study-plan",
  },
  {
    id: "faq-smart-review",
    question: "What is Smart Review?",
    answer:
      "Smart Review organises every completed question into four groups: High Priority Fixes (wrong + high confidence), Needs Review (wrong + uncertain), Uncertain Knowledge (right + uncertain), and Strong Areas (right + confident) — so you always know exactly where to focus.",
    screenshotId: 9,
    featureTag: "smart-review",
  },
] as const;

// ── About page feature sections ───────────────────────────────────────────────
//
// Curated list of feature deep-dive blocks for the About page.
// Each block maps to one ScreenshotFeatureBlock component.

export type AboutFeatureBlock = {
  readonly screenshotId: ScreenshotId;
  readonly heading: string;
  readonly subheading: string;
  readonly bullets: readonly string[];
  readonly flip: boolean;
  readonly feature: ScreenshotFeature;
};

export const ABOUT_FEATURE_BLOCKS: readonly AboutFeatureBlock[] = [
  {
    screenshotId: 10,
    heading: "Thousands of practice questions with full clinical rationale",
    subheading: "Practice",
    bullets: [
      "Every question answered includes a full explanation — not just the correct answer, but why each wrong option is wrong",
      "Questions are tagged by topic, body system, and exam relevance",
      "Pathway-specific content for RN, RPN, NP, and Allied Health",
    ],
    flip: false,
    feature: "question-bank",
  },
  {
    screenshotId: 6,
    heading: "Adaptive exams that simulate real conditions",
    subheading: "CAT",
    bullets: [
      "Computer Adaptive Testing adjusts item difficulty in real time based on your performance",
      "Minimal, focused exam interface — no decorative UI, just the clinical challenge",
      "Readiness scores and weak-area analysis after every session",
    ],
    flip: true,
    feature: "cat-exam",
  },
  {
    screenshotId: 9,
    heading: "Know exactly what to fix next",
    subheading: "Smart Review",
    bullets: [
      "Questions grouped into High Priority Fixes, Needs Review, Uncertain Knowledge, and Strong Areas",
      "Overconfidence detection: when you're wrong but were sure, it's flagged immediately",
      "Direct links from each flagged question to the relevant lesson",
    ],
    flip: false,
    feature: "smart-review",
  },
  {
    screenshotId: 8,
    heading: "A personalised study plan built from your data",
    subheading: "Adaptive Study Plan",
    bullets: [
      "Day-by-day schedule generated from your CAT score and confidence patterns",
      "Each day links directly to specific lessons and practice sets for your weak areas",
      "Ends with a recommended retest window so you always know when to sit your next CAT",
    ],
    flip: true,
    feature: "study-plan",
  },
] as const;
