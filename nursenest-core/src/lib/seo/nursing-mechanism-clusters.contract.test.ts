import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { NURSING_MECHANISM_EXPLAINER_DRAFTS } from "@/content/nursing-mechanism-explainers";
import {
  buildNursingMechanismBreadcrumbJsonLd,
  listPublishedNursingMechanismSitemapPaths,
  NURSING_MECHANISM_CLUSTERS,
  NURSING_MECHANISM_EXAMS,
  NURSING_MECHANISM_TIERS,
  nursingMechanismCanonicalPath,
} from "@/lib/seo/nursing-mechanism-clusters";

const placeholderPattern = /\b(lorem|todo|tbd|placeholder|coming soon|insert|dummy|sample title|description here)\b/i;
const supportedTiers = new Set<string>(NURSING_MECHANISM_TIERS);
const supportedExams = new Set<string>(NURSING_MECHANISM_EXAMS);

function assertUnique(label: string, values: readonly string[]) {
  const seen = new Set<string>();
  for (const value of values) {
    assert.ok(!seen.has(value), `${label} must be unique: ${value}`);
    seen.add(value);
  }
}

test("nursing mechanism registry has unique slugs, titles, and descriptions", () => {
  assertUnique("slug", NURSING_MECHANISM_CLUSTERS.map((cluster) => cluster.slug));
  assertUnique("title", NURSING_MECHANISM_CLUSTERS.map((cluster) => cluster.suggestedTitle.toLowerCase()));
  assertUnique("description", NURSING_MECHANISM_CLUSTERS.map((cluster) => cluster.metaDescription.toLowerCase()));
});

test("nursing mechanism registry rejects placeholder copy and unsupported labels", () => {
  for (const cluster of NURSING_MECHANISM_CLUSTERS) {
    assert.doesNotMatch(cluster.suggestedTitle, placeholderPattern, `${cluster.slug} has placeholder title`);
    assert.doesNotMatch(cluster.metaDescription, placeholderPattern, `${cluster.slug} has placeholder description`);
    assert.ok(cluster.targetQueryPatterns.length > 0, `${cluster.slug} needs query patterns`);
    assert.ok(cluster.internalLinkAnchors.length >= 3, `${cluster.slug} needs at least 3 internal links`);
    assert.ok(cluster.relatedLessons.length > 0, `${cluster.slug} needs related lessons`);
    assert.ok(cluster.relatedCalculatorsTools.length > 0, `${cluster.slug} needs tools/calculators`);
    assert.ok(cluster.relatedPracticeCatHooks.length > 0, `${cluster.slug} needs practice/CAT hooks`);
    for (const tier of cluster.tierRelevance) assert.ok(supportedTiers.has(tier), `${cluster.slug} unsupported tier ${tier}`);
    for (const exam of cluster.examRelevance) assert.ok(supportedExams.has(exam), `${cluster.slug} unsupported exam ${exam}`);
  }
});

test("published nursing mechanism clusters require complete canonical-ready content", () => {
  const drafts = new Map(NURSING_MECHANISM_EXPLAINER_DRAFTS.map((draft) => [draft.slug, draft]));
  for (const cluster of NURSING_MECHANISM_CLUSTERS.filter((row) => row.status === "published")) {
    const draft = drafts.get(cluster.slug);
    assert.ok(draft, `${cluster.slug} must have content before publish`);
    assert.equal(draft.status, "published", `${cluster.slug} content status must match registry publish state`);
    const words = [
      draft.clinicalSummary,
      ...draft.mechanismExplanation,
      ...draft.nursingImplications,
      draft.examRelevance,
      ...draft.commonMisconceptions,
      ...draft.faq.flatMap((item) => [item.question, item.answer]),
    ].join(" ").split(/\s+/).filter(Boolean).length;
    assert.ok(words >= 1000, `${cluster.slug} must be at least 1000 words before publication`);
    assert.ok(nursingMechanismCanonicalPath(cluster).startsWith("/nursing-mechanisms/"));
  }
});

test("draft and hidden nursing mechanism clusters are excluded from sitemap paths", () => {
  const sitemapPaths = new Set(listPublishedNursingMechanismSitemapPaths());
  for (const cluster of NURSING_MECHANISM_CLUSTERS) {
    const path = nursingMechanismCanonicalPath(cluster);
    if (cluster.status === "published") {
      assert.ok(sitemapPaths.has(path), `${path} should be in published sitemap collector`);
    } else {
      assert.ok(!sitemapPaths.has(path), `${path} should not be in sitemap collector`);
    }
  }
});

test("breadcrumb JSON-LD uses canonical NurseNest URLs", () => {
  for (const cluster of NURSING_MECHANISM_CLUSTERS.slice(0, 10)) {
    const jsonLd = buildNursingMechanismBreadcrumbJsonLd(cluster) as {
      itemListElement?: Array<{ item?: string; position?: number; name?: string }>;
    };
    assert.equal(jsonLd.itemListElement?.length, 3);
    for (const [index, item] of (jsonLd.itemListElement ?? []).entries()) {
      assert.equal(item.position, index + 1);
      assert.ok(item.name?.trim());
      assert.ok(item.item?.startsWith("https://www.nursenest.ca/"), `${cluster.slug} breadcrumb must use canonical URL`);
    }
  }
});

test("initial top priority drafts contain required editorial sections but remain unpublished", () => {
  assert.equal(NURSING_MECHANISM_EXPLAINER_DRAFTS.length, 10);
  for (const draft of NURSING_MECHANISM_EXPLAINER_DRAFTS) {
    assert.equal(draft.status, "draft", `${draft.slug} should not be mass-published`);
    assert.ok(draft.title && draft.metaTitle && draft.metaDescription && draft.h1);
    assert.ok(draft.clinicalSummary.length > 80);
    assert.ok(draft.mechanismExplanation.length >= 3);
    assert.ok(draft.nursingImplications.length >= 3);
    assert.ok(draft.commonMisconceptions.length >= 3);
    assert.ok(draft.faq.length >= 3);
    assert.ok(draft.internalLinks.length >= 3);
    assert.ok(draft.practiceCta.href);
    assert.ok(draft.relatedLessonsCta.href);
    assert.ok(draft.apa7References.length >= 3);
  }
});

test("public route keeps drafts unavailable and noindex", () => {
  const routeSource = readFileSync(
    join(process.cwd(), "src/app/(marketing)/(default)/nursing-mechanisms/[slug]/page.tsx"),
    "utf8",
  );
  assert.match(routeSource, /cluster\.status !== "published"/);
  assert.match(routeSource, /draft\.status !== "published"/);
  assert.match(routeSource, /robots:\s*\{\s*index:\s*false,\s*follow:\s*false\s*\}/);
  assert.match(routeSource, /notFound\(\)/);
});
