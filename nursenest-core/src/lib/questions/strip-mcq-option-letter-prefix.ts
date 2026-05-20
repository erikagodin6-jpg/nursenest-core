/**
 * Strip leading letter labels from bank option text when the UI already shows a
 * letter badge (e.g. avoids "A. C. Persistent sadness..." after option shuffle).
 */
export function stripRedundantMcqLetterPrefix(text: string): string {
  const t = text.trim();
  const stripped = t.replace(/^(?:[A-H]\.\s*)+/i, "").trim();
  return stripped.length > 0 ? stripped : t;
}
