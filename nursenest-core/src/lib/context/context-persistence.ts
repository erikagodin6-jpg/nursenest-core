/**
 * Client-side context persistence helpers for the smart exam selector.
 *
 * Manages both cookie and localStorage for fast access:
 *   - Cookies: server-readable on subsequent SSR requests
 *   - localStorage: instant client reads, no parse delay
 *
 * Integrates with the existing cookie system:
 *   - `nn_global_region`        → global region cookie
 *   - `nn_marketing_locale`     → locale cookie
 *   - `nn_preferred_profession` → profession cookie
 *   - `nn_preferred_exam`       → exam cookie
 *   - `nn_selector_dismissed`   → dismiss flag (localStorage only)
 */

import type { GlobalRegionSlug, GlobalLocaleCode } from "@/lib/i18n/global-regions";
import { SELECTOR_DISMISSED_KEY } from "./resolve-initial-context";

// ── Cookie constants (match save-context-preferences.ts) ─────────────────────

const REGION_COOKIE = "nn_global_region";
const LOCALE_COOKIE = "nn_marketing_locale";
const PROFESSION_COOKIE = "nn_preferred_profession";
const EXAM_COOKIE = "nn_preferred_exam";
const COOKIE_MAX_AGE_SECONDS = 365 * 24 * 60 * 60;

// ── localStorage keys ────────────────────────────────────────────────────────

const LS_PREFIX = "nn_ctx_";
const LS_REGION = `${LS_PREFIX}region`;
const LS_LOCALE = `${LS_PREFIX}locale`;
const LS_PROFESSION = `${LS_PREFIX}profession`;
const LS_EXAM = `${LS_PREFIX}exam`;

// ── Types ────────────────────────────────────────────────────────────────────

export type SelectorSelection = {
  region: GlobalRegionSlug;
  locale: GlobalLocaleCode;
  profession: string;
  exam: string | null;
};

// ── Write helpers ────────────────────────────────────────────────────────────

function setCookie(name: string, value: string): void {
  document.cookie = `${name}=${encodeURIComponent(value)};path=/;max-age=${COOKIE_MAX_AGE_SECONDS};SameSite=Lax`;
}

function setLS(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // localStorage unavailable (private browsing, quota exceeded)
  }
}

/**
 * Persist the user's exam selector choices to both cookies and localStorage.
 */
export function persistSelectorSelection(selection: SelectorSelection): void {
  setCookie(REGION_COOKIE, selection.region);
  setCookie(LOCALE_COOKIE, selection.locale);
  setCookie(PROFESSION_COOKIE, selection.profession);
  if (selection.exam) {
    setCookie(EXAM_COOKIE, selection.exam);
  }

  setLS(LS_REGION, selection.region);
  setLS(LS_LOCALE, selection.locale);
  setLS(LS_PROFESSION, selection.profession);
  if (selection.exam) {
    setLS(LS_EXAM, selection.exam);
  }
}

/**
 * Mark selector as dismissed so it won't show again.
 */
export function persistSelectorDismissed(): void {
  setLS(SELECTOR_DISMISSED_KEY, "1");
}

// ── Read helpers (client-side) ───────────────────────────────────────────────

function getLS(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Check if user has existing context preferences (client-side).
 */
export function hasExistingPreferences(): boolean {
  return !!(getLS(LS_REGION) || getCookie(REGION_COOKIE));
}

/**
 * Check if selector was previously dismissed.
 */
export function wasSelectorDismissed(): boolean {
  return getLS(SELECTOR_DISMISSED_KEY) === "1";
}

/**
 * Read saved context from localStorage (fast) or cookie (fallback).
 */
export function readSavedContext(): Partial<SelectorSelection> {
  return {
    region: (getLS(LS_REGION) ?? getCookie(REGION_COOKIE) ?? undefined) as GlobalRegionSlug | undefined,
    locale: (getLS(LS_LOCALE) ?? getCookie(LOCALE_COOKIE) ?? undefined) as GlobalLocaleCode | undefined,
    profession: getLS(LS_PROFESSION) ?? getCookie(PROFESSION_COOKIE) ?? undefined,
    exam: getLS(LS_EXAM) ?? getCookie(EXAM_COOKIE) ?? undefined,
  };
}
