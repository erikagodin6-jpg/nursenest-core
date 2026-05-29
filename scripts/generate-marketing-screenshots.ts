#!/usr/bin/env node
/**
 * Thin wrapper — canonical assessment screenshot pipeline lives in:
 *   nursenest-core/scripts/generate-assessment-screenshots.ts
 *
 * From repo root:
 *   npx tsx scripts/generate-marketing-screenshots.ts
 *   npx tsx scripts/generate-marketing-screenshots.ts --category=cat,flashcards
 *   npx tsx scripts/generate-marketing-screenshots.ts --theme=ocean
 *   npx tsx scripts/generate-marketing-screenshots.ts --list
 *   npx tsx scripts/generate-marketing-screenshots.ts --help
 *
 * Output: marketing-assets/screenshots/{cat,practice-exams,flashcards,ecg,pharmacology,clinical-skills,loft}/
 *         marketing-assets/screenshots/gallery/index.html
 *         marketing-assets/screenshots/manifest.json
 *
 * Prerequisites:
 *   1. npx playwright install chromium  (from nursenest-core/)
 *   2. App running: cd nursenest-core && npm run dev:next:3000
 *   3. QA user seeded: cd nursenest-core && DATABASE_URL=... npx tsx scripts/seed-screenshot-demo-user.ts
 *   4. Set credentials: QA_PAID_EMAIL / QA_PAID_PASSWORD  (or E2E_* / SCREENSHOT_DEMO_* variants)
 */
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const appRoot = join(__dirname, "../nursenest-core");
const script = join(appRoot, "scripts/generate-assessment-screenshots.ts");

const result = spawnSync(
  process.execPath,
  ["--import", "tsx/esm", script, ...process.argv.slice(2)],
  { cwd: appRoot, stdio: "inherit", env: process.env },
);

process.exit(result.status ?? 1);
