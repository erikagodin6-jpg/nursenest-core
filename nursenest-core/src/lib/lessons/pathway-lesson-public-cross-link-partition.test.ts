import test from "node:test";
import assert from "node:assert/strict";
import type { LinkCandidate } from "@/lib/linking/internal-link-types";
import { partitionParsedLessonCrossLinksByIntegrityEvaluations } from "@/lib/lessons/pathway-lesson-public-cross-link-partition";

function lessonCandidate(href: string): LinkCandidate {
  return {
    kind: "lesson",
    topicKey: "t",
    href,
    anchorText: "x",
    score: 1,
    strength: "strong",
    localeMatch: true,
    pathwayMatch: true,
  };
}

/** When {@link evaluatePublicMarketingLessonCrossLinkIntegrity} would succeed, cross-links stay in `resolved.lessons` (same partition as {@link filterResolvedLinksLessonsByPublicMarketingIntegrity}). */
test("partition: all ok => all kept", () => {
  const parsed = [
    { candidate: lessonCandidate("/a"), slug: "a" },
    { candidate: lessonCandidate("/b"), slug: "b" },
  ];
  const evalBySlug = new Map([
    ["a", { ok: true as const }],
    ["b", { ok: true as const }],
  ]);
  const { kept, excluded } = partitionParsedLessonCrossLinksByIntegrityEvaluations({ parsed, evalBySlug });
  assert.equal(kept.length, 2);
  assert.equal(excluded.length, 0);
});

test("partition: missing eval entry => cross_link_slug_parse_failed", () => {
  const parsed = [{ candidate: lessonCandidate("/a"), slug: "a" }];
  const evalBySlug = new Map<string, { ok: true } | { ok: false; reason: "detail_loader_miss"; slug: string }>();
  const { kept, excluded } = partitionParsedLessonCrossLinksByIntegrityEvaluations({ parsed, evalBySlug });
  assert.equal(kept.length, 0);
  assert.equal(excluded.length, 1);
  assert.equal(excluded[0]!.reason, "cross_link_slug_parse_failed");
});

test("partition: detail_loader_miss => excluded with reason", () => {
  const parsed = [{ candidate: lessonCandidate("/x"), slug: "x" }];
  const evalBySlug = new Map([["x", { ok: false as const, reason: "detail_loader_miss" as const, slug: "x" }]]);
  const { kept, excluded } = partitionParsedLessonCrossLinksByIntegrityEvaluations({ parsed, evalBySlug });
  assert.equal(kept.length, 0);
  assert.equal(excluded[0]!.reason, "detail_loader_miss");
});

test("partition: pathway_context_mismatch => excluded", () => {
  const parsed = [{ candidate: lessonCandidate("/x"), slug: "x" }];
  const evalBySlug = new Map([
    ["x", { ok: false as const, reason: "pathway_context_mismatch" as const, slug: "x" }],
  ]);
  const { kept, excluded } = partitionParsedLessonCrossLinksByIntegrityEvaluations({ parsed, evalBySlug });
  assert.equal(kept.length, 0);
  assert.equal(excluded[0]!.reason, "pathway_context_mismatch");
});

test("partition: taxonomy_review_required => excluded", () => {
  const parsed = [{ candidate: lessonCandidate("/x"), slug: "x" }];
  const evalBySlug = new Map([
    ["x", { ok: false as const, reason: "taxonomy_review_required" as const, slug: "x" }],
  ]);
  const { kept, excluded } = partitionParsedLessonCrossLinksByIntegrityEvaluations({ parsed, evalBySlug });
  assert.equal(kept.length, 0);
  assert.equal(excluded[0]!.reason, "taxonomy_review_required");
});

test("partition: detail_not_public_complete => excluded", () => {
  const parsed = [{ candidate: lessonCandidate("/x"), slug: "x" }];
  const evalBySlug = new Map([
    ["x", { ok: false as const, reason: "detail_not_public_complete" as const, slug: "x" }],
  ]);
  const { kept, excluded } = partitionParsedLessonCrossLinksByIntegrityEvaluations({ parsed, evalBySlug });
  assert.equal(kept.length, 0);
  assert.equal(excluded[0]!.reason, "detail_not_public_complete");
});

test("partition: professional_hub_corpus_guard => excluded", () => {
  const parsed = [{ candidate: lessonCandidate("/x"), slug: "x" }];
  const evalBySlug = new Map([
    ["x", { ok: false as const, reason: "professional_hub_corpus_guard" as const, slug: "x" }],
  ]);
  const { kept, excluded } = partitionParsedLessonCrossLinksByIntegrityEvaluations({ parsed, evalBySlug });
  assert.equal(kept.length, 0);
  assert.equal(excluded[0]!.reason, "professional_hub_corpus_guard");
});
