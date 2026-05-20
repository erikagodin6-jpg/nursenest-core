export type ContinueStudyActivityType = "lesson" | "flashcards" | "practice" | "clinical-scenario";

export type ContinueStudyCheckpoint = {
  pathwayId: string;
  topicSlug: string | null;
  lessonSlug: string | null;
  activityType: ContinueStudyActivityType;
  updatedAt: Date;
  href: string;
  label: string;
};
