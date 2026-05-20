import { fireEvent, render, screen } from "@testing-library/react";

import { PreNursingLessonMiniAssessment } from "@/components/pre-nursing/pre-nursing-lesson-mini-assessment";
import { PRE_NURSING_ATP_MINI_ASSESSMENT } from "@/content/pre-nursing/pre-nursing-mini-assessments";

describe("PreNursingLessonMiniAssessment", () => {
  it("renders lesson mastery framing", () => {
    render(
      <PreNursingLessonMiniAssessment
        title="ATP pathway mastery check"
        description="Validate oxygenation and ATP reasoning."
        checkpoints={PRE_NURSING_ATP_MINI_ASSESSMENT}
      />,
    );

    expect(screen.getByText(/lesson mastery check/i)).toBeInTheDocument();
    expect(screen.getByText(/ATP pathway mastery check/i)).toBeInTheDocument();
    expect(screen.getByText(/0%/i)).toBeInTheDocument();
  });

  it("updates mastery progress after learner responses", () => {
    render(
      <PreNursingLessonMiniAssessment
        title="ATP pathway mastery check"
        description="Validate oxygenation and ATP reasoning."
        checkpoints={[PRE_NURSING_ATP_MINI_ASSESSMENT[0]]}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /ATP production drops sharply/i }));

    expect(screen.getByText(/100%/i)).toBeInTheDocument();
    expect(screen.getByText(/ready to move forward/i)).toBeInTheDocument();
  });
});
