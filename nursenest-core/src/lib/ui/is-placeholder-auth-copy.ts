import {
  humanizedMarketingKeyFallback,
  isForbiddenAuthoredMarketingLeafValue,
} from "@/lib/marketing-i18n/marketing-message-value-policy";
import { looksLikeRawI18nKey } from "@/lib/ui/format-display-label";

/**
 * Detects copy that should not appear on production auth surfaces: missing-catalog
 * humanized keys, raw i18n paths, obvious CMS/template stubs, and a few whole-string
 * placeholders. Kept **conservative** — only flags short/generic whole values or
 * clear key-shaped strings; do not use to reject legitimate brief UI labels.
 */
export function isPlaceholderAuthCopy(text: string, messageKey?: string): boolean {
  const t = text.trim();
  if (!t) return true;

  if (messageKey && t === humanizedMarketingKeyFallback(messageKey)) {
    return true;
  }

  if (messageKey && t === messageKey) {
    return true;
  }

  if (looksLikeRawI18nKey(t)) {
    return true;
  }

  if (isForbiddenAuthoredMarketingLeafValue(t)) {
    return true;
  }

  const lower = t.toLowerCase();
  if (lower.includes("lorem ipsum") || lower.includes("<<stub") || lower.includes("{{missing")) {
    return true;
  }

  return false;
}
