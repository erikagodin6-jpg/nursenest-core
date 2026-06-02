/**
 * Practice test / CAT exam runner — safe resolution when marketing copy is missing
 * or the provider echoes the key (see {@link MarketingI18nProvider} `safeFormat`).
 */

export type PracticeTestRunI18nParams = Record<string, string | number | undefined>;

export function applyPracticeTestRunI18nParams(
  template: string,
  params?: PracticeTestRunI18nParams,
): string {
  if (!params) return template;
  let out = template;
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined) out = out.replaceAll(`{{${k}}}`, String(v));
  }
  return out;
}

/**
 * True when `t(key)` likely failed to resolve (key echoed, empty, or still a dot-path).
 */
export function isUntranslatedPracticeTestRunResolved(resolved: string, key: string): boolean {
  const r = resolved.trim();
  if (!r) return true;
  if (r === key) return true;
  if (r.startsWith("[missing:")) return true;
  if (r.startsWith("learner.practiceTests.run.")) return true;
  return false;
}

/**
 * Prefer `resolved` when it looks like real copy; otherwise apply `fallback` + `{{param}}` interpolation.
 */
export function resolvePracticeTestRunCopy(
  resolved: string,
  key: string,
  fallback: string,
  params?: PracticeTestRunI18nParams,
): string {
  if (isUntranslatedPracticeTestRunResolved(resolved, key)) {
    return applyPracticeTestRunI18nParams(fallback, params);
  }
  return resolved;
}
