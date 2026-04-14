/**
 * China nursing exam marketing surfaces (NNQE, work abroad).
 * Path-based navigation priority for `/exams/china` and `/china/*`.
 */

export function shouldPrioritizeChinaNavigation(pathname: string): boolean {
  const p = pathname.startsWith("/") ? pathname : `/${pathname}`;
  if (p === "/exams/china" || p.startsWith("/exams/china/")) return true;
  if (p.startsWith("/china/")) return true;
  return false;
}
