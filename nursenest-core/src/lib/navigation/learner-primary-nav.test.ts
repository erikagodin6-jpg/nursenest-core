import test from "node:test";
import assert from "node:assert/strict";
import {
  buildLearnerPrimaryNavItems,
  buildOptionalClinicalScenariosShellNavItem,
  buildOptionalOsceScenarioShellNavItems,
  buildOptionalPrintablesShellNavItem,
  buildOptionalStudyToolsShellNavItem,
  CANONICAL_LEARNER_ROUTES,
  isLearnerPrimaryNavKey,
  LEARNER_PRIMARY_NAV_ITEM_KEY,
} from "./learner-primary-nav";

test("LEARNER_PRIMARY_NAV_ITEM_KEY is lessons or practice only", () => {
  assert.ok(LEARNER_PRIMARY_NAV_ITEM_KEY === "lessons" || LEARNER_PRIMARY_NAV_ITEM_KEY === "practice");
});

test("isLearnerPrimaryNavKey matches LEARNER_PRIMARY_NAV_ITEM_KEY", () => {
  assert.equal(isLearnerPrimaryNavKey(LEARNER_PRIMARY_NAV_ITEM_KEY), true);
  assert.equal(isLearnerPrimaryNavKey("practice"), LEARNER_PRIMARY_NAV_ITEM_KEY === "practice");
  assert.equal(isLearnerPrimaryNavKey("flashcards"), false);
});

test("buildLearnerPrimaryNavItems: primary key maps to canonical route", () => {
  const items = buildLearnerPrimaryNavItems(null);
  const primary = items.find((i) => i.key === LEARNER_PRIMARY_NAV_ITEM_KEY);
  assert.ok(primary);
  if (LEARNER_PRIMARY_NAV_ITEM_KEY === "lessons") {
    assert.equal(primary!.href, CANONICAL_LEARNER_ROUTES.lessons);
    assert.equal(primary!.matchBase, "/app/lessons");
  } else {
    assert.equal(primary!.href, CANONICAL_LEARNER_ROUTES.practice);
    assert.equal(primary!.matchBase, "/app/questions");
  }
});

test("buildLearnerPrimaryNavItems: legacy Exams label still opens premium practice-tests surface", () => {
  const cat = buildLearnerPrimaryNavItems("us-rn-nclex-rn", { examsLabel: "Exams" }).find((i) => i.key === "cat");
  assert.ok(cat);
  assert.equal(cat!.href, "/app/practice-tests?startMode=practice_exam");
  assert.equal(cat!.matchBase, "/app/practice-tests");
});

test("buildOptionalPrintablesShellNavItem: hidden when navVisible is false", () => {
  assert.equal(buildOptionalPrintablesShellNavItem("us-rn-nclex-rn", false), null);
});

test("buildOptionalPrintablesShellNavItem: visible when navVisible is true", () => {
  const row = buildOptionalPrintablesShellNavItem("us-rn-nclex-rn", true);
  assert.ok(row);
  assert.equal(row!.href, `${CANONICAL_LEARNER_ROUTES.printables}?pathwayId=us-rn-nclex-rn`);
  assert.equal(row!.matchPrefix, "/app/printables");
});

test("buildOptionalStudyToolsShellNavItem: hidden unless NEXT_PUBLIC_ENABLE_STUDY_TOOLS=true", (t) => {
  t.afterEach(() => {
    delete process.env.NEXT_PUBLIC_ENABLE_STUDY_TOOLS;
  });
  assert.equal(buildOptionalStudyToolsShellNavItem("rn-1"), null);
  process.env.NEXT_PUBLIC_ENABLE_STUDY_TOOLS = "true";
  const row = buildOptionalStudyToolsShellNavItem("rn-1");
  assert.ok(row);
  assert.equal(row!.href, "/app/study-tools?pathwayId=rn-1");
  assert.equal(row!.matchPrefix, "/app/study-tools");
});

test("buildOptionalOsceScenarioShellNavItems: OSCE row hidden unless NEXT_PUBLIC_ENABLE_OSCE_SCENARIOS=true", (t) => {
  t.afterEach(() => {
    delete process.env.NEXT_PUBLIC_ENABLE_OSCE_SCENARIOS;
  });
  assert.equal(buildOptionalOsceScenarioShellNavItems("us-rn-nclex-rn").length, 0);
  process.env.NEXT_PUBLIC_ENABLE_OSCE_SCENARIOS = "true";
  const rows = buildOptionalOsceScenarioShellNavItems("us-rn-nclex-rn");
  assert.equal(rows.length, 1);
  assert.equal(rows[0]!.href, "/app/osce?pathwayId=us-rn-nclex-rn");
});

test("buildOptionalClinicalScenariosShellNavItem: hidden unless NEXT_PUBLIC_ENABLE_CLINICAL_SCENARIOS=true", (t) => {
  t.afterEach(() => {
    delete process.env.NEXT_PUBLIC_ENABLE_CLINICAL_SCENARIOS;
  });
  assert.equal(buildOptionalClinicalScenariosShellNavItem("us-rn-nclex-rn"), null);
  process.env.NEXT_PUBLIC_ENABLE_CLINICAL_SCENARIOS = "true";
  const row = buildOptionalClinicalScenariosShellNavItem("us-rn-nclex-rn");
  assert.ok(row);
  assert.equal(row!.href, "/app/clinical-scenarios?pathwayId=us-rn-nclex-rn");
});
