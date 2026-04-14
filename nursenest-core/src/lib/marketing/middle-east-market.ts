/**
 * Middle East / Gulf nursing exam surfaces (Prometric, DHA, HAAD, Qatar, DataFlow).
 * Drives header navigation priority for Arabic/Urdu locales and Gulf exam routes.
 */

export const MIDDLE_EAST_PRIORITY_LOCALES = new Set(["ar", "ur"]);

export function shouldPrioritizeMiddleEastNavigation(pathname: string, locale: string): boolean {
  const p = pathname.startsWith("/") ? pathname : `/${pathname}`;
  if (p === "/exams/middle-east" || p.startsWith("/exams/middle-east/")) return true;
  if (p.startsWith("/middle-east/")) return true;
  if (MIDDLE_EAST_PRIORITY_LOCALES.has(locale)) return true;
  return false;
}
