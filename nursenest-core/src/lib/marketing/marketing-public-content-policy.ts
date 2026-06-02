/** Route grouping for revalidation + admin UX (not a security boundary). */
export type MarketingPublicContentSurface =
  | "home"
  | "pricing"
  | "registry"
  | "blog"
  | "flashcards"
  | "tools"
  | "study"
  | "hubs"
  | "labs"
  | "med_calc";

export type MarketingPublicContentEditableKeyDef = {
  surface: MarketingPublicContentSurface;
  /** Canonical marketing path for admin grouping (e.g. `/`, `/pricing`, `/flashcards`). */
  route: string;
  sectionKey: string;
  fieldKey: string;
  maxLen: number;
  /** When set, override is read from DB instead of i18n shards (see `resolveRegistryMarketingOverride`). */
  source?: "i18n" | "registry";
  /** Recommended max length for meta title lines (enforced in admin save paths). */
  seoTitleMaxLen?: number;
  /** Recommended max length for meta description lines. */
  seoDescriptionMaxLen?: number;
};

export type MarketingPublicContentSlotInfo = {
  messageKey: string;
  route: string;
  sectionKey: string;
  fieldKey: string;
  surface: MarketingPublicContentSurface;
  maxLen: number;
  seoTitleMaxLen?: number;
  seoDescriptionMaxLen?: number;
  source?: "i18n" | "registry";
};

/**
 * Central allowlist: only these keys may be read/written via the marketing public content override system.
 * Add keys here before exposing them in the Page Copy editor or inline staff affordances.
 */
export const MARKETING_PUBLIC_CONTENT_EDITABLE_KEYS: Readonly<
  Record<string, MarketingPublicContentEditableKeyDef>
