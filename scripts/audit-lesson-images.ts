/**
 * Audit lesson image coverage against the education image inventory.
 *
 * Outputs:
 *   - Lessons with matched images (by source: override | exact_slug | topic_slug)
 *   - Lessons with no image
 *   - Inventory images that match no known lesson slug (orphans)
 *   - Duplicate candidate conflicts
 *
 * Run:
 *   npx tsx scripts/audit-lesson-images.ts
 *
 * Optional flags:
 *   --json          Output machine-readable JSON instead of human text
 *   --orphans-only  Show only orphan images (no lesson match)
 *   --missing-only  Show only lessons without an image
 *
 * Requires DATABASE_URL to be set for full lesson slug enumeration.
 * Without a DB, only inventory orphan analysis is performed.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// --- CLI flags ---
const args = process.argv.slice(2);
const JSON_OUT = args.includes("--json");
const ORPHANS_ONLY = args.includes("--orphans-only");
const MISSING_ONLY = args.includes("--missing-only");

// --- Load inventory ---
const inventoryPath = path.join(ROOT, "src/config/education-image-inventory.json");
if (!fs.existsSync(inventoryPath)) {
  console.error("ERROR: Inventory not found:", inventoryPath);
  console.error("Run: node scripts/sync-lesson-image-inventory.mjs");
  process.exit(1);
}

const inventory: { version: number; keys: string[] } = JSON.parse(
  fs.readFileSync(inventoryPath, "utf8"),
);

// Build basename → preferred key mapping (mirrors inventory.ts logic).
const IMAGE_PREFIXES = ["uploads/images/", "uploads/lesson-images/"];
const PREFERRED_EXTENSIONS = [".webp", ".png", ".jpg", ".jpeg"];

function basenameWithoutExtension(key: string): string {
  const base = key.split("/").pop() ?? key;
  return base.replace(/\.[^.]+$/, "").toLowerCase();
}

function findKeyForBasename(
  basename: string,
  keys: string[],
): string | null {
  for (const prefix of IMAGE_PREFIXES) {
    for (const ext of PREFERRED_EXTENSIONS) {
      const candidate = `${prefix}${basename}${ext}`;
      if (keys.includes(candidate)) return candidate;
    }
  }
  return null;
}

// Unique basenames from inventory (one per image, preferred ext wins).
const allInventoryBasenames = [...new Set(inventory.keys.map(basenameWithoutExtension))];

// --- Inline override map (mirrors lesson-image-overrides.ts without TS imports) ---
// Keep in sync with src/lib/content/lesson-image-overrides.ts.
const LESSON_IMAGE_OVERRIDES: Record<string, string> = {
  // Add overrides here to mirror the source file.
};

function resolveForSlug(slug: string, topicSlug?: string): {
  url: string | null;
  objectKey: string | null;
  source: "override" | "exact_slug" | "topic_slug" | "none";
} {
  const normalized = slug.trim().toLowerCase();
  const overrideKey = LESSON_IMAGE_OVERRIDES[normalized];
  if (overrideKey) {
    return { url: `[CDN]/${overrideKey}`, objectKey: overrideKey, source: "override" };
  }
  const slugKey = findKeyForBasename(normalized, inventory.keys);
  if (slugKey) {
    return { url: `[CDN]/${slugKey}`, objectKey: slugKey, source: "exact_slug" };
  }
  if (topicSlug) {
    const tNorm = topicSlug.trim().toLowerCase();
    if (tNorm && tNorm !== normalized) {
      const topicKey = findKeyForBasename(tNorm, inventory.keys);
      if (topicKey) {
        return { url: `[CDN]/${topicKey}`, objectKey: topicKey, source: "topic_slug" };
      }
    }
  }
  return { url: null, objectKey: null, source: "none" };
}

// --- Load lesson slugs from DB (optional) ---
type LessonRow = { slug: string; title: string; topicSlug: string; pathwayId: string };

async function loadLessonsFromDb(): Promise<LessonRow[] | null> {
  if (!process.env.DATABASE_URL) return null;
  try {
    // Dynamic import so the script fails gracefully without a DB.
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();
    const PAGE_SIZE = 500;
    const rows: LessonRow[] = [];
    let cursor: string | undefined;
    for (;;) {
      const page: Array<{ slug: string; title: string; topicSlug: string; pathwayId: string }> =
        await (prisma.pathwayLesson as any).findMany({
          select: { slug: true, title: true, topicSlug: true, pathwayId: true },
          where: { status: "PUBLISHED" },
          take: PAGE_SIZE,
          ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
          orderBy: { id: "asc" },
        });
      if (page.length === 0) break;
      rows.push(...page);
      if (page.length < PAGE_SIZE) break;
      // We need the ID for the cursor; re-fetch last row with ID.
      const lastSlug = page[page.length - 1]!.slug;
      const last = await (prisma.pathwayLesson as any).findFirst({
        where: { slug: lastSlug },
        select: { id: true },
      });
      cursor = last?.id;
      if (!cursor) break;
    }
    await prisma.$disconnect();
    return rows;
  } catch (err) {
    console.warn(
      "WARN: Could not load lessons from DB:",
      (err as Error).message,
    );
    return null;
  }
}

// --- Report types ---
type LessonReport = {
  slug: string;
  title: string;
  pathwayId: string;
  objectKey: string | null;
  source: "override" | "exact_slug" | "topic_slug" | "none";
};

type AuditReport = {
  inventoryTotal: number;
  inventoryBasenames: string[];
  lessonsTotal: number | null;
  lessonsMatched: LessonReport[];
  lessonsMissing: LessonReport[];
  orphanImages: string[];
  duplicateCandidates: Array<{ basename: string; keys: string[] }>;
  dbAvailable: boolean;
};

// --- Main ---
async function main() {
  const lessons = await loadLessonsFromDb();
  const dbAvailable = lessons !== null;

  // Deduplicate lessons by slug (same slug can exist across pathways).
  const uniqueLessons = new Map<string, LessonRow>();
  if (lessons) {
    for (const l of lessons) {
      if (!uniqueLessons.has(l.slug)) uniqueLessons.set(l.slug, l);
    }
  }

  const matched: LessonReport[] = [];
  const missing: LessonReport[] = [];

  if (dbAvailable) {
    for (const [slug, lesson] of uniqueLessons) {
      const res = resolveForSlug(slug, lesson.topicSlug);
      const row: LessonReport = {
        slug,
        title: lesson.title,
        pathwayId: lesson.pathwayId,
        objectKey: res.objectKey,
        source: res.source,
      };
      if (res.source !== "none") {
        matched.push(row);
      } else {
        missing.push(row);
      }
    }
  }

  // Find inventory images that matched no lesson slug.
  const matchedKeys = new Set(matched.map((r) => r.objectKey).filter(Boolean));
  const overrideKeys = new Set(Object.values(LESSON_IMAGE_OVERRIDES));
  const orphanImages: string[] = [];
  for (const basename of allInventoryBasenames) {
    const key = findKeyForBasename(basename, inventory.keys);
    if (!key) continue;
    const isOverrideTarget = [...overrideKeys].some((v) => v === key);
    if (!isOverrideTarget && !matchedKeys.has(key)) {
      orphanImages.push(key);
    }
  }

  // Find basenames with multiple extensions (potential duplicates).
  const basenameToKeys = new Map<string, string[]>();
  for (const k of inventory.keys) {
    const bn = basenameWithoutExtension(k);
    const existing = basenameToKeys.get(bn) ?? [];
    existing.push(k);
    basenameToKeys.set(bn, existing);
  }
  const duplicateCandidates = [...basenameToKeys.entries()]
    .filter(([, keys]) => keys.length > 1)
    .map(([basename, keys]) => ({ basename, keys }));

  const report: AuditReport = {
    inventoryTotal: allInventoryBasenames.length,
    inventoryBasenames: allInventoryBasenames,
    lessonsTotal: dbAvailable ? uniqueLessons.size : null,
    lessonsMatched: matched,
    lessonsMissing: missing,
    orphanImages,
    duplicateCandidates,
    dbAvailable,
  };

  if (JSON_OUT) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  // Human-readable output.
  const hr = "─".repeat(64);

  console.log("\n" + hr);
  console.log("  LESSON IMAGE AUDIT");
  console.log(hr);
  console.log(`  Inventory:       ${report.inventoryTotal} unique image basenames`);
  if (dbAvailable) {
    console.log(`  Lessons (DB):    ${report.lessonsTotal} unique slugs`);
    console.log(`  Matched:         ${matched.length}`);
    console.log(`  No image:        ${missing.length}`);
  } else {
    console.log("  Lessons (DB):    [unavailable — set DATABASE_URL for full audit]");
  }
  console.log(`  Orphan images:   ${orphanImages.length}`);
  console.log(`  Dup basenames:   ${duplicateCandidates.length}`);
  console.log(hr + "\n");

  if (!ORPHANS_ONLY && dbAvailable && matched.length > 0) {
    console.log(`MATCHED LESSONS (${matched.length})`);
    const bySource = { override: 0, exact_slug: 0, topic_slug: 0 };
    for (const r of matched) {
      bySource[r.source as keyof typeof bySource]++;
    }
    console.log(
      `  override=${bySource.override}  exact_slug=${bySource.exact_slug}  topic_slug=${bySource.topic_slug}`,
    );
    for (const r of matched) {
      console.log(`  [${r.source.padEnd(10)}] ${r.slug} → ${r.objectKey}`);
    }
    console.log();
  }

  if (!ORPHANS_ONLY && dbAvailable && missing.length > 0) {
    console.log(`LESSONS WITHOUT IMAGES (${missing.length})`);
    for (const r of missing) {
      console.log(`  ${r.slug}`);
    }
    console.log();
  }

  if (orphanImages.length > 0) {
    console.log(`ORPHAN IMAGES — no lesson slug match (${orphanImages.length})`);
    console.log("  These images exist in the inventory but match no lesson.");
    console.log("  Consider renaming them to match a lesson slug, or adding a manual override.\n");
    for (const key of orphanImages) {
      console.log(`  ${key}`);
    }
    console.log();
  } else {
    console.log("ORPHAN IMAGES — none found (all inventory images match a lesson)\n");
  }

  if (duplicateCandidates.length > 0 && !MISSING_ONLY && !ORPHANS_ONLY) {
    console.log(`DUPLICATE BASENAMES — multiple extensions for same image (${duplicateCandidates.length})`);
    console.log("  (Expected: each lesson image should have both .png and .webp for format fallback)\n");
    for (const { basename, keys } of duplicateCandidates) {
      console.log(`  ${basename}:`);
      for (const k of keys) console.log(`    ${k}`);
    }
    console.log();
  }

  if (!dbAvailable) {
    console.log(
      "TIP: Set DATABASE_URL and re-run for a full report of lessons with/without images.",
    );
    console.log();
  }
}

main().catch((err) => {
  console.error("FATAL:", err);
  process.exit(1);
});
