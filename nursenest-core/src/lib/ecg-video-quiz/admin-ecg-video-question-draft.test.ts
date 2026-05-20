import assert from "node:assert/strict";
import test from "node:test";
import { QuestionType } from "@prisma/client";
import {
  ADMIN_AI_ECG_VIDEO_QUESTION_TOOL,
  buildEcgVideoQuestionDraft,
} from "@/lib/ecg-video-quiz/admin-ecg-video-question-draft";
import { ECG_VIDEO_QUESTION_FORMAT } from "@/lib/ecg-video-quiz/ecg-video-question";

test("ECG admin draft helper creates draft-only normalized question metadata", () => {
  const draft = buildEcgVideoQuestionDraft({
    stem: "Watch the ECG clip and identify the rhythm.",
    options: ["Normal sinus rhythm", "Atrial flutter", "Asystole", "SVT"],
    answerKey: ["Atrial flutter"],
    rationale: "Sawtooth flutter waves with a regular ventricular response support atrial flutter.",
    difficultyLabel: "INTERMEDIATE",
    exhibit: {
      kind: ECG_VIDEO_QUESTION_FORMAT,
      asset: { url: "https://cdn.example.test/flutter.mp4", mimeType: "video/mp4" },
      rhythmCategory: "Atrial flutter",
      recognitionClues: ["Sawtooth atrial activity", "Regular atrial rate"],
      linkedLesson: { href: "/lessons/ecg-atrial-flutter", title: "Atrial flutter ECG review" },
    },
  });

  assert.equal(ADMIN_AI_ECG_VIDEO_QUESTION_TOOL, "admin-ai-ecg-video-question-draft");
  assert.equal(draft.questionType, QuestionType.MCQ);
  assert.equal(draft.metadata?.difficultyLabel, "INTERMEDIATE");
  assert.equal(draft.metadata?.ecgVideo?.kind, ECG_VIDEO_QUESTION_FORMAT);
  assert.equal(draft.metadata?.ecgLevel, "basic");
  assert.equal(draft.metadata?.ecgMode, "quiz");
  assert.ok(draft.metadata?.tags?.includes("ecg-video"));
  assert.equal(draft.metadata?.lessonLinkSuggestions?.[0]?.confidence, "required");
});
