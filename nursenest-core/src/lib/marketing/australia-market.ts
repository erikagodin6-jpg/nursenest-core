/**
 * Australia nursing registration surfaces (AHPRA, NMBA, OBA/OSCE).
 * Drives header navigation priority on Australia exam routes (path-based).
 *
 * Note: Marketing `NursenestRegion` is US/CA-only; Australia selection in other
 * global UIs does not yet map here—use pathname triggers for reliable behaviour.
 */

export function shouldPrioritizeAustraliaNavigation(pathname: string): boolean {
  const p = pathname.startsWith("/") ? pathname : `/${pathname}`;
  if (p === "/exams/australia" || p.startsWith("/exams/australia/")) return true;
  if (p.startsWith("/australia/")) return true;
  return false;
}
