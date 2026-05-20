import type { Page } from "@playwright/test";

/**
 * Detects common “missing translation” signals in console output (dev + prod patterns).
 * Matches user-facing phrases plus {@link formatMarketingMessage} / production JSON logs.
 */
export const I18N_MISSING_KEY_RE =
  /missing i18n key|translation missing|undefined translation|\[marketing-i18n\] missing key|marketing_message_key_missing|missing key.*locale bundle/i;

export type I18nMissingKeyAudit = {
  /** All matching lines, prefixed with `currentPath` when set */
  violations: string[];
  dispose: () => void;
};

/**
 * Single listener for the whole test: set `currentPath` before each `goto` so violations are attributable.
 */
export function attachI18nMissingKeyAudit(
  page: Page,
  getCurrentPath: () => string,
): I18nMissingKeyAudit {
  const violations: string[] = [];

  const onConsole = (msg: { type: () => string; text: () => string }) => {
    const text = msg.text();
    if (!I18N_MISSING_KEY_RE.test(text)) return;
    const path = getCurrentPath();
    violations.push(path ? `${path} [${msg.type()}] ${text}` : `[${msg.type()}] ${text}`);
  };

  page.on("console", onConsole);

  return {
    violations,
    dispose: () => {
      page.off("console", onConsole);
    },
  };
}
