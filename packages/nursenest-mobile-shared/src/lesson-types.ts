/**
 * Minimal DTOs mirroring `GET /api/learner/pathway-lessons*`
 * and `GET /api/learner/pathway-lesson` — server is canonical; types are best-effort mirrors.
 */

export type PathwayLessonProgressStatus = "not_started" | "in_progress" | "completed";

export type MobilePathwayLessonExamSpecificMetadata = {
  readonly examType: string;
  readonly nursingRole: string;
  readonly country: string;
  readonly scopeLevel: string;
  readonly unitSystem: string;
  readonly specialty: string | null;
  readonly difficultyTier: string;
  readonly acuityLevel: string;
  readonly clinicalJudgmentLevel: string;
};

export type MobilePathwayLessonListRow = {
  readonly id: string;
  readonly title: string;
  readonly summary: string | null;
  readonly topic: string | null;
  readonly bodySystem: string | null;
  readonly topicSlug?: string | null;
  readonly pathwayMeta: { readonly pathwayId: string; readonly slug: string };
  readonly examSpecificMetadata?: MobilePathwayLessonExamSpecificMetadata | null;
};

export type MobilePathwayLessonsListResponse = {
  readonly source: "pathway_lessons";
  readonly total: number;
  readonly page: number;
  readonly pageCount: number;
  readonly pageSize: number;
  readonly defaultPageSize: number;
  readonly scanCapped: boolean;
  readonly rows: MobilePathwayLessonListRow[];
  /** `${pathwayId}:${slug}` → status. Omitted or null when `canShowLessonProgress` is false. */
  readonly progressByPathwaySlug: Record<string, PathwayLessonProgressStatus> | null;
  readonly entitlement: {
    readonly hasAccess: boolean;
    readonly canShowLessonProgress: boolean;
  };
  readonly visiblePathwayIds: string[];
};

export type MobilePathwayLessonTopicsResponse = {
  readonly pathwayId: string;
  readonly topics: ReadonlyArray<{ readonly topicSlug: string; readonly label: string }>;
};

/** Subset of `PathwayLessonSection` for mobile rendering (expand as UI grows). */
export type MobilePathwayLessonSection = {
  readonly id: string;
  readonly heading: string;
  readonly kind: string;
  readonly body: string;
};

/** Loose record shape — detail screen selects known fields; unknown keys tolerated from API. */
export type MobilePathwayLessonRecord = {
  readonly slug: string;
  readonly title: string;
  readonly topic: string;
  readonly topicSlug: string;
  readonly bodySystem: string;
  readonly sections: MobilePathwayLessonSection[];
  readonly seoDescription?: string;
  readonly relatedLessonRefs?: ReadonlyArray<{ readonly slug: string; readonly titleHint?: string }>;
  /** Present on many pathway lessons when authored — optional mirror of web record. */
  readonly studyTakeaways?: readonly string[];
  readonly studyCommonTraps?: readonly string[];
  readonly memoryAnchor?: string;
  readonly exams?: readonly string[];
  readonly activeExamMeta?: { readonly exam?: string; readonly yieldLevel?: string };
  readonly examSpecificMetadata?: MobilePathwayLessonExamSpecificMetadata | null;
};

export type MobilePathwayLessonDetailResponse = {
  readonly pathwayId: string;
  readonly lessonId: string;
  readonly record: MobilePathwayLessonRecord;
  readonly progressStatus: PathwayLessonProgressStatus;
  readonly related: ReadonlyArray<{
    readonly lessonId: string | null;
    readonly slug: string;
    readonly title: string;
    readonly topicSlug: string;
    readonly topic: string;
  }>;
  readonly entitlement: {
    readonly hasAccess: boolean;
    readonly canShowLessonProgress: boolean;
  };
};
