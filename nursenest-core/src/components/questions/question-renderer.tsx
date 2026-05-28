"use client";

import type { ComponentProps } from "react";
import { FlashcardStudyQuestionStack } from "@/components/flashcards/flashcard-study-question-stack";
import { buildAdaptiveCaseSimulation } from "@/lib/questions/adaptive-case-simulation";

export type QuestionRendererMode = "flashcard" | "practice" | "exam" | "review";
export type QuestionRendererLayout = "standard";

type FlashcardStackProps = ComponentProps<typeof FlashcardStudyQuestionStack>;

export type QuestionRendererProps = FlashcardStackProps & {
  mode: QuestionRendererMode;
  type?: string | null;
  layout?: QuestionRendererLayout;
};

export function QuestionRenderer({
  mode,
  type,
  layout = "standard",
  ...stackProps
}: QuestionRendererProps) {
  void mode;
  void layout;
  const adaptiveCaseSimulation =
    stackProps.adaptiveCaseSimulation ??
    buildAdaptiveCaseSimulation({
      id: `${type ?? mode}-${stackProps.questionLabel ?? stackProps.prompt.slice(0, 48)}`,
      questionType: type,
      stem: stackProps.prompt,
      topic: stackProps.topicLine,
      rationale: stackProps.explanation ?? stackProps.answer,
    });
  return <FlashcardStudyQuestionStack {...stackProps} adaptiveCaseSimulation={adaptiveCaseSimulation} />;
}
