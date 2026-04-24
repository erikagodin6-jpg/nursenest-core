/** @see pathway-lesson-public-cross-link-integrity.test.ts — hub-link-integrity imports the lesson loader chain. */
import "../../../scripts/stub-server-only.cjs";
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { verifyMarketingHubLessonRowsResolve } from "@/lib/lessons/pathway-lesson-hub-link-integrity";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";

function hubRow(slug: string, title = "Lesson title"): PathwayLessonRecord {
  return {
    slug,
    title,
    topic: "Topic",
    topicSlug: "infection",
    bodySystem: "cardiovascular",
    system: "cardiovascular",
    previewSectionCount: 1,
    seoTitle: title,
    seoDescription:
      "Clinical framing, safety cues, prioritization patterns, and exam-style rationale for this topic in nursing practice.",
    sections: [],
    structuralQuality: { publicComplete: true },
    exams: [],
    countries: [],
  } as PathwayLessonRecord;
}

describe("verifyMarketingHubLessonRowsResolve", () => {
  it("uses listWarehouseLocale for hydration when row omits localeMeta.contentLocale", async () => {
    const calls: Array<{ slug: string; hub: string; shard?: string }> = [];
    const resolveLessonDetail = async (pathwayId: string, slug: string, hub: string, shard?: string) => {
      calls.push({ slug, hub, shard });
      if (pathwayId !== "ca-rn-nclex-rn") return undefined;
      if (shard === "fr" || hub === "fr") return hubRow(slug);
      return undefined;
    };
    const rowNoMeta = hubRow("lesson-wh");
    delete (rowNoMeta as { localeMeta?: unknown }).localeMeta;
    const { kept } = await verifyMarketingHubLessonRowsResolve({ id: "ca-rn-nclex-rn" }, [rowNoMeta], "en", {
      resolveLessonDetail,
      listWarehouseLocale: "fr-CA",
    });
    assert.equal(kept.length, 1);
    assert.deepEqual(calls, [{ slug: "lesson-wh", hub: "en", shard: "fr" }]);
  });

  it("hydrates each slug using the hub row localeMeta.contentLocale when present", async () => {
    const calls: Array<{ slug: string; hub: string; shard?: string }> = [];
    const resolveLessonDetail = async (pathwayId: string, slug: string, hub: string, shard?: string) => {
      calls.push({ slug, hub, shard });
      if (pathwayId !== "ca-rn-nclex-rn") return undefined;
      if (shard === "fr" || hub === "fr") return hubRow(slug);
      return undefined;
    };
    const rowFr: PathwayLessonRecord = {
      ...hubRow("lesson-fr"),
      localeMeta: {
        requestedContentLocale: "en",
        contentLocale: "fr",
        usedLocaleFallback: true,
        isCatalogEnglishSource: false,
      },
    };
    const { kept } = await verifyMarketingHubLessonRowsResolve({ id: "ca-rn-nclex-rn" }, [rowFr], "en", {
      resolveLessonDetail,
    });
    assert.equal(kept.length, 1);
    assert.deepEqual(calls, [{ slug: "lesson-fr", hub: "en", shard: "fr" }]);
  });

  it("surfaces droppedPreparedRowSamples for failed slugs (ops triage)", async () => {
    const resolveLessonDetail = async () => undefined;
    const row = hubRow("gone-bad");
    row.topicSlug = "pharmacology";
    const { diagnostics } = await verifyMarketingHubLessonRowsResolve({ id: "ca-rn-nclex-rn" }, [row], "en", {
      resolveLessonDetail,
    });
    assert.ok(diagnostics.droppedPreparedRowSamples?.length);
    const s = diagnostics.droppedPreparedRowSamples![0]!;
    assert.equal(s.slug, "gone-bad");
    assert.equal(s.reasonDropped, "detail_loader_miss");
    assert.equal(s.topicSlug, "pharmacology");
  });

  it("keeps valid rows and drops only unresolvable slugs (mixed inventory)", async () => {
    const resolveLessonDetail = async (pathwayId: string, slug: string) => {
      if (pathwayId !== "ca-rn-nclex-rn") return undefined;
      if (slug === "missing") return undefined;
      return hubRow(slug);
    };
    const { kept, diagnostics } = await verifyMarketingHubLessonRowsResolve(
      { id: "ca-rn-nclex-rn" },
      [hubRow("lesson-1"), hubRow("missing"), hubRow("lesson-2")],
      "en",
      { resolveLessonDetail },
    );
    assert.equal(kept.length, 2);
    assert.equal(diagnostics.keptRowCount, 2);
    assert.equal(diagnostics.incomingPreparedRowCount, 3);
    assert.ok(Array.isArray(diagnostics.exclusionReasonsRanked));
    assert.equal(diagnostics.exclusionReasonsRanked?.[0]?.reason, "detail_loader_miss");
    assert.equal(diagnostics.exclusionReasonsRanked?.[0]?.count, 1);
  });

  it("calls resolveLessonDetail once per unique slug (duplicate rows do not multiply verify work)", async () => {
    let slugResolveCalls = 0;
    const resolveLessonDetail = async (pathwayId: string, slug: string) => {
      if (pathwayId !== "ca-rn-nclex-rn") return undefined;
      slugResolveCalls += 1;
      return hubRow(slug);
    };
    const { kept } = await verifyMarketingHubLessonRowsResolve(
      { id: "ca-rn-nclex-rn" },
      [hubRow("dup"), hubRow("dup"), hubRow("other")],
      "en",
      { resolveLessonDetail },
    );
    assert.equal(kept.length, 3);
    assert.equal(slugResolveCalls, 2);
  });

  it("does not zero the hub when one slug fails among several", async () => {
    const resolveLessonDetail = async (_pid: string, slug: string) => (slug === "x" ? undefined : hubRow(slug));
    const { kept } = await verifyMarketingHubLessonRowsResolve(
      { id: "ca-rn-nclex-rn" },
      [hubRow("a"), hubRow("x"), hubRow("b")],
      "en",
      { resolveLessonDetail },
    );
    assert.equal(kept.length, 2);
  });

  it("reports diagnostics when every slug fails the resolver", async () => {
    const resolveLessonDetail = async () => undefined;
    const { kept, diagnostics } = await verifyMarketingHubLessonRowsResolve(
      { id: "ca-rn-nclex-rn" },
      [hubRow("a"), hubRow("b")],
      "en",
      { resolveLessonDetail, skipZeroKeptPipelineInvariant: true },
    );
    assert.equal(kept.length, 0);
    assert.equal(diagnostics.keptRowCount, 0);
    assert.ok((diagnostics.excludedByReason.detail_loader_miss ?? 0) >= 1);
  });

  it("drops rows when resolver returns lesson failing pathway exam/country context", async () => {
    const wrongExam = {
      ...hubRow("geo-miss"),
      exams: ["NP" as const],
      countries: ["US" as const],
    } as PathwayLessonRecord;
    const resolveLessonDetail = async () => wrongExam;
    const { kept } = await verifyMarketingHubLessonRowsResolve(
      { id: "ca-rn-nclex-rn" },
      [hubRow("geo-miss")],
      "en",
      { resolveLessonDetail, skipZeroKeptPipelineInvariant: true },
    );
    assert.equal(kept.length, 0);
  });

  it("returns empty kept without throwing when every slug fails (recoverable inventory shrink)", async () => {
    const resolveLessonDetail = async () => undefined;
    const { kept, diagnostics } = await verifyMarketingHubLessonRowsResolve(
      { id: "ca-rn-nclex-rn" },
      [hubRow("a")],
      "en",
      { resolveLessonDetail },
    );
    assert.equal(kept.length, 0);
    assert.equal(diagnostics.keptRowCount, 0);
    assert.ok((diagnostics.excludedByReason.detail_loader_miss ?? 0) >= 1);
  });
});
