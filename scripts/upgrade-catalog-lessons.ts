/**
 * upgrade-catalog-lessons.ts
 *
 * Batch clinical-grade upgrade for ALL lessons in catalog.json.
 * Processes all 5 pathways: ca-rn, ca-rpn, us-rn, us-lpn, us-np.
 * Upgrades every lesson under 1,200 words to the full 11-section structure.
 *
 * Usage:
 *   npx tsx scripts/upgrade-catalog-lessons.ts
 *   npx tsx scripts/upgrade-catalog-lessons.ts --pathway ca-rn-nclex-rn
 *   npx tsx scripts/upgrade-catalog-lessons.ts --pathway us-rn-nclex-rn --dry-run
 *   npx tsx scripts/upgrade-catalog-lessons.ts --min-words 1500 --force
 *
 * Env vars required:
 *   AI_INTEGRATIONS_OPENAI_API_KEY  — API key for LLM provider
 *   AI_INTEGRATIONS_OPENAI_BASE_URL — Base URL (defaults to OpenAI)
 *   LESSON_OPENAI_MODEL             — Same resolution as nursenest-core lesson expansion
 *   AI_INTEGRATIONS_OPENAI_MODEL    — Shared fallback
 *   UPGRADE_MODEL                   — Legacy last-resort override (optional)
 *   (default model: gpt-4.1-mini)
 */

import OpenAI from "openai";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import {
  buildSystemPrompt,
  buildLessonPrompt,
  countLessonWords,
  validateSections,
  REQUIRED_SECTION_KINDS,
  type LessonTier,
  type CatalogSection,
} from "./clinical-grade-system-prompt.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CATALOG_PATH = path.join(
  __dirname,
  "../nursenest-core/src/content/pathway-lessons/catalog.json"
);
const PROGRESS_PATH = path.join(__dirname, "../tmp/upgrade-catalog-progress.json");

// ─── CLI args ────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const FORCE = args.includes("--force");
const PATHWAY_FILTER = (() => {
  const i = args.indexOf("--pathway");
  return i !== -1 ? args[i + 1] : null;
})();
const MIN_WORDS = (() => {
  const i = args.indexOf("--min-words");
  return i !== -1 ? parseInt(args[i + 1], 10) : 1200;
})();

// ─── Config ──────────────────────────────────────────────────────────────────
const MODEL =
  process.env.LESSON_OPENAI_MODEL?.trim() ||
  process.env.AI_INTEGRATIONS_OPENAI_MODEL?.trim() ||
  process.env.UPGRADE_MODEL?.trim() ||
  "gpt-4.1-mini";
const MAX_RETRIES = 3;
const CONCURRENCY = 2;         // parallel lessons per pathway
const SAVE_EVERY = 5;          // write catalog to disk every N upgrades
const MAX_TOKENS = 4096;
const TEMPERATURE = 0.3;

// ─── Pathway → tier + region mapping ─────────────────────────────────────────
const PATHWAY_META: Record<
  string,
  { tier: LessonTier; region: "ca" | "us" | "global" }
> = {
  "ca-rn-nclex-rn":      { tier: "rn",     region: "ca" },
  "ca-rpn-rex-pn":       { tier: "rpn",    region: "ca" },
  "us-rn-nclex-rn":      { tier: "rn",     region: "us" },
  "us-lpn-nclex-pn":     { tier: "rpn",    region: "us" },
  "us-np-fnp":           { tier: "np",     region: "us" },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getOpenAI(): OpenAI {
  return new OpenAI({
    apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  });
}

interface ProgressRecord {
  upgradedSlugs: string[];
  failedSlugs: string[];
  startedAt: string;
  lastUpdatedAt: string;
}

function loadProgress(): ProgressRecord {
  if (fs.existsSync(PROGRESS_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(PROGRESS_PATH, "utf8")) as ProgressRecord;
    } catch {
      // corrupted — start fresh
    }
  }
  return {
    upgradedSlugs: [],
    failedSlugs: [],
    startedAt: new Date().toISOString(),
    lastUpdatedAt: new Date().toISOString(),
  };
}

function saveProgress(progress: ProgressRecord): void {
  fs.mkdirSync(path.dirname(PROGRESS_PATH), { recursive: true });
  progress.lastUpdatedAt = new Date().toISOString();
  fs.writeFileSync(PROGRESS_PATH, JSON.stringify(progress, null, 2));
}

function saveCatalog(catalog: any): void {
  fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2));
}

