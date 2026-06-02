/**
 * Anonymous-safe regressions for marketing pathway lesson detail (reading shell).
 *
 * Run: `node --import tsx --test src/lib/marketing/public-lesson-detail-marketing.contract.test.tsx`
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MarketingI18nProvider } from "@/components/i18n/marketing-i18n-provider";
import { LessonReadingScrollProgress } from "@/components/lessons/lesson-reading-scroll-progress";
import { LessonSectionNav } from "@/components/lessons/lesson-section-nav";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DETAIL_BODY = path.resolve(
  __dirname,
  "../../app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/[lessonSlug]/pathway-lesson-detail-page-body.tsx",
);
const LESSON_NAV = path.resolve(__dirname, "../../components/lessons/lesson-section-nav.tsx");

const BLOCKLIST_VISIBLE = [
  "placeholder",
  "Header",
  "Label",
  "Value",
  "Metric",
  "Description",
  "Preview Label",
  "BPM Label",
  "HR Label",
  "Rhythm Label",
  "debug",
  "inventory",
  "source of truth",
  "audit",
  "internal",
  "CAT pool",
  "linked learning signal",
  "unpublished",
  "coming soon",
] as const;

/** Matches standalone i18n-style keys if they leak as visible text (domain.name.segment). */
const RAW_I18N_KEY = /^[a-z][a-zA-Z0-9]*(\.[a-zA-Z0-9_]+){2,}$/;

const NAV_MESSAGES: Record<string, string> = {
  "learner.lessons.nav.contentsLabel": "Contents",
  "learner.lessons.nav.ariaSectionsNav": "Lesson sections navigation",
  "learner.lessons.nav.onThisPage": "On this page",
  "learner.lessons.nav.sectionsCount": "{count} sections",
  "learner.lessons.nav.progressLocal": "Sign in to track",
  "learner.lessons.nav.jumpTop": "Jump to top",
  "learner.lessons.nav.jumpReview": "Jump to review",
  "learner.lessons.nav.ariaJumpControls": "Jump controls",
};

function stripTagsForSmoke(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function tokensFromVisible(html: string): string[] {
  const t = stripTagsForSmoke(html);
  return t.split(/[\s|,.;:!?()[\]{}]+/).filter(Boolean);
}

describe("public lesson detail — marketing contract", () => {
  it("scroll progress exposes stable selector for reading depth", () => {
    const html = renderToStaticMarkup(<LessonReadingScrollProgress />);
    assert.match(html, /data-nn-lesson-progress=/);
    assert.match(html, /data-nn-lesson-progress-fill/);
    assert.match(html, /role="progressbar"/);
  });

  it("TOC landmarks distinguish desktop rail vs mobile drawer", () => {
    const html = renderToStaticMarkup(
      <MarketingI18nProvider locale="en" messages={NAV_MESSAGES}>
        <LessonSectionNav
          sections={[
            { id: "sec-a", heading: "Introduction", kind: "intro" },
            { id: "sec-b", heading: "Clinical pearls", kind: "clinical_pearls" },
          ]}
          progress="in_progress"
          progressVisible
        />
      </MarketingI18nProvider>,
    );
    assert.match(html, /data-nn-lesson-toc-mobile/);
    assert.match(html, /data-nn-lesson-toc-desktop/);
    const visible = stripTagsForSmoke(html);
    for (const token of BLOCKLIST_VISIBLE) {
      assert.equal(
        visible.includes(token.toLowerCase()),
        false,
        `unexpected visible token "${token}"`,
      );
    }
    const words = tokensFromVisible(html);
    for (const w of words) {
      assert.equal(RAW_I18N_KEY.test(w), false, `unexpected raw key-like token in nav markup: ${w}`);
    }
  });

  it("lesson detail route orders TOC before article column (TOC not nested in article)", () => {
    const src = fs.readFileSync(DETAIL_BODY, "utf8");
    const navIdx = src.indexOf("<LessonSectionNav");
    const articleIdx = src.indexOf("data-nn-lesson-article");
    assert.ok(navIdx > 0 && articleIdx > 0);
    assert.ok(navIdx < articleIdx, "LessonSectionNav should appear before the article landmark in source order");
    assert.equal(src.includes("<article"), true);
    assert.equal(/<article[^>]*>[\s\S]*nn-lesson-section-nav/.test(src), false);
  });

  it("lesson detail + nav sources avoid restored arch graphic markers", () => {
    const body = fs.readFileSync(DETAIL_BODY, "utf8");
    const nav = fs.readFileSync(LESSON_NAV, "utf8");
    for (const src of [body, nav]) {
      assert.equal(src.includes("nn-arch"), false);
      assert.equal(src.toLowerCase().includes("archgraphic"), false);
    }
  });

  it("reading progress render leaves no raw i18n key tokens as visible strings", () => {
    const html = renderToStaticMarkup(<LessonReadingScrollProgress />);
    const words = tokensFromVisible(html);
    for (const w of words) {
      assert.equal(RAW_I18N_KEY.test(w), false, `unexpected raw key-like token in progress markup: ${w}`);
    }
  });
});
