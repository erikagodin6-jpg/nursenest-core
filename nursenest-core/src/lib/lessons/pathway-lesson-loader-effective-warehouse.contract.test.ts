/**
 * Regression: marketing lesson detail + hub verify must consult the same dominant DB warehouse locale
 * as hub list SQL (`effectiveLocaleForPathwayLessonDbRows`) when canonical EN / overlay rows miss.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

test("getPathwayLessonImpl includes effective warehouse locale fallback after overlay branch", () => {
  const loaderPath = join(__dirname, "pathway-lesson-loader.ts");
  const src = readFileSync(loaderPath, "utf8");
  assert.ok(
    src.includes("lesson_detail_effective_warehouse_row"),
    "must log when resolving via dominant warehouse locale",
  );
  assert.ok(
    /getPathwayLessonListWarehouseLocaleForHub\(pathwayId, overlayLocale\)|effectiveLocaleForPathwayLessonDbRows\(pathwayId, overlayLocale\)/.test(
      src,
    ),
    "must reuse hub list warehouse picker for per-slug hydration",
  );
});

test("hub hot paths memoize locale groupBy, pathway DB presence, and overlay bundle (React cache)", () => {
  const loaderPath = join(__dirname, "pathway-lesson-loader.ts");
  const src = readFileSync(loaderPath, "utf8");
  assert.match(
    src,
    /effectiveLocaleForPathwayLessonDbRows\s*=\s*cache\(|getPathwayLessonListWarehouseLocaleForHub/,
    "warehouse locale groupBy must not run once per verified slug",
  );
  assert.match(
    src,
    /pathwayHasPublishedDbLessons\s*=\s*cache\(/,
    "pathway DB presence probe must not run once per verified slug",
  );
  assert.match(
    src,
    /fetchPublishedLessonOverlaysForMarketingLocale\s*=\s*cache\(/,
    "locale overlay bundle must not reload once per verified slug",
  );
});
