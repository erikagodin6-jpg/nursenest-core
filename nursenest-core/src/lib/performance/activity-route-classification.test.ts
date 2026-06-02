import assert from "node:assert/strict";
import test from "node:test";
import { classifyActivityRoute } from "@/lib/performance/activity-route-classification";
import { getBudgetById } from "@/lib/performance/route-registry";

test("classifyActivityRoute maps target learner activities to performance budgets", () => {
  assert.equal(classifyActivityRoute("/app/questions")?.activity, "questions");
  assert.equal(classifyActivityRoute("/app/flashcards/decks")?.activity, "flashcards");
  assert.equal(classifyActivityRoute("/app/lessons/cardiac")?.activity, "lessons");
  assert.equal(classifyActivityRoute("/app/clinical-skills")?.activity, "clinical-skills");
  assert.equal(classifyActivityRoute("/app/pharmacology")?.activity, "pharmacology");
  assert.equal(classifyActivityRoute("/app/practice-tests/cat-launch")?.activity, "cat");
  assert.equal(classifyActivityRoute("/app/cat")?.activity, "cat");
  assert.equal(classifyActivityRoute("/app/osce")?.activity, "loft");
  assert.equal(classifyActivityRoute("/modules/ecg/basic/lessons")?.activity, "ecg");
});

test("ECG and LOFT are CI-enforced at the platform activity budgets", () => {
  const budget = getBudgetById("learner-ecg");
  assert.ok(budget, "learner-ecg budget must exist");
  assert.equal(budget.ciEnforced, true);
  assert.equal(budget.firstContentBudgetMs, 2000);

  const loftBudget = getBudgetById("learner-loft");
  assert.ok(loftBudget, "learner-loft budget must exist");
  assert.equal(loftBudget.ciEnforced, true);
  assert.equal(loftBudget.firstContentBudgetMs, 3000);
});
