/** Route grouping for revalidation + admin UX (not a security boundary). */
export type MarketingPublicContentSurface = "home" | "pricing" | "registry";

export type MarketingPublicContentEditableKeyDef = {
  surface: MarketingPublicContentSurface;
  maxLen: number;
  /** When set, override is read from DB instead of i18n shards (see `resolveRegistryMarketingOverride`). */
  source?: "i18n" | "registry";
};

/**
 * Central allowlist: only these keys may be read/written via the marketing public content override system.
 * Add keys here before exposing them in the inline editor.
 */
export const MARKETING_PUBLIC_CONTENT_EDITABLE_KEYS: Readonly<
  Record<string, MarketingPublicContentEditableKeyDef>
> = {
  "pages.home.sampleQuestion.sectionTitle": { surface: "home", maxLen: 400, source: "i18n" },
  "pages.home.sampleQuestion.sectionKicker": { surface: "home", maxLen: 120, source: "i18n" },
  "pages.home.hero.headline": { surface: "home", maxLen: 400, source: "i18n" },
  "pages.home.globalRegions.title": { surface: "home", maxLen: 200, source: "i18n" },
  "pages.home.globalRegions.eyebrow": { surface: "home", maxLen: 120, source: "i18n" },
  "pages.pricing.affordableNursingAndHealthcareExam": { surface: "pricing", maxLen: 400, source: "i18n" },
  "pages.pricing.joinThousandsOfHealthcareProfessionals": { surface: "pricing", maxLen: 400, source: "i18n" },
  "pages.pricing.tryBeforeYouBuy": { surface: "pricing", maxLen: 240, source: "i18n" },
  "marketing.globalRoot.headline": { surface: "registry", maxLen: 320, source: "registry" },
} as const;

export type MarketingPublicContentEditableKey = keyof typeof MARKETING_PUBLIC_CONTENT_EDITABLE_KEYS;

export function isMarketingPublicContentEditableKey(key: string): key is MarketingPublicContentEditableKey {
  return Object.prototype.hasOwnProperty.call(MARKETING_PUBLIC_CONTENT_EDITABLE_KEYS, key);
}

export function getMarketingPublicContentKeyDef(
  key: string,
): MarketingPublicContentEditableKeyDef | undefined {
  if (!isMarketingPublicContentEditableKey(key)) return undefined;
  return MARKETING_PUBLIC_CONTENT_EDITABLE_KEYS[key];
}

export function normalizeMarketingPublicContentLocale(locale: string): string {
  const t = locale.trim().toLowerCase();
  if (!t) return "en";
  if (t === "en-us" || t === "en_us") return "en";
  return t.slice(0, 32);
}

/** Plain text only: block angle brackets and obvious script injection for v1. */
export function assertPlainMarketingOverrideText(value: string, maxLen: number): void {
  if (value.length > maxLen) {
    throw new Error(`Text exceeds max length (${maxLen}).`);
  }
  if (value.includes("<") || value.includes(">")) {
    throw new Error("Angle brackets are not allowed in marketing overrides.");
  }
  if (/javascript\s*:/i.test(value) || /\bon\w+\s*=/i.test(value)) {
    throw new Error("Disallowed patterns in marketing overrides.");
  }
}
