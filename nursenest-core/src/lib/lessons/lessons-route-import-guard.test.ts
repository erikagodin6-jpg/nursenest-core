/**
 * Regression: `/app/(learner)/lessons` route tree must not pull flashcard banks, raw catalog sync,
 * admin tooling, or sitemap generators into the default server chunk.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const __dirname = dirname(fileURLToPath(import.meta.url));
const LESSONS_APP_ROOT = join(__dirname, "..", "..", "app", "(student)", "app", "(learner)", "lessons");

const FORBIDDEN_SUBSTRINGS = [
  '@/lib/flashcards/',
  "@/lib/flashcards/",
  "from \"@/lib/lessons/pathway-lesson-catalog-sync\"",
  "from '@/lib/lessons/pathway-lesson-catalog-sync'",
  '@/scripts/',
  "@/scripts/",
  "generateSitemap",
  "generateStaticParams",
  "(admin)/admin",
  "@/app/(admin)",
] as const;

describe("lessons route import guard (app learner lessons tree)", () => {
  it("tsx route files avoid heavy or cross-surface imports", () => {
    const files = ["page.tsx", join("[id]", "page.tsx"), "layout.tsx", "error.tsx", join("[id]", "error.tsx"), join("[id]", "loading.tsx")];
    for (const rel of files) {
      const abs = join(LESSONS_APP_ROOT, rel);
      let src: string;
      try {
        src = readFileSync(abs, "utf8");
      } catch {
        continue;
      }
      for (const bad of FORBIDDEN_SUBSTRINGS) {
        assert.ok(
          !src.includes(bad),
          `${rel} must not import ${bad} (keep lessons hub/detail lean; use pathway-lesson-loader / row resolvers instead)`,
        );
      }
    }
  });
});
