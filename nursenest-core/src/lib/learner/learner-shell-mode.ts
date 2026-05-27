/**
 * Centralised learner shell mode resolver.
 *
 * Single source of truth for which chrome and widgets are suppressed on any
 * learner route.  All layout-level gating MUST derive from `learnerShellFlags`
 * rather than calling individual path helpers directly.  This makes it
 * impossible to silently break exam isolation by touching one helper in
 * isolation — any change must be made here and will be caught by the test suite.
 */

import { isFocusedPracticeTestSessionPath } from "./focused-exam-shell";
import { isFlashcardsFocusedStudyPath, isFlashcardsHubLandingPath } from "./flashcards-hub-focused-shell";
import { isPracticeTestsHubLandingPath } from "./practice-tests-hub-focused-shell";

/**
 * Coarse-grained mode describing which UI tier a learner route belongs to.
 *
 * exam-focused     — active practice-test / CAT session: minimal chrome only
 * flashcards-study — active flashcard study session: no study-next widgets
 * study-hub        — flashcards or practice-tests hub landing: no study-next widgets
 * dashboard        — the root `/app` dashboard
 * standard         — all other learner routes
 */
export type LearnerShellMode =
  | "exam-focused"
  | "flashcards-study"
  | "study-hub"
  | "dashboard"
  | "standard";

export type LearnerShellFlags = {
  readonly mode: LearnerShellMode;
  /** Replace full learner nav with the minimal exam-only exit strip. */
  readonly suppressFullChrome: boolean;
  /** Hide study-next block, learner-path strip, paywall stats fetch, etc. */
  readonly suppressStudyWidgets: boolean;
  /** True only on the root `/app` dashboard. */
  readonly isDashboard: boolean;
};

/** Strip query-string and trailing slash once so every helper gets a clean path. */
function normaliseLearnerPath(raw: string | null | undefined): string {
  return (raw?.split("?")[0] ?? "").replace(/\/+$/, "") || "/app";
}

export function resolveLearnerShellMode(pathname: string | null | undefined): LearnerShellMode {
  if (pathname == null) return "standard";
  const path = normaliseLearnerPath(pathname);
  if (isFocusedPracticeTestSessionPath(path)) return "exam-focused";
  if (path === "/app") return "dashboard";
  if (isFlashcardsFocusedStudyPath(path)) return "flashcards-study";
  if (isFlashcardsHubLandingPath(path) || isPracticeTestsHubLandingPath(path)) return "study-hub";
  return "standard";
}

export function learnerShellFlags(pathname: string | null | undefined): LearnerShellFlags {
  const mode = resolveLearnerShellMode(pathname);
  return {
    mode,
    suppressFullChrome: mode === "exam-focused" || mode === "flashcards-study",
    suppressStudyWidgets: mode === "exam-focused" || mode === "flashcards-study" || mode === "study-hub",
    isDashboard: mode === "dashboard",
  };
}
