import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

import { buildPathwayLessonSystemSections } from "@/lib/lessons/pathway-lesson-body-system-groups";
import { canonicalHubLessonDisplayTitle } from "@/lib/lessons/pathway-lesson-hub-organize";
import { getCatalogPathwayLessonsSync } from "@/lib/lessons/pathway-lesson-catalog-sync";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";
import {
  buildNursingTierHubContent,
} from "@/lib/marketing/nursing-tier-hub-content";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import { loadEnglishMarketingChromeShardMerge, MARKETING_PAGES_HOME_HERO_REQUIRED_KEYS } from "@/lib/marketing/marketing-build-time-chrome-validation";
import { MARKETING_HERO_NAV_CRITICAL_KEYS } from "@/lib/marketing/marketing-hero-nav-critical-keys";
import { resolveMarketingDisplayCopy, resolvePublicLessonTitle } from "@/lib/public-display-copy";

const pkgRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const pagesEn = JSON.parse(fs.readFileSync(path.join(pkgRoot, "public/i18n/en/pages.json"), "utf8")) as Record<string, string>;

function row(partial: Partial<PathwayLessonRecord>): PathwayLessonRecord {
  return {
    slug: partial.slug ?? "sample-lesson",
    title: partial.title ?? "Sample Lesson",
    topic: partial.topic ?? "Cardiovascular",
    topicSlug: partial.topicSlug ?? "cardiovascular",
    bodySystem: partial.bodySystem ?? "cardiovascular",
    previewSectionCount: partial.previewSectionCount ?? 5,
    seoTitle: partial.seoTitle ?? partial.title ?? "Sample Lesson | NurseNest",
    seoDescription: partial.seoDescription ?? "Sample lesson.",
    sections: partial.sections ?? [],
    ...partial,
  };
}

function assertNoRawOrPlaceholder(label: string, value: string): void {
  assert.doesNotMatch(value, /^(?:pages|nav|footer|components|learner)\./, label);
  assert.doesNotMatch(value, /\b(?:missing key|placeholder|todo)\b/i, label);
}

describe("public display copy resolvers", () => {
  it("CABG uses the curated catalog title, not the generated SEO title", () => {
    const lesson = getCatalogPathwayLessonsSync("us-rn-nclex-rn").find(
      (l) => l.slug === "cabg-and-postoperative-cabg-complications-nclex-rn",
    );
    assert.ok(lesson, "expected CABG lesson in US RN catalog");
    assert.equal(resolvePublicLessonTitle({ curatedTitle: lesson.title, generatedTitle: lesson.seoTitle, slug: lesson.slug }), "CABG");
    assert.equal(canonicalHubLessonDisplayTitle(lesson), "CABG");
    assert.notEqual(canonicalHubLessonDisplayTitle(lesson), "CABG Post-Op Complications");
  });

  it("canonicalHubLessonDisplayTitle prefers bundled catalog over regressed lesson.title when pathwayId is set", () => {
    const regressed = row({
      slug: "cabg-and-postoperative-cabg-complications-nclex-rn",
      title: "CABG and Postoperative CABG Complications",
      seoTitle: "CABG | NCLEX-RN Canada lesson",
    });
    assert.equal(canonicalHubLessonDisplayTitle(regressed, "us-rn-nclex-rn"), "CABG");
  });

  it("lesson cards keep curated titles ahead of slug-humanized fallback", () => {
    assert.equal(
      resolvePublicLessonTitle({
        curatedTitle: "ABG",
        generatedTitle: "ABG Interpretation Basics | NurseNest",
        slug: "abg-interpretation-basics",
      }),
      "ABG",
    );
  });

  it("RN, PN/RPN, and NP lesson hubs do not emit placeholder-like section headers", () => {
    for (const pathwayId of ["us-rn-nclex-rn", "ca-rpn-rex-pn", "us-np-fnp"]) {
      const sections = buildPathwayLessonSystemSections(
        [row({ slug: `${pathwayId}-safety`, title: "Clinical Judgment", bodySystem: "patient_safety_quality" })],
        pathwayId,
      );
      assert.ok(sections.length > 0, `expected section for ${pathwayId}`);
      for (const section of sections) {
        assertNoRawOrPlaceholder(`${pathwayId}:${section.id}`, section.label);
      }
    }
  });

  it("nursing tier hub cards resolve visible labels without raw keys", () => {
    for (const pathwayId of ["us-rn-nclex-rn", "ca-rpn-rex-pn", "us-np-fnp"]) {
      const pathway = getExamPathwayById(pathwayId);
      assert.ok(pathway, `missing pathway ${pathwayId}`);
      const content = buildNursingTierHubContent(pathway);
      assertNoRawOrPlaceholder(`${pathwayId}:title`, content.title);
      for (const action of content.actions) {
        assertNoRawOrPlaceholder(`${pathwayId}:${action.id}`, action.label);
      }
    }
  });

  it("header/nav critical labels and homepage/pricing titles do not show raw i18n keys", () => {
    const chrome = loadEnglishMarketingChromeShardMerge();
    for (const key of MARKETING_HERO_NAV_CRITICAL_KEYS) {
      assertNoRawOrPlaceholder(key, resolveMarketingDisplayCopy({ key, messages: chrome }));
    }
    for (const key of [...MARKETING_PAGES_HOME_HERO_REQUIRED_KEYS, "pages.home.metaTitle", "pages.pricing.title"]) {
      assertNoRawOrPlaceholder(key, resolveMarketingDisplayCopy({ key, messages: pagesEn }));
    }
  });
});
