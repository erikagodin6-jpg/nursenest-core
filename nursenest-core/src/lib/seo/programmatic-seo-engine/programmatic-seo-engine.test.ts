import assert from "node:assert/strict";
import { test } from "node:test";
import { CountryCode, ExamFamily, TierCode } from "@prisma/client";
import { mergePublicBlogMetaDescription } from "@/lib/seo/programmatic-seo-engine/blog-public-metadata";
import { primaryTaxonomyLeafForBlogPost } from "@/lib/seo/programmatic-seo-engine/blog-taxonomy";
import {
  clusterPageMeetsIndexabilityThreshold,
  MIN_INDEXABLE_CLUSTER_INTRO_CHARS,
  MIN_INDEXABLE_CLUSTER_ITEMS,
} from "@/lib/seo/programmatic-seo-engine/cluster-gates";
import {
  isShoutyOrSpammyTitle,
  isWeakMetaDescription,
  isWeakSeoTitle,
} from "@/lib/seo/programmatic-seo-engine/guardrails";
import { sanitizeProgrammaticInternalLinks } from "@/lib/seo/programmatic-seo-engine/link-plan";
import { mergePathwayLessonPublicMetadata } from "@/lib/seo/programmatic-seo-engine/lesson-public-metadata";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { TAXONOMY } from "@/lib/taxonomy/taxonomy";

const caRnPathway: ExamPathwayDefinition = {
  id: "ca-rn-nclex-rn",
  countrySlug: "canada",
  countryCode: CountryCode.CA,
  roleTrack: "rn",
  examCode: "nclex-rn",
  examFamily: ExamFamily.NCLEX_RN,
  examKey: "NCLEX_RN",
  displayName: "NCLEX-RN (Canada)",
  shortName: "NCLEX-RN",
  stripeTier: TierCode.RN,
  contentExamKeys: ["NCLEX-RN"],
  seoTitle: "NCLEX-RN practice questions for Canada | NurseNest",
  seoDescription: "Practice NCLEX-RN questions with rationales and adaptive tests. Built for Canadian nurses.",
  status: "active",
  acquisitionMode: "subscribe",
};

test("mergePublicBlogMetaDescription keeps strong manual copy", () => {
  const manual =
    "This is a complete, readable manual description for nurses preparing for the exam. It ends properly.";
  const out = mergePublicBlogMetaDescription(manual, "Auto would be different but should not win.");
  assert.equal(out.source, "manual");
  assert.ok(out.description.includes("nurses"));
});

test("mergePublicBlogMetaDescription falls back when manual is weak", () => {
  const out = mergePublicBlogMetaDescription("short", "A".repeat(120) + " Clear sentence for the reader here.");
  assert.equal(out.source, "auto");
  assert.ok(out.description.length >= 48);
});

test("sanitizeProgrammaticInternalLinks dedupes, excludes self prefix, caps length", () => {
  const out = sanitizeProgrammaticInternalLinks(
    [
      { href: "/lessons", anchor: "A", kind: "hub" },
      { href: "/lessons/", anchor: "Dup", kind: "hub" },
      { href: "/blog/foo", anchor: "Self", kind: "blog" },
      { href: "/other", anchor: "B", kind: "hub" },
    ],
    { excludeHrefPrefixes: ["/blog/foo"], max: 2 },
  );
  assert.equal(out.length, 2);
  assert.equal(out[0]?.href, "/lessons");
  assert.equal(out[1]?.href, "/other");
});

test("mergePathwayLessonPublicMetadata prefers strong manual seoTitle", () => {
  const merged = mergePathwayLessonPublicMetadata({
    pathway: caRnPathway,
    lesson: {
      title: "Fluid balance",
      topic: "Renal",
      bodySystem: "Renal",
      seoTitle: "Fluid balance for NCLEX-RN — Canada clinical focus",
      seoDescription:
        "A thorough lesson description for Canadian NCLEX-RN candidates. Covers assessment, interventions, and safety.",
    },
  });
  assert.equal(merged.title.source, "manual");
  assert.ok(merged.title.title.includes("Fluid balance"));
});

test("mergePathwayLessonPublicMetadata uses auto when manual title is shouty", () => {
  const merged = mergePathwayLessonPublicMetadata({
    pathway: caRnPathway,
    lesson: {
      title: "Safe medication administration",
      topic: "Pharmacology",
      bodySystem: "Pharmacology",
      seoTitle: "MUST READ!!! CLICK HERE",
      seoDescription: "Good enough manual description for the lesson page. It has enough length and a period.",
    },
  });
  assert.equal(merged.title.source, "auto");
  assert.ok(isShoutyOrSpammyTitle("MUST READ!!! CLICK HERE"));
  assert.ok(merged.title.title.includes("Safe medication"));
});

test("clusterPageMeetsIndexabilityThreshold enforces item and intro minimums", () => {
  assert.equal(
    clusterPageMeetsIndexabilityThreshold({
      renderableItemCount: MIN_INDEXABLE_CLUSTER_ITEMS,
      introPlainTextChars: MIN_INDEXABLE_CLUSTER_INTRO_CHARS,
    }),
    true,
  );
  assert.equal(
    clusterPageMeetsIndexabilityThreshold({
      renderableItemCount: MIN_INDEXABLE_CLUSTER_ITEMS - 1,
      introPlainTextChars: MIN_INDEXABLE_CLUSTER_INTRO_CHARS,
    }),
    false,
  );
});

test("guardrails reject weak titles and meta", () => {
  assert.equal(isWeakSeoTitle("x", 8), true);
  assert.equal(isWeakSeoTitle("Adequate lesson title here", 8), false);
  assert.equal(isWeakMetaDescription("nope"), true);
  assert.equal(isShoutyOrSpammyTitle("CLICK HERE now"), true);
});

test("primaryTaxonomyLeafForBlogPost prefers category leaf", () => {
  const leaf = TAXONOMY.CLINICAL[0];
  assert.equal(
    primaryTaxonomyLeafForBlogPost({
      category: leaf,
      tags: ["not_a_taxonomy_leaf"],
    }),
    leaf,
  );
});
