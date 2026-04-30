/**
 * Allied health pathway lessons — source-of-truth + catalog sanity (no Prisma required).
 *
 * Live chain (PathwayLesson canonical):
 * - Admin: `/admin/pathway-lessons` → `/api/admin/pathway-lessons/*` mutates `pathway_lessons` (see Prisma model PathwayLesson).
 * - Marketing: `pathway-lesson-loader` `getPathwayLesson` merges published DB row + bundled `allied-bundled-catalog.json` + overlays; prefers DB when `structuralQuality.publicComplete`, else catalog when catalog row is public-complete.
 * - Learner: `resolveAppSubscriberPathwayLessonForDetail` prefers `getPublishedPathwayLessonRecordById` (DB by id), then `getPathwayLesson` slug path (same normalizer).
 * - ContentItem → PathwayLesson sync is an explicit no-op (`syncPublishedContentItemToPathwayLessons`).
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import { syncPublishedContentItemToPathwayLessons } from "@/lib/admin/sync-content-item-to-pathway-lesson";
import { ALLIED_PROFESSIONS } from "@/lib/allied/allied-professions-registry";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import {
  getCatalogLessonsRaw,
  getCatalogLessonRawBySlug,
  getCatalogPathwayLessonsSync,
  getLessonBySlug,
  normalizeLesson,
} from "@/lib/lessons/pathway-lesson-catalog-sync";
import { pathwayAuthorityBlocksContentItemLessonPatch } from "@/lib/lessons/pathway-lesson-content-item-authority";
import { alliedHealthLessonDetailPath, marketingPathwayLessonDetailPath } from "@/lib/lessons/lesson-routes";

const here = dirname(fileURLToPath(import.meta.url));
const coreRoot = join(here, "..", "..", "..");

const ALLIED_PATHWAY_IDS = ["us-allied-core", "ca-allied-core"] as const;

describe("Allied health — authoring / ContentItem authority", () => {
  it("ContentItem publish hook does not fork PathwayLesson truth (no-op bridge)", async () => {
    await syncPublishedContentItemToPathwayLessons({ id: "fake" } as never);
    const src = readFileSync(join(coreRoot, "src", "lib", "admin", "sync-content-item-to-pathway-lesson.ts"), "utf8");
    assert.match(src, /no-op/);
  });

  it("pathwayAuthorityBlocksContentItemLessonPatch blocks body edits when linked to PathwayLesson", () => {
    assert.equal(
      pathwayAuthorityBlocksContentItemLessonPatch({
        linkedPathwayLessonId: "cl_lesson_1",
        patch: { body: "x" },
      }),
      true,
    );
  });
});

describe("Allied health — bundled catalog + URL contracts", () => {
  it("each allied pathway has a non-empty merged catalog", () => {
    for (const pathwayId of ALLIED_PATHWAY_IDS) {
      const lessons = getCatalogPathwayLessonsSync(pathwayId);
      assert.ok(lessons.length > 0, `expected lessons for ${pathwayId}`);
    }
  });

  it("merged catalog has no duplicate slugs per pathway", () => {
    for (const pathwayId of ALLIED_PATHWAY_IDS) {
      const raw = getCatalogLessonsRaw(pathwayId);
      const seen = new Set<string>();
      for (const row of raw) {
        const s = String(row.slug ?? "").trim().toLowerCase();
        assert.ok(!seen.has(s), `duplicate slug ${s} in ${pathwayId}`);
        seen.add(s);
      }
    }
  });

  it("getLessonBySlug matches normalizeLesson(getCatalogLessonRawBySlug) for a sample US allied slug", () => {
    const pathwayId = "us-allied-core";
    const slug = getCatalogPathwayLessonsSync(pathwayId)[0]?.slug;
    assert.ok(slug, "expected at least one US allied lesson");
    const raw = getCatalogLessonRawBySlug(pathwayId, slug!);
    assert.ok(raw);
    const a = getLessonBySlug(pathwayId, slug!);
    const b = normalizeLesson(raw!, pathwayId);
    assert.ok(a && b);
    assert.equal(a!.sections.length, b.sections.length);
    assert.equal(a!.slug, b.slug);
  });

  it("allied profession lesson detail path resolves under canonical marketing pathway URL", () => {
    const prof = ALLIED_PROFESSIONS[0];
    assert.ok(prof);
    const pathway = getExamPathwayById(prof.pathwayId);
    assert.ok(pathway);
    const slug = getCatalogPathwayLessonsSync(prof.pathwayId)[0]?.slug;
    assert.ok(slug);
    const direct = marketingPathwayLessonDetailPath(pathway, slug!);
    const allied = alliedHealthLessonDetailPath(prof.professionKey, slug!);
    assert.ok(direct);
    assert.ok(allied);
    assert.equal(direct, allied);
    assert.match(direct, /\/lessons\//);
  });
});
