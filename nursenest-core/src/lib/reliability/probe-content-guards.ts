import {
  collectForbiddenProductionTextViolations,
  formatMarketingDomViolationMessage,
  htmlToProbePlainText,
} from "@/lib/validation/forbidden-production-text";

/** Case-insensitive phrases that indicate a broken or degraded public surface. */
export const RELIABILITY_FAILURE_PHRASES = [
  "application error",
  "something went wrong",
  "temporarily unavailable",
  "lesson unavailable",
  "missing key",
] as const;

/** Raw i18n-style keys that must not appear verbatim in HTML bodies. */
const RAW_I18N_SUBSTRINGS = ["pages.home.", "pages.pricing."] as const;

export function collectReliabilityFailurePhrases(plainText: string): string[] {
  const low = plainText.toLowerCase();
  const hits: string[] = [];
  for (const phrase of RELIABILITY_FAILURE_PHRASES) {
    if (low.includes(phrase)) hits.push(phrase);
  }
  return hits;
}

export function collectRawI18nKeyLeaks(plainText: string): string[] {
  const hits: string[] = [];
  for (const needle of RAW_I18N_SUBSTRINGS) {
    if (plainText.includes(needle)) hits.push(needle);
  }
  return hits;
}

export function analyzeProbePlainText(routeLabel: string, plainText: string): string[] {
  const issues: string[] = [];
  for (const phrase of collectReliabilityFailurePhrases(plainText)) {
    issues.push(`${routeLabel}: failure_phrase:${phrase}`);
  }
  for (const needle of collectRawI18nKeyLeaks(plainText)) {
    issues.push(`${routeLabel}: raw_i18n_substring:${needle}`);
  }
  const forbidden = collectForbiddenProductionTextViolations(plainText);
  if (forbidden.length > 0) {
    issues.push(formatMarketingDomViolationMessage(routeLabel, forbidden));
  }
  return issues;
}

export function analyzeProbeHtml(routeLabel: string, html: string): string[] {
  return analyzeProbePlainText(routeLabel, htmlToProbePlainText(html));
}

/** Best-effort: public HTML should expose a non-empty document title when healthy. */
export function extractHtmlTitle(html: string): string | null {
  const m = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  if (!m) return null;
  const t = m[1]?.replace(/\s+/g, " ").trim() ?? "";
  return t.length > 0 ? t : null;
}
