import { LearningItem, Recommendation } from "./recommendation-engine";
import { LearnerProfile } from "./learner-profile";

export type SupportedLocale = "en" | "es";

export type I18nDict = Record<string, string>;

export type LocalizedRecommendation = Recommendation & {
  title: string;
  domainLabel: string;
  reasonLabel: string;
};

export function createTranslator(locale: SupportedLocale, dictionaries: Record<SupportedLocale, I18nDict>) {
  const dict = dictionaries[locale] ?? dictionaries.en;

  return function t(key: string): string {
    return dict[key] ?? dictionaries.en[key] ?? key;
  };
}

function domainKeyToI18n(domain: string): string {
  return `domain.${domain}`;
}

function reasonKey(reason: string): string {
  if (reason.includes("due")) return "status.due";
  if (reason.includes("weak")) return "status.weakness";
  return "status.strength";
}

export function localizeRecommendation(
  rec: Recommendation,
  locale: SupportedLocale,
  dictionaries: Record<SupportedLocale, I18nDict>,
  itemLookup: Record<string, LearningItem>
): LocalizedRecommendation {
  const t = createTranslator(locale, dictionaries);
  const item = itemLookup[rec.itemId];

  return {
    ...rec,
    title: item ? t(`item.${item.type}`) : rec.itemId,
    domainLabel: t(domainKeyToI18n(rec.domain)),
    reasonLabel: t(reasonKey(rec.reason)),
  };
}

export function localizeRecommendations(
  recs: Recommendation[],
  locale: SupportedLocale,
  dictionaries: Record<SupportedLocale, I18nDict>,
  itemLookup: Record<string, LearningItem>
): LocalizedRecommendation[] {
  return recs.map((r) =>
    localizeRecommendation(r, locale, dictionaries, itemLookup)
  );
}

export function applyLearnerLocale(profile: LearnerProfile, locale: SupportedLocale) {
  return {
    ...profile,
    preferredLocale: locale,
  };
}
