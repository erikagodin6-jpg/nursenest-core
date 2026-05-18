import { fireEvent, render, screen } from "@testing-library/react";

import { PreNursingAdaptiveCheckpointSection } from "@/components/pre-nursing/pre-nursing-adaptive-checkpoint-section";

describe("PreNursingAdaptiveCheckpointSection", () => {
  it("renders interactive checkpoints without remediation before an answer is selected", () => {
    render(
      <PreNursingAdaptiveCheckpointSection
        ids={["atpAerobicVsAnaerobic"]}
        remediationTitle="Strengthen ATP foundations"
        remediationWeakArea="Aerobic vs anaerobic ATP production"
        remediationExplanation="Learners often remember glycolysis makes ATP but miss how much ATP is lost without oxygen-dependent metabolism."
        remediationActions={["Review aerobic vs anaerobic metabolism."]}
        remediationRelatedConcepts={["oxygenation", "ATP", "lactate"]}
      />,
    );

    expect(screen.getByText(/aerobic vs anaerobic check/i)).toBeInTheDocument();
    expect(screen.queryByText(/strengthen ATP foundations/i)).not.toBeInTheDocument();
  });

  it("shows remediation insight after an incorrect checkpoint response", () => {
    render(
      <PreNursingAdaptiveCheckpointSection
        ids={["atpAerobicVsAnaerobic"]}
        remediationTitle="Strengthen ATP foundations"
        remediationWeakArea="Aerobic vs anaerobic ATP production"
        remediationExplanation="Learners often remember glycolysis makes ATP but miss how much ATP is lost without oxygen-dependent metabolism."
        remediationActions={["Review aerobic vs anaerobic metabolism."]}
        remediationRelatedConcepts={["oxygenation", "ATP", "lactate"]}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /ATP production increases/i }));

    expect(screen.getByText(/strengthen ATP foundations/i)).toBeInTheDocument();
    expect(screen.getByText(/aerobic vs anaerobic ATP production/i)).toBeInTheDocument();
    expect(screen.getByText("oxygenation")).toBeInTheDocument();
  });
});
