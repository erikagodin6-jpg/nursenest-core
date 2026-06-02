import type { Page } from "@playwright/test";
import { DEFAULT_MARKETING_LOCALE } from "../../../src/lib/i18n/marketing-locale-policy";
import { HEADER_CHROME } from "./country-selector";

export type UntranslatedViolation = { region: string; code: string; excerpt: string };

export type UntranslatedScanResult = {
  violations: UntranslatedViolation[];
  /** Non-failing hint for script-heavy locales (may be partial translations). */
  scriptLocaleHeuristic?: string;
};

/** Locales where we expect substantial non-ASCII copy when translations are present. */
const SCRIPT_EXPECTATION_LOCALES = new Set([
  "ja",
  "ar",
  "zh",
  "zh-tw",
  "hi",
  "ko",
  "th",
  "ru",
  "fa",
  "ur",
  "ta",
  "te",
  "bn",
  "mr",
  "gu",
  "pa",
]);

/** Raw key / merge-failure patterns (conservative — avoids matching normal sentences). */
const RAW_KEY_PATTERNS: RegExp[] = [
  /\b(?:pages|nav|home|marketing|brand|footer|seo|hero|cta|auth)\.[a-z][a-z0-9_]*\.[a-z0-9_]/i,
  /marketing_message_key_missing/i,
  /\[missing\b/i,
];

const PLACEHOLDER_PATTERNS: RegExp[] = [
  /\bundefined\b/i,
  /\bnull\b/i,
  /\bTODO\b/i,
  /\bTBD\b/i,
  /\bmissing translation\b/i,
  /\bnot translated\b/i,
];

function nonAsciiRatio(s: string): number {
  if (!s.length) return 0;
  let n = 0;
  for (let i = 0; i < s.length; i++) {
    if (s.charCodeAt(i) > 127) n++;
  }
  return n / s.length;
}

function clip(s: string, max = 200): string {
  const t = s.replace(/\s+/g, " ").trim();
  return t.length <= max ? t : `${t.slice(0, max)}…`;
}

/**
 * Lightweight browser-side scan for obvious i18n failures on marketing surfaces.
 * English (`en`) is skipped — baseline is not “untranslated”.
 */
export async function scanMarketingChromeForUntranslatedSignals(
  page: Page,
  localeCode: string,
): Promise<UntranslatedScanResult> {
  if (localeCode === DEFAULT_MARKETING_LOCALE) {
    return { violations: [] };
  }

  const violations: UntranslatedViolation[] = [];
  let scriptLocaleHeuristic: string | undefined;

  const regions: { name: string; selector: string }[] = [
    { name: "header", selector: HEADER_CHROME },
    { name: "main", selector: "main, [role='main']" },
    { name: "footer", selector: "footer" },
  ];

  const combined: string[] = [];

  for (const { name, selector } of regions) {
    const loc = page.locator(selector).first();
    const visible = await loc.isVisible().catch(() => false);
    if (!visible) {
      violations.push({ region: name, code: "missing", excerpt: "region not visible" });
      continue;
    }
    const text = await loc.innerText().catch(() => "");
    combined.push(text);
    const t = text.replace(/\s+/g, " ");

    for (const rx of RAW_KEY_PATTERNS) {
      const m = t.match(rx);
      if (m) {
        violations.push({ region: name, code: "raw_key_like", excerpt: clip(m[0] ?? t) });
      }
    }
    for (const rx of PLACEHOLDER_PATTERNS) {
      if (rx.test(t)) {
        violations.push({ region: name, code: "placeholder_token", excerpt: clip(t) });
        break;
      }
    }

    if (name === "header" || name === "footer") {
      const buttons = loc.locator("button, a.nn-btn-primary");
      const n = await buttons.count();
      for (let i = 0; i < Math.min(n, 30); i++) {
        const btn = buttons.nth(i);
        if (!(await btn.isVisible().catch(() => false))) continue;
        const label = (await btn.innerText().catch(() => "")).trim();
        const aria = (await btn.getAttribute("aria-label").catch(() => "")) ?? "";
        if (!label.length && !aria.trim().length) {
          violations.push({ region: name, code: "empty_control", excerpt: `control index ${i}` });
        }
      }
    }
  }

  if (SCRIPT_EXPECTATION_LOCALES.has(localeCode)) {
    const body = combined.join("\n");
    const stripped = body.replace(/NurseNest|NCLEX|RN|PN|https?:\/\/\S+/gi, "");
    if (stripped.length > 350 && nonAsciiRatio(stripped) < 0.03) {
      scriptLocaleHeuristic =
        "low non-Latin character ratio in header/main/footer — possible English fallback (review manually; partial locales may be mostly English)";
    }
  }

  return { violations, ...(scriptLocaleHeuristic ? { scriptLocaleHeuristic } : {}) };
}
