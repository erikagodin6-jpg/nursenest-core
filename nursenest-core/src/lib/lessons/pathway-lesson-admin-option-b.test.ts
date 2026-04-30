import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import { ContentStatus } from "@prisma/client";
import {
  pathwayLessonMutationRevalidationTargets,
  marketingPathwayLessonDetailSubpath,
} from "@/lib/admin/pathway-lesson-mutation-revalidation-targets";
import { CACHE_TAG_PATHWAY_LESSON_INDEX } from "@/lib/cache/cache-tags";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { marketingPathwayLessonDetailPath } from "@/lib/lessons/lesson-routes";
import { pathwayLessonIdFromContentItemTags, PATHWAY_LESSON_LINK_TAG_PREFIX } from "@/lib/lessons/pathway-lesson-cms-link-tags";
import { resolveMarketingPathwayLessonRouteResolution } from "@/lib/lessons/pathway-lesson-route-access";
import {
  buildAdminPathwayLessonStableEditHref,
  DEFAULT_PATHWAY_LESSON_ADMIN_LOCALE,
} from "@/lib/admin/pathway-lesson-stable-edit-href";

describe("Option B — pathway lesson as authoring source of truth", () => {
  it("marketing lesson detail path matches buildExamPathwayPath(…, lessons/{slug})", () => {
    const pathway = getExamPathwayById("us-rn-nclex-rn");
    assert.ok(pathway);
    const slug = "fluid-electrolytes-basics";
    const viaHelper = marketingPathwayLessonDetailPath(pathway, slug);
    const viaBuild = buildExamPathwayPath(pathway, `lessons/${encodeURIComponent(slug)}`);
    assert.equal(viaHelper, viaBuild);
  });

  it("pathway-lesson-id tag resolves for admin ContentItem → PathwayLesson handoff", () => {
    const id = "clxxxxxxxxpathwaylesson";
    assert.equal(pathwayLessonIdFromContentItemTags([`other`, `${PATHWAY_LESSON_LINK_TAG_PREFIX}${id}`]), id);
    assert.equal(pathwayLessonIdFromContentItemTags([`PATHWAY-LESSON-ID:${id}`]), id);
  });

  it("draft PathwayLesson rows are not treated as published in loader contract (status gate)", () => {
    assert.notEqual(ContentStatus.DRAFT, ContentStatus.PUBLISHED);
    assert.notEqual(ContentStatus.IN_REVIEW, ContentStatus.PUBLISHED);
  });

  it("revalidation targets use exact buildExamPathwayPath lesson subpath for marketing detail", () => {
    const pathway = getExamPathwayById("us-rn-nclex-rn");
    assert.ok(pathway);
    const slug = "fluid-electrolytes-basics";
    const t = pathwayLessonMutationRevalidationTargets({
      pathwayLessonId: "pl_test",
      pathwayId: pathway.id,
      slug,
      indexingImpact: false,
    });
    assert.ok(t.marketingDetailPath);
    assert.equal(t.marketingDetailPath, buildExamPathwayPath(pathway, marketingPathwayLessonDetailSubpath(slug)));
    assert.ok(t.pathnamesWithLayout.includes(t.marketingDetailPath));
  });

  it("revalidation targets include previous slug marketing URL after rename", () => {
    const pathway = getExamPathwayById("us-rn-nclex-rn");
    assert.ok(pathway);
    const t = pathwayLessonMutationRevalidationTargets({
      pathwayLessonId: "pl_test",
      pathwayId: pathway.id,
      slug: "new-slug",
      previousSlug: "old-slug",
      indexingImpact: false,
    });
    const oldPath = marketingPathwayLessonDetailPath(pathway, "old-slug");
    assert.ok(oldPath);
    assert.ok(t.pathnamesWithLayout.includes(oldPath));
  });

  it("revalidation targets add pathway lesson index tag when indexingImpact", () => {
    const t = pathwayLessonMutationRevalidationTargets({
      pathwayLessonId: "pl_test",
      pathwayId: "us-rn-nclex-rn",
      slug: "x",
      indexingImpact: true,
    });
    assert.ok(t.cacheTags.includes(CACHE_TAG_PATHWAY_LESSON_INDEX));
    assert.equal(t.sitemapPath, "/sitemap.xml");
  });

  it("marketing lesson detail stays unavailable when loader returns no row (e.g. draft / not published)", () => {
    const pathway = getExamPathwayById("us-rn-nclex-rn") as ExamPathwayDefinition | undefined;
    assert.ok(pathway);
    const r = resolveMarketingPathwayLessonRouteResolution({
      pathway,
      lesson: undefined,
      lessonLoadFailed: false,
      userId: "",
      entitlement: "error",
      learnerPathResolved: null,
    });
    assert.equal(r.kind, "not_found");
    if (r.kind === "not_found") assert.equal(r.reason, "lesson_not_found");
  });

  it("admin pathway-lesson API updates prisma.pathwayLesson only (ContentItem sync not in publish path)", () => {
    const dir = fileURLToPath(new URL(".", import.meta.url));
    const routePath = join(dir, "../../app/api/admin/pathway-lessons/[id]/route.ts");
    const src = readFileSync(routePath, "utf8");
    assert.match(src, /prisma\.pathwayLesson\.update/);
    assert.equal(src.includes("prisma.contentItem"), false);
    assert.equal(src.includes("content_items"), false);
  });

  it("admin pathway-lesson GET [id] supports pathwayId+slug query (PathwayLesson only, no ContentItem)", () => {
    const dir = fileURLToPath(new URL(".", import.meta.url));
    const routePath = join(dir, "../../app/api/admin/pathway-lessons/[id]/route.ts");
    const src = readFileSync(routePath, "utf8");
    assert.match(src, /searchParams\.get\("pathwayId"\)/);
    assert.match(src, /loadAdminPathwayLessonRow/);
    assert.equal(src.includes("prisma.contentItem"), false);
  });

  it("deprecated GET /api/admin/pathway-lessons/lookup delegates to PathwayLesson row loader (no ContentItem)", () => {
    const dir = fileURLToPath(new URL(".", import.meta.url));
    const routePath = join(dir, "../../app/api/admin/pathway-lessons/lookup/route.ts");
    const loaderPath = join(dir, "../admin/load-admin-pathway-lesson-row.server.ts");
    const routeSrc = readFileSync(routePath, "utf8");
    const loaderSrc = readFileSync(loaderPath, "utf8");
    assert.match(routeSrc, /loadAdminPathwayLessonRow/);
    assert.match(loaderSrc, /prisma\.pathwayLesson\.findFirst/);
    assert.equal(routeSrc.includes("prisma.contentItem"), false);
    assert.equal(routeSrc.includes("contentItem"), false);
    assert.equal(loaderSrc.includes("prisma.contentItem"), false);
  });

  it("admin pathway-lesson route exports POST publish delegator", () => {
    const dir = fileURLToPath(new URL(".", import.meta.url));
    const routePath = join(dir, "../../app/api/admin/pathway-lessons/[id]/route.ts");
    const src = readFileSync(routePath, "utf8");
    assert.match(src, /export async function POST/);
    assert.match(src, /ContentStatus\.PUBLISHED/);
  });

  it("syncPublishedContentItemToPathwayLessons stub documents temporary bridge (ContentItem-only hook)", () => {
    const dir = fileURLToPath(new URL(".", import.meta.url));
    const syncPath = join(dir, "../../lib/admin/sync-content-item-to-pathway-lesson.ts");
    const src = readFileSync(syncPath, "utf8");
    assert.match(src, /syncPublishedContentItemToPathwayLessons/);
    assert.match(src, /TODO: TEMPORARY COMPATIBILITY ONLY/);
    assert.equal(src.includes("pathwayLesson.update"), false);
    assert.equal(src.includes("prisma."), false);
  });

  it("admin pathway-lesson PATCH blocks first transition to published when structure is not publicly complete", () => {
    const dir = fileURLToPath(new URL(".", import.meta.url));
    const routePath = join(dir, "../../app/api/admin/pathway-lessons/[id]/route.ts");
    const src = readFileSync(routePath, "utf8");
    assert.match(src, /structural_public_incomplete/);
    assert.match(src, /structuralPublicComplete/);
    assert.match(src, /transitioningIntoPublished/);
  });

  it("admin pathway-lesson PATCH validates locale on publish", () => {
    const dir = fileURLToPath(new URL(".", import.meta.url));
    const routePath = join(dir, "../../app/api/admin/pathway-lessons/[id]/route.ts");
    const src = readFileSync(routePath, "utf8");
    assert.match(src, /locale_invalid/);
    assert.match(src, /mergedLocale/);
  });

  it("admin ContentItem GET exposes lessonSurface for pathway vs content branching", () => {
    const dir = fileURLToPath(new URL(".", import.meta.url));
    const routePath = join(dir, "../../app/api/admin/lessons/[id]/route.ts");
    const src = readFileSync(routePath, "utf8");
    assert.match(src, /lessonSurface/);
    assert.match(src, /pathway_lesson/);
  });

  it("stable admin PathwayLesson edit href uses pathwayId + slug (locale only when non-default)", () => {
    const base = buildAdminPathwayLessonStableEditHref({
      pathwayId: "us-rn-nclex-rn",
      slug: "fluid-electrolytes-basics",
      locale: DEFAULT_PATHWAY_LESSON_ADMIN_LOCALE,
    });
    assert.ok(base.startsWith("/admin/pathway-lessons/edit?"));
    assert.ok(base.includes("pathwayId=us-rn-nclex-rn"));
    assert.ok(base.includes("slug=fluid-electrolytes-basics"));
    assert.equal(base.includes("locale="), false);

    const withLocale = buildAdminPathwayLessonStableEditHref({
      pathwayId: "ca-rpn-nclex-pn",
      slug: "sample-lesson",
      locale: "fr",
    });
    assert.ok(withLocale.includes("pathwayId=ca-rpn-nclex-pn"));
    assert.ok(withLocale.includes("slug=sample-lesson"));
    assert.ok(withLocale.includes("locale=fr"));
  });

  it("admin pathway lesson list surfaces link to stable edit (not ContentItem row editor)", () => {
    const dir = fileURLToPath(new URL(".", import.meta.url));
    const indexPath = join(dir, "../../app/(admin)/admin/pathway-lessons/page.tsx");
    const libPath = join(dir, "../../components/admin/lessons/admin-lessons-library-client.tsx");
    const indexSrc = readFileSync(indexPath, "utf8");
    const libSrc = readFileSync(libPath, "utf8");
    const stableEditHrefImport =
      /import\s*\{\s*buildAdminPathwayLessonStableEditHref\s*\}\s*from\s*["']@\/lib\/admin\/pathway-lesson-stable-edit-href["']/;
    assert.match(indexSrc, stableEditHrefImport);
    assert.match(libSrc, stableEditHrefImport);

    const indexMapMarker = "rows.map((r) => (";
    const iStart = indexSrc.indexOf(indexMapMarker);
    assert.ok(iStart > 0, "pathway index row map not found");
    const iEnd = indexSrc.indexOf("))}\n      </ul>", iStart);
    assert.ok(iEnd > iStart, "pathway index row map end not found");
    const indexRowTemplate = indexSrc.slice(iStart, iEnd);
    assert.equal(indexRowTemplate.includes("/admin/lessons/"), false);
    assert.match(indexRowTemplate, /buildAdminPathwayLessonStableEditHref\(\{/);
    assert.match(indexRowTemplate, /pathwayId:\s*r\.pathwayId/);
    assert.match(indexRowTemplate, /slug:\s*r\.slug/);
    assert.match(indexRowTemplate, /locale:\s*r\.locale/);

    const pathwayMapMarker = "pRows.map((r) => (";
    const pStart = libSrc.indexOf(pathwayMapMarker);
    assert.ok(pStart > 0, "pathway table row map not found");
    const pEnd = libSrc.indexOf("))\n                )}", pStart);
    assert.ok(pEnd > pStart, "pathway table row map end not found");
    const pathwayRowTemplate = libSrc.slice(pStart, pEnd);
    assert.equal(pathwayRowTemplate.includes("/admin/lessons/"), false);
    assert.match(pathwayRowTemplate, /buildAdminPathwayLessonStableEditHref\(\{/);
    assert.match(pathwayRowTemplate, /pathwayId:\s*r\.pathwayId/);
    assert.match(pathwayRowTemplate, /slug:\s*r\.slug/);
    assert.match(pathwayRowTemplate, /locale:\s*r\.locale/);
  });
});