/**
 * Call the AI to regenerate a single lesson to clinical-grade standard.
 * Returns upgraded sections or null on failure.
 */
async function regenerateLesson(
  openai: OpenAI,
  title: string,
  topic: string,
  bodySystem: string,
  tier: LessonTier,
  region: "ca" | "us" | "global",
  attempt = 1
): Promise<CatalogSection[] | null> {
  const systemPrompt = buildSystemPrompt(tier);
  const userPrompt = buildLessonPrompt(title, topic, bodySystem, tier, region);

  try {
    const response = await openai.chat.completions.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      temperature: TEMPERATURE,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const raw = response.choices[0]?.message?.content || "";
    if (!raw) {
      console.warn(`  [attempt ${attempt}] Empty response for "${title}"`);
      return null;
    }

    // Strip markdown fences if present
    const cleaned = raw
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```\s*$/, "")
      .trim();

    let parsed: { sections?: CatalogSection[] };
    try {
      parsed = JSON.parse(cleaned);
    } catch (e) {
      console.warn(`  [attempt ${attempt}] Invalid JSON for "${title}": ${String(e).slice(0, 80)}`);
      if (attempt < MAX_RETRIES) {
        await sleep(2000);
        return regenerateLesson(openai, title, topic, bodySystem, tier, region, attempt + 1);
      }
      return null;
    }

    const sections = parsed.sections;
    if (!Array.isArray(sections) || sections.length === 0) {
      console.warn(`  [attempt ${attempt}] No sections array for "${title}"`);
      if (attempt < MAX_RETRIES) {
        await sleep(2000);
        return regenerateLesson(openai, title, topic, bodySystem, tier, region, attempt + 1);
      }
      return null;
    }

    // Validate structure
    const wordCount = countLessonWords(sections);
    const { valid, missing } = validateSections(sections);

    if (!valid) {
      console.warn(`  [attempt ${attempt}] Missing sections for "${title}": ${missing.join(", ")}`);
      if (attempt < MAX_RETRIES) {
        await sleep(2000);
        return regenerateLesson(openai, title, topic, bodySystem, tier, region, attempt + 1);
      }
      return null;
    }

    if (wordCount < MIN_WORDS) {
      console.warn(
        `  [attempt ${attempt}] Under word count for "${title}": ${wordCount}/${MIN_WORDS}`
      );
      if (attempt < MAX_RETRIES) {
        await sleep(2000);
        return regenerateLesson(openai, title, topic, bodySystem, tier, region, attempt + 1);
      }
      return null;
    }

    return sections;
  } catch (err: any) {
    console.error(`  [attempt ${attempt}] API error for "${title}": ${err.message}`);
    if (attempt < MAX_RETRIES) {
      await sleep(3000 * attempt);
      return regenerateLesson(openai, title, topic, bodySystem, tier, region, attempt + 1);
    }
    return null;
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Process a batch of lessons with limited concurrency.
 */
async function processBatch<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);
    const batchResults = await Promise.all(
      batch.map((item, j) => fn(item, i + j))
    );
    results.push(...batchResults);
  }
  return results;
}

// ─── Main ────────────────────────────────────────────────────────────────────
async function main(): Promise<void> {
  console.log(`Model: ${MODEL}`);
  console.log("═══════════════════════════════════════════════════════");
  console.log(" NurseNest Catalog Clinical-Grade Lesson Upgrade");
  console.log("═══════════════════════════════════════════════════════");
  console.log(`  Min words:   ${MIN_WORDS}`);
  console.log(`  Dry run:     ${DRY_RUN}`);
  console.log(`  Force:       ${FORCE}`);
  console.log(`  Pathway:     ${PATHWAY_FILTER || "all"}`);
  console.log(`  Concurrency: ${CONCURRENCY}`);
  console.log("───────────────────────────────────────────────────────\n");

  if (!process.env.AI_INTEGRATIONS_OPENAI_API_KEY && !DRY_RUN) {
    console.error("ERROR: AI_INTEGRATIONS_OPENAI_API_KEY is not set.");
    console.error("Set it and re-run, or add --dry-run to preview what would be upgraded.");
    process.exit(1);
  }

  const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));
  const pathways: Record<string, { lessons: any[] }> = catalog.pathways;

  const progress = loadProgress();
  const openai = DRY_RUN ? null : getOpenAI();

  let totalUpgraded = 0;
  let totalSkipped = 0;
  let totalFailed = 0;
  let totalAlreadyGood = 0;

  const pathwayKeys = Object.keys(pathways).filter(
    (k) => !PATHWAY_FILTER || k === PATHWAY_FILTER
  );

  for (const pathwayKey of pathwayKeys) {
    const meta = PATHWAY_META[pathwayKey];
    if (!meta) {
      console.warn(`No tier mapping for pathway "${pathwayKey}" — skipping.`);
      continue;
    }

    const pw = pathways[pathwayKey];
    const lessons = pw.lessons || [];

    const toUpgrade = lessons.filter((lesson) => {
      if (progress.upgradedSlugs.includes(lesson.slug) && !FORCE) return false;
      const words = countLessonWords(lesson.sections || []);
      return words < MIN_WORDS;
    });

    const alreadyGood = lessons.filter((lesson) => {
      const words = countLessonWords(lesson.sections || []);
      return words >= MIN_WORDS;
    });

    totalAlreadyGood += alreadyGood.length;

    console.log(`\n━━━ ${pathwayKey} [${meta.tier.toUpperCase()} / ${meta.region}] ━━━`);
    console.log(`  Total lessons: ${lessons.length}`);
    console.log(`  Already ≥${MIN_WORDS}w: ${alreadyGood.length}`);
    console.log(`  To upgrade: ${toUpgrade.length}`);

    if (toUpgrade.length === 0) {
      console.log("  ✓ All lessons meet the word count threshold.");
      continue;
    }

    if (DRY_RUN) {
      toUpgrade.forEach((l) => {
        const w = countLessonWords(l.sections || []);
        console.log(`  [DRY RUN] Would upgrade: "${l.title}" (${w}w)`);
      });
      totalSkipped += toUpgrade.length;
      continue;
    }

    let pathwayUpgraded = 0;
    let pathwayFailed = 0;

    await processBatch(toUpgrade, CONCURRENCY, async (lesson, idx) => {
      const currentWords = countLessonWords(lesson.sections || []);
      console.log(
        `  [${idx + 1}/${toUpgrade.length}] Upgrading: "${lesson.title}" (${currentWords}w → target ≥${MIN_WORDS}w)`
      );

      const newSections = await regenerateLesson(
        openai!,
        lesson.title,
        lesson.topic || lesson.topicSlug || "General Nursing",
        lesson.bodySystem || "General",
        meta.tier,
        meta.region
      );

      if (!newSections) {
        console.error(`  ✗ Failed to upgrade: "${lesson.title}"`);
        progress.failedSlugs.push(lesson.slug);
        pathwayFailed++;
        totalFailed++;
        return;
      }

      const newWords = countLessonWords(newSections);
      console.log(`  ✓ Upgraded: "${lesson.title}" (${currentWords}w → ${newWords}w)`);

      // Replace sections in-place
      lesson.sections = newSections;

      // Remove preTest/postTest if present — regenerated lessons use case_study
      // (leave them if explicitly set; don't overwrite external quiz data)

      progress.upgradedSlugs.push(lesson.slug);
      pathwayUpgraded++;
      totalUpgraded++;

      // Periodic save
      if ((pathwayUpgraded + pathwayFailed) % SAVE_EVERY === 0) {
        saveCatalog(catalog);
        saveProgress(progress);
        console.log(`  [checkpoint] Saved catalog. (${pathwayUpgraded} upgraded, ${pathwayFailed} failed)`);
      }
    });

    // Final save for this pathway
    saveCatalog(catalog);
    saveProgress(progress);

    console.log(
      `  ─── Pathway done: ${pathwayUpgraded} upgraded, ${pathwayFailed} failed ───`
    );
  }

  // Final stats
  console.log("\n═══════════════════════════════════════════════════════");
  console.log(" Upgrade Complete");
  console.log("═══════════════════════════════════════════════════════");
  console.log(`  Already meeting standard: ${totalAlreadyGood}`);
  console.log(`  Upgraded this run:        ${totalUpgraded}`);
  console.log(`  Dry-run skipped:          ${totalSkipped}`);
  console.log(`  Failed:                   ${totalFailed}`);
  console.log(
    `  Progress saved to:        ${PROGRESS_PATH}`
  );
  console.log("═══════════════════════════════════════════════════════\n");

  if (totalFailed > 0) {
    console.log("Failed slugs:");
    progress.failedSlugs.slice(-20).forEach((s) => console.log(`  - ${s}`));
    console.log("Re-run with --force to retry failed lessons.");
  }
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
