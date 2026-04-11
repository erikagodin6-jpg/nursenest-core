/**
 * Per-user study defaults stored in localStorage (device-local).
 * Used by `/app/account/study-preferences` and consumed by question bank / practice exam UIs.
 */

export const LEARNER_STUDY_DEFAULTS_VERSION = 1 as const;

export type LearnerStudyDefaultsV1 = {
  v: typeof LEARNER_STUDY_DEFAULTS_VERSION;
  questionBank: {
    /** Items per fetch / session builder default. */
    sessionSize: number;
    /** Exam-style bank: rationales deferred until the learner reveals them. */
    examShell: boolean;
  };
  practiceExam: {
    /** Surface timed mode first on the practice exam picker when true. */
    timedPreferred: boolean;
  };
  lessonAssessments: {
    /** When false, lesson pages open directly into content without pre/post assessments. */
    enabled: boolean;
  };
};

export const ALLOWED_QBANK_SESSION_SIZES = [10, 15, 20, 25, 30] as const;

export function studyDefaultsStorageKey(userId: string): string {
  return `nn_learner_study_defaults_${userId}`;
}

export function defaultLearnerStudyDefaults(): LearnerStudyDefaultsV1 {
  return {
    v: 1,
    questionBank: { sessionSize: 20, examShell: false },
    practiceExam: { timedPreferred: false },
    lessonAssessments: { enabled: true },
  };
}

function clampSessionSize(n: number): number {
  if (!Number.isFinite(n)) return 20;
  const allowed = ALLOWED_QBANK_SESSION_SIZES as readonly number[];
  return allowed.includes(n) ? n : 20;
}

export function readLearnerStudyDefaults(userId: string): LearnerStudyDefaultsV1 {
  if (typeof window === "undefined") return defaultLearnerStudyDefaults();
  try {
    const raw = localStorage.getItem(studyDefaultsStorageKey(userId));
    if (!raw) return defaultLearnerStudyDefaults();
    const j = JSON.parse(raw) as Partial<LearnerStudyDefaultsV1>;
    if (j.v !== 1) return defaultLearnerStudyDefaults();
    return {
      v: 1,
      questionBank: {
        sessionSize: clampSessionSize(Number(j.questionBank?.sessionSize)),
        examShell: Boolean(j.questionBank?.examShell),
      },
      practiceExam: {
        timedPreferred: Boolean(j.practiceExam?.timedPreferred),
      },
      lessonAssessments: {
        enabled: j.lessonAssessments?.enabled !== false,
      },
    };
  } catch {
    return defaultLearnerStudyDefaults();
  }
}

export function writeLearnerStudyDefaults(userId: string, next: LearnerStudyDefaultsV1): void {
  try {
    localStorage.setItem(studyDefaultsStorageKey(userId), JSON.stringify(next));
  } catch {
    /* quota / private mode */
  }
}
