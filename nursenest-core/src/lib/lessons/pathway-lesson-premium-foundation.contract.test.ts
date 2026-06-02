import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const here = dirname(fileURLToPath(import.meta.url));
const coreRoot = join(here, "..", "..");

const MARKETING_DETAIL_PATH = join(
  coreRoot,
  "app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/[lessonSlug]/pathway-lesson-detail-page-body.tsx",
);
const LEARNER_DETAIL_PATH = join(
  coreRoot,
  "app/(app)/app/(learner)/lessons/[id]/page.tsx",
);

function read(path: string) {
  return readFileSync(path, "utf8");
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

function assertRendersAfter(
  source: string,
  firstNeedle: string,
  secondNeedle: string,
  label: string,
) {
  const first = source.indexOf(firstNeedle);
  assert.ok(first >= 0, `${label}: missing ${firstNeedle}`);
  const second = source.indexOf(secondNeedle, first + firstNeedle.length);
  assert.ok(
    second >= 0,
    `${label}: expected ${secondNeedle} after ${firstNeedle}`,
  );
}

describe("Phase 1 lesson premium foundation", () => {
  it("marketing lesson detail uses the premium reading layout with horizontal nav and bottom review", () => {
    const source = read(MARKETING_DETAIL_PATH);

    assert.match(
      source,
      /<LessonStudyPhaseProgress[\s\S]*persisted=\{Boolean\(userId\) && fullAccess\}/,
    );
    assert.match(
      source,
      /<LessonSectionNav[\s\S]*progressVisible=\{Boolean\(userId\) && fullAccess\}/,
    );
    assert.match(
      source,
      /className="nn-lesson-layout nn-lesson-layout--premium-reading/,
    );
    assert.match(source, /id="lesson-retention-review"/);
    assert.match(source, /<LessonStickyReviewDock enabled=\{fullAccess\}/);
    assert.equal(source.includes("PathwayLessonStudyRail"), false);
    assert.equal(source.includes('aria-label="Lesson utilities"'), false);

    assertOrdered(
      source,
      "<LessonSectionNav",
      'data-testid="pathway-lesson-main-column"',
      "marketing detail",
    );
    assertOrdered(
      source,
      "<LessonSectionCard",
      'id="lesson-retention-review"',
      "marketing detail",
    );
    assertOrdered(
      source,
      'id="lesson-retention-review"',
      "<PathwayLessonQuickClinicalSummary",
      "marketing detail",
    );
    assertOrdered(
      source,
      "<PathwayLessonQuickClinicalSummary",
      "<PathwayLessonActions",
      "marketing detail",
    );
    assertOrdered(
      source,
      "<PathwayLessonQuickClinicalSummary",
      "<PathwayLessonDetailDeferred",
      "marketing detail",
    );

    assert.match(source, /label="Edit this pathway lesson"/);
    assert.match(source, /buildAdminPathwayLessonStableEditHref/);
  });

  it("learner lesson detail uses the same foundation and keeps persisted progress entitlement-gated", () => {
    const source = read(LEARNER_DETAIL_PATH);

    assert.match(
      source,
      /<LessonStudyPhaseProgress[\s\S]*persisted=\{Boolean\(userId\) && entitlement\.hasAccess\}/,
    );
    assert.match(
      source,
      /<LessonSectionNav[\s\S]*progressVisible=\{Boolean\(userId\) && entitlement\.hasAccess\}/,
    );
    assert.match(
      source,
      /className="nn-lesson-layout nn-lesson-layout--premium-reading"/,
    );
    assert.match(source, /id="lesson-retention-review"/);
    assert.match(
      source,
      /<LessonStickyReviewDock enabled=\{entitlement\.hasAccess\}/,
    );
    assert.equal(source.includes("PathwayLessonStudyRail"), false);
    assert.equal(source.includes('aria-label="Lesson utilities"'), false);

    assertOrdered(
      source,
      "<LessonSectionNav",
      'data-testid="pathway-lesson-main-column"',
      "learner detail",
    );
    assertRendersAfter(
      source,
      "<PathwayLessonQuickClinicalSummary",
      "<LessonNavButtons",
      "learner detail",
    );

    assert.match(source, /label="Edit this pathway lesson"/);
    assert.match(source, /buildAdminPathwayLessonStableEditHref/);
  });
});
