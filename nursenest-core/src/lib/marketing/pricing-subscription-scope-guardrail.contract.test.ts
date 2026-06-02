/**
 * Contract: pricing surfaces never imply Advanced ECG, BLS/ACLS/PALS, telemetry mastery,
 * "official certification", or a "pass guarantee" are included in standard subscriptions.
 *
 * Rationale: subscription clarity initiative. Inclusion-implying namespaces (plan cards,
 * conversion clarity inclusion list, ecosystem bullets, narrative subheads, feature grid bodies,
 * matrix `core/premium` cells) must stay scoped to what actually ships in standard nursing/Allied
 * plans. Disclaimer namespaces (subscription FAQ Advanced-ECG / BLS rows, ECG block "advanced"
 * panel, conversion clarity "notIncluded*", learnerFaq subheading) explicitly call those items
 * out as separate / future / not guaranteed and are exempt.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.join(__dirname, "..", "..", "..");
const PAGES_EN = path.join(pkgRoot, "public", "i18n", "en", "pages.json");

/**
 * Inclusion-implying keys: any pricing copy that lists what a paid subscription DOES include
 * or what a tier ships. These must not name out-of-scope products as included.
 */
const INCLUSION_IMPLYING_KEY_PREFIXES: readonly string[] = [
  "pages.pricing.planCard.bullet",
  "pages.pricing.conversionClarity.included",
  "pages.pricing.conversionClarity.value",
  "pages.pricing.conversionClarity.heading",
  "pages.pricing.conversionClarity.intro",
  "pages.pricing.ecosystem.bullet",
  "pages.pricing.ecosystem.title",
  "pages.pricing.ecosystem.lead",
  "pages.pricing.featuresGrid.f",
  "pages.pricing.compare.row.",
  "pages.pricing.compare.nn",
  "pages.pricing.matrix.r",
  "pages.pricing.conversion.includes.",
  "pages.pricing.narrative.",
  "pages.pricing.tierScope.",
  "pages.pricing.tier.",
];

/**
 * Disclaimer namespaces — copy here is *expected* to mention out-of-scope items by name in order
 * to clarify that they are NOT part of standard subscriptions. Skip them in the inclusion scan.
 */
const DISCLAIMER_KEY_ALLOWLIST: readonly RegExp[] = [
  /^pages\.pricing\.subscriptionFaq\.(q|a)\d+$/,
  /^pages\.pricing\.ecg\.(eyebrow|title|core\.body|advanced\.(title|body))$/,
  /^pages\.pricing\.conversionClarity\.notIncluded/,
  /^pages\.pricing\.conversionClarity\.intro$/,
  /^pages\.pricing\.learnerFaq\.(subheading|passGuaranteeQuestion|passGuaranteeAnswer|examRealismAnswer)$/,
];

/** Sensitive substrings that must never appear in inclusion-implying copy. */
const FORBIDDEN_INCLUSION_PATTERNS: ReadonlyArray<{ name: string; re: RegExp }> = [
  { name: "advanced_ecg_implied_included", re: /\badvanced\s+ecg\b/i },
  { name: "telemetry_mastery_implied_included", re: /telemetry\s+mastery/i },
  { name: "bls_implied_included", re: /\bBLS\b/ },
  { name: "acls_implied_included", re: /\bACLS\b/ },
  { name: "pals_implied_included", re: /\bPALS\b/ },
  { name: "all_occupations_implied_included", re: /\ball\s+occupations?\b/i },
  { name: "all_pathways_implied_included", re: /\ball\s+pathways?\b/i },
  { name: "official_certification_implied", re: /official\s+certification/i },
  { name: "guarantee_pass_implied", re: /pass(es|ing)?\s+guaranteed?|guaranteed?\s+pass/i },
];

function isInclusionKey(key: string): boolean {
  if (!INCLUSION_IMPLYING_KEY_PREFIXES.some((p) => key.startsWith(p))) return false;
  if (DISCLAIMER_KEY_ALLOWLIST.some((re) => re.test(key))) return false;
  return true;
}

describe("pricing subscription scope guardrail", () => {
  it("inclusion-implying pricing copy never names Advanced ECG / BLS / ACLS / PALS as included, and never claims official certification or pass guarantees", () => {
    const pages = JSON.parse(fs.readFileSync(PAGES_EN, "utf8")) as Record<string, string>;
    const violations: Array<{ key: string; pattern: string; value: string }> = [];

    for (const [key, raw] of Object.entries(pages)) {
      if (typeof raw !== "string") continue;
      if (!isInclusionKey(key)) continue;
      for (const { name, re } of FORBIDDEN_INCLUSION_PATTERNS) {
        if (re.test(raw)) {
          violations.push({ key, pattern: name, value: raw.slice(0, 240) });
        }
      }
    }

    if (violations.length > 0) {
      const msg = violations
        .map((v) => `  ${v.pattern}: ${v.key}\n    "${v.value}"`)
        .join("\n");
      assert.fail(
        `Pricing inclusion-implying copy must not imply out-of-scope items as included.\n${msg}`,
      );
    }
  });

  it("Advanced ECG / BLS / ACLS / PALS disclaimers stay present where expected", () => {
    const pages = JSON.parse(fs.readFileSync(PAGES_EN, "utf8")) as Record<string, string>;
    const a3 = pages["pages.pricing.subscriptionFaq.a3"] ?? "";
    const a6 = pages["pages.pricing.subscriptionFaq.a6"] ?? "";
    const advBody = pages["pages.pricing.ecg.advanced.body"] ?? "";

    assert.match(
      a3,
      /\bnot\s+included\b|\bseparate\s+future\s+premium\b|\bnot\s+part\s+of\s+standard\b/i,
      `subscriptionFaq.a3 must disclaim Advanced ECG inclusion: ${a3}`,
    );
    assert.match(
      a6,
      /BLS\/ACLS\/PALS|emergency-?response\s+readiness/i,
      `subscriptionFaq.a6 must reference BLS/ACLS/PALS-style scoping: ${a6}`,
    );
    assert.match(
      a6,
      /planned\s+future|not\s+automatic|where\s+noted/i,
      `subscriptionFaq.a6 must hedge BLS/ACLS/PALS as future / non-automatic: ${a6}`,
    );
    assert.match(
      advBody,
      /separate\s+future\s+premium|not\s+included\s+in\s+standard/i,
      `ecg.advanced.body must mark Advanced ECG as separate / not included: ${advBody}`,
    );
  });
});
