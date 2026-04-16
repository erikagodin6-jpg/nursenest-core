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
  it("next.config production headers include private no-cache no-store for /app routes", () => {
    const nextConfig = readFileSync(join(nursenestCoreRoot, "next.config.ts"), "utf8");
    assert.match(nextConfig, /private,\s*no-cache,\s*no-store,\s*must-revalidate/);
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

  it("subscriber gate resolves entitlements from DB via getUserAccess", () => {
    const gate = readFileSync(
      join(nursenestCoreRoot, "src", "lib", "entitlements", "require-subscriber-session.ts"),
      "utf8",
    );
    assert.match(gate, /getUserAccess/);
    assert.match(gate, /accessScopeFromUserAccess/);

    const resolve = readFileSync(join(nursenestCoreRoot, "src", "lib", "entitlements", "resolve-entitlement.ts"), "utf8");
    assert.match(resolve, /getUserAccess/);
  });

  it("production next.config does not blanket no-store all /api/* (allows /api/public edge cache); sets explicit /api/public policy", () => {
    const nextConfig = readFileSync(join(nursenestCoreRoot, "next.config.ts"), "utf8");
    assert.match(nextConfig, /do not set a blanket `no-store` on all `\/api\/\*`/);
    assert.match(nextConfig, /source:\s*"\/api\/public\/:path\*"/);
    assert.match(
      nextConfig,
      /public,\s*max-age=60,\s*s-maxage=120,\s*stale-while-revalidate=600/,
    );
    assert.match(nextConfig, /no blanket `\/api\/\*` Cache-Control rule/);
  });

  it("marketing pathway lesson server body gates teaching supplements with fullAccess (ExamTakeaways / memory / traps)", () => {
    const body = readFileSync(
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
        "pathway-lesson-detail-page-body.tsx",
      ),
      "utf8",
    );
    assert.match(body, /fullAccess\s*&&\s*lessonHasExamTakeaways/);
    assert.match(body, /fullAccess\s*&&\s*lesson\.memoryAnchor/);
    assert.match(body, /fullAccess\s*&&\s*lesson\.studyCommonTraps/);
  });

  it("marketing pathway lesson server body uses thin client/deferred helpers (no full record across boundaries)", () => {
    const body = readFileSync(
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
        "pathway-lesson-detail-page-body.tsx",
      ),
      "utf8",
    );
    assert.match(body, /toPathwayLessonDeferredServerSnapshot\(/);
    assert.match(body, /pickPathwayLessonMarketingRecordChipsSource\(/);
    assert.match(body, /<PathwayLessonQuickReview\s+quickReviewLines=/);
  });

  it("marketing pathway lesson page.tsx stays a thin shell (body owns paywall render tree)", () => {
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
    assert.match(page, /PathwayLessonDetailPageBody/);
    assert.match(page, /Subscriber-only supplements/);
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
