/**
 * Screenshot Registry — single source of truth for ALL NurseNest CDN screenshots.
 *
 * Every screenshot used across the marketing site, pricing page, feature sections,
 * FAQ, about page, and homepage must be registered here.
 *
 * CDN base: https://nursenest-images.tor1.cdn.digitaloceanspaces.com
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
// Feature mapping is based on observed slide ordering in HomePlatformPreviewSection:
//   [9,0,11,1,2,12,4,3,5,6,7,8,10,13,14] described as
//   "bank, rationales/lessons, flashcards, dashboard, lesson library, reports, NGN-style"
//
// Update the `feature` and descriptive fields when screenshots are replaced or re-ordered.
// The CDN URLs and objectKeys are derived from id — they are the stable keys.

export const SCREENSHOT_REGISTRY: readonly ScreenshotRecord[] = [
  entry(
    1,
    "rationale",
    "Full rationale panel",
    "Complete answer explanations — why each option is correct or wrong — visible at a glance.",
    "NurseNest practice interface showing a full rationale panel with correct answer explanation, individual incorrect-option explanations, and a key takeaway section.",
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
    "dashboard",
    "Student dashboard",
    "Progress overview — streak, accuracy trend, and recent activity — at a glance.",
    "NurseNest student dashboard showing progress metrics, recent session results, and study streak.",
  ),
  entry(
    4,
    "question-types",
    "NGN-style questions",
    "Advanced item types that match modern exam formats — cloze, matrix, and extended reasoning.",
    "NurseNest showing a Next Generation NCLEX-style question with extended multiple-response options.",
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
    "question-bank",
    "Question bank",
    "Thousands of practice questions with clinical rationale, topic filters, and pathway-specific content.",
    "NurseNest question bank view showing a list of practice questions with topic tags, difficulty indicators, and pathway filters.",
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
    "Lesson library",
    "Browse all lessons by pathway, topic, and exam focus area.",
    "NurseNest lesson library showing a filterable grid of lesson cards organised by clinical category and RN pathway.",
  ),
  entry(
    14,
    "general",
    "Platform overview",
    "The full NurseNest study system — lessons, practice, CAT, and analytics — in one place.",
    "NurseNest platform overview showing the main study hub with navigation to lessons, practice questions, CAT exams, and results.",
  ),
  entry(
    15,
    "general",
    "Study interface",
    "A clean, focused environment designed for long, productive study sessions.",
    "NurseNest study interface showing a clean layout optimised for readability during extended study sessions.",
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
} satisfies Record<string, readonly ScreenshotId[]>;
