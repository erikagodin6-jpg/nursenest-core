import type { CountryCode, TierCode } from "@prisma/client";

export type LessonSoundTierScope = {
  /** When set, the item is hidden unless the viewer tier is listed (no silent fallback). */
  allowedTiers?: TierCode[];
};

export function lessonSoundItemVisibleForTier(scope: LessonSoundTierScope | undefined, viewerTier: TierCode): boolean {
  if (!scope?.allowedTiers?.length) return true;
  return scope.allowedTiers.includes(viewerTier);
}

export function lessonSoundCountryNote(
  notes: Partial<Record<CountryCode, string>> | undefined,
  countryCode: CountryCode,
): string | undefined {
  if (!notes) return undefined;
  return notes[countryCode]?.trim() || undefined;
}
