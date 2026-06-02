import assert from "node:assert/strict";
import test from "node:test";
import { CANONICAL_PATHWAY_HUB } from "@/lib/marketing/canonical-pathway-hubs";
import { RN, rnLessons, rnQuestions } from "@/lib/marketing/marketing-entry-routes";

test("RN marketing entry routes use pathway-scoped hubs (not mixed-tier /lessons or /question-bank)", () => {
  assert.equal(RN.usLessons, `${CANONICAL_PATHWAY_HUB.usRn}/lessons`);
  assert.equal(RN.caLessons, `${CANONICAL_PATHWAY_HUB.caRn}/lessons`);
  assert.equal(RN.usQuestions, `${CANONICAL_PATHWAY_HUB.usRn}/questions`);
  assert.equal(RN.caQuestions, `${CANONICAL_PATHWAY_HUB.caRn}/questions`);
  assert.equal(rnLessons("US"), RN.usLessons);
  assert.equal(rnLessons("CA"), RN.caLessons);
  assert.equal(rnQuestions("US"), RN.usQuestions);
  assert.equal(rnQuestions("CA"), RN.caQuestions);
});
