export type NursingGeneratedContentKind =
  | "question"
  | "rationale"
  | "distractor-rationale"
  | "hint"
  | "lesson"
  | "blog";

export type NursingGeneratedContentBlock = {
  id: string;
  kind: NursingGeneratedContentKind;
  text: string;
};

export type ContentVariationIssueCode =
  | "REPEATED_OPENING_PATTERN"
  | "REPEATED_SENTENCE_FRAME"
  | "TEMPLATE_PHRASE"
  | "OVERUSED_EXPLANATION_CONNECTOR"
  | "LOW_STRUCTURAL_VARIATION";

export type ContentVariationIssue = {
  code: ContentVariationIssueCode;
  severity: "warning" | "error";
  ids: string[];
  message: string;
  remediation: string;
};

export type ContentVariationResult = {
  pass: boolean;
  score: number;
  issues: ContentVariationIssue[];
};

const TEMPLATE_PHRASES = [
  /\bthis option does not address\b/i,
  /\bthis is not the best answer\b/i,
  /\bthis is incorrect\b/i,
  /\bthe correct answer is correct because\b/i,
  /\bthis is the best answer because\b/i,
  /\breview the material\b/i,
  /\bimportant to know\b/i,
  /\bclinical reasoning is important\b/i,
  /\bpatient safety is important\b/i,
] as const;

const SENTENCE_FRAME_STARTERS = [
  "the nurse should",
  "this option",
  "the correct answer",
  "the priority",
  "because",
  "therefore",
  "the client",
  "the patient",
] as const;

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s'-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function words(value: string): string[] {
  return normalize(value).match(/\b[\p{L}\p{N}'-]+\b/gu) ?? [];
}

function firstWords(value: string, count: number): string {
  return words(value).slice(0, count).join(" ");
}

function sentences(value: string): string[] {
  return value
    .split(/[.!?]+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length >= 12);
}

function ngrams(values: string[], size: number): string[] {
  const grams: string[] = [];
  for (let i = 0; i <= values.length - size; i += 1) {
    grams.push(values.slice(i, i + size).join(" "));
  }
  return grams;
}

function addIssue(issues: ContentVariationIssue[], issue: ContentVariationIssue): void {
  issues.push(issue);
}

function groupedBy<T>(values: T[], key: (value: T) => string): Map<string, T[]> {
  const groups = new Map<string, T[]>();
  for (const value of values) {
    const k = key(value);
    if (!k) continue;
    groups.set(k, [...(groups.get(k) ?? []), value]);
  }
  return groups;
}

export function evaluateNursingContentVariation(
  blocks: readonly NursingGeneratedContentBlock[],
): ContentVariationResult {
  const nonEmpty = blocks.filter((block) => block.text.trim().length > 0);
  const issues: ContentVariationIssue[] = [];

  const openingGroups = groupedBy(nonEmpty, (block) => firstWords(block.text, 5));
  for (const [opening, group] of openingGroups) {
    if (opening.split(" ").length >= 4 && group.length >= 3) {
      addIssue(issues, {
        code: "REPEATED_OPENING_PATTERN",
        severity: "warning",
        ids: group.map((block) => block.id),
        message: `Multiple content blocks start with the same phrase: "${opening}".`,
        remediation:
          "Vary the opening by starting with the clinical cue, risk, learner misconception, or nursing principle instead of the same template.",
      });
    }
  }

  for (const block of nonEmpty) {
    const matched = TEMPLATE_PHRASES.find((pattern) => pattern.test(block.text));
    if (matched) {
      addIssue(issues, {
        code: "TEMPLATE_PHRASE",
        severity: "error",
        ids: [block.id],
        message: "Content uses template-like phrasing that can feel generated during study.",
        remediation:
          "Replace generic phrasing with a concrete cue, consequence, priority comparison, and transferable nursing principle.",
      });
    }
  }

  const frameHits = new Map<string, string[]>();
  for (const block of nonEmpty) {
    const starts = sentences(block.text)
      .map((sentence) => normalize(sentence))
      .map((sentence) => SENTENCE_FRAME_STARTERS.find((starter) => sentence.startsWith(starter)))
      .filter((starter): starter is (typeof SENTENCE_FRAME_STARTERS)[number] => starter !== undefined);
    for (const starter of starts) {
      frameHits.set(starter, [...(frameHits.get(starter) ?? []), block.id]);
    }
  }
  for (const [starter, ids] of frameHits) {
    const uniqueIds = Array.from(new Set(ids));
    if (uniqueIds.length >= 4) {
      addIssue(issues, {
        code: "REPEATED_SENTENCE_FRAME",
        severity: "warning",
        ids: uniqueIds,
        message: `Several explanations reuse the "${starter}" sentence frame.`,
        remediation:
          "Alternate sentence structure: lead with the cue, the risk, the delayed action, or the nursing framework.",
      });
    }
  }

  const connectorCount = nonEmpty.reduce((sum, block) => {
    return sum + (block.text.match(/\b(because|therefore|however|although|but)\b/gi)?.length ?? 0);
  }, 0);
  const totalSentences = nonEmpty.reduce((sum, block) => sum + sentences(block.text).length, 0);
  if (totalSentences >= 8 && connectorCount / totalSentences > 1.4) {
    addIssue(issues, {
      code: "OVERUSED_EXPLANATION_CONNECTOR",
      severity: "warning",
      ids: nonEmpty.map((block) => block.id),
      message: "Explanations overuse the same connective logic words.",
      remediation:
        "Mix concise teaching structures: cue recognition, priority comparison, risk statement, and principle takeaway.",
    });
  }

  const repeatedGramIds = new Map<string, Set<string>>();
  for (const block of nonEmpty) {
    for (const gram of new Set(ngrams(words(block.text), 6))) {
      if (gram.length < 30) continue;
      repeatedGramIds.set(gram, new Set([...(repeatedGramIds.get(gram) ?? []), block.id]));
    }
  }
  const repeatedFrame = Array.from(repeatedGramIds.entries()).find(([, ids]) => ids.size >= 3);
  if (repeatedFrame) {
    addIssue(issues, {
      code: "LOW_STRUCTURAL_VARIATION",
      severity: "warning",
      ids: Array.from(repeatedFrame[1]),
      message: "Multiple blocks repeat the same longer phrase or explanation structure.",
      remediation:
        "Rewrite one or more blocks so the clinical idea is taught with a different example, order, or comparison.",
    });
  }

  const penalty = issues.reduce((sum, issue) => sum + (issue.severity === "error" ? 18 : 7), 0);
  const score = Math.max(0, 100 - penalty);

  return {
    pass: score >= 82 && !issues.some((issue) => issue.severity === "error"),
    score,
    issues,
  };
}
