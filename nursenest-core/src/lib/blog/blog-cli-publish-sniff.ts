/**
 * Lightweight heuristics for CLI / audit checks (not a substitute for full pre-publish validation).
 */

/** True when HTML contains Unicode en dash or em dash (often flagged in editorial style guides). */
export function blogHtmlContainsUnicodeDash(html: string): boolean {
  return /[\u2014\u2013]/.test(html);
}

/** Heuristic: obvious placeholder / fake citation lines for tests and CLI warnings. */
export function blogReferenceLineLooksLikePlaceholder(line: string): boolean {
  const t = line.toLowerCase();
  if (/\bplaceholder\b|\blorem ipsum\b|\[insert\b|\btbd\b|\bfixme\b|\bxxx\b/i.test(t)) return true;
  if (/\bexample\.com\b|\bfakejournal\b|\btestdoi\b|\bno\s+such\s+journal\b/i.test(t)) return true;
  if (/https?:\/\/\s*example\./i.test(t)) return true;
  return false;
}
