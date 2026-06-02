import {
  createPreNursingMasteryEvent,
  inferPreNursingMasteryState,
  type PreNursingMasteryEvent,
} from "@/lib/pre-nursing/pre-nursing-mastery-events";

describe("pre-nursing adaptive mastery events", () => {
  it("creates timestamped mastery events", () => {
    const event = createPreNursingMasteryEvent({
      conceptId: "prenursing.atp.aerobic-vs-anaerobic",
      source: "lesson-checkpoint",
      selectedOptionId: "c",
      correct: true,
      confidence: "confident",
      weakAreaTags: ["oxygenation", "cellular-energy"],
      remediationRecommended: false,
    });

    expect(event.conceptId).toBe("prenursing.atp.aerobic-vs-anaerobic");
    expect(event.source).toBe("lesson-checkpoint");
    expect(event.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it("infers practicing when the learner is incorrect", () => {
    expect(
      inferPreNursingMasteryState({ correct: false, confidence: "very-confident" }),
    ).toBe("practicing");
  });

  it("infers mastered only from correct high-confidence performance", () => {
    expect(
      inferPreNursingMasteryState({ correct: true, confidence: "very-confident" }),
    ).toBe("mastered");
  });

  it("infers strong from correct confident performance", () => {
    expect(
      inferPreNursingMasteryState({ correct: true, confidence: "confident" }),
    ).toBe("strong");
  });

  it("keeps neutral correct performance in developing state", () => {
    expect(
      inferPreNursingMasteryState({ correct: true, confidence: "neutral" }),
    ).toBe("developing");
  });

  it("supports every planned adaptive learning source", () => {
    const sources: PreNursingMasteryEvent["source"][] = [
      "lesson-checkpoint",
      "mini-assessment",
      "flashcard-review",
      "guided-calculation",
      "simulation",
      "readiness-exam",
    ];

    for (const source of sources) {
      const event = createPreNursingMasteryEvent({
        conceptId: `prenursing.contract.${source}`,
        source,
        correct: true,
      });
      expect(event.source).toBe(source);
    }
  });
});
