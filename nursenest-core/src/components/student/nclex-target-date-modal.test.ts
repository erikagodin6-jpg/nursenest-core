import assert from "node:assert/strict";
import test from "node:test";

import {
  buildNclexTargetDatePatchBody,
  shouldPromptForNclexTargetDate,
  shouldSyncStoredNclexTargetDate,
  type NclexTargetDateState,
} from "./nclex-target-date-modal";

test("skips target-date prompt when profile has a valid exam date", () => {
  const profile: NclexTargetDateState = {
    examDate: "2026-08-14T00:00:00.000Z",
    examDatePlanType: "proposed",
    examGoalSetAt: "2026-05-26T12:00:00.000Z",
  };

  assert.equal(shouldPromptForNclexTargetDate(profile), false);
});

test("skips target-date prompt when learner explicitly marked exam timing as unsure", () => {
  const profile: NclexTargetDateState = {
    examDate: null,
    examDatePlanType: "unsure",
    examGoalSetAt: "2026-05-26T12:00:00.000Z",
  };

  assert.equal(shouldPromptForNclexTargetDate(profile), false);
});

test("prompts target-date setup when profile has no date or saved decision", () => {
  const profile: NclexTargetDateState = {
    examDate: null,
    examDatePlanType: null,
    examGoalSetAt: null,
  };

  assert.equal(shouldPromptForNclexTargetDate(profile), true);
});

test("prompts target-date setup when profile date is corrupted", () => {
  const profile: NclexTargetDateState = {
    examDate: "not-a-date",
    examDatePlanType: "confirmed",
    examGoalSetAt: "2026-05-26T12:00:00.000Z",
  };

  assert.equal(shouldPromptForNclexTargetDate(profile), true);
});

test("legacy local saved date prevents a duplicate prompt when profile hydration is empty", () => {
  assert.equal(
    shouldPromptForNclexTargetDate(null, {
      savedDate: "2026-08-14",
      dismissed: false,
    }),
    false,
  );
});

test("legacy local saved date is eligible for profile backfill when DB has no decision", () => {
  assert.equal(
    shouldSyncStoredNclexTargetDate(
      {
        examDate: null,
        examDatePlanType: null,
        examGoalSetAt: null,
      },
      {
        savedDate: "2026-08-14",
        dismissed: false,
      },
    ),
    true,
  );
});

test("legacy local saved date does not overwrite an explicit unsure profile decision", () => {
  assert.equal(
    shouldSyncStoredNclexTargetDate(
      {
        examDate: null,
        examDatePlanType: "unsure",
        examGoalSetAt: "2026-05-26T12:00:00.000Z",
      },
      {
        savedDate: "2026-08-14",
        dismissed: false,
      },
    ),
    false,
  );
});

test("modal save payload writes through the existing learner exam-plan API contract", () => {
  assert.deepEqual(buildNclexTargetDatePatchBody("2026-08-14"), {
    examDatePlanType: "proposed",
    examDate: "2026-08-14",
  });
});
