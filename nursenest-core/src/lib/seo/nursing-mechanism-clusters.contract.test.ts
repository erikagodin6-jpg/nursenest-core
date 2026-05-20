import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import {
  countNursingMechanismExplainerWords,
  getNursingMechanismPublishBlockers,
  isNursingMechanismExplainerPublishable,
  NURSING_MECHANISM_EXPLAINER_DRAFTS,
  NURSING_MECHANISM_MINIMUM_PUBLISH_WORDS,
} from "@/content/nursing-mechanism-explainers";
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
const expandedTopExplainers = [
  "why-hyperkalemia-affects-the-heart-nursing-mechanism",
  "hyperkalemia-vs-hypokalemia-ecg-changes-nursing",
  "why-burns-cause-hyperkalemia-nursing",
] as const;

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

test("expanded top nursing mechanism drafts meet reviewable long-form depth without publishing", () => {
  for (const slug of expandedTopExplainers) {
    const draft = NURSING_MECHANISM_EXPLAINER_DRAFTS.find((item) => item.slug === slug);
    assert.ok(draft, `${slug} should have a draft`);
    assert.equal(draft.status, "draft", `${slug} should remain guarded as draft`);
    assert.ok(
      countNursingMechanismExplainerWords(draft) >= NURSING_MECHANISM_MINIMUM_PUBLISH_WORDS,
      `${slug} should meet the long-form word-count floor`,
    );
    assert.ok(draft.longFormSections?.some((section) => /Signs, symptoms, labs, and diagnostics/i.test(section.heading)));
    assert.ok(draft.longFormSections?.some((section) => /Nursing priorities/i.test(section.heading)));
    assert.ok(draft.longFormSections?.some((section) => /exam traps/i.test(section.heading)));
  }
});

test("publish eligibility blocks indexing for incomplete nursing mechanism drafts", () => {
  const completeDraft = NURSING_MECHANISM_EXPLAINER_DRAFTS.find((item) => item.slug === expandedTopExplainers[0]);
  assert.ok(completeDraft);
  assert.equal(isNursingMechanismExplainerPublishable(completeDraft), false, "draft status must block publishability");

  assert.deepEqual(
    getNursingMechanismPublishBlockers({
      ...completeDraft,
      status: "published",
    }),
    [],
    "a reviewed status flip should only pass when content gates are satisfied",
  );

  const incomplete = {
    ...completeDraft,
    status: "published" as const,
    clinicalSummary: "Brief incomplete page.",
    mechanismExplanation: ["Mechanism pending"],
    longFormSections: [],
    nursingImplications: [],
    examRelevance: "",
    internalLinks: [],
    apa7References: [],
  };
  const blockers = getNursingMechanismPublishBlockers(incomplete);
  assert.ok(blockers.some((blocker) => blocker.includes("minimum word count")), "word-count gate should block indexing");
  assert.ok(blockers.includes("references are missing"));
  assert.ok(blockers.includes("nursing priorities are missing"));
  assert.ok(blockers.includes("exam relevance is missing"));
  assert.ok(blockers.includes("internal links are missing"));
});

test("draft and hidden nursing mechanism clusters are excluded from sitemap paths", () => {
  const sitemapPaths = new Set(listPublishedNursingMechanismSitemapPaths());
  assert.equal(sitemapPaths.size, 0, "draft-only mechanism program should not emit sitemap URLs");
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
      assert.ok(item.item?.startsWith("https://nursenest.ca/"), `${cluster.slug} breadcrumb must use canonical URL`);
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
  assert.match(routeSource, /isNursingMechanismExplainerPublishable\(draft\)/);
  assert.match(routeSource, /robots:\s*\{\s*index:\s*false,\s*follow:\s*false\s*\}/);
  assert.match(routeSource, /notFound\(\)/);
});
