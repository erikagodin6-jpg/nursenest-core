import {
  PRE_NURSING_ANATOMY_INITIAL_CHECKPOINT_IDS,
  PRE_NURSING_FOUNDATION_CHECKPOINTS,
} from "@/content/pre-nursing/pre-nursing-interactive-checkpoints";

describe("pre-nursing interactive checkpoint contracts", () => {
  it("provides foundational anatomy checkpoint coverage", () => {
    expect(PRE_NURSING_ANATOMY_INITIAL_CHECKPOINT_IDS.length).toBeGreaterThanOrEqual(5);
  });

  it("ensures every checkpoint has four answer options", () => {
    for (const checkpoint of Object.values(PRE_NURSING_FOUNDATION_CHECKPOINTS)) {
      expect(checkpoint.options).toHaveLength(4);
    }
  });

  it("ensures every checkpoint contains remediation-oriented educational support", () => {
    for (const checkpoint of Object.values(PRE_NURSING_FOUNDATION_CHECKPOINTS)) {
      expect(checkpoint.clinicalRelevance?.length ?? 0).toBeGreaterThan(24);
      expect(checkpoint.memoryAnchor?.length ?? 0).toBeGreaterThan(12);
      expect(checkpoint.misconceptionNote?.length ?? 0).toBeGreaterThan(12);
    }
  });

  it("ensures correct answers map to valid options", () => {
    for (const checkpoint of Object.values(PRE_NURSING_FOUNDATION_CHECKPOINTS)) {
      const optionIds = checkpoint.options.map((option) => option.id);
      expect(optionIds).toContain(checkpoint.correctOptionId);
    }
  });

  it("prevents empty rationales", () => {
    for (const checkpoint of Object.values(PRE_NURSING_FOUNDATION_CHECKPOINTS)) {
      for (const option of checkpoint.options) {
        expect(option.rationale.trim().length).toBeGreaterThan(30);
      }
    }
  });
});
