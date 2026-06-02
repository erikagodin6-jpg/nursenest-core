/**
 * Korea nursing exam marketing surfaces (`/exams/korea`, `/korea/nursing-exam`).
 * Path-based navigation priority for `/exams/korea` and `/korea/*`.
 */

export function shouldPrioritizeKoreaNavigation(pathname: string): boolean {
  const p = pathname.startsWith("/") ? pathname : `/${pathname}`;
  if (p === "/exams/korea" || p.startsWith("/exams/korea/")) return true;
  if (p.startsWith("/korea/")) return true;
  return false;
}
