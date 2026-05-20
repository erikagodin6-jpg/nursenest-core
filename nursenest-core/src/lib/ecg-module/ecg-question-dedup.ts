export type EcgDedupQuestion = {
  questionText?: string | null;
  stem?: string | null;
  rhythmTag?: string | null;
  topicTags?: string[] | null;
  answerOptions?: unknown;
  rationale?: string | null;
};

export type EcgDuplicateDecision = {
  duplicate: boolean;
  reason: string | null;
  matchedIndex: number | null;
};

export function normalizeQuestionText(value: string | null | undefined): string {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokens(value: string): Set<string> {
  return new Set(normalizeQuestionText(value).split(" ").filter((token) => token.length > 2));
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 1;
  let overlap = 0;
  for (const token of a) if (b.has(token)) overlap += 1;
  return overlap / (a.size + b.size - overlap);
}

function answerText(value: unknown): string {
  if (!Array.isArray(value)) return normalizeQuestionText(String(value ?? ""));
  return normalizeQuestionText(
    value
      .map((entry) => {
        if (entry && typeof entry === "object" && !Array.isArray(entry)) {
          const record = entry as Record<string, unknown>;
          return `${record.id ?? ""} ${record.text ?? ""}`;
        }
        return String(entry ?? "");
      })
      .join(" "),
  );
}

function concept(question: EcgDedupQuestion): string {
  return normalizeQuestionText([question.rhythmTag, ...(question.topicTags ?? [])].filter(Boolean).join(" "));
}

export function isDuplicateEcgQuestion(candidate: EcgDedupQuestion, existing: EcgDedupQuestion[]): EcgDuplicateDecision {
  const candidateStem = normalizeQuestionText(candidate.questionText ?? candidate.stem);
  const candidateConcept = concept(candidate);
  const candidateAnswers = tokens(answerText(candidate.answerOptions));
  const candidateRationale = tokens(candidate.rationale ?? "");

  for (let index = 0; index < existing.length; index += 1) {
    const row = existing[index];
    const rowStem = normalizeQuestionText(row.questionText ?? row.stem);
    if (candidateStem && candidateStem === rowStem) {
      return { duplicate: true, reason: "normalized_stem", matchedIndex: index };
    }

    const sameConcept = candidateConcept.length > 0 && candidateConcept === concept(row);
    const answerSimilarity = jaccard(candidateAnswers, tokens(answerText(row.answerOptions)));
    const rationaleSimilarity = jaccard(candidateRationale, tokens(row.rationale ?? ""));
    if (sameConcept && answerSimilarity >= 0.82 && rationaleSimilarity >= 0.72) {
      return { duplicate: true, reason: "concept_answers_rationale", matchedIndex: index };
    }
  }

  return { duplicate: false, reason: null, matchedIndex: null };
}

export function filterDuplicateGeneratedQuestions<T extends EcgDedupQuestion>(
  generated: T[],
  existing: EcgDedupQuestion[],
): { accepted: T[]; rejected: Array<{ question: T; reason: string }> } {
  const accepted: T[] = [];
  const rejected: Array<{ question: T; reason: string }> = [];
  const seen = [...existing];
  for (const question of generated) {
    const decision = isDuplicateEcgQuestion(question, seen);
    if (decision.duplicate) {
      rejected.push({ question, reason: decision.reason ?? "duplicate" });
      continue;
    }
    accepted.push(question);
    seen.push(question);
  }
  return { accepted, rejected };
}
