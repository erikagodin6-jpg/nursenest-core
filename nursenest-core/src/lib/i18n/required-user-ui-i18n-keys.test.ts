/**
 * Fails CI if any supported marketing locale is missing required user-ui chrome keys
 * (nav/hero/auth/account learner shell). Admin-only keys excluded.
 */
import assert from "node:assert/strict";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { MARKETING_LOCALE_CODES } from "@/lib/i18n/marketing-locale-policy";
import { loadMergedMarketingMessagesFromNextPublicDir } from "@/lib/i18n/merge-next-public-i18n-shards";
import {
  REQUIRED_USER_UI_I18N_KEYS,
  validateRequiredUserUiI18nKeys,
} from "@/lib/i18n/required-user-ui-i18n-keys";
import type { MarketingMessages } from "@/lib/marketing-i18n-core";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const I18N_DIR = path.join(__dirname, "..", "..", "..", "public", "i18n");

/** Must match `script/compile-i18n.ts` / `script/merge-marketing-i18n.ts` — marketing may list extra routable codes before TS sources exist. */
const COMPILED_I18N_LOCALES = new Set<string>([
  "en", "fr", "tl", "hi", "es", "zh", "zh-tw", "ar", "ko", "pt", "pa", "vi", "ht", "ur", "ja", "fa", "de", "th", "tr", "id", "it", "ru",
]);

function readLocale(code: string): MarketingMessages {
  const m = loadMergedMarketingMessagesFromNextPublicDir(I18N_DIR, code);
  if (!m || Object.keys(m).length === 0) {
    throw new Error(`Missing locale bundle (shards or legacy json): ${code}`);
  }
  return m;
}

describe("required user UI i18n keys (non-admin)", () => {
  it("every supported locale includes all required keys with non-empty values", () => {
    const failures: string[] = [];
    for (const locale of MARKETING_LOCALE_CODES) {
      if (!COMPILED_I18N_LOCALES.has(locale)) continue;
      const messages = readLocale(locale);
      const r = validateRequiredUserUiI18nKeys(messages, locale);
      if (!r.ok) {
        failures.push(
          `${locale}: missing=${r.missing.slice(0, 12).join(",")}${r.missing.length > 12 ? "…" : ""} empty=${r.empty.join(",")}`,
        );
      }
    }
    assert.equal(failures.length, 0, failures.join("\n"));
  });

  it("required key list stays in sync with English bundle shape", () => {
    const en = readLocale("en");
    for (const key of REQUIRED_USER_UI_I18N_KEYS) {
      assert.ok(
        typeof en[key] === "string" && en[key]!.trim().length > 0,
        `en.json must define non-empty ${key}`,
      );
    }
  });
});
