/**
 * Screenshot Registry — single source of truth for ALL NurseNest CDN screenshots.
 *
 * Every screenshot used across the marketing site, pricing page, feature sections,
 * FAQ, about page, and homepage must be registered here.
 *
 * CDN base (must match `HOME_HERO_CDN_BASE_URL` / deploy docs — do not invent origins):
 * https://nursenest-images.tor1.cdn.digitaloceanspaces.com
 * Objects:  screenshot1.png … screenshot15.png (existing), screenshot16+ (future)
 *
 * Usage:
 *   import { SCREENSHOT_GROUPS, getScreenshotsForFeature } from "@/lib/marketing/screenshot-registry";
 *   // in a component that uses ScreenshotCarousel or ScreenshotGrid:
 *   <ScreenshotCarousel ids={SCREENSHOT_GROUPS.practice} ... />
 *
 * Do NOT hardcode CDN URLs in individual components.
 * Do NOT inline base64 images.
 * Add new screenshots here when uploaded to Spaces.
 *
 * Governance:
 *   - Contract tests: `src/lib/marketing/screenshot-registry.contract.test.ts` (also in `npm run test:homepage`).
 *   - Capture routes + slots: `scripts/capture-slot-targets.json` + `docs/screenshot-capture-targets.md`.
 *   - Upload / approval: `docs/SCREENSHOT_CAPTURE_TO_CDN.md` (DigitalOcean Spaces is manual-approval only).
 *   - After replacing CDN PNGs, update labels/descriptions to match current UI; verify OG image in `src/app/layout.tsx`.
 *
 * CDN URLs are composed from {@link SCREENSHOT_CDN_BASE} + object keys — keep in sync with
 * `HOME_HERO_CDN_BASE_URL` in `src/config/home-hero-carousel.ts`. Local Playwright output uses the same
 * filenames under `public/marketing/screenshots/` before upload.
 */

// ── CDN base (matches HOME_HERO_CDN_BASE_URL in config/home-hero-carousel.ts) ──

export const SCREENSHOT_CDN_BASE =
  "https://nursenest-images.tor1.cdn.digitaloceanspaces.com" as const;

// ── Feature taxonomy ─────────────────────────────────────────────────────────

/**
 * Semantic feature each screenshot belongs to.
 * A screenshot may only have ONE primary feature — pick the most specific.
 */
export type ScreenshotFeature =
  | "question-bank" // practice question list / search
  | "rationale" // answer explanations — correct + incorrect rationale
  | "lesson" // lesson content / reading view
  | "flashcard" // flashcard / active recall study mode
  | "cat-exam" // CAT session in progress (minimal exam layout)
  | "cat-results" // CAT results page — readiness score, weak areas
  | "study-plan" // adaptive study plan with day cards
  | "smart-review" // smart review — questions grouped by confidence
  | "confidence" // confidence tracking analytics
  | "dashboard" // student dashboard / progress overview
  | "reports" // topic-level progress report / accuracy chart
  | "question-types" // NGN / advanced question format view
  | "ecg-workstation" // ECG / telemetry learning workspace (rhythm education monitor chrome)
  | "general"; // platform overview / multi-feature screenshots

// ── Screenshot record type ───────────────────────────────────────────────────

export type ScreenshotId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;

export type ScreenshotRecord = {
  /** 1-indexed ID matching the filename: screenshot{id}.png */
  id: ScreenshotId;
  /** DigitalOcean Spaces object key: `screenshot{id}.png` */
  objectKey: string;
  /** Full public CDN URL — NEVER modify this to go through the app proxy */
  publicUrl: string;
  /** Primary semantic feature this screenshot demonstrates */
  feature: ScreenshotFeature;
  /** Short label shown in captions and grid tiles (≤40 chars) */
  label: string;
  /** One sentence shown in carousel overlay / grid card (≤100 chars) */
  description: string;
  /**
   * Alt text for accessibility.
   * Defaults to `label + ". " + description` if not supplied.
   * Keep ≤220 chars; be descriptive of the visible UI.
   */
  alt?: string;
};

