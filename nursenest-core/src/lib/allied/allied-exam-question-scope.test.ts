import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { prismaWhereForAlliedProfessionExamQuestions } from "@/lib/allied/allied-exam-question-scope";

describe("prismaWhereForAlliedProfessionExamQuestions", () => {
  it("returns null when pathway is not allied marketing core", () => {
    assert.equal(prismaWhereForAlliedProfessionExamQuestions("us-rn-nclex-rn", "pharmacy-tech"), null);
  });

  it("returns null for unknown profession keys", () => {
    assert.equal(prismaWhereForAlliedProfessionExamQuestions("us-allied-core", "not-a-real-profession"), null);
  });

  it("returns OR scope for pharmacy tech on allied core", () => {
    const w = prismaWhereForAlliedProfessionExamQuestions("us-allied-core", "pharmacy-tech");
    assert.ok(w && "OR" in w && Array.isArray(w.OR));
    const ors = w.OR as Record<string, unknown>[];
    assert.ok(ors.some((o) => (o as { careerType?: { in?: string[] } }).careerType?.in?.includes("pharmacyTech")));
  });

  it("maps respiratory to rrt careerType", () => {
    const w = prismaWhereForAlliedProfessionExamQuestions("ca-allied-core", "respiratory");
    assert.ok(w && "OR" in w);
    const ors = (w as { OR: { careerType?: { in?: string[] } }[] }).OR;
    assert.ok(ors.some((o) => o.careerType?.in?.includes("rrt")));
  });
});
