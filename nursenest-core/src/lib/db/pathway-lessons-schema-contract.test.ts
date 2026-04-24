import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { pathwayLessonsSchemaDriftFromPrismaErrorMessage } from "@/lib/db/pathway-lessons-schema-contract";

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
});
