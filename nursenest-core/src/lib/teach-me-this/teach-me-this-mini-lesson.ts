export type TeachMeThisMiniLesson = {
  conceptOverview: string;
  whyItMatters: string;
  clinicalExample: string;
  patientScenario: string;
  nclexTip: string;
  memoryHook: string;
  practiceQuestion: {
    prompt: string;
    answer: string;
  };
};

export type TeachMeThisInput = {
  topic?: string | null;
  subtopic?: string | null;
  questionStem?: string | null;
  correctAnswer?: string | null;
  rationale?: string | null;
  clinicalPearl?: string | null;
  examTip?: string | null;
  memoryHook?: string | null;
};

function cleanText(value: string | null | undefined): string {
  return String(value ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function sentences(value: string | null | undefined): string[] {
  const text = cleanText(value);
  if (!text) return [];
  const matches = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) ?? [];
  return matches.map((part) => part.trim()).filter((part) => part.length > 0);
}

function firstSentences(value: string | null | undefined, count: number, fallback: string): string {
  const selected = sentences(value).slice(0, count).join(" ");
  return selected || fallback;
}

function truncate(value: string, max = 220): string {
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1).trim()}…`;
}

export function buildTeachMeThisMiniLesson(input: TeachMeThisInput): TeachMeThisMiniLesson {
  const topic = cleanText(input.subtopic) || cleanText(input.topic) || "this concept";
  const stem = cleanText(input.questionStem);
  const answer = cleanText(input.correctAnswer);
  const rationale = cleanText(input.rationale);
  const rationaleSentences = sentences(rationale);
  const firstRationale = rationaleSentences[0] ?? "";
  const secondRationale = rationaleSentences[1] ?? "";
  const thirdRationale = rationaleSentences[2] ?? "";
  const pearl = cleanText(input.clinicalPearl);
  const examTip = cleanText(input.examTip);
  const memoryHook = cleanText(input.memoryHook);

  return {
    conceptOverview: firstRationale
      ? truncate(firstRationale)
      : `Review the core cues for ${topic} before continuing this study session.`,
    whyItMatters: pearl
      ? truncate(pearl)
      : secondRationale
        ? truncate(secondRationale)
        : `Missing ${topic} can affect prioritization, safety, and the next clinical decision.`,
    clinicalExample: secondRationale
      ? truncate(secondRationale)
      : answer
        ? `In this item, the safest answer is tied to ${answer}. Use the stem cues to explain why it fits.`
        : firstSentences(rationale, 1, `Apply ${topic} to the patient finding in the stem.`),
    patientScenario: stem
      ? truncate(`Patient scenario: ${stem}`, 260)
      : `Patient scenario: A learner is asked to apply ${topic} to a changing clinical cue and choose the safest next action.`,
    nclexTip: examTip
      ? truncate(examTip)
      : thirdRationale
        ? truncate(thirdRationale)
        : `On exam items, connect the key cue to the safest action before comparing distractors.`,
    memoryHook: memoryHook || (answer ? `${topic}: cue before choice` : `${topic}: identify the cue first`),
    practiceQuestion: {
      prompt: stem
        ? `What cue in this stem makes ${topic} the concept to review?`
        : `Which finding would make ${topic} clinically important?`,
      answer: firstSentences(rationale, 2, answer || `Name the cue, explain the risk, then choose the safest action.`),
    },
  };
}
