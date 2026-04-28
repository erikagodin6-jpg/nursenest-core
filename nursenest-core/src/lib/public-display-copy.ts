import { formatTitleCase } from "@/lib/format/text-case";
import { cleanLessonTitleForDisplay } from "@/lib/lessons/lesson-title-presentation";
import { assertNoPublicPlaceholderCopy, normalizeResolvedMarketingLeaf } from "@/lib/marketing-i18n/marketing-message-value-policy";
import type { MarketingMessages } from "@/lib/marketing-i18n-core";

const RAW_I18N_KEY_RE = /^(?:pages|nav|footer|components|learner|marketing|home|pricing|exams|tools)\.[A-Za-z0-9_.-]+$/;

function cleanPublicText(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim();
}

function isUsablePublicText(value: unknown): value is string {
  const text = cleanPublicText(value);
  if (!text) return false;
  if (RAW_I18N_KEY_RE.test(text)) return false;
  if (/\b(?:missing key|placeholder|todo)\b/i.test(text)) return false;
  return true;
}

function humanizeSlug(slug: string | null | undefined): string {
  const raw = cleanPublicText(slug);
  if (!raw) return "";
  return formatTitleCase(raw.replace(/[-_]+/g, " "));
}

export type PublicLessonTitleInput = {
  /** Canonical curated public display title from catalog/DB. Generated scripts must preserve this value. */
  curatedTitle?: string | null;
  /** Explicit localized public copy, when a locale-specific title exists. */
  i18nTitle?: string | null;
  /** Generated title from SEO/import helpers. Must never override curatedTitle. */
  generatedTitle?: string | null;
  slug?: string | null;
};

/**
 * Public lesson title precedence:
 * canonical curated title > explicit i18n copy > generated fallback > humanized slug.
 *
 * `catalog.json` lesson `title` is the curated public display source. Generated scripts may add metadata,
 * but must not rewrite it from older registries or SEO helpers; public-copy tests fail on known regressions.
 */
export function resolvePublicLessonTitle(input: PublicLessonTitleInput): string {
  const chosen =
    (isUsablePublicText(input.curatedTitle) && input.curatedTitle) ||
    (isUsablePublicText(input.i18nTitle) && input.i18nTitle) ||
    (isUsablePublicText(input.generatedTitle) && input.generatedTitle) ||
    humanizeSlug(input.slug);
  return cleanLessonTitleForDisplay(chosen || "Lesson") || "Lesson";
}

export type PublicHubTitleInput = {
  curatedTitle?: string | null;
  i18nTitle?: string | null;
  generatedTitle?: string | null;
  slug?: string | null;
};

export function resolvePublicHubTitle(input: PublicHubTitleInput): string {
  const chosen =
    (isUsablePublicText(input.curatedTitle) && input.curatedTitle) ||
    (isUsablePublicText(input.i18nTitle) && input.i18nTitle) ||
    (isUsablePublicText(input.generatedTitle) && input.generatedTitle) ||
    humanizeSlug(input.slug);
  return cleanPublicText(chosen || "Lessons");
}

export type MarketingDisplayCopyInput = {
  key?: string | null;
  messages?: MarketingMessages | null;
  fallbackMessages?: MarketingMessages | null;
  curatedCopy?: string | null;
  explicitI18nCopy?: string | null;
  generatedFallback?: string | null;
  slug?: string | null;
};

export function resolveMarketingDisplayCopy(input: MarketingDisplayCopyInput): string {
  const key = cleanPublicText(input.key);
  const rawFromMessages =
    key && input.messages ? normalizeResolvedMarketingLeaf(input.messages[key], key) : undefined;
  const rawFromFallback =
    key && input.fallbackMessages ? normalizeResolvedMarketingLeaf(input.fallbackMessages[key], key) : undefined;
  const chosen =
    (isUsablePublicText(input.curatedCopy) && input.curatedCopy) ||
    (isUsablePublicText(input.explicitI18nCopy) && input.explicitI18nCopy) ||
    (isUsablePublicText(rawFromMessages) && rawFromMessages) ||
    (isUsablePublicText(rawFromFallback) && rawFromFallback) ||
    (isUsablePublicText(input.generatedFallback) && input.generatedFallback) ||
    humanizeSlug(input.slug);

  return assertNoPublicPlaceholderCopy(cleanPublicText(chosen || "NurseNest"), key ? `marketing:${key}` : "marketing");
}
