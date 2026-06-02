import { prisma } from "@/lib/db";
import { defaultEcgQaMetadataForRhythm } from "@/lib/ecg-module/ecg-safety-governance";
import { filterDuplicateGeneratedQuestions, type EcgDedupQuestion } from "@/lib/ecg-module/ecg-question-dedup";
import { defaultEcgStripConfigForRhythm, type EcgStripMediaConfig } from "@/lib/ecg-module/ecg-waveform-generator";

export type EcgQuestionCategory = "rhythm" | "strip_video" | "case" | "electrolyte_medication" | "advanced";

export type GeneratedEcgQuestion = EcgDedupQuestion & {
  videoUrl: string;
  thumbnailUrl: string | null;
  durationSeconds: number | null;
  mediaType: "ecg_live_strip";
  mediaConfig: EcgStripMediaConfig;
  questionText: string;
  answerOptions: Array<{ id: string; text: string }>;
  correctAnswerId: string;
  rationale: string;
  difficulty: string;
  rhythmTag: string;
  clinicalPriority: string | null;
  allowedTiers: string[];
  isPremium: boolean;
  level: string;
  mode: string;
  topicTags: string[];
  lessonLinkCount: number;
  medicalQaStatus: string;
  clinicianReviewedAt: Date | null;
  clinicianReviewedBy: string | null;
  waveformFidelity: string;
  qaStatus: string;
  publishSafetyStatus: string;
};

export type EcgGenerationActivity = {
  category: EcgQuestionCategory;
  requested: number;
  generated: number;
  inserted: number;
  duplicatesRejected: number;
};

const RHYTHMS_BY_CATEGORY: Record<EcgQuestionCategory, string[]> = {
  rhythm: ["normal_sinus_rhythm", "sinus_bradycardia", "sinus_tachycardia", "atrial_fibrillation", "atrial_flutter", "svt", "pvcs", "pacs", "first_degree_av_block"],
  strip_video: ["atrial_fibrillation", "atrial_flutter", "ventricular_tachycardia", "ventricular_fibrillation", "asystole", "torsades_de_pointes", "paced_rhythm"],
  case: ["stemi_pattern", "pea", "third_degree_av_block", "svt", "atrial_fibrillation"],
  electrolyte_medication: ["hyperkalemia_pattern", "hypokalemia_pattern", "torsades_de_pointes"],
  advanced: ["ventricular_tachycardia", "ventricular_fibrillation", "second_degree_type_ii_av_block", "third_degree_av_block", "paced_rhythm"],
};

function label(rhythmKey: string): string {
  return rhythmKey.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function buildQuestion(category: EcgQuestionCategory, index: number): GeneratedEcgQuestion {
  const rhythmKey = RHYTHMS_BY_CATEGORY[category][index % RHYTHMS_BY_CATEGORY[category].length]!;
  const rhythmLabel = label(rhythmKey);
  const mediaConfig = defaultEcgStripConfigForRhythm(rhythmKey);
  const governance = defaultEcgQaMetadataForRhythm(rhythmKey, "generated");
  const suffix = `${category.replace(/_/g, " ")} set ${Math.floor(index / RHYTHMS_BY_CATEGORY[category].length) + 1}`;
  const options = [
    { id: "a", text: rhythmLabel },
    { id: "b", text: "Normal sinus rhythm" },
    { id: "c", text: "Atrial fibrillation" },
    { id: "d", text: "Ventricular tachycardia" },
  ].filter((option, optionIndex, all) => all.findIndex((x) => x.text === option.text) === optionIndex || optionIndex === 0);
  while (options.length < 4) options.push({ id: String.fromCharCode(97 + options.length), text: `ECG distractor ${options.length}` });

  return {
    videoUrl: "",
    thumbnailUrl: null,
    durationSeconds: null,
    mediaType: "ecg_live_strip",
    mediaConfig,
    questionText: `Identify the rhythm and immediate clinical concern shown in this deterministic ECG strip (${suffix}).`,
    answerOptions: options,
    correctAnswerId: "a",
    rationale: `${rhythmLabel} is identified by ${mediaConfig.rhythmKey.replace(/_/g, " ")} features in the validated template. The strip configuration is deterministic and should be reviewed against clinical presentation before learner publication.`,
    difficulty: mediaConfig.difficulty,
    rhythmTag: rhythmKey,
    clinicalPriority: category === "advanced" || category === "case" ? "urgent recognition" : null,
    allowedTiers: mediaConfig.pathwayTierScope.includes("PN") || mediaConfig.pathwayTierScope.includes("RPN") ? ["RN"] : ["RN", "NP"],
    isPremium: true,
    level: mediaConfig.difficulty === "advanced" ? "advanced" : "basic",
    mode: category === "strip_video" || category === "advanced" ? "drill" : "quiz",
    topicTags: ["ecg", category, rhythmKey, mediaConfig.difficulty],
    lessonLinkCount: category === "rhythm" || category === "strip_video" ? 1 : 0,
    medicalQaStatus: governance.qaStatus,
    clinicianReviewedAt: null,
    clinicianReviewedBy: null,
    waveformFidelity: governance.waveformFidelity,
    qaStatus: governance.qaStatus,
    publishSafetyStatus: governance.publishSafetyStatus,
  };
}

export function generateQuestionsForCategory(category: EcgQuestionCategory, countNeeded: number): GeneratedEcgQuestion[] {
  const count = Math.max(0, Math.min(100, Math.floor(countNeeded)));
  return Array.from({ length: count }, (_, index) => buildQuestion(category, index));
}

export async function generateAndInsertEcgQuestionsForCategory(
  category: EcgQuestionCategory,
  countNeeded: number,
  deps: {
    loadExisting?: () => Promise<EcgDedupQuestion[]>;
    insertMany?: (questions: GeneratedEcgQuestion[]) => Promise<number>;
  } = {},
): Promise<EcgGenerationActivity> {
  const generated = generateQuestionsForCategory(category, countNeeded);
  const existing =
    deps.loadExisting
      ? await deps.loadExisting()
      : await prisma.ecgVideoQuestion.findMany({
          select: { questionText: true, rhythmTag: true, topicTags: true, answerOptions: true, rationale: true },
          take: 5000,
        });
  const filtered = filterDuplicateGeneratedQuestions(generated, existing);
  const insertMany =
    deps.insertMany ??
    ((questions: GeneratedEcgQuestion[]) =>
      prisma.ecgVideoQuestion
        .createMany({
          data: questions,
          skipDuplicates: true,
        })
        .then((result) => result.count));
  const inserted = filtered.accepted.length > 0 ? await insertMany(filtered.accepted) : 0;
  return {
    category,
    requested: countNeeded,
    generated: generated.length,
    inserted,
    duplicatesRejected: filtered.rejected.length,
  };
}
