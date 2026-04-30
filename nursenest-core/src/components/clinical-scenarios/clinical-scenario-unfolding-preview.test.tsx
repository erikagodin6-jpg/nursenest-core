import "@happy-dom/global-registrator/register";

import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import React from "react";

(globalThis as unknown as { React?: typeof React }).React = React;
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ClinicalScenarioPreviewModel } from "@/components/clinical-scenarios/clinical-scenario-unfolding-preview";
import { ClinicalScenarioUnfoldingPreview } from "@/components/clinical-scenarios/clinical-scenario-unfolding-preview";

afterEach(() => {
  cleanup();
});

function buildScenario(): ClinicalScenarioPreviewModel {
  return {
    id: "sc_test",
    title: "Preview scenario",
    pathwayId: "us-rn-nclex-rn",
    canonicalCategoryId: "cardiovascular",
    tierFocus: "RN_NCLEX_RN",
    difficulty: "INTERMEDIATE",
    patientAgeContext: "64 y",
    presentingConcern: "Substernal pressure",
    briefHistory: "HTN, HLD",
    medicationsAllergies: "NKDA",
    initialVitals: { HR: "88", BP: "152/88" },
    assessmentFindings: "Diaphoretic, anxious",
    labsDiagnostics: { Troponin: "pending" },
    publishStatus: "DRAFT",
    stages: [
      {
        id: "st0",
        orderIndex: 0,
        scenarioText: "You are assessing the patient at triage.",
        vitals: { HR: "92", BP: "148/90" },
        assessmentFindings: "Ongoing chest discomfort",
        labUpdates: null,
        questionStem: "What is the priority nursing action?",
        optionsJson: [
          { id: "opt_ok", label: "Obtain a 12-lead ECG and notify the provider per protocol." },
          { id: "opt_bad", label: "Tell the patient to wait quietly without further assessment." },
        ],
        correctOptionId: "opt_ok",
        rationale: "Acute coronary syndrome is a time-sensitive emergency; rapid ECG and escalation reduce harm.",
        whyWrongByOptionId: {
          opt_bad: "Delaying assessment can miss ischemia and violates basic safety prioritization.",
        },
        clinicalJudgmentFocus: "Prioritization · safety / red flags",
        consequencesByOptionId: {
          opt_ok: "patient improves",
          opt_bad: "patient deteriorates",
        },
        nextStageOrder: null,
      },
    ],
  };
}

function branchingOpt(
  id: string,
  text: string,
  isCorrect: boolean,
  trajectory: "improves" | "unchanged" | "deteriorates",
  effect: "unlock" | "limit" | "delay" | "escalate",
  rationale: string,
) {
  return { id, text, isCorrect, rationale, consequence: { trajectory, effect } };
}

function buildTwoStageBranching(opts: { isPremium?: boolean } = {}): ClinicalScenarioPreviewModel {
  return {
    id: "sc_branch",
    title: "Branching test",
    pathwayId: "ca-rn-nclex-rn",
    canonicalCategoryId: "cardiovascular",
    tierFocus: "RN_NCLEX_RN",
    difficulty: "INTERMEDIATE",
    patientAgeContext: "60y",
    presentingConcern: "chest pain",
    briefHistory: "hx",
    medicationsAllergies: null,
    initialVitals: { HR: "80" },
    assessmentFindings: "af",
    labsDiagnostics: null,
    publishStatus: "DRAFT",
    isPremium: opts.isPremium,
    stages: [
      {
        id: "a",
        orderIndex: 0,
        scenarioText: "Stage A narrative.",
        vitals: { BP: "120/80" },
        assessmentFindings: "ok",
        labUpdates: null,
        questionStem: "Priority?",
        optionsJson: [
          branchingOpt("c1", "Do the right thing", true, "improves", "unlock", "R1"),
          branchingOpt("w1", "Delay dangerous choice", false, "unchanged", "delay", "R delay"),
        ],
        correctOptionId: "c1",
        rationale: "stage rat",
        whyWrongByOptionId: {},
        clinicalJudgmentFocus: "judgment",
        consequencesByOptionId: {},
        nextStageOrder: null,
      },
      {
        id: "b",
        orderIndex: 1,
        scenarioText: "Stage B narrative.",
        vitals: { BP: "118/78" },
        assessmentFindings: "ok2",
        labUpdates: null,
        questionStem: "Next?",
        optionsJson: [
          branchingOpt("c2", "Right step 2", true, "improves", "unlock", "R2"),
          branchingOpt("w2", "Wrong limit", false, "deteriorates", "limit", "R bad"),
        ],
        correctOptionId: "c2",
        rationale: "rat2",
        whyWrongByOptionId: {},
        clinicalJudgmentFocus: "judgment",
        consequencesByOptionId: {},
        nextStageOrder: null,
      },
    ],
  };
}

describe("ClinicalScenarioUnfoldingPreview", () => {
  it("shows trajectory from selected answer consequences", async () => {
    const user = userEvent.setup();
    render(<ClinicalScenarioUnfoldingPreview scenario={buildScenario()} />);

    const stageCard = screen.getByText(/Case stage 1 of 1/i).closest("section");
    assert.ok(stageCard);
    assert.equal(within(stageCard as HTMLElement).queryByText(/Trajectory:/i), null);

    await user.click(screen.getByRole("button", { name: /wait quietly without further assessment/i }));

    const traj = await screen.findByText(/Trajectory: Deteriorating/i);
    assert.ok(traj);

    await user.click(screen.getByRole("button", { name: /12-lead ECG/i }));
    assert.ok(await screen.findByText(/Trajectory: Improving/i));
  });
});

describe("ClinicalScenarioUnfoldingPreview branching engine UI", () => {
  let fetchBackup: typeof globalThis.fetch;

  beforeEach(() => {
    fetchBackup = globalThis.fetch;
    globalThis.fetch = (() => Promise.resolve({ ok: true, json: async () => ({ ok: true }) } as Response)) as typeof fetch;
  });

  afterEach(() => {
    globalThis.fetch = fetchBackup;
  });

  it("premium scenario blocks stage 2 for free users after stage 1 commit", async () => {
    const user = userEvent.setup();
    render(
      <ClinicalScenarioUnfoldingPreview
        scenario={buildTwoStageBranching({ isPremium: true })}
        premiumUnlocked={false}
        allowStaffFullPreview={false}
      />,
    );

    await user.click(screen.getByRole("button", { name: /Do the right thing/i }));
    await user.click(screen.getByRole("button", { name: /Commit & continue/i }));

    assert.equal(screen.queryByRole("button", { name: /Right step 2/i }), null);
    assert.ok(await screen.findByTestId("clinical-scenario-paywall"));
  });

  it("renders outcome debrief after completing final branching stage", async () => {
    const user = userEvent.setup();
    render(
      <ClinicalScenarioUnfoldingPreview
        scenario={buildTwoStageBranching({ isPremium: false })}
        premiumUnlocked={true}
      />,
    );

    await user.click(screen.getByRole("button", { name: /Do the right thing/i }));
    await user.click(screen.getByRole("button", { name: /Commit & continue/i }));

    await user.click(screen.getByRole("button", { name: /Right step 2/i }));
    await user.click(screen.getByRole("button", { name: /Commit & continue/i }));

    assert.ok(await screen.findByTestId("clinical-scenario-outcome-screen"));
    assert.ok(await screen.findByText(/Outcome: stabilized/i));
    assert.ok(screen.getByText(/Correct pathway/i));
  });
});
