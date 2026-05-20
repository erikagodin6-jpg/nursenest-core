/**
 * Contract: premium lesson hub layout convergence.
 * Guards the visual/structural requirements of the global hub upgrade:
 *   - Title format includes "Lesson Library"
 *   - Hero stat card and trust badge props wired in category-first-index
 *   - Category cards use per-category icons (getLessonHubSystemVisual)
 *   - No yellow/decorative block artifacts in marketing hub components
 *   - CSS classes for premium hub primitives present in the redesign stylesheet
 *   - LessonsPageShell exposes statCard and trustBadges props
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { resolveCssFile } from "@/lib/test-utils/resolve-css-imports";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const categoryFirstIndexPath = path.join(
  __dirname,
  "../../components/pathway-lessons/marketing-lessons-hub-category-first-index.tsx",
);
const lessonsPageShellPath = path.join(
  __dirname,
  "../../components/pathway-lessons/lessons-page-shell.tsx",
);
const premiumCssPath = path.join(__dirname, "../../app/premium-redesign-2026.css");
const hubCategoryPath = path.join(__dirname, "../lessons/marketing-lessons-hub-category.ts");

describe("LessonsPageShell premium props contract", () => {
  it("declares statCard prop with value and label shape", () => {
    const src = fs.readFileSync(lessonsPageShellPath, "utf8");
    assert.match(src, /statCard\?.*\{.*value.*string.*label.*string/s,
      "LessonsPageShell must declare statCard?: { value: string; label: string }");
  });

  it("declares trustBadges prop as string array", () => {
    const src = fs.readFileSync(lessonsPageShellPath, "utf8");
    assert.match(src, /trustBadges\?.*string\[\]/,
      "LessonsPageShell must declare trustBadges?: string[]");
  });

  it("renders stat card value and label when prop provided", () => {
    const src = fs.readFileSync(lessonsPageShellPath, "utf8");
    assert.match(src, /nn-lessons-hub-stat-card/, "must render stat card with nn-lessons-hub-stat-card class");
    assert.match(src, /statCard\.value/, "must render statCard.value");
    assert.match(src, /statCard\.label/, "must render statCard.label");
  });

  it("renders trust badges when prop provided", () => {
    const src = fs.readFileSync(lessonsPageShellPath, "utf8");
    assert.match(src, /nn-lessons-hub-trust-badge/, "must render trust badges with nn-lessons-hub-trust-badge class");
    assert.match(src, /trustBadges\.map/, "must map over trustBadges array");
  });
});

describe("MarketingLessonsHubCategoryFirstIndex layout contract", () => {
  it("title includes 'Lesson Library' — not bare 'Lessons'", () => {
    const src = fs.readFileSync(categoryFirstIndexPath, "utf8");
    assert.match(src, /Lesson Library/, "pageTitle must include 'Lesson Library'");
    assert.doesNotMatch(
      src,
      /formatTitleCase\("Lessons"\)/,
      "must not use bare formatTitleCase('Lessons') — use pathway-aware title",
    );
  });

  it("passes statCard prop to LessonsPageShell for catalog with lessons", () => {
    const src = fs.readFileSync(categoryFirstIndexPath, "utf8");
    assert.match(src, /statCard=\{/, "must pass statCard prop to LessonsPageShell");
    assert.match(src, /High-yield lessons/, "statCard label must mention 'High-yield lessons'");
  });

  it("passes trustBadges prop to LessonsPageShell", () => {
    const src = fs.readFileSync(categoryFirstIndexPath, "utf8");
    assert.match(src, /trustBadges=\{hubTrustBadges\}/, "must pass trustBadges to LessonsPageShell");
    assert.match(src, /hubTrustBadges/, "must define hubTrustBadges array");
  });

  it("imports and uses getLessonHubSystemVisual for category icons", () => {
    const src = fs.readFileSync(categoryFirstIndexPath, "utf8");
    assert.match(src, /getLessonHubSystemVisual/, "must import getLessonHubSystemVisual");
    assert.match(src, /visual\.icon/, "must destructure icon from visual");
    assert.match(src, /visual\.accentVar/, "must destructure accentVar from visual");
    assert.match(src, /nn-hub-cat-accent/, "must apply --nn-hub-cat-accent CSS variable");
  });

  it("renders open affordance on category tiles (H11)", () => {
    const tilePath = path.join(__dirname, "../../components/pathway-lessons/lessons-hub-category-tile.tsx");
    const src = fs.readFileSync(tilePath, "utf8");
    assert.match(src, /ArrowRight/, "category tiles must render ArrowRight open affordance");
  });

  it("renders category description when available", () => {
    const src = fs.readFileSync(categoryFirstIndexPath, "utf8");
    assert.match(src, /cat\.description/, "must render cat.description");
  });

  it("uses H11 layout markers on hub section and category tiles", () => {
    const src = fs.readFileSync(categoryFirstIndexPath, "utf8");
    assert.match(src, /data-nn-lessons-hub-layout="h11"/, "hub must declare H11 layout");
    assert.match(src, /LessonsHubCategoryTile/, "must render LessonsHubCategoryTile");
    const tilePath = path.join(__dirname, "../../components/pathway-lessons/lessons-hub-category-tile.tsx");
    const tileSrc = fs.readFileSync(tilePath, "utf8");
    assert.match(tileSrc, /nn-hub-category-tile/, "category tiles must use nn-hub-category-tile class");
  });

  it("has no yellow/decorative block artifacts in marketing hub markup", () => {
    const src = fs.readFileSync(categoryFirstIndexPath, "utf8");
    assert.doesNotMatch(src, /bg-yellow-\d/, "must have no Tailwind bg-yellow- classes in hub");
    assert.doesNotMatch(src, /bg-amber-[^5]/, "must have no bg-amber- (non-semantic) in hub");
  });
});

describe("MarketingHubCategoryDescriptor description contract", () => {
  it("type includes optional description field", () => {
    const src = fs.readFileSync(hubCategoryPath, "utf8");
    assert.match(
      src,
      /MarketingHubCategoryDescriptor[\s\S]{0,200}description\?:\s*string/,
      "MarketingHubCategoryDescriptor must include description?: string",
    );
  });

  it("pathwayMarketingHubCategories populates description from learning config", () => {
    const src = fs.readFileSync(hubCategoryPath, "utf8");
    assert.match(src, /description:\s*category\.description/, "must populate description from category.description");
  });
});

describe("Premium redesign CSS hub primitives", () => {
  it("defines nn-lessons-hub-stat-card styles", () => {
    const css = resolveCssFile(premiumCssPath);
    assert.match(css, /\.nn-lessons-hub-stat-card/, "must define .nn-lessons-hub-stat-card");
  });

  it("defines nn-lessons-hub-trust-badge styles", () => {
    const css = resolveCssFile(premiumCssPath);
    assert.match(css, /\.nn-lessons-hub-trust-badge/, "must define .nn-lessons-hub-trust-badge");
  });

  it("defines nn-hub-category-tile styles (H11 layout)", () => {
    const css = resolveCssFile(premiumCssPath);
    assert.match(css, /\.nn-hub-category-tile/, "must define .nn-hub-category-tile");
    assert.match(css, /\.nn-lessons-hub-layout-h11/, "must define .nn-lessons-hub-layout-h11");
  });

  it("defines theme-aware stat card backgrounds for Ocean, Blossom, Midnight", () => {
    const css = resolveCssFile(premiumCssPath);
    assert.match(css, /\[data-theme="ocean"\][\s\S]{0,80}nn-lessons-hub-stat-card/s);
    assert.match(css, /\[data-theme="blossom"\][\s\S]{0,200}nn-lessons-hub-stat-card/s);
    assert.match(css, /\[data-theme="midnight"\][\s\S]{0,200}nn-lessons-hub-stat-card/s);
  });

  it("defines theme-specific hero backgrounds for Ocean, Blossom, Midnight", () => {
    const css = resolveCssFile(premiumCssPath);
    assert.match(
      css,
      /html\[data-theme="ocean"\]\s+\.nn-premium-lessons-hub-hero/s,
      "must define Ocean-specific hero background",
    );
    assert.match(
      css,
      /html\[data-theme="blossom"\]\s+\.nn-premium-lessons-hub-hero/s,
      "must define Blossom-specific hero background",
    );
    assert.match(
      css,
      /html\[data-theme="midnight"\]\s+\.nn-premium-lessons-hub-hero/s,
      "must define Midnight-specific hero background",
    );
  });

  it("defines exam-critical and empty category card modifier classes", () => {
    const css = resolveCssFile(premiumCssPath);
    assert.match(css, /\.nn-hub-category-card--exam-critical/, "must define exam-critical modifier class");
    assert.match(css, /\.nn-hub-category-card--empty/, "must define empty modifier class");
  });

  it("defines nn-lessons-hub-lesson-row with transition and reduced-motion guard", () => {
    const css = resolveCssFile(premiumCssPath);
    assert.match(css, /\.nn-lessons-hub-lesson-row/, "must define .nn-lessons-hub-lesson-row");
    const reducedSection = css.match(/@media \(prefers-reduced-motion: reduce\)[\s\S]{0,400}nn-lessons-hub-lesson-row/);
    assert.ok(reducedSection, "must guard nn-lessons-hub-lesson-row with prefers-reduced-motion");
  });
});

describe("Category grid content hierarchy contract", () => {
  it("filters review_required from the public hub grid", () => {
    const src = fs.readFileSync(categoryFirstIndexPath, "utf8");
    assert.match(
      src,
      /categoryId === "review_required"/,
      "must explicitly filter review_required from category grid",
    );
    assert.match(src, /cat\.slug === "review-required"/, "must also filter review-required slug variants");
    assert.doesNotMatch(
      src,
      /data-nn-qa-lessons-review-required|Review Required/,
      "must not render a learner-facing Review Required hub block",
    );
  });

  it("filters zero-lesson categories from anonymous view", () => {
    const src = fs.readFileSync(categoryFirstIndexPath, "utf8");
    assert.match(src, /n > 0/, "must hide categories with zero lessons for anonymous visitors");
  });

  it("defines and uses EXAM_CRITICAL_CATEGORY_IDS for content hierarchy", () => {
    const src = fs.readFileSync(categoryFirstIndexPath, "utf8");
    assert.match(src, /EXAM_CRITICAL_CATEGORY_IDS/, "must define EXAM_CRITICAL_CATEGORY_IDS");
    assert.match(
      src,
      /EXAM_CRITICAL_CATEGORY_IDS\.has\(cat\.id\)/,
      "must check each category against exam-critical set",
    );
    const tilePath = path.join(__dirname, "../../components/pathway-lessons/lessons-hub-category-tile.tsx");
    const tileSrc = fs.readFileSync(tilePath, "utf8");
    assert.match(
      tileSrc,
      /nn-hub-category-card--exam-critical/,
      "must apply exam-critical class on category tiles",
    );
  });

  it("applies aria-disabled to empty category cards", () => {
    const tilePath = path.join(__dirname, "../../components/pathway-lessons/lessons-hub-category-tile.tsx");
    const tileSrc = fs.readFileSync(tilePath, "utf8");
    assert.match(tileSrc, /aria-disabled=\{isEmpty/, "must mark empty cards aria-disabled");
  });
});

describe("Category drill-down lesson rows contract", () => {
  const categoryLessonsSurfacePath = path.join(
    __dirname,
    "../../components/pathway-lessons/marketing-lessons-hub-category-lessons-surface.tsx",
  );

  it("uses H11 lesson row component in category drill-down", () => {
    const src = fs.readFileSync(categoryLessonsSurfacePath, "utf8");
    assert.match(src, /LessonsHubLessonRow/, "category surface must render LessonsHubLessonRow");
    assert.match(src, /data-nn-lessons-hub-layout="h11"/, "category surface must use H11 layout");
    const rowSrc = fs.readFileSync(
      path.join(__dirname, "../../components/pathway-lessons/lessons-hub-lesson-row.tsx"),
      "utf8",
    );
    assert.match(rowSrc, /nn-lessons-hub-lesson-row-h11/, "lesson row must include H11 class");
  });

  it("renders directional affordance on lesson rows", () => {
    const src = fs.readFileSync(categoryLessonsSurfacePath, "utf8");
    // inline SVG chevron or path d= for right-arrow
    assert.match(src, /m9 18 6-6-6-6|ChevronRight|chevron-right/, "lesson rows must include directional arrow affordance");
  });

  it("truncates long lesson titles cleanly", () => {
    const src = fs.readFileSync(categoryLessonsSurfacePath, "utf8");
    assert.match(src, /truncate/, "lesson label span must truncate overflow to prevent wrapping");
  });
});

describe("Capitalization contract — hub titles and labels", () => {
  it("category-first-index uses title-case 'Lesson Library' suffix", () => {
    const src = fs.readFileSync(categoryFirstIndexPath, "utf8");
    assert.match(src, /Lesson Library/, "hub title must include 'Lesson Library'");
    assert.doesNotMatch(src, /lesson library/, "hub title must not use all-lowercase 'lesson library'");
  });

  it("category-first-index uses 'High-yield lessons' (correct capitalisation) in stat card", () => {
    const src = fs.readFileSync(categoryFirstIndexPath, "utf8");
    assert.match(src, /High-yield lessons/, "stat card label must use 'High-yield lessons'");
    assert.doesNotMatch(
      src,
      /High-Yield Lessons/,
      "stat card label should NOT over-capitalize to 'High-Yield Lessons'",
    );
  });

  it("trust badges use sentence-case labels", () => {
    const src = fs.readFileSync(categoryFirstIndexPath, "utf8");
    assert.match(src, /Evidence-based content/, "first trust badge must be 'Evidence-based content'");
    assert.match(src, /Exam-focused/, "second trust badge must be 'Exam-focused'");
    assert.match(src, /Created by nurses/, "third trust badge must be 'Created by nurses'");
  });
});
