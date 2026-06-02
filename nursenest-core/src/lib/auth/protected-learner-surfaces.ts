/**
 * Central auth-surface classifier for learner content.
 *
 * Public marketing pages can still describe activities, but any learner
 * workspace, session, or subscriber API must pass server-side auth before
 * content is allowed to render or data is returned.
 */

export const PROTECTED_LEARNER_PAGE_PREFIXES = [
  "/app",
  "/activities",
  "/dashboard",
  "/study",
  "/study-tools",
] as const;

export const PROTECTED_LEARNER_API_PREFIXES = [
  "/api/ai/study-plan",
  "/api/cat",
  "/api/exam-questions",
  "/api/exams",
  "/api/flashcards",
  "/api/learner",
  "/api/lessons",
  "/api/practice-tests",
  "/api/questions",
  "/api/remediation",
  "/api/study-plan",
  "/api/study-tools",
  "/api/verified-study",
] as const;

function matchesPrefix(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function isProtectedLearnerPagePath(pathname: string): boolean {
  return PROTECTED_LEARNER_PAGE_PREFIXES.some((prefix) => matchesPrefix(pathname, prefix));
}

export function isProtectedLearnerApiPath(pathname: string): boolean {
  return PROTECTED_LEARNER_API_PREFIXES.some((prefix) => matchesPrefix(pathname, prefix));
}

export function isProtectedLearnerAuthPath(pathname: string): boolean {
  return isProtectedLearnerPagePath(pathname) || isProtectedLearnerApiPath(pathname);
}
