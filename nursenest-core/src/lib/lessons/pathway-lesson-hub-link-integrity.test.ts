/** @see pathway-lesson-public-cross-link-integrity.test.ts — hub-link-integrity imports the lesson loader chain. */
import "../../../scripts/stub-server-only.cjs";
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  HubVerifyPreparedPositiveZeroKeptError,
  verifyMarketingHubLessonRowsResolve,
} from "@/lib/lessons/pathway-lesson-hub-link-integrity";
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

  it("throws HubVerifyPreparedPositiveZeroKeptError when all rows drop and invariant is not skipped", async () => {
    const resolveLessonDetail = async () => undefined;
    await assert.rejects(
      verifyMarketingHubLessonRowsResolve({ id: "ca-rn-nclex-rn" }, [hubRow("a")], "en", {
        resolveLessonDetail,
      }),
      (err: unknown) => err instanceof HubVerifyPreparedPositiveZeroKeptError,
    );
  });
});
