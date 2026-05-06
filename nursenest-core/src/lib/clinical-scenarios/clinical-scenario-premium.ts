/**
 * Premium clinical simulations — column + legacy referencesJson marker.
 */

export function scenarioIsPremiumFromReferencesJson(referencesJson: unknown): boolean {
  if (!Array.isArray(referencesJson)) return false;
  return referencesJson.some(
    (row) => row && typeof row === "object" && (row as { isPremium?: unknown }).isPremium === true,
  );
}

export function scenarioEffectiveIsPremium(row: { isPremium?: boolean; referencesJson: unknown }): boolean {
  return row.isPremium === true || scenarioIsPremiumFromReferencesJson(row.referencesJson);
}