// ── Factory ──────────────────────────────────────────────────────────────────

function entry(
  id: ScreenshotId,
  feature: ScreenshotFeature,
  label: string,
  description: string,
  alt?: string,
): ScreenshotRecord {
  const objectKey = `screenshot${id}.png`;
  const publicUrl = `${SCREENSHOT_CDN_BASE}/${objectKey}`;
  return {
    id,
    objectKey,
    publicUrl,
    feature,
    label,
    description,
    alt: alt ?? `${label}. ${description}`.slice(0, 220),
  };
}

// ── Registry ─────────────────────────────────────────────────────────────────
//
// Capture pipeline + CDN slot mapping: `nursenest-core/scripts/capture-slot-targets.json`,
// `docs/SCREENSHOT_CAPTURE_TO_CDN.md`, and `capture-marketing-screenshots.mjs`.
// Update copy when PNGs are replaced so captions match visible UI.

export const SCREENSHOT_REGISTRY: readonly ScreenshotRecord[] = [
  entry(
    1,
    "rationale",
    "Full rationale panel",
    "Practice session with complete explanations — why each option is correct or wrong — at a glance.",
    "NurseNest practice runner showing a rationale panel with correct-answer explanation, incorrect-option breakdowns, and a concise takeaway.",
  ),
  entry(
    2,
    "flashcard",
    "Flashcard study mode",
    "Active recall with spaced repetition to lock in clinical concepts faster.",
    "NurseNest flashcard study session showing a question on one side and a clinical concept answer on the other.",
  ),
  entry(
    3,
    "reports",
    "Readiness report",
    "Readiness trends, weak areas, strengths, and next-step recommendations with real learner data.",
    "NurseNest readiness report showing score trends, weak areas, strengths, and recommended next study activities.",
  ),
  entry(
    4,
    "question-types",
    "Completed Bowtie item",
    "NGN bowtie workflow showing condition, actions, monitoring priorities, and teaching rationale.",
    "NurseNest completed bowtie item showing a clinical scenario, selected condition, priority actions, monitoring priorities, and rationale.",
  ),
  entry(
    5,
    "reports",
    "Progress reports",
    "Topic-by-topic accuracy and readiness tracking to identify exactly where you stand.",
    "NurseNest progress report showing accuracy by topic area with horizontal bar charts and readiness scores.",
  ),
  entry(
    6,
    "cat-exam",
    "CAT exam session",
    "A focused, single-column exam interface that adapts item difficulty in real time.",
    "NurseNest CAT exam mode showing a single question in a minimal, clinical layout with answer options and a slim progress bar.",
  ),
  entry(
    7,
    "cat-results",
    "CAT results",
    "Readiness score, weak areas, strengths, and a clear next-step recommendation.",
    "NurseNest CAT results page showing a large readiness score, a 3-card summary row, and a weak-areas section with topic bars.",
  ),
  entry(
    8,
    "study-plan",
    "Adaptive study plan",
    "A personalised day-by-day plan built from your CAT score and confidence patterns.",
    "NurseNest adaptive study plan showing Day 1 through Day 3 cards with study blocks, lesson links, and a retest strategy.",
  ),
  entry(
    9,
    "smart-review",
    "Smart review screen",
    "Every completed question grouped by correctness and confidence — so you know what to fix first.",
    "NurseNest smart review screen showing four groups: High Priority Fixes, Needs Review, Uncertain Knowledge, and Strong Areas.",
  ),
  entry(
    10,
    "rationale",
    "Answered question",
    "A completed NCLEX-style item with selected answer, correct answer, rationale, and clinical pearl visible.",
    "NurseNest answered question screen showing selected answer, correct answer, teaching rationale, and clinical pearl.",
  ),
  entry(
    11,
    "confidence",
    "Confidence analytics",
    "See how often your confidence matches your accuracy — and where overconfidence is costing you.",
    "NurseNest confidence analytics showing Overconfident Errors, Uncertain Correct, and Strong Knowledge cards side by side.",
  ),
  entry(
    12,
    "lesson",
    "Lesson content",
    "Structured lessons organised by clinical topic, body system, and exam relevance.",
    "NurseNest lesson page showing a structured clinical topic lesson with section cards for pathophysiology, signs and symptoms, and nursing care.",
  ),
  entry(
    13,
    "lesson",
    "Lesson knowledge check",
    "Open lesson state with teaching content, clinical pearl, and an embedded knowledge check.",
    "NurseNest lesson detail showing educational content, clinical pearl, and a knowledge check inside the lesson.",
  ),
  entry(
    14,
    "question-types",
    "Completed Matrix item",
    "NGN matrix item showing completed selections, clinical scenario, and rationale.",
    "NurseNest completed matrix question showing selected cells, clinical scenario, and educational rationale.",
  ),
  entry(
    15,
    "ecg-workstation",
    "ECG Detective Mode",
    "Rhythm strip interpretation with rate, PR, QRS, likely rhythm, and clinical reasoning visible.",
    "NurseNest ECG Detective Mode showing a rhythm strip and interpretation workflow with clinical reasoning.",
  ),
];

