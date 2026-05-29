/**
 * Screenshot governance — rules and validation contracts for the NurseNest
 * marketing screenshot system.
 *
 * Imported by:
 *   - Contract tests (screenshot-governance.contract.test.ts)
 *   - CI validation scripts
 *   - The Playwright visual regression spec
 *
 * Do NOT import browser-only APIs here (this runs in both Node and browser).
 */

import {
  SCREENSHOT_REGISTRY,
  SCREENSHOT_GROUPS,
  type ScreenshotId,
  type ScreenshotRecord,
} from "@/lib/marketing/screenshot-registry";

// ─── Governed marketing routes ────────────────────────────────────────────────

/**
 * Every marketing page that must have at least one screenshot displayed.
 * Used by CI to verify no page silently loses screenshot coverage.
 */
export const GOVERNED_MARKETING_ROUTES = [
  { route: "/",                   label: "Homepage",           requiredSlots: SCREENSHOT_GROUPS.homepageHero },
  { route: "/pricing",            label: "Pricing",            requiredSlots: SCREENSHOT_GROUPS.pricingPreview },
  { route: "/faq",                label: "FAQ",                requiredSlots: SCREENSHOT_GROUPS.faqAbout },
  { route: "/about",              label: "About",              requiredSlots: SCREENSHOT_GROUPS.aboutShowcase },
  { route: "/us/rn/nclex-rn",    label: "RN Hub",             requiredSlots: [1, 10] as ScreenshotId[] },
  { route: "/canada/pn/rex-pn",  label: "RPN/PN Hub",         requiredSlots: [1, 10] as ScreenshotId[] },
  { route: "/canada/np/cnple",   label: "NP Hub",             requiredSlots: [6, 7, 12] as ScreenshotId[] },
] as const;

// ─── Screenshot freshness rules ───────────────────────────────────────────────

/**
 * Maximum age (days) before a screenshot is considered stale.
 * Local files exceeding this age should be regenerated before the next release.
 */
export const SCREENSHOT_STALENESS_THRESHOLD_DAYS = 30;

/**
 * Critical CDN slots that must always be accessible (4xx = CI failure).
 * These are the slots used on the highest-traffic pages.
 */
export const CRITICAL_CDN_SLOTS: readonly ScreenshotId[] = [
  1,  // Practice rationale — used on homepage + pricing + FAQ
  3,  // Learner dashboard — used on homepage + FAQ
  6,  // CAT exam — used on homepage + pricing
  7,  // CAT results — used on homepage + pricing + FAQ
  10, // Question bank — used on homepage + FAQ
  12, // Lesson detail — used on homepage + FAQ
  14, // Marketing homepage — used on homepage carousel
];

// ─── Expected screenshot count per page ──────────────────────────────────────

export const PAGE_SCREENSHOT_MINIMUMS: Record<string, number> = {
  home:             15,  // Full carousel
  pricing:           3,  // Product preview grid
  faq:               4,  // Visual FAQ items
  about:             9,  // About showcase
  "for-institutions": 7,  // Institutional hero
};

// ─── Registry validation ──────────────────────────────────────────────────────

export type GovernanceViolation = {
  ruleId: string;
  severity: "critical" | "warning";
  message: string;
  screenshotId?: ScreenshotId;
  detail?: string;
};

/**
 * Validates the screenshot registry against governance rules.
 * Returns violations — empty array means all rules pass.
 */
export function validateScreenshotRegistry(): GovernanceViolation[] {
  const violations: GovernanceViolation[] = [];

  // Rule 1: Every registry entry must have a valid CDN URL
  for (const record of SCREENSHOT_REGISTRY) {
    if (!record.publicUrl.startsWith("https://")) {
      violations.push({
        ruleId: "GOV-001",
        severity: "critical",
        message: `Screenshot ${record.id} has an invalid CDN URL`,
        screenshotId: record.id,
        detail: record.publicUrl,
      });
    }
  }

  // Rule 2: Every critical slot must be in the registry
  for (const id of CRITICAL_CDN_SLOTS) {
    const record = SCREENSHOT_REGISTRY.find((r) => r.id === id);
    if (!record) {
      violations.push({
        ruleId: "GOV-002",
        severity: "critical",
        message: `Critical slot ${id} is missing from SCREENSHOT_REGISTRY`,
        screenshotId: id,
      });
    }
  }

  // Rule 3: Hompage hero must have all 15 slots
  if (SCREENSHOT_GROUPS.homepageHero.length !== 15) {
    violations.push({
      ruleId: "GOV-003",
      severity: "critical",
      message: `Homepage hero carousel expects 15 screenshots, found ${SCREENSHOT_GROUPS.homepageHero.length}`,
    });
  }

  // Rule 4: No duplicate IDs in the registry
  const ids = SCREENSHOT_REGISTRY.map((r) => r.id);
  const uniqueIds = new Set(ids);
  if (ids.length !== uniqueIds.size) {
    violations.push({
      ruleId: "GOV-004",
      severity: "critical",
      message: "SCREENSHOT_REGISTRY contains duplicate IDs",
    });
  }

  // Rule 5: All group IDs must exist in the registry
  for (const [groupName, groupIds] of Object.entries(SCREENSHOT_GROUPS)) {
    for (const id of groupIds) {
      const exists = SCREENSHOT_REGISTRY.find((r) => r.id === id);
      if (!exists) {
        violations.push({
          ruleId: "GOV-005",
          severity: "critical",
          message: `SCREENSHOT_GROUPS.${groupName} references non-existent screenshot ID ${id}`,
          screenshotId: id as ScreenshotId,
        });
      }
    }
  }

  // Rule 6: Every entry must have a label and description
  for (const record of SCREENSHOT_REGISTRY) {
    if (!record.label || record.label.length < 5) {
      violations.push({
        ruleId: "GOV-006",
        severity: "warning",
        message: `Screenshot ${record.id} has an insufficient label`,
        screenshotId: record.id,
      });
    }
    if (!record.description || record.description.length < 20) {
      violations.push({
        ruleId: "GOV-007",
        severity: "warning",
        message: `Screenshot ${record.id} has an insufficient description`,
        screenshotId: record.id,
      });
    }
  }

  // Rule 7: Pricing preview must include at least one practice and one CAT screenshot
  const pricingIds = new Set<ScreenshotId>(SCREENSHOT_GROUPS.pricingPreview);
  const hasPractice = SCREENSHOT_REGISTRY.some(
    (r) => pricingIds.has(r.id) && (r.feature === "question-bank" || r.feature === "rationale"),
  );
  const hasCat = SCREENSHOT_REGISTRY.some(
    (r) => pricingIds.has(r.id) && (r.feature === "cat-exam" || r.feature === "cat-results"),
  );
  if (!hasPractice) {
    violations.push({
      ruleId: "GOV-008",
      severity: "warning",
      message: "Pricing preview group does not include a practice/question screenshot",
    });
  }
  if (!hasCat) {
    violations.push({
      ruleId: "GOV-009",
      severity: "warning",
      message: "Pricing preview group does not include a CAT screenshot",
    });
  }

  return violations;
}