> = {
  "pages.home.sampleQuestion.sectionTitle": {
    surface: "home",
    route: "/",
    sectionKey: "home.sampleQuestion",
    fieldKey: "sectionTitle",
    maxLen: 400,
    source: "i18n",
  },
  "pages.home.sampleQuestion.sectionKicker": {
    surface: "home",
    route: "/",
    sectionKey: "home.sampleQuestion",
    fieldKey: "sectionKicker",
    maxLen: 120,
    source: "i18n",
  },
  "pages.home.hero.headline": {
    surface: "home",
    route: "/",
    sectionKey: "home.hero",
    fieldKey: "headline",
    maxLen: 400,
    source: "i18n",
  },
  "pages.home.hero.subheading": {
    surface: "home",
    route: "/",
    sectionKey: "home.hero",
    fieldKey: "subheading",
    maxLen: 400,
    source: "i18n",
  },
  "pages.home.hero.subheading2": {
    surface: "home",
    route: "/",
    sectionKey: "home.hero",
    fieldKey: "subheading2",
    maxLen: 400,
    source: "i18n",
  },
  "pages.home.hero.primaryCta": {
    surface: "home",
    route: "/",
    sectionKey: "home.hero",
    fieldKey: "primaryCta",
    maxLen: 120,
    source: "i18n",
  },
  "pages.home.hero.secondaryCta": {
    surface: "home",
    route: "/",
    sectionKey: "home.hero",
    fieldKey: "secondaryCta",
    maxLen: 120,
    source: "i18n",
  },
  "pages.home.globalRegions.title": {
    surface: "home",
    route: "/",
    sectionKey: "home.globalRegions",
    fieldKey: "title",
    maxLen: 200,
    source: "i18n",
  },
  "pages.home.globalRegions.eyebrow": {
    surface: "home",
    route: "/",
    sectionKey: "home.globalRegions",
    fieldKey: "eyebrow",
    maxLen: 120,
    source: "i18n",
  },
  "pages.home.metaTitle": {
    surface: "home",
    route: "/",
    sectionKey: "home.seo",
    fieldKey: "metaTitle",
    maxLen: 200,
    source: "i18n",
    seoTitleMaxLen: 70,
  },
  "pages.home.metaTitleCA": {
    surface: "home",
    route: "/",
    sectionKey: "home.seo",
    fieldKey: "metaTitleCA",
    maxLen: 200,
    source: "i18n",
    seoTitleMaxLen: 70,
  },
  "pages.home.metaTitleUS": {
    surface: "home",
    route: "/",
    sectionKey: "home.seo",
    fieldKey: "metaTitleUS",
    maxLen: 200,
    source: "i18n",
    seoTitleMaxLen: 70,
  },
  "pages.home.metaDescription": {
    surface: "home",
    route: "/",
    sectionKey: "home.seo",
    fieldKey: "metaDescription",
    maxLen: 400,
    source: "i18n",
    seoDescriptionMaxLen: 320,
  },
  "pages.home.metaDescriptionCA": {
    surface: "home",
    route: "/",
    sectionKey: "home.seo",
    fieldKey: "metaDescriptionCA",
    maxLen: 400,
    source: "i18n",
    seoDescriptionMaxLen: 320,
  },
  "pages.home.metaDescriptionUS": {
    surface: "home",
    route: "/",
    sectionKey: "home.seo",
    fieldKey: "metaDescriptionUS",
    maxLen: 400,
    source: "i18n",
    seoDescriptionMaxLen: 320,
  },
  "pages.pricing.affordableNursingAndHealthcareExam": {
    surface: "pricing",
    route: "/pricing",
    sectionKey: "pricing.hero",
    fieldKey: "affordableNursingAndHealthcareExam",
    maxLen: 400,
    source: "i18n",
  },
  "pages.pricing.joinThousandsOfHealthcareProfessionals": {
    surface: "pricing",
    route: "/pricing",
    sectionKey: "pricing.hero",
    fieldKey: "joinThousandsOfHealthcareProfessionals",
    maxLen: 400,
    source: "i18n",
  },
  "pages.pricing.tryBeforeYouBuy": {
    surface: "pricing",
    route: "/pricing",
    sectionKey: "pricing.hero",
    fieldKey: "tryBeforeYouBuy",
    maxLen: 240,
    source: "i18n",
  },
  "pages.publicFlashcardsHub.h1": {
    surface: "flashcards",
    route: "/flashcards",
    sectionKey: "flashcards.hero",
    fieldKey: "h1",
    maxLen: 240,
    source: "i18n",
  },
  "pages.publicFlashcardsHub.intro": {
    surface: "flashcards",
    route: "/flashcards",
    sectionKey: "flashcards.hero",
    fieldKey: "intro",
    maxLen: 600,
    source: "i18n",
  },
  "pages.publicFlashcardsHub.heroPill": {
    surface: "flashcards",
    route: "/flashcards",
    sectionKey: "flashcards.hero",
    fieldKey: "heroPill",
    maxLen: 120,
    source: "i18n",
  },
  "pages.publicFlashcardsHub.metaTitleUS": {
    surface: "flashcards",
    route: "/flashcards",
    sectionKey: "flashcards.seo",
    fieldKey: "metaTitleUS",
    maxLen: 200,
    source: "i18n",
    seoTitleMaxLen: 70,
  },
  "pages.publicFlashcardsHub.metaTitleCA": {
    surface: "flashcards",
    route: "/flashcards",
    sectionKey: "flashcards.seo",
    fieldKey: "metaTitleCA",
    maxLen: 200,
    source: "i18n",
    seoTitleMaxLen: 70,
  },
  "pages.publicFlashcardsHub.metaDescriptionUS": {
    surface: "flashcards",
    route: "/flashcards",
    sectionKey: "flashcards.seo",
    fieldKey: "metaDescriptionUS",
    maxLen: 400,
    source: "i18n",
    seoDescriptionMaxLen: 320,
  },
  "pages.publicFlashcardsHub.metaDescriptionCA": {
    surface: "flashcards",
    route: "/flashcards",
    sectionKey: "flashcards.seo",
    fieldKey: "metaDescriptionCA",
    maxLen: 400,
    source: "i18n",
    seoDescriptionMaxLen: 320,
  },
  "marketing.globalRoot.headline": {
    surface: "registry",
    route: "/",
    sectionKey: "registry.globalRoot",
    fieldKey: "headline",
    maxLen: 320,
    source: "registry",
  },
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

export function listMarketingPublicContentSlots(): MarketingPublicContentSlotInfo[] {
  return (Object.keys(MARKETING_PUBLIC_CONTENT_EDITABLE_KEYS) as MarketingPublicContentEditableKey[]).map(
    (messageKey) => {
      const def = MARKETING_PUBLIC_CONTENT_EDITABLE_KEYS[messageKey];
      return {
        messageKey,
        route: def.route,
        sectionKey: def.sectionKey,
        fieldKey: def.fieldKey,
        surface: def.surface,
        maxLen: def.maxLen,
        seoTitleMaxLen: def.seoTitleMaxLen,
        seoDescriptionMaxLen: def.seoDescriptionMaxLen,
        source: def.source,
      };
    },
  );
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

/**
 * Extra SEO-oriented checks for meta title/description keys.
 */
export function assertMarketingOverrideSeoGuards(
  messageKey: string,
  value: string,
  def: MarketingPublicContentEditableKeyDef,
): void {
  assertPlainMarketingOverrideText(value, def.maxLen);
  if (def.seoTitleMaxLen && /metatitle/i.test(messageKey) && value.length > def.seoTitleMaxLen) {
    throw new Error(`SEO title exceeds recommended ${def.seoTitleMaxLen} characters (currently ${value.length}).`);
  }
  if (def.seoDescriptionMaxLen && /metadescription/i.test(messageKey) && value.length > def.seoDescriptionMaxLen) {
    throw new Error(
      `SEO description exceeds recommended ${def.seoDescriptionMaxLen} characters (currently ${value.length}).`,
    );
  }
}
