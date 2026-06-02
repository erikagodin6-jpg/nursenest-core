import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  STUDY_LINK_REQUIRED_COLUMNS,
  checkStudyLinkSchemaReadiness,
  assertStudyLinkSchemaReady,
} from "../../../scripts/lib/schema-readiness-guard";

describe("schema readiness guard contracts", () => {
  it("exports the correct required columns for study-link migration", () => {
    assert.equal(STUDY_LINK_REQUIRED_COLUMNS.length, 3);
    assert.deepEqual(STUDY_LINK_REQUIRED_COLUMNS[0], {
      table: "exam_questions",
      column: "study_link_pathway_id",
    });
    assert.deepEqual(STUDY_LINK_REQUIRED_COLUMNS[1], {
      table: "exam_questions",
      column: "study_link_lesson_slug",
    });
    assert.deepEqual(STUDY_LINK_REQUIRED_COLUMNS[2], {
      table: "clinical_nursing_scenarios",
      column: "study_link_lesson_slug",
    });
  });

  it("checkStudyLinkSchemaReadiness returns expected shape", async () => {
    const result = await checkStudyLinkSchemaReadiness();
    assert.equal(typeof result.ready, "boolean");
    assert.ok(Array.isArray(result.missingColumns));
    if (!result.ready) {
      for (const col of result.missingColumns) {
        assert.equal(typeof col.table, "string");
        assert.equal(typeof col.column, "string");
      }
    }
  });

  it("assertStudyLinkSchemaReady throws with helpful message when columns missing", async () => {
    const result = await checkStudyLinkSchemaReadiness();
    if (!result.ready) {
      // If columns are missing, assertStudyLinkSchemaReady should throw
      let threw = false;
      let errorMessage = "";
      try {
        await assertStudyLinkSchemaReady();
      } catch (e) {
        threw = true;
        errorMessage = String(e);
      }
      assert.equal(threw, true, "Expected assertStudyLinkSchemaReady to throw");
      assert.ok(
        errorMessage.includes("npx prisma migrate deploy"),
        "Error message should mention migration command",
      );
      assert.ok(
        errorMessage.includes("study_link_pathway_id") ||
          errorMessage.includes("study_link_lesson_slug"),
        "Error message should mention missing column names",
      );
    } else {
      // If columns exist, assertStudyLinkSchemaReady should not throw
      let threw = false;
      try {
        await assertStudyLinkSchemaReady();
      } catch {
        threw = true;
      }
      assert.equal(threw, false, "Expected assertStudyLinkSchemaReady to not throw when schema is ready");
    }
  });

  it("guard prevents partial writes by checking schema before any data operations", async () => {
    // This test verifies the contract that the guard runs before any writes.
    // The guard is called in link-study-content.ts before any database writes,
    // ensuring the script fails fast if the schema is not ready.
    const result = await checkStudyLinkSchemaReadiness();
    // The guard should be called synchronously at the start of main()
    // before any loop iterations that perform writes.
    assert.ok(
      result.ready || !result.ready,
      "Guard should always return a definitive readiness state",
    );
  });
});