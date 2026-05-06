import assert from "node:assert/strict";
import test from "node:test";

import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import { npPathwaySpecialtyAndSql } from "@/lib/flashcards/np-pathway-specialty-sql";

test("npPathwaySpecialtyAndSql is empty for RN pathway", () => {
  const p = getExamPathwayById("us-rn-nclex-rn");
  assert.ok(p);
  const s = npPathwaySpecialtyAndSql(p);
  assert.equal(s.strings.join("").trim().length, 0);
});

test("npPathwaySpecialtyAndSql is non-empty for US NP FNP", () => {
  const p = getExamPathwayById("us-np-fnp");
  assert.ok(p);
  const s = npPathwaySpecialtyAndSql(p);
  assert.ok(s.strings.join(" ").includes("NOT"));
});