// ── Lookup helpers ────────────────────────────────────────────────────────────

/** Get a single screenshot record by 1-based ID. Returns undefined if not found. */
export function getScreenshot(id: ScreenshotId): ScreenshotRecord | undefined {
  return SCREENSHOT_REGISTRY.find((s) => s.id === id);
}

/** Get all screenshots tagged with a specific feature. */
export function getScreenshotsForFeature(feature: ScreenshotFeature): readonly ScreenshotRecord[] {
  return SCREENSHOT_REGISTRY.filter((s) => s.feature === feature);
}

/** Get multiple screenshot records by an ordered list of 1-based IDs. */
export function getScreenshotsByIds(ids: readonly ScreenshotId[]): ScreenshotRecord[] {
  return ids
    .map((id) => SCREENSHOT_REGISTRY.find((s) => s.id === id))
    .filter((s): s is ScreenshotRecord => s != null);
}

/**
 * Convert a list of screenshot IDs to zero-based HOMEPAGE_HERO_SLIDE_METADATA indices.
 * Use this when calling `buildHomepageHeroSlidesAtIndices(t, toSlideIndices(ids))`.
 */
export function toSlideIndices(ids: readonly ScreenshotId[]): number[] {
  return ids.map((id) => id - 1);
}

// ── Shared curated lists (avoid duplicating the same ID tuple in multiple groups) ──

/** About page — platform preview carousel order (breadth + core learner loops). */
const ABOUT_SHOWCASE_IDS = [14, 10, 1, 12, 6, 8, 9, 11, 3] as const;

/** For Institutions — primary carousel / page helper order (readiness → teaching → scale). */
const INSTITUTIONAL_SHOWCASE_IDS = [7, 12, 15, 6, 5, 2, 10, 14, 11] as const;

/** About + How-it-works ecosystem narrative — Learn → Practice → Strengthen → Clinical readiness. */
const ECOSYSTEM_NARRATIVE_IDS = [12, 1, 9, 7] as const;

/** Clinical readiness interconnections — telemetry / ECG, lessons, results, study plan. */
const CLINICAL_READINESS_IDS = [15, 12, 7, 8] as const;

// ── Pre-defined groups for common surfaces ────────────────────────────────────
//
// Use these named groups to keep consumer components declarative.
// Update the IDs here (not in individual pages) when the canonical screenshot changes.

