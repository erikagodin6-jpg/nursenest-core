/** NextAuth is pinned to `/api/auth` in web (`PINNED_AUTH_BASE_PATH`). */
export const AUTH_BASE = "/api/auth";

export const apiPaths = {
  authCsrf: `${AUTH_BASE}/csrf`,
  authSession: `${AUTH_BASE}/session`,
  /** Auth.js / NextAuth credentials provider callback. */
  authCredentialsCallback: `${AUTH_BASE}/callback/credentials`,
  authSignOut: `${AUTH_BASE}/signout`,
  learnerPersonalProfile: "/api/learner/personal-profile",
  learnerCommandCenter: "/api/learner/command-center",
  learnerReadiness: "/api/learner/readiness",
  flashcardsDueSummary: "/api/flashcards/due-summary",
  learnerEngagementNudges: "/api/learner/engagement-nudges",
  /** Pathway lesson hub + detail (subscriber; PathwayLesson canonical). */
  learnerPathwayLessons: "/api/learner/pathway-lessons",
  learnerPathwayLessonTopics: "/api/learner/pathway-lessons/topics",
  learnerPathwayLessonDetail: "/api/learner/pathway-lesson",
  lessonsPathwayProgress: "/api/lessons/pathway-progress",
} as const;
