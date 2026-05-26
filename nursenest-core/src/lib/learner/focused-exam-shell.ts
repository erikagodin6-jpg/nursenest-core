/**
 * Active practice-test session routes get a stripped exam chrome — no nav, footer, or widgets.
 * Path format: /app/practice-tests/[sessionId]  (exactly one dynamic segment, not a static leaf).
 */
const NON_SESSION_PRACTICE_TEST_SLUGS = new Set([
  "start",
  "cat-launch",
  "cat-insights",
  "results",
]);

const PRACTICE_TEST_SESSION_PREFIX = "/app/practice-tests/";

export function isFocusedPracticeTestSessionPath(inputPathname: string | null | undefined): boolean {
  if (!inputPathname) return false;
  const pathname = (inputPathname.split("?")[0] ?? "").replace(/\/+$/, "");
  if (!pathname.startsWith(PRACTICE_TEST_SESSION_PREFIX)) return false;
  const segment = pathname.slice(PRACTICE_TEST_SESSION_PREFIX.length);
  if (!segment || segment.includes("/")) return false;
  return !NON_SESSION_PRACTICE_TEST_SLUGS.has(segment);
}
