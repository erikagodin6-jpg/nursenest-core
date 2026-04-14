/**
 * Regression: paywall / SEO / cache invariants are encoded in config and access helpers.
 * Does not hit network or Next runtime — reads source files and pure functions only.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import { visibleSectionsForLesson } from "@/lib/lessons/pathway-lesson-visible-sections";
import { buildQuickReviewBullets } from "@/lib/lessons/pathway-lesson-quick-review";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";

const here = dirname(fileURLToPath(import.meta.url));
const nursenestCoreRoot = join(here, "..", "..", "..");

describe("paywall surface policy (static checks)", () => {
  it("next.config production headers include private no-store for /app routes", () => {
    const nextConfig = readFileSync(join(nursenestCoreRoot, "next.config.ts"), "utf8");
    assert.match(nextConfig, /private,\s*no-store,\s*must-revalidate/);
    assert.match(nextConfig, /["']\/app["']/);
    assert.match(nextConfig, /["']\/app\/:path\*["']/);
  });

  it("learner app layout sets robots noindex for /app segment", () => {
    const layout = readFileSync(
      join(nursenestCoreRoot, "src", "app", "(student)", "app", "layout.tsx"),
      "utf8",
    );
    assert.match(layout, /robots:\s*\{\s*index:\s*false/);
    assert.match(layout, /follow:\s*false/);
  });

  it("core lesson/question APIs require session at the top of the handler", () => {
    const lessons = readFileSync(join(nursenestCoreRoot, "src", "app", "api", "lessons", "route.ts"), "utf8");
    assert.match(lessons, /if\s*\(\s*!userId\s*\)/);
    assert.match(lessons, /401/);
    const questions = readFileSync(join(nursenestCoreRoot, "src", "app", "api", "questions", "[id]", "route.ts"), "utf8");
    assert.match(questions, /if\s*\(\s*!userId\s*\)/);
    assert.match(questions, /401/);
    const pt = readFileSync(join(nursenestCoreRoot, "src", "app", "api", "practice-tests", "route.ts"), "utf8");
    assert.match(pt, /requireSubscriberSession/);
  });

  it("marketing pathway lesson page gates teaching supplements with fullAccess (ExamTakeaways / memory / traps)", () => {
    const page = readFileSync(
      join(
        nursenestCoreRoot,
        "src",
        "app",
        "(marketing)",
        "(default)",
        "[locale]",
        "[slug]",
        "[examCode]",
        "lessons",
        "[lessonSlug]",
        "page.tsx",
      ),
      "utf8",
    );
    assert.match(page, /fullAccess\s*&&\s*lessonHasExamTakeaways/);
    assert.match(page, /fullAccess\s*&&\s*lesson\.memoryAnchor/);
    assert.match(page, /fullAccess\s*&&\s*lesson\.studyCommonTraps/);
  });
});

describe("locked marketing preview record shape", () => {
  it("visibleSectionsForLesson + previewLesson keeps quick review within visible sections only", () => {
    const sections = Array.from({ length: 4 }, (_, i) => ({
      id: `s${i}`,
      heading: `H${i}`,
      kind: "clinical_meaning" as const,
      body: `SECRET-BODY-${i}`,
    }));
    const lesson: PathwayLessonRecord = {
      slug: "slug",
      title: "Title",
      topic: "tp",
      topicSlug: "tp",
      bodySystem: "G",
      previewSectionCount: 1,
      seoTitle: "seo",
      seoDescription: "d",
      sections,
    };
    const visible = visibleSectionsForLesson(lesson, false);
    const previewLesson: PathwayLessonRecord = { ...lesson, sections: visible };
    const bullets = buildQuickReviewBullets(previewLesson);
    assert.ok(bullets.every((b) => !b.includes("SECRET-BODY-1")));
    assert.ok(bullets.some((b) => b.includes("SECRET-BODY-0")));
  });
});
