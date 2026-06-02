export type SimilarQuestionSourceType =
  | "flashcard"
  | "practice_question"
  | "cat_exam"
  | "ecg_question"
  | "pharmacology_question"
  | "clinical_skills_question";

export type SimilarQuestionContext = {
  sourceType: SimilarQuestionSourceType;
  sourceId: string;
  topic?: string | null;
  subtopic?: string | null;
  nclexObjective?: string | null;
  clinicalConcept?: string | null;
  medicationClass?: string | null;
  ecgRhythmCategory?: string | null;
  pathwayId?: string | null;
  currentCorrect?: boolean | null;
  lowConfidence?: boolean | null;
  previouslyMissed?: boolean | null;
  weakArea?: boolean | null;
};

export type SimilarQuestionCount = 3 | 5 | "all";

export type SimilarQuestionBasis =
  | { kind: "medication_class"; label: string; topicName: string }
  | { kind: "ecg_rhythm_category"; label: string; topicName: string }
  | { kind: "nclex_objective"; label: string; topicName: string }
  | { kind: "clinical_concept"; label: string; topicName: string }
  | { kind: "subtopic"; label: string; topicName: string }
  | { kind: "topic"; label: string; topicName: string };

function clean(value: string | null | undefined): string | null {
  const v = value?.replace(/\s+/g, " ").trim();
  return v && v.length > 1 ? v : null;
}

export function deriveSimilarQuestionBasis(context: SimilarQuestionContext): SimilarQuestionBasis | null {
  const medicationClass = clean(context.medicationClass);
  if (medicationClass) {
    return { kind: "medication_class", label: `same medication class: ${medicationClass}`, topicName: medicationClass };
  }

  const ecgRhythmCategory = clean(context.ecgRhythmCategory);
  if (ecgRhythmCategory) {
    return { kind: "ecg_rhythm_category", label: `same ECG rhythm category: ${ecgRhythmCategory}`, topicName: ecgRhythmCategory };
  }

  const nclexObjective = clean(context.nclexObjective);
  if (nclexObjective) {
    return { kind: "nclex_objective", label: `same NCLEX objective: ${nclexObjective}`, topicName: nclexObjective };
  }

  const clinicalConcept = clean(context.clinicalConcept);
  if (clinicalConcept) {
    return { kind: "clinical_concept", label: `same clinical concept: ${clinicalConcept}`, topicName: clinicalConcept };
  }

  const subtopic = clean(context.subtopic);
  if (subtopic) {
    return { kind: "subtopic", label: `same concept: ${subtopic}`, topicName: subtopic };
  }

  const topic = clean(context.topic);
  if (topic) {
    return { kind: "topic", label: `same topic: ${topic}`, topicName: topic };
  }

  return null;
}

export function buildSimilarQuestionsHref(context: SimilarQuestionContext, count: SimilarQuestionCount): string | null {
  const basis = deriveSimilarQuestionBasis(context);
  if (!basis) return null;

  if (context.sourceType === "ecg_question") {
    const qs = new URLSearchParams();
    qs.set("level", "basic");
    qs.set("mode", "drills");
    qs.set("similarRhythm", basis.topicName);
    if (count !== "all") qs.set("count", String(count));
    return `/modules/ecg-interpretation/practice?${qs.toString()}`;
  }

  const qs = new URLSearchParams();
  if (context.pathwayId?.trim()) qs.set("pathwayId", context.pathwayId.trim());
  qs.set("topic", basis.topicName);
  qs.set("source", "similar_questions");
  qs.set("mode", context.weakArea ? "weak" : "random");
  qs.set("count", count === "all" ? "30" : String(count));

  if (context.weakArea) qs.set("studyFilter", "weak");
  else if (context.previouslyMissed) qs.set("studyFilter", "incorrect");
  else qs.set("studyFilter", "all");

  return `/app/questions/start?${qs.toString()}`;
}

export function similarQuestionAdaptiveReason(context: SimilarQuestionContext): string {
  const basis = deriveSimilarQuestionBasis(context);
  const target = basis?.label ?? "the same learning target";

  if (context.weakArea) {
    return `Reinforce ${target}. Weak-area practice is prioritized first.`;
  }
  if (context.previouslyMissed || context.currentCorrect === false) {
    return `Reinforce ${target}. Previously missed concepts are prioritized first.`;
  }
  if (context.lowConfidence) {
    return `Reinforce ${target}. Low-confidence answers are prioritized first.`;
  }
  return `Reinforce ${target} with a focused follow-up set.`;
}