export const SCREENSHOT_GROUPS = {
  /**
   * Practice interface: question stem + full rationale panel.
   * Used on: pricing Product Preview, homepage feature deep-dive.
   */
  practice: [1, 10] as const,

  /**
   * CAT exam experience: session layout + results page.
   * Used on: pricing Product Preview, homepage feature deep-dive, CAT landing.
   */
  catExam: [6, 7] as const,

  /**
   * Analytics and results: CAT results, progress reports, confidence.
   * Used on: pricing Product Preview, results section, about page.
   */
  results: [7, 5, 11] as const,

  /**
   * Lesson study mode: lesson content + library browse.
   * Used on: lessons landing page, homepage study mode section.
   */
  lessons: [12, 13] as const,

  /**
   * Adaptive study plan: day cards + locked premium preview.
   * Used on: pricing What You Unlock, homepage feature deep-dive, about page.
   */
  studyPlan: [8] as const,

  /**
   * Smart review: grouped questions by confidence.
   * Used on: pricing What You Unlock, homepage feature deep-dive.
   */
  smartReview: [9] as const,

  /**
   * Confidence analytics.
   * Used on: pricing What You Unlock, results page.
   */
  confidence: [11] as const,

  /**
   * Homepage platform preview carousel (matches PLATFORM_PREVIEW_SLIDE_ORDER in
   * home-platform-preview-section.tsx, converted from 0-based to 1-based IDs).
   */
  homepageHero: [10, 1, 12, 2, 3, 13, 5, 4, 6, 7, 8, 9, 11, 14, 15] as const,

  /**
   * Pricing Product Preview: one screenshot per product area (practice, CAT, results).
   */
  pricingPreview: [1, 6, 7] as const,

  /**
   * Feature section highlights — 4 core product surfaces for homepage deep-dives.
   */
  featureHighlights: [10, 6, 8, 9] as const,

  /**
   * FAQ / About page: general platform + lesson screenshots.
   * Avoid session-specific shots that may confuse out-of-context visitors.
   */
  faqAbout: [14, 10, 12, 3] as const,

  /** About page carousel — registry-only showcase distinct from FAQ selection. */
  aboutShowcase: ABOUT_SHOWCASE_IDS,

  /**
   * For Institutions marketing — hero montage order:
   * CAT results (readiness) → lesson → ECG → CAT session → reports → flashcards → question bank.
   */
  institutionalHeroMontage: [7, 12, 15, 6, 5, 2, 10] as const,

  /** Paired with the six “why institutions” feature cards (same order as UI). */
  institutionalWhyFeatures: [12, 10, 4, 5, 13, 14] as const,

  /** Section: how rollout works (study plan → smart review → bank scale). */
  institutionalWorkflow: [8, 9, 10] as const,

  /** Large alternating platform showcase blocks. */
  institutionalPlatformBlocks: [14, 15, 6, 7] as const,

  /** Educator / analytics emphasis. */
  institutionalEducator: [11, 5] as const,

  /**
   * For Institutions — full curated carousel + `getScreenshotsForPage("for-institutions")`.
   * Alias of {@link INSTITUTIONAL_SHOWCASE_IDS} / `institutionalShowcase`.
   */
  institutionalShowcase: INSTITUTIONAL_SHOWCASE_IDS,

  /** @deprecated Use `institutionalShowcase` — kept for older imports. */
  institutionalPageCurated: INSTITUTIONAL_SHOWCASE_IDS,

  /**
   * About + How-it-works ecosystem narrative (Learn → Practice → Strengthen → Clinical readiness).
   * Lesson content → rationale practice → smart review → CAT readiness results.
   */
  ecosystemNarrative: ECOSYSTEM_NARRATIVE_IDS,

  /**
   * Clinical readiness ecosystem interconnections — used on About page to show how
   * telemetry/ECG, lessons, results, and the adaptive study plan reinforce each other.
   */
  clinicalReadiness: CLINICAL_READINESS_IDS,
} satisfies Record<string, readonly ScreenshotId[]>;
