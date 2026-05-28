"use client";

import type { ComponentProps } from "react";
import { FlashcardStudyQuestionStack } from "@/components/flashcards/flashcard-study-question-stack";

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
  void type;
  void layout;
  return <FlashcardStudyQuestionStack {...stackProps} />;
}
