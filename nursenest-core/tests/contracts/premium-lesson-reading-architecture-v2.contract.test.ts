/**
 * Static guard for the canonical premium lesson reading architecture.
 *
 * Run from `nursenest-core/`:
 *   node --import tsx --test tests/contracts/premium-lesson-reading-architecture-v2.contract.test.ts
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

const ROOT = process.cwd();
const MARKETING_DETAIL_PATH = path.resolve(
  ROOT,
  "src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/[lessonSlug]/pathway-lesson-detail-page-body.tsx",
);
const LEARNER_DETAIL_PATH = path.resolve(
  ROOT,
  "src/app/(student)/app/(learner)/lessons/[id]/page.tsx",
);
const SECTION_NAV_PATH = path.resolve(
  ROOT,
  "src/components/lessons/lesson-section-nav.tsx",
);
const READING_VIEWPORT_PATH = path.resolve(
  ROOT,
  "src/components/lessons/lesson-reading-viewport.tsx",
);
const PROGRESS_RAIL_PATH = path.resolve(
  ROOT,
  "src/components/lessons/lesson-compact-progress-rail.tsx",
);
const SECTION_CARD_PATH = path.resolve(
  ROOT,
  "src/components/lessons/lesson-section-card.tsx",
);
const STICKY_DOCK_PATH = path.resolve(
  ROOT,
  "src/components/lessons/lesson-sticky-review-dock.tsx",
);
const RETENTION_HELPER_PATH = path.resolve(
  ROOT,
  "src/lib/lessons/lesson-retention-section.ts",
);
const MARKETING_CSS_PATH = path.resolve(
  ROOT,
  "src/app/styles/marketing/lesson-readability-hotfix.css",
);
const LEARNER_CSS_PATH = path.resolve(
  ROOT,
  "src/app/styles/learner/learner-global.css",
);

function read(filePath: string): string {
  return fs.readFileSync(filePath, "utf8");
}

function assertOrdered(
  source: string,
  firstNeedle: string,
  secondNeedle: string,
  label: string,
) {
  const first = source.indexOf(firstNeedle);
  const second = source.indexOf(secondNeedle);
  assert.ok(first >= 0, `${label}: missing ${firstNeedle}`);
  assert.ok(second >= 0, `${label}: missing ${secondNeedle}`);
  assert.ok(
    first < second,
    `${label}: expected ${firstNeedle} before ${secondNeedle}`,
  );
}

describe("premium lesson reading architecture v2", () => {
  const marketingDetail = read(MARKETING_DETAIL_PATH);
  const learnerDetail = read(LEARNER_DETAIL_PATH);
  const sectionNav = read(SECTION_NAV_PATH);
  const readingViewport = read(READING_VIEWPORT_PATH);
  const progressRail = read(PROGRESS_RAIL_PATH);
  const sectionCard = read(SECTION_CARD_PATH);
  const stickyDock = read(STICKY_DOCK_PATH);
  const retentionHelper = read(RETENTION_HELPER_PATH);
  const marketingCss = read(MARKETING_CSS_PATH);
  const learnerCss = read(LEARNER_CSS_PATH);

  it("ships on both live lesson detail surfaces instead of hiding behind unused code", () => {
    for (const [label, source] of [
      ["marketing", marketingDetail],
      ["learner", learnerDetail],
    ] as const) {
      assert.match(
        source,
        /className="nn-lesson-layout nn-lesson-layout--premium-reading/,
        `${label} reading layout missing`,
      );
      assert.match(
        source,
        /<LessonReadingViewport/,
        `${label} reading viewport mount missing`,
      );
      assert.match(
        source,
        /<LessonStickyReviewDock/,
        `${label} sticky review dock missing`,
      );
      assert.match(
        source,
        /id="lesson-retention-review"/,
        `${label} bottom review zone missing`,
      );
      assert.match(
        source,
        /isLessonRetentionSectionKind/,
        `${label} retention section split missing`,
      );
      assert.equal(
        source.includes("PathwayLessonStudyRail"),
        false,
        `${label} must not render side study rail`,
      );
      assert.equal(
        source.includes("PathwayLessonDeferredRelatedRail"),
        false,
        `${label} must not render side related rail`,
      );
      assert.equal(
        source.includes("nn-lesson-layout--triple"),
        false,
        `${label} must not use old triple layout`,
      );
    }
  });

  it("keeps learning content first and moves retention support to the bottom", () => {
    assertOrdered(
      marketingDetail,
      "<LessonSectionCard",
      'id="lesson-retention-review"',
      "marketing detail",
    );
    assertOrdered(
      marketingDetail,
      'id="lesson-retention-review"',
      "<PathwayLessonMemoryAnchorStrip",
      "marketing detail",
    );
    assertOrdered(
      marketingDetail,
      'id="lesson-retention-review"',
      "<PathwayLessonCommonTrapsStrip",
      "marketing detail",
    );
    assertOrdered(
      marketingDetail,
      'id="lesson-retention-review"',
      "<ExamTakeawaysBlock",
      "marketing detail",
    );
    assertOrdered(
      learnerDetail,
      "<LessonSectionCard",
      'id="lesson-retention-review"',
      "learner detail",
    );
    assertOrdered(
      learnerDetail,
      'id="lesson-retention-review"',
      "<PathwayLessonMemoryAnchorStrip",
      "learner detail",
    );
    assertOrdered(
      learnerDetail,
      'id="lesson-retention-review"',
      "<PathwayLessonCommonTrapsStrip",
      "learner detail",
    );
    assertOrdered(
      learnerDetail,
      'id="lesson-retention-review"',
      "<ExamTakeawaysBlock",
      "learner detail",
    );
    assert.match(retentionHelper, /clinical_pearls/);
    assert.match(retentionHelper, /red_flags/);
    assert.match(retentionHelper, /exam_tips/);
  });

  it("uses a reading-first viewport with constrained side rails", () => {
    assert.match(readingViewport, /nn-lesson-reading-viewport/);
    assert.match(readingViewport, /LessonCompactProgressRail/);
    assert.match(readingViewport, /layout="rail"/);
    assert.match(sectionNav, /data-nn-premium-horizontal-lesson-nav/);
    assert.match(sectionNav, /nn-lesson-section-nav--horizontal/);
    assert.match(sectionNav, /nn-lesson-section-nav--rail/);
    assert.match(progressRail, /nn-lesson-progress-rail/);
    assert.equal(sectionNav.includes("<aside"), false);
    for (const [label, css] of [
      ["marketing", marketingCss],
      ["learner", learnerCss],
    ] as const) {
      assert.match(css, /\.nn-lesson-reading-viewport/, `${label} reading viewport grid missing`);
      assert.match(
        css,
        /grid-template-columns:\s*minmax\(10\.5rem,\s*15rem\)\s*minmax\(0,\s*1fr\)\s*minmax\(10\.5rem,\s*13\.75rem\)/,
        `${label} constrained side-rail grid missing`,
      );
      assert.match(css, /max-width:\s*15rem/, `${label} left rail width cap missing`);
      assert.match(css, /max-width:\s*13\.75rem/, `${label} right rail width cap missing`);
    }
  });

  it("adds the canonical recognize interpret act workflow module without inventing clinical copy", () => {
    assert.match(sectionCard, /lessonSectionUsesClinicalWorkflow/);
    assert.match(sectionCard, />Recognize</);
    assert.match(sectionCard, />Interpret</);
    assert.match(sectionCard, />Act</);
  });

  it("keeps the reading layer theme-token driven across public and learner CSS", () => {
    for (const [label, css] of [
      ["marketing", marketingCss],
      ["learner", learnerCss],
    ] as const) {
      assert.match(
        css,
        /--nn-lesson-reader-max:\s*88ch/,
        `${label} reading width token missing`,
      );
      assert.match(
        css,
        /--nn-lesson-reader-wide:\s*112ch/,
        `${label} wide reading token missing`,
      );
      assert.match(
        css,
        /var\(--semantic-surface\)/,
        `${label} surface token missing`,
      );
      assert.match(
        css,
        /var\(--semantic-text-primary\)/,
        `${label} primary text token missing`,
      );
      assert.match(
        css,
        /var\(--semantic-text-secondary\)/,
        `${label} secondary text token missing`,
      );
      assert.match(
        css,
        /var\(--semantic-border-soft\)/,
        `${label} border token missing`,
      );
      assert.match(
        css,
        /color-mix\(in srgb, var\(--semantic-panel-warm\)/,
        `${label} warm theme mix missing`,
      );
      assert.match(
        css,
        /prefers-reduced-motion:\s*reduce/,
        `${label} reduced motion guard missing`,
      );
      assert.match(
        css,
        /backdrop-filter:\s*blur/,
        `${label} nav glass treatment missing`,
      );
    }
  });

  it("keeps RN lessons on the wide colored-section reading canvas with modular section cards", () => {
    assert.match(marketingDetail, /nn-lesson-page-shell--rn/);
    assert.match(learnerDetail, /nn-lesson-page-shell--rn/);
    for (const [label, css] of [
      ["marketing", marketingCss],
      ["learner", learnerCss],
    ] as const) {
      assert.match(css, /--nn-rn-lesson-canvas-wide:\s*min\(100%,\s*87\.5rem\)/, `${label} RN canvas width missing`);
      assert.match(css, /\.nn-premium-lesson-detail-shell\.nn-lesson-page-shell--rn/, `${label} RN shell selector missing`);
      assert.match(css, /border-left:\s*4px solid color-mix\(in srgb, var\(--lsc-color\)/, `${label} colored section accent missing`);
      assert.match(css, /max-width:\s*96ch/, `${label} RN readable prose width missing`);
    }
  });

  it("reveals the sticky review dock only after the learner is deep into the lesson", () => {
    assert.match(stickyDock, /ratio > 0\.62/);
    assert.match(stickyDock, /requestAnimationFrame/);
    assert.match(stickyDock, /data-visible/);
    assert.match(stickyDock, /#\$\{targetId\}/);
  });
});
