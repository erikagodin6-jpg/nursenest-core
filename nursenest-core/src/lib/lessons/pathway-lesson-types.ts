/** Canonical five-block structure (render order). Legacy catalog kinds are normalized into these. */
export type PathwayLessonSectionKind =
  | "clinical_meaning"
  | "exam_relevance"
  | "core_concept"
  | "clinical_scenario"
  | "takeaways"
  | "intro"
  | "core"
  | "clinical_application"
  | "exam_tips";

export type PathwayLessonSection = {
  id: string;
  heading: string;
  kind: PathwayLessonSectionKind;
  body: string;
};

export type PathwayLessonRecord = {
  slug: string;
  title: string;
  topic: string;
  topicSlug: string;
  bodySystem: string;
  previewSectionCount: number;
  seoTitle: string;
  seoDescription: string;
  sections: PathwayLessonSection[];
};
