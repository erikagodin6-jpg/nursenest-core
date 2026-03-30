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

/** How localized pathway lesson content was resolved for this response. */
export type PathwayLessonLocaleMeta = {
  /** BCP-47-style key the caller asked for (normalized). */
  requestedContentLocale: string;
  /** Locale of the DB row or catalog source actually rendered (normalized). */
  contentLocale: string;
  /** Requested locale had no published row; English (or another available locale) was used instead. */
  usedLocaleFallback: boolean;
  /** Narrative comes from bundled English catalog (not `pathway_lessons`). */
  isCatalogEnglishSource: boolean;
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
  localeMeta?: PathwayLessonLocaleMeta;
};
