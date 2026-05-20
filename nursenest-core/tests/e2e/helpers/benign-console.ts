/**
 * Filters known-non-fatal console noise on public marketing pages (Playwright).
 * Next.js dev / RSC can forward server-side `[nursenest-core]` diagnostics as `console.error`;
 * allied hubs still render via fallbacks when optional Prisma reads fail in local DBs.
 */
export function isBenignPublicMarketingConsoleMessage(text: string): boolean {
  const t = text.toLowerCase();
  if (t.includes("favicon")) return true;
  if (t.includes("resizeobserver")) return true;
  // Forwarded server logs from pathway lesson hub pipeline (timeouts / schema drift / dev DB).
  if (/\[nursenest-core\]\s*pathway_lessons/i.test(text)) return true;
  // Marketing hub overview blocks (optional reads; page still renders).
  if (/\[nursenest-core\]\s*exam_pathway_hub/i.test(text)) return true;
  return false;
}
