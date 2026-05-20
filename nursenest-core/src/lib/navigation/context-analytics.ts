/**
 * Context-switching analytics events.
 *
 * Typed event builders for tracking how users interact with the
 * country/language/profession/exam context system.
 *
 * Uses the existing `trackClientEvent` pattern from posthog-client.
 */

import type { GlobalRegionSlug, GlobalLocaleCode } from "@/lib/i18n/global-regions";

// ── Event names ──────────────────────────────────────────────────────────────

export const CONTEXT_EVENTS = {
  countrySelectorOpened: "country_selector_opened",
  countryChanged: "country_changed",
  languageChanged: "language_changed",
  professionChanged: "profession_changed",
  examChanged: "exam_changed",
  settingsContextSaved: "settings_context_saved",
  invalidContextSwitchBlocked: "invalid_context_switch_blocked",
  entitlementRedirectApplied: "entitlement_redirect_applied",
  localizedRouteResolved: "localized_route_resolved",
  countrySpecificCtaViewed: "country_specific_cta_viewed",
  countrySpecificCtaClicked: "country_specific_cta_clicked",
  contextDrawerOpened: "context_drawer_opened",
  contextDrawerClosed: "context_drawer_closed",
  returnToHomeCta: "return_to_home_cta",
  marketReadinessViewed: "market_readiness_viewed",
} as const;

export type ContextEventName = (typeof CONTEXT_EVENTS)[keyof typeof CONTEXT_EVENTS];

// ── Event payload types ──────────────────────────────────────────────────────

type ContextSurface =
  | "utility_strip"
  | "context_bar"
  | "mobile_drawer"
  | "settings_page"
  | "header_popover";

type BaseContextPayload = {
  surface: ContextSurface;
  locale: GlobalLocaleCode;
  region: GlobalRegionSlug;
  profession: string | null;
  exam: string | null;
};

type CountryChangedPayload = BaseContextPayload & {
  previous_region: GlobalRegionSlug;
  new_region: GlobalRegionSlug;
  entitlement_region: GlobalRegionSlug | null;
  is_home_region: boolean;
  market_support_tier: string;
};

type LanguageChangedPayload = BaseContextPayload & {
  previous_locale: GlobalLocaleCode;
  new_locale: GlobalLocaleCode;
};

type ProfessionChangedPayload = BaseContextPayload & {
  previous_profession: string | null;
  new_profession: string;
};

type ExamChangedPayload = BaseContextPayload & {
  previous_exam: string | null;
  new_exam: string;
};

type SettingsSavedPayload = BaseContextPayload & {
  fields_changed: string[];
};

type InvalidSwitchPayload = BaseContextPayload & {
  attempted_region?: GlobalRegionSlug;
  attempted_profession?: string;
  attempted_exam?: string;
  reason: string;
};

type EntitlementRedirectPayload = BaseContextPayload & {
  target_region: GlobalRegionSlug;
  redirect_to: string;
  reason: string;
};

// ── Event builders ───────────────────────────────────────────────────────────

export function buildCountryChangedEvent(
  surface: ContextSurface,
  currentLocale: GlobalLocaleCode,
  currentRegion: GlobalRegionSlug,
  newRegion: GlobalRegionSlug,
  profession: string | null,
  exam: string | null,
  entitlementRegion: GlobalRegionSlug | null,
  marketSupportTier: string,
): { event: string; properties: CountryChangedPayload } {
  return {
    event: CONTEXT_EVENTS.countryChanged,
    properties: {
      surface,
      locale: currentLocale,
      region: newRegion,
      profession,
      exam,
      previous_region: currentRegion,
      new_region: newRegion,
      entitlement_region: entitlementRegion,
      is_home_region: entitlementRegion === newRegion,
      market_support_tier: marketSupportTier,
    },
  };
}

export function buildLanguageChangedEvent(
  surface: ContextSurface,
  region: GlobalRegionSlug,
  previousLocale: GlobalLocaleCode,
  newLocale: GlobalLocaleCode,
  profession: string | null,
  exam: string | null,
): { event: string; properties: LanguageChangedPayload } {
  return {
    event: CONTEXT_EVENTS.languageChanged,
    properties: {
      surface,
      locale: newLocale,
      region,
      profession,
      exam,
      previous_locale: previousLocale,
      new_locale: newLocale,
    },
  };
}

export function buildProfessionChangedEvent(
  surface: ContextSurface,
  locale: GlobalLocaleCode,
  region: GlobalRegionSlug,
  previousProfession: string | null,
  newProfession: string,
  exam: string | null,
): { event: string; properties: ProfessionChangedPayload } {
  return {
    event: CONTEXT_EVENTS.professionChanged,
    properties: {
      surface,
      locale,
      region,
      profession: newProfession,
      exam,
      previous_profession: previousProfession,
      new_profession: newProfession,
    },
  };
}

export function buildExamChangedEvent(
  surface: ContextSurface,
  locale: GlobalLocaleCode,
  region: GlobalRegionSlug,
  profession: string | null,
  previousExam: string | null,
  newExam: string,
): { event: string; properties: ExamChangedPayload } {
  return {
    event: CONTEXT_EVENTS.examChanged,
    properties: {
      surface,
      locale,
      region,
      profession,
      exam: newExam,
      previous_exam: previousExam,
      new_exam: newExam,
    },
  };
}

export function buildSettingsSavedEvent(
  locale: GlobalLocaleCode,
  region: GlobalRegionSlug,
  profession: string | null,
  exam: string | null,
  fieldsChanged: string[],
): { event: string; properties: SettingsSavedPayload } {
  return {
    event: CONTEXT_EVENTS.settingsContextSaved,
    properties: {
      surface: "settings_page",
      locale,
      region,
      profession,
      exam,
      fields_changed: fieldsChanged,
    },
  };
}

export function buildInvalidSwitchEvent(
  surface: ContextSurface,
  locale: GlobalLocaleCode,
  region: GlobalRegionSlug,
  profession: string | null,
  exam: string | null,
  reason: string,
  attempted?: { region?: GlobalRegionSlug; profession?: string; exam?: string },
): { event: string; properties: InvalidSwitchPayload } {
  return {
    event: CONTEXT_EVENTS.invalidContextSwitchBlocked,
    properties: {
      surface,
      locale,
      region,
      profession,
      exam,
      reason,
      attempted_region: attempted?.region,
      attempted_profession: attempted?.profession,
      attempted_exam: attempted?.exam,
    },
  };
}

export function buildEntitlementRedirectEvent(
  locale: GlobalLocaleCode,
  region: GlobalRegionSlug,
  targetRegion: GlobalRegionSlug,
  profession: string | null,
  exam: string | null,
  redirectTo: string,
  reason: string,
): { event: string; properties: EntitlementRedirectPayload } {
  return {
    event: CONTEXT_EVENTS.entitlementRedirectApplied,
    properties: {
      surface: "context_bar",
      locale,
      region,
      profession,
      exam,
      target_region: targetRegion,
      redirect_to: redirectTo,
      reason,
    },
  };
}