// ─── Required generated screenshot paths ─────────────────────────────────────

/**
 * Local file paths (relative to public/) that must exist for the marketing site
 * to show real screenshots rather than legacy fallbacks.
 *
 * Checked by: screenshot-governance.contract.test.ts + CI validation
 */
export const REQUIRED_GENERATED_PATHS = [
  // Used directly by tier-value-experience.tsx stages
  "marketing/generated-screenshots/core/learner-dashboard.webp",
  "marketing/generated-screenshots/core/cat-exam-session.webp",
  "marketing/generated-screenshots/core/cat-results.webp",
  "marketing/generated-screenshots/core/flashcards.webp",
  "marketing/generated-screenshots/core/confidence-analytics.webp",
  "marketing/generated-screenshots/core/smart-review.webp",
  // Tier-specific hubs (richer context per audience in TierValueExperience)
  "marketing/generated-screenshots/rn/rn-hub.webp",
  "marketing/generated-screenshots/rn/rn-flashcards.webp",
  "marketing/generated-screenshots/rn/rn-cat-exam.webp",
  "marketing/generated-screenshots/pn/pn-hub.webp",
  "marketing/generated-screenshots/np/np-hub.webp",
  "marketing/generated-screenshots/np/np-loft-simulation.webp",
  "marketing/generated-screenshots/allied/allied-hub.webp",
  "marketing/generated-screenshots/newgrad/newgrad-hub.webp",
  // Marketing page screenshots
  "marketing/generated-screenshots/marketing/marketing-home-desktop.webp",
  "marketing/generated-screenshots/marketing/pricing.webp",
  "marketing/generated-screenshots/marketing/faq.webp",
] as const;

export type RequiredGeneratedPath = (typeof REQUIRED_GENERATED_PATHS)[number];

// ─── Capture route registry ───────────────────────────────────────────────────

/**
 * Maps each CDN slot to the app route it should be captured from.
 * Used to validate that capture routes still exist and serve content.
 */
export const CDN_SLOT_CAPTURE_ROUTES: Record<ScreenshotId, string> = {
  1:  "/app/questions/session",
  2:  "/app/flashcards",
  3:  "/app",
  4:  "/app/questions/bank",
  5:  "/app/account/report",
  6:  "/app/practice-tests/cat-launch",
  7:  "/app/practice-tests/cat-insights",
  8:  "/app/study-plan",
  9:  "/app/review",
  10: "/app/questions",
  11: "/app/analytics",
  12: "/app/lessons",
  13: "/app/lessons",
  14: "/",
  15: "/modules/ecg/basic/lessons",
};

// ─── Theme coverage requirements ─────────────────────────────────────────────

export type ThemeId = "ocean" | "midnight" | "blossom" | "aurora" | "sage-garden";

export const REQUIRED_THEME_COVERAGE: Record<ThemeId, string[]> = {
  ocean:        ["core/learner-dashboard.webp", "core/flashcards.webp", "marketing/marketing-home-desktop.webp"],
  midnight:     ["core/cat-exam-session.webp", "core/cat-results.webp", "core/ecg-workstation.webp"],
  blossom:      ["core/flashcards.webp", "marketing/marketing-home-desktop.webp"],
  aurora:       ["core/lesson-detail.webp"],
  "sage-garden":["marketing/marketing-home-desktop.webp"],
};

// ─── Screenshot age check ─────────────────────────────────────────────────────

/**
 * Returns true if the screenshot manifest entry is fresh (within threshold).
 * Use this when reading the generated manifest.json to detect stale captures.
 */
export function isScreenshotFresh(
  generatedAt: string,
  thresholdDays = SCREENSHOT_STALENESS_THRESHOLD_DAYS,
): boolean {
  const age = (Date.now() - new Date(generatedAt).getTime()) / (1000 * 60 * 60 * 24);
  return age <= thresholdDays;
}

/**
 * Returns a human-readable age string from an ISO date.
 */
export function screenshotAgeLabel(generatedAt: string): string {
  const days = Math.round(
    (Date.now() - new Date(generatedAt).getTime()) / (1000 * 60 * 60 * 24),
  );
  if (days === 0) return "today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}
