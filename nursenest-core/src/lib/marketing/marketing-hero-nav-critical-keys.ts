/**
 * Critical marketing i18n keys for the homepage hero carousel, top navigation chrome, and footer.
 * Used by CI validation and layout integrity checks — not a sitewide i18n audit.
 */
import type { MarketingMessages } from "@/lib/marketing-i18n-core";
import { HOME_HERO_SCREENSHOT_COUNT, homeHeroSlideCaptionKey, homeHeroSlideTitleKey } from "@/config/home-hero-carousel";

/** Keys for `components.homeHeroCarousel.slideNN.{title,caption}` (all slides1…N). */
export function marketingHeroCarouselCriticalKeys(): string[] {
  const keys: string[] = [];
  for (let i = 1; i <= HOME_HERO_SCREENSHOT_COUNT; i++) {
    keys.push(homeHeroSlideTitleKey(i), homeHeroSlideCaptionKey(i));
  }
  return keys;
}

/** Pathway pill strip under the header ({@link MarketingSiteSubNav}). */
export const MARKETING_NAV_SUB_STRIP_KEYS = [
  "nav.pathwayHubsAria",
  "nav.examStrip.rn",
  "nav.examStrip.pnUS",
  "nav.examStrip.pnCA",
  "nav.examStrip.npUS",
  "nav.examStrip.npCA",
  "nav.examStrip.alliedUS",
  "nav.examStrip.alliedCA",
  "nav.preNursing",
  "nav.tools",
] as const;

/** Desktop header, mobile drawer, utility strip ({@link SiteHeader}, {@link MarketingHeaderUtilityStrip}). */
export const MARKETING_NAV_HEADER_CHROME_KEYS = [
  "footer.faq",
  "brand.homeAriaLabel",
  "nav.marketingExplore",
  "nav.admin",
  "nav.openMenu",
  "nav.theme",
  "nav.themeGroupLight",
  "nav.themeGroupDark",
  "nav.closeMenu",
  "nav.more",
  "nav.regionLabel",
  "home.region.us",
  "home.region.ca",
  "home.region.usDesc",
  "home.region.caDesc",
  "nav.language",
  "nav.marketingFlow.learn",
  "nav.marketingFlow.practice",
  "nav.marketingFlow.track",
  "nav.examTracks.more",
  "nav.marketingMore",
  "nav.mega.startHere",
  "nav.mega.openHub",
  "nav.mega.examHubSuffix",
] as const;

/** Signed-in / auth cluster in the header ({@link MarketingHeaderAuth}). */
export const MARKETING_NAV_AUTH_KEYS = [
  "nav.logIn",
  "nav.account",
  "account.idPrefix",
  "account.role.admin",
  "account.role.administrator",
  "nav.learnerApp",
  "nav.signout",
] as const;

/** Footer labels and legal/support copy required for global marketing chrome. */
export const MARKETING_FOOTER_CRITICAL_KEYS = [
  "footer.supportingNursesGlobally",
  "footer.brandTagline",
  "footer.globalPathwaysLine",
  "footer.studyInYourLanguage",
  "footer.viewAllLanguages",
  "footer.rights",
  "footer.legalDisclaimer",
] as const;

export const MARKETING_HERO_NAV_CRITICAL_KEY_GROUPS = {
  heroCarousel: marketingHeroCarouselCriticalKeys(),
  navSubStrip: [...MARKETING_NAV_SUB_STRIP_KEYS],
  navHeaderChrome: [...MARKETING_NAV_HEADER_CHROME_KEYS],
  navAuth: [...MARKETING_NAV_AUTH_KEYS],
  footer: [...MARKETING_FOOTER_CRITICAL_KEYS],
} as const;

/** Flat, deduplicated list for validators. */
export const MARKETING_HERO_NAV_CRITICAL_KEYS: readonly string[] = Array.from(
  new Set([
    ...MARKETING_HERO_NAV_CRITICAL_KEY_GROUPS.heroCarousel,
    ...MARKETING_HERO_NAV_CRITICAL_KEY_GROUPS.navSubStrip,
    ...MARKETING_HERO_NAV_CRITICAL_KEY_GROUPS.navHeaderChrome,
    ...MARKETING_HERO_NAV_CRITICAL_KEY_GROUPS.navAuth,
    ...MARKETING_HERO_NAV_CRITICAL_KEY_GROUPS.footer,
  ]),
);

function isMissingValue(v: string | undefined): boolean {
  return v === undefined || (typeof v === "string" && v.trim() === "");
}

export type MarketingHeroNavCriticalKeyResult = {
  ok: boolean;
  missing: string[];
};

/** Returns keys absent or empty in `messages` (canonical English bundle in CI). */
export function validateMarketingHeroNavCriticalKeys(messages: MarketingMessages): MarketingHeroNavCriticalKeyResult {
  const missing: string[] = [];
  for (const key of MARKETING_HERO_NAV_CRITICAL_KEYS) {
    if (isMissingValue(messages[key])) missing.push(key);
  }
  return { ok: missing.length === 0, missing };
}
