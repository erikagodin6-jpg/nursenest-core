#!/usr/bin/env node
/**
 * Copy Playwright-generated core captures into homepage carousel local WebP slots.
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

const __dirname = dirname(fileURLToPath(import.meta.url));
const APP_ROOT = join(__dirname, "..");
const GENERATED = join(APP_ROOT, "public", "marketing", "generated-screenshots", "core");
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

const WIDTH_SUFFIXES = ["", "-1200w", "-768w", "-480w"];

mkdirSync(OUT_DIR, { recursive: true });

let copied = 0;
let missing = 0;

for (const [key, slot] of Object.entries(SLOT_MAP)) {
  for (const suffix of WIDTH_SUFFIXES) {
    const srcName = suffix ? `${key}${suffix}.webp` : `${key}.webp`;
    const dstName = suffix ? `screenshot${slot}${suffix}.webp` : `screenshot${slot}.webp`;
    const src = join(GENERATED, srcName);
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
  console.log(`Skipped ${missing} missing source variant(s) in ${GENERATED}`);
}
