/**
 * Loads hub integrity → pathway lesson loader → `server-only` i18n overlay. Stub first (see pathway-lesson-loader.test.ts).
 */
import "../../../scripts/stub-server-only.cjs";
import test from "node:test";
import assert from "node:assert/strict";
import { parseMarketingLessonSlugForPathwayHref } from "@/lib/lessons/pathway-lesson-marketing-detail-href-parse";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import { marketingPathwayLessonsIndexPath } from "@/lib/lessons/lesson-routes";
import { evaluatePublicMarketingLessonCrossLinkIntegrity } from "@/lib/lessons/pathway-lesson-hub-link-integrity";
import { filterResolvedLinksLessonsByPublicMarketingIntegrity } from "@/lib/lessons/pathway-lesson-public-cross-link-integrity";
import type { ResolvedLinks } from "@/lib/linking/internal-link-types";

const pathwayPick = { countrySlug: "us", roleTrack: "rn", examCode: "nclex-rn" } as const;

test("parseMarketingLessonSlugForPathwayHref: extracts slug from canonical lesson href", () => {
  const base = marketingPathwayLessonsIndexPath(pathwayPick);
  const slug = parseMarketingLessonSlugForPathwayHref(pathwayPick, `${base}/fluid-balance`);
  assert.equal(slug, "fluid-balance");
});

test("parseMarketingLessonSlugForPathwayHref: rejects wrong pathway prefix", () => {
  const slug = parseMarketingLessonSlugForPathwayHref(pathwayPick, "/canada/pn/rex-pn/lessons/sepsis");
  assert.equal(slug, null);
});

test("parseMarketingLessonSlugForPathwayHref: rejects bare lessons index", () => {
  const base = marketingPathwayLessonsIndexPath(pathwayPick);
  const slug = parseMarketingLessonSlugForPathwayHref(pathwayPick, base);
  assert.equal(slug, null);
});

test("evaluatePublicMarketingLessonCrossLinkIntegrity: blank slug => missing_slug (no DB)", async () => {
  const r = await evaluatePublicMarketingLessonCrossLinkIntegrity({ id: "us-rn-nclex-rn" }, "   ", "en");
  assert.equal(r.ok, false);
  if (r.ok) return;
  assert.equal(r.reason, "missing_slug");
});

test("filterResolvedLinksLessonsByPublicMarketingIntegrity: invalid href parse => excluded", async () => {
  const pathway = getExamPathwayById("us-rn-nclex-rn");
  assert.ok(pathway);
  const { resolved, excluded } = await filterResolvedLinksLessonsByPublicMarketingIntegrity({
    pathway,
    lessonContentLocale: "en",
    resolved: {
      lessons: [
        {
          kind: "lesson",
          topicKey: "t",
          href: "/not-a-lesson-hub/preview",
          anchorText: "x",
          score: 1,
          strength: "strong",
          localeMatch: true,
          pathwayMatch: true,
        },
      ],
      flashcards: [],
      questions: [],
      blogs: [],
      cat: [],
    },
  });
  assert.equal(resolved.lessons.length, 0);
  assert.equal(excluded.length, 1);
  assert.equal(excluded[0]!.reason, "cross_link_slug_parse_failed");
});

test("filterResolvedLinksLessonsByPublicMarketingIntegrity: unknown slug => detail_loader_miss", async () => {
  const pathway = getExamPathwayById("us-rn-nclex-rn");
  assert.ok(pathway);
  const base = marketingPathwayLessonsIndexPath(pathway);
  const { resolved, excluded } = await filterResolvedLinksLessonsByPublicMarketingIntegrity({
    pathway,
    lessonContentLocale: "en",
    resolved: {
      lessons: [
        {
          kind: "lesson",
          topicKey: "t",
          href: `${base}/does-not-exist-zzz-999`,
          anchorText: "Missing",
          score: 1,
          strength: "strong",
          localeMatch: true,
          pathwayMatch: true,
        },
      ],
      flashcards: [],
      questions: [],
      blogs: [],
      cat: [],
    },
  });
  assert.equal(resolved.lessons.length, 0);
  assert.equal(excluded.length, 1);
  assert.equal(excluded[0]!.reason, "detail_loader_miss");
});

test("filterResolvedLinksLessonsByPublicMarketingIntegrity: no pathway drops all lesson links", async () => {
  const base = marketingPathwayLessonsIndexPath(pathwayPick);
  const emptyResolved: ResolvedLinks = {
    lessons: [
      {
        kind: "lesson",
        topicKey: "any",
        href: `${base}/any`,
        anchorText: "Any",
        score: 1,
        strength: "strong",
        localeMatch: true,
        pathwayMatch: true,
      },
    ],
    flashcards: [],
    questions: [],
    blogs: [],
    cat: [],
  };
  const { resolved, excluded } = await filterResolvedLinksLessonsByPublicMarketingIntegrity({
    pathway: null,
    lessonContentLocale: "en",
    resolved: emptyResolved,
  });
  assert.equal(resolved.lessons.length, 0);
  assert.equal(excluded.length, 1);
  assert.equal(excluded[0]!.reason, "cross_link_pathway_missing");
});
