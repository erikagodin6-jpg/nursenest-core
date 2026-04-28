import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  pathwayLessonsSchemaDriftFromPrismaErrorMessage,
  pathwayLessonsSchemaDriftFromUnknown,
} from "@/lib/db/pathway-lessons-schema-contract";

describe("pathway-lessons-schema-contract", () => {
  it("detects missing structural_public_complete from Prisma error text", () => {
    const drift = pathwayLessonsSchemaDriftFromPrismaErrorMessage(
      'The column `pathway_lessons.structural_public_complete` does not exist in the current database.',
    );
    assert.ok(drift);
    assert.equal(drift.code, "missing_structural_public_complete");
    assert.match(drift.remediation, /migrate deploy/);
  });

  it("returns null for unrelated errors", () => {
    assert.equal(pathwayLessonsSchemaDriftFromPrismaErrorMessage("connection refused"), null);
  });

  it("detects invalid prisma invocation text mentioning structural_public_complete", () => {
    const drift = pathwayLessonsSchemaDriftFromPrismaErrorMessage(
      "Invalid prisma.pathwayLesson.findMany() invocation: The column pathway_lessons.structural_public_complete does not exist in the current database.",
    );
    assert.ok(drift);
    assert.equal(drift.code, "missing_structural_public_complete");
  });

  it("pathwayLessonsSchemaDriftFromUnknown maps Error messages", () => {
    const drift = pathwayLessonsSchemaDriftFromUnknown(
      new Error(
        "The column `pathway_lessons.structural_public_complete` does not exist in the current database.",
      ),
    );
    assert.ok(drift);
    assert.equal(drift?.code, "missing_structural_public_complete");
  });

  it("pathwayLessonsSchemaDriftFromUnknown returns null for unrelated errors", () => {
    assert.equal(pathwayLessonsSchemaDriftFromUnknown(new Error("connection refused")), null);
  });
});
