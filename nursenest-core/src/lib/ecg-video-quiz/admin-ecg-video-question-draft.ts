import { QuestionType } from "@prisma/client";
import { ECG_VIDEO_QUESTION_FORMAT, ECG_VIDEO_TAG, type EcgVideoQuestionExhibit } from "@/lib/ecg-video-quiz/ecg-video-question";
import type { NormalizedQuestionDraft } from "@/lib/content/ai-draft-validation";

export const ADMIN_AI_ECG_VIDEO_QUESTION_TOOL = "admin-ai-ecg-video-question-draft";

export function buildEcgVideoQuestionDraft(args: {
  stem: string;
  options: string[];
  answerKey: string[];
  rationale: string;
  topicTag?: string;
  difficultyLabel?: string;
  exhibit: EcgVideoQuestionExhibit;
  level?: "basic" | "advanced";
  mode?: "lesson" | "quiz" | "drill";
  tags?: string[];
}): NormalizedQuestionDraft {
  const tags = [...new Set([...(args.tags ?? []), ECG_VIDEO_TAG, args.exhibit.rhythmCategory].filter(Boolean))];
  return {
    stem: args.stem.trim(),
    rationale: args.rationale.trim(),
    options: args.options.map((x) => x.trim()).filter(Boolean),
    answerKey: args.answerKey.map((x) => x.trim()).filter(Boolean),
    questionType: QuestionType.MCQ,
    topicTag: args.topicTag?.trim() || args.exhibit.rhythmCategory,
    metadata: {
      difficultyLabel: args.difficultyLabel,
      tags,
      ecgLevel: args.level ?? "basic",
      ecgMode: args.mode ?? "quiz",
      ecgVideo: {
        ...args.exhibit,
        kind: ECG_VIDEO_QUESTION_FORMAT,
      },
      lessonLinkSuggestions: args.exhibit.linkedLesson
        ? [
            {
              title: args.exhibit.linkedLesson.title ?? "Linked ECG lesson",
              slug: args.exhibit.linkedLesson.slug,
              reason: "ECG video question requires a reviewed linked lesson before publishing.",
              confidence: "required",
            },
          ]
        : undefined,
    },
  };
}
