#!/usr/bin/env node
/**
 * Copy Playwright-generated captures into homepage carousel local WebP slots.
 *
 * Maps generate-marketing-screenshots.ts keys → CDN screenshot{N} filenames under
 * public/marketing/homepage-screenshots/ so getMarketingHeroImageUrlChain() prefers
 * fresh local assets over stale CDN PNGs.
 *
 * Usage:
 *   node scripts/sync-homepage-screenshot-variants.mjs
 */
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/** Slot → preferred theme for homepage carousel (40% Ocean · 35% Blossom · 25% Midnight). */
const SLOT_THEME_MAP = {
  "practice-rationale": "ocean",
  flashcards: "blossom",
  "learner-dashboard": "ocean",
  "question-bank-advanced": "ocean",
  "progress-report": "midnight",
  "cat-exam-session": "midnight",
  "cat-results": "midnight",
  "study-plan": "blossom",
  "smart-review": "blossom",
  "question-bank": "ocean",
  "confidence-analytics": "midnight",
  "lesson-detail": "blossom",
  "lesson-library": "blossom",
  "marketing-home-desktop": "ocean",
  "ecg-workstation": "ocean",
};

const __dirname = dirname(fileURLToPath(import.meta.url));
const APP_ROOT = join(__dirname, "..");
const GENERATED_ROOT = join(APP_ROOT, "public", "marketing", "generated-screenshots");
const OUT_DIR = join(APP_ROOT, "public", "marketing", "homepage-screenshots");

/** generate key → CDN slot id (screenshot{N}.png) */
const SLOT_MAP = {
  "practice-rationale": 1,
  flashcards: 2,
  "learner-dashboard": 3,
  "question-bank-advanced": 4,
  "progress-report": 5,
  "cat-exam-session": 6,
  "cat-results": 7,
  "study-plan": 8,
  "smart-review": 9,
  "question-bank": 10,
  "confidence-analytics": 11,
  "lesson-detail": 12,
  "lesson-library": 13,
  "marketing-home-desktop": 14,
  "ecg-workstation": 15,
};

/** Keys stored outside core/ in generated-screenshots */
const TIER_BY_KEY = {
  "marketing-home-desktop": "marketing",
};

const WIDTH_SUFFIXES = ["", "-1200w", "-768w", "-480w"];

mkdirSync(OUT_DIR, { recursive: true });

let copied = 0;
let missing = 0;

for (const [key, slot] of Object.entries(SLOT_MAP)) {
  const tier = TIER_BY_KEY[key] ?? "core";
  const theme = SLOT_THEME_MAP[key] ?? "ocean";
  const themeDir = join(GENERATED_ROOT, "themes", theme);
  const generatedDir = join(GENERATED_ROOT, tier);

  for (const suffix of WIDTH_SUFFIXES) {
    const srcName = suffix ? `${key}${suffix}.webp` : `${key}.webp`;
    const dstName = suffix ? `screenshot${slot}${suffix}.webp` : `screenshot${slot}.webp`;
    const themeSrc = join(themeDir, srcName);
    const coreSrc = join(generatedDir, srcName);
    const src = existsSync(themeSrc) ? themeSrc : coreSrc;
    const dst = join(OUT_DIR, dstName);
    if (!existsSync(src)) {
      missing += 1;
      continue;
    }
    copyFileSync(src, dst);
    copied += 1;
  }
}

console.log(`Homepage screenshot sync: ${copied} file(s) copied → ${OUT_DIR}`);
if (missing > 0) {
  console.log(`Skipped ${missing} missing source variant(s) under ${GENERATED_ROOT}`);
}
