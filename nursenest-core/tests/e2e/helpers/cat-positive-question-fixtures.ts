/**
 * Minimal synthetic `question` objects for CAT GET interception — keep shapes aligned
 * with `practiceRunnerNeedsUnsupportedFallback` + Bowtie normalization.
 */
export const CAT_POSITIVE_FIXTURE_STEMS = {
  mcq: "E2E CAT matrix — select the best answer for this synthetic item.",
  sata: "E2E CAT matrix — select all that apply.",
  bowtie: "E2E CAT matrix — assign one option to each row.",
} as const;

export function catPositiveMcqQuestion(overrides: Partial<Record<string, unknown>> = {}): Record<string, unknown> {
  return {
    questionType: "MCQ",
    stem: CAT_POSITIVE_FIXTURE_STEMS.mcq,
    options: ["Alpha", "Bravo", "Charlie", "Delta"],
    correctAnswer: "Alpha",
    rationale: "Because Alpha is correct for this fixture.",
    ...overrides,
  };
}

export function catPositiveSataQuestion(overrides: Partial<Record<string, unknown>> = {}): Record<string, unknown> {
  return {
    questionType: "SATA",
    stem: CAT_POSITIVE_FIXTURE_STEMS.sata,
    options: ["One", "Two", "Three", "Four"],
    correctAnswer: ["One", "Three"],
    rationale: "One and Three are correct for this fixture.",
    ...overrides,
  };
}

export function catPositiveBowtieQuestion(overrides: Partial<Record<string, unknown>> = {}): Record<string, unknown> {
  return {
    questionType: "Bowtie",
    stem: CAT_POSITIVE_FIXTURE_STEMS.bowtie,
    options: {
      format: "bowtie",
      bank: [
        { id: "c1", text: "Condition A" },
        { id: "c2", text: "Condition B" },
        { id: "i1", text: "Intervention 1" },
        { id: "m1", text: "Monitor 1" },
      ],
    },
    correctAnswer: { condition: "c1", intervention: "i1", monitoring: "m1" },
    rationale: "Synthetic bowtie mapping.",
    ...overrides,
  };
}
