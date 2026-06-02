import { render, screen } from "@testing-library/react";

import { PreNursingCheckpointCluster } from "@/components/pre-nursing/pre-nursing-checkpoint-cluster";
import { PRE_NURSING_ANATOMY_INITIAL_CHECKPOINT_IDS } from "@/content/pre-nursing/pre-nursing-interactive-checkpoints";

describe("PreNursingCheckpointCluster", () => {
  it("renders checkpoint clusters with active-learning framing", () => {
    render(
      <PreNursingCheckpointCluster
        ids={PRE_NURSING_ANATOMY_INITIAL_CHECKPOINT_IDS.slice(0, 2)}
      />,
    );

    expect(screen.getByText(/interactive checkpoints/i)).toBeInTheDocument();
    expect(screen.getByText(/active learning/i)).toBeInTheDocument();
  });

  it("renders clinical-thinking checkpoints", () => {
    render(
      <PreNursingCheckpointCluster
        ids={["oxygenationGasExchange", "potassiumCardiacConduction"]}
      />,
    );

    expect(screen.getByText(/oxygenation check/i)).toBeInTheDocument();
    expect(screen.getByText(/electrolyte safety check/i)).toBeInTheDocument();
  });

  it("renders low-stakes educational framing", () => {
    render(
      <PreNursingCheckpointCluster
        ids={["homeostasisNegativeFeedback"]}
      />,
    );

    expect(screen.getByText(/low-stakes practice/i)).toBeInTheDocument();
    expect(screen.getByText(/check your understanding/i)).toBeInTheDocument();
  });
});
