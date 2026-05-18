import { render, screen } from "@testing-library/react";

import { PreNursingRemediationInsightCard } from "@/components/pre-nursing/pre-nursing-remediation-insight-card";

describe("PreNursingRemediationInsightCard", () => {
  it("renders adaptive remediation framing", () => {
    render(
      <PreNursingRemediationInsightCard
        title="Strengthen oxygenation foundations"
        weakArea="Gas exchange vs ventilation"
        explanation="Learners often confuse moving air with moving oxygen across the alveolar-capillary membrane."
        recommendedActions={[
          "Review the oxygenation checkpoint rationale.",
          "Revisit the gas exchange visual explanation.",
        ]}
      />,
    );

    expect(screen.getByText(/adaptive remediation/i)).toBeInTheDocument();
    expect(screen.getByText(/focus area/i)).toBeInTheDocument();
    expect(screen.getByText(/struggling with a concept early is normal/i)).toBeInTheDocument();
  });

  it("renders related concept chips when supplied", () => {
    render(
      <PreNursingRemediationInsightCard
        title="Strengthen ATP foundations"
        weakArea="Anaerobic metabolism"
        explanation="ATP yield drops sharply when cells lose access to oxygen-dependent metabolism."
        recommendedActions={["Review aerobic vs anaerobic metabolism."]}
        relatedConcepts={["oxygenation", "lactate", "cellular energy"]}
      />,
    );

    expect(screen.getByText("oxygenation")).toBeInTheDocument();
    expect(screen.getByText("lactate")).toBeInTheDocument();
    expect(screen.getByText("cellular energy")).toBeInTheDocument();
  });
});
