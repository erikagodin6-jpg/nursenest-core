/**
 * Import guard tests for lesson hub routes.
 *
 * These tests fail if lesson hub or detail route files accidentally import
 * heavy modules (full lesson bodies, admin/blog generation utilities,
 * programmatic SEO universe) that caused 5+ minute page renders.
 *
 * They do NOT require a running server or DB — they read source files statically.
 *
 * Root cause context: the marketing hub page was calling
 * verifyMarketingHubLessonRowsResolve with a cap of 400 slugs, each requiring
 * an individual full-row Prisma read (including sections JSONB). At concurrency=8
 * that produced 50 serial rounds × query time = 5+ minute renders.
 *
 * The fix: cap reduced to effectiveHubPageSize × pageRequested. These guards
 * prevent the constants from silently reverting to slow values.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname_ts = dirname(__filename);
// test file lives at src/lib/lessons/ — go up 3 levels to reach project root
const root = join(__dirname_ts, "../../..");

function readRoute(relPath: string): string {
  return readFileSync(join(root, relPath), "utf8");
}

// ── Constants guards ─────────────────────────────────────────────────────────

describe("lessons hub performance constants", () => {
  it("PATHWAY_HUB_MARKETING_VERIFY_UNIQUE_SLUG_CAP must be ≤ 80", () => {
    const src = readRoute("src/lib/lessons/pathway-lesson-scale.ts");
    const m = src.match(/PATHWAY_HUB_MARKETING_VERIFY_UNIQUE_SLUG_CAP\s*=\s*(\d+)/);
    assert.ok(m, "PATHWAY_HUB_MARKETING_VERIFY_UNIQUE_SLUG_CAP constant not found");
    const v = Number(m![1]);
    assert.ok(
      v <= 80,
      `PATHWAY_HUB_MARKETING_VERIFY_UNIQUE_SLUG_CAP is ${v} — must be ≤ 80. ` +
        "Values above 80 cause hundreds of individual DB reads per hub render.",
    );
  });

  it("PATHWAY_LESSON_MARKETING_HUB_VERIFY_DB_TIMEOUT_MS must be ≤ 5000 ms", () => {
    const src = readRoute("src/lib/lessons/pathway-lesson-loader-config.ts");
    const m = src.match(/PATHWAY_LESSON_MARKETING_HUB_VERIFY_DB_TIMEOUT_MS\s*=\s*([\d_]+)/);
    assert.ok(m, "PATHWAY_LESSON_MARKETING_HUB_VERIFY_DB_TIMEOUT_MS constant not found");
    const v = Number(m![1]!.replace(/_/g, ""));
    assert.ok(
      v <= 5000,
      `PATHWAY_LESSON_MARKETING_HUB_VERIFY_DB_TIMEOUT_MS is ${v} ms — must be ≤ 5000 ms. ` +
        "High timeouts compound with the slug count: 50 rounds × 15 s = 750 s worst case.",
    );
  });
});

// ── Hub page must apply per-page verify cap ──────────────────────────────────

describe("marketing hub page.tsx verify scope", () => {
  const hubSrc = readRoute(
    "src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/page.tsx",
  );

  it("applies pageVerifyCap to limit verify to current page", () => {
    assert.ok(
      hubSrc.includes("pageVerifyCap"),
      "Hub page.tsx must define pageVerifyCap. Without it, the full PATHWAY_HUB_MARKETING_VERIFY_UNIQUE_SLUG_CAP " +
        "applies to every render, causing hundreds of DB reads.",
    );
  });

  it("pageVerifyCap formula uses effectiveHubPageSizeForVerify × pageRequested", () => {
    assert.ok(
      hubSrc.includes("effectiveHubPageSizeForVerify * pageRequested"),
      "Hub page.tsx pageVerifyCap formula must multiply effectiveHubPageSizeForVerify by pageRequested " +
        "so each page only verifies the lessons it will actually render.",
    );
  });
});

// ── Hub route must not import full lesson body modules ───────────────────────

describe("marketing hub page.tsx must not import heavy modules", () => {
  const hubSrc = readRoute(
    "src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/page.tsx",
  );

  it("does not import full lesson-library JSON", () => {
    assert.ok(
      !hubSrc.includes("lesson-library.json"),
      "Hub page.tsx must not import lesson-library.json — it is a 4.6 MB file and loading it server-side on every hub render is catastrophically slow.",
    );
  });

  it("does not import blog generation utilities", () => {
    assert.ok(
      !hubSrc.includes("from \"@/lib/blog/"),
      "Hub page.tsx must not import blog generation utilities — these are admin-only and heavy.",
    );
  });

  it("does not import admin generation utilities", () => {
    const hasAdmin =
      hubSrc.includes("from \"@/lib/admin/") || hubSrc.includes("from '@/lib/admin/");
    assert.ok(
      !hasAdmin,
      "Hub page.tsx must not import admin generation utilities.",
    );
  });
});

// ── Learner hub must not import full lesson body modules ─────────────────────

describe("learner hub page.tsx must not import heavy modules", () => {
  const learnerSrc = readRoute(
    "src/app/(app)/app/(learner)/lessons/page.tsx",
  );

  it("does not import full lesson-library JSON", () => {
    assert.ok(
      !learnerSrc.includes("lesson-library.json"),
      "Learner hub page.tsx must not import lesson-library.json.",
    );
  });

  it("does not import programmatic SEO / sitemap universe", () => {
    const hasSitemap =
      learnerSrc.includes("sitemap") ||
      learnerSrc.includes("programmatic-seo") ||
      learnerSrc.includes("seo-engine");
    assert.ok(
      !hasSitemap,
      "Learner hub page.tsx must not import sitemap/programmatic SEO utilities.",
    );
  });

  it("does not import blog generation utilities", () => {
    assert.ok(
      !learnerSrc.includes("from \"@/lib/blog/"),
      "Learner hub page.tsx must not import blog generation utilities.",
    );
  });
});

// ── Marketing lesson detail must not import sitemap universe ─────────────────

describe("marketing lesson detail page.tsx must not import sitemap universe", () => {
  const detailSrc = readRoute(
    "src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/[lessonSlug]/page.tsx",
  );

  it("does not import programmatic SEO universe that triggers full catalog scan", () => {
    const hasBulkSitemap =
      detailSrc.includes("generateStaticParams") ||
      detailSrc.includes("sitemap-universe") ||
      detailSrc.includes("all-pathway-lessons");
    assert.ok(
      !hasBulkSitemap,
      "Lesson detail page.tsx must not import full sitemap/universe modules. " +
        "Detail pages must load only the selected lesson, not the full catalog.",
    );
  });

  it("does not import blog generation utilities", () => {
    assert.ok(
      !detailSrc.includes("from \"@/lib/blog/"),
      "Lesson detail page.tsx must not import blog generation utilities.",
    );
  });
});
