/**
 * True only on the practice-exams landing hub (`/app/practice-tests`), not session routes,
 * CAT launch bridges, or insights. Hides secondary learner chrome so the exam workspace
 * dominates the first viewport.
 */
export function isPracticeTestsHubLandingPath(inputPathname: string | null | undefined): boolean {
  const pathname = (inputPathname ?? "").split("?")[0]?.split("#")[0]?.replace(/\/+$/, "") ?? "";
  return pathname === "/app/practice-tests";
}
