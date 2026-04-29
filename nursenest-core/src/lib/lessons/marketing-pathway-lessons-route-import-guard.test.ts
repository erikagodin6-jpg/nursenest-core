/**
 * Marketing pathway lesson hub/detail routes must not import pathway-lesson-catalog-sync directly.
 * Full-catalog entrypoints belong in loaders and catalog modules so route chunks stay lean and
 * refactors cannot accidentally pull full merges into RSC entry graphs.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MARKETING_LESSONS_ROOT = join(
  __dirname,
  "..",
  "..",
  "app",
  "(marketing)",
  "(default)",
  "[locale]",
  "[slug]",
  "[examCode]",
  "lessons",
);

const FORBIDDEN_SUBSTRINGS = [
  'from "@/lib/lessons/pathway-lesson-catalog-sync"',
  "from '@/lib/lessons/pathway-lesson-catalog-sync'",
] as const;

describe("marketing pathway lessons route import guard", () => {
  it("hub and lesson page modules do not import pathway-lesson-catalog-sync directly", () => {
    const files = ["page.tsx", join("[lessonSlug]", "page.tsx"), join("topics", "[topicSlug]", "page.tsx")];
    for (const rel of files) {
      const abs = join(MARKETING_LESSONS_ROOT, rel);
      let src: string;
      try {
        src = readFileSync(abs, "utf8");
      } catch {
        continue;
      }
      for (const bad of FORBIDDEN_SUBSTRINGS) {
        assert.ok(
          !src.includes(bad),
          `${rel} must not ${bad} — use pathway-lesson-loader / marketing-lessons-hub-category / summary index APIs`,
        );
      }
    }
  });
});
