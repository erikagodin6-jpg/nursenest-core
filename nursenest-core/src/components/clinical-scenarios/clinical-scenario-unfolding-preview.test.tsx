import "@happy-dom/global-registrator/register";

import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
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
