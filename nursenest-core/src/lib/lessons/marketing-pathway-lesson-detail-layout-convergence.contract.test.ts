/**
 * Marketing pathway lesson detail must inherit the same premium hub shell as lesson index routes.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const detailBodyPath = path.join(
  __dirname,
  "../../app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/[lessonSlug]/pathway-lesson-detail-page-body.tsx",
);
const loadingFallbackPath = path.join(
  __dirname,
  "../../components/lessons/pathway-lesson-detail-loading-fallback.tsx",
);
const lessonsShellPath = path.join(
  __dirname,
  "../../components/pathway-lessons/lessons-page-shell.tsx",
);
const readingV2Path = path.join(__dirname, "premium-lesson-reading-v2.ts");

describe("marketing pathway lesson detail layout convergence", () => {
  it("detail body uses LessonsPageShell premium hub wrapper", () => {
    const src = fs.readFileSync(detailBodyPath, "utf8");
    assert.match(src, /<LessonsPageShell/, "detail page must render LessonsPageShell");
    assert.match(src, /omitHeroBand/, "detail shell must omit duplicate hub H1");
    assert.match(
      fs.readFileSync(lessonsShellPath, "utf8"),
      /data-premium-layout-version/,
      "LessonsPageShell must expose premium layout version marker",
    );
    assert.doesNotMatch(
      src,
      /max-w-\[100rem\]/,
      "detail page must not use legacy 100rem outer wrapper",
    );
  });

  it("detail body wires unified study chrome and bottom nav", () => {
    const src = fs.readFileSync(detailBodyPath, "utf8");
    assert.match(src, /MarketingPathwayLessonHubStudyChrome/, "must render hub study chrome");
    assert.match(src, /buildMarketingLessonHubSurfaceChips/, "must build shared surface chips");
    assert.match(src, /<StudyBottomNav[\s\S]*compact/, "must render compact StudyBottomNav");
    assert.match(src, /BreadcrumbsFromResolution/, "must keep breadcrumb resolution + JSON-LD path");
  });

  it("loading fallback matches LessonsPageShell", () => {
    const src = fs.readFileSync(loadingFallbackPath, "utf8");
    assert.match(src, /<LessonsPageShell/, "loading fallback must use LessonsPageShell");
    assert.match(src, /omitHeroBand/, "loading fallback must omit hero band");
  });

  it("LessonsPageShell supports omitHeroBand for lesson detail", () => {
    const src = fs.readFileSync(lessonsShellPath, "utf8");
    assert.match(src, /omitHeroBand\?:/, "shell must declare omitHeroBand");
  });

  it("allied pathways use premium reading v2 layout", () => {
    const src = fs.readFileSync(readingV2Path, "utf8");
    assert.match(src, /roleTrack === "allied"/, "allied roleTrack must enable reading v2");
  });
});
