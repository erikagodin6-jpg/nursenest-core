#!/usr/bin/env node
/**
 * Build-time gate: canonical English marketing JSON + layout shell must not ship with
 * stub/placeholder copy, empty critical homepage keys, or duplicated chrome components.
 *
 * Runs without Next/DB — safe under SKIP_I18N_PREBUILD=1. Invoked from:
 *   - scripts/run-build-prechecks.mjs (always, before optional i18n audits)
 *   - npm run build:deploy:full (before next build)
 *
 * Exit 1 on any failure.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const pkgRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

const PAGES_EN = path.join(pkgRoot, "public", "i18n", "en", "pages.json");
const NAV_EN = path.join(pkgRoot, "public", "i18n", "en", "nav.json");
const BRAND_EN = path.join(pkgRoot, "public", "i18n", "en", "brand.json");
const PRICING_CONVERSION_CLARITY_KEYS = path.join(
  pkgRoot,
  "scripts",
  "contracts",
  "pricing-conversion-clarity-keys.json",
);
const DEFAULT_MARKETING_LAYOUT = path.join(pkgRoot, "src", "app", "(marketing)", "(default)", "layout.tsx");

/** Homepage + shell strings that must be non-empty and non-stub in canonical `en`. */
const REQUIRED_PAGE_KEYS = [
  "pages.home.hero.headline",
  "pages.home.hero.subheading",
  "pages.home.hero.subheading2",
  "pages.home.hero.eyebrowBrand",
  "pages.home.hero.scanItem1",
  "pages.home.hero.scanItem2",
  "pages.home.hero.scanItem3",
  "pages.home.hero.scanItem4",
  "pages.home.carouselHandoff.kicker",
  "pages.home.carouselHandoff.lead",
  "pages.home.howItWorks.kicker",
  "pages.home.howItWorks.title",
  "pages.home.howItWorks.subtitle",
  "pages.home.globalRegions.title",
  "pages.home.globalRegions.subtitle",
  "pages.home.globalRegions.expansionFootnote",
  "pages.home.metaTitleCA",
  "pages.home.metaDescriptionCA",
  /** Non-empty i18n for pricing loading state (deploy sentinels reject stuck English “Loading pricing…”). */
  "pages.pricing.rowPlansLoading",
  /** Catalog gap slots (e.g. no 3-month New Grad row) must not show raw i18n keys. */
  "pages.pricing.plan.durationNotOffered",
  /** Empty API payload / degraded pricing must not show raw i18n keys. */
  "pages.pricing.error.pricingTemporarilyUnavailable",
  "pages.pricing.error.trackTemporarilyUnavailable",
  "pages.pricing.checkout.unavailableBody",
  "pages.pricing.plan.rowDataIncomplete",
  /** Pricing page when global region has no regional Stripe scope (partial / marketing hubs). */
  "pages.pricing.globalContext.northAmericaStripeScope",
  "pages.pricing.globalContext.northAmericaStripeScopeAria",
  "pages.pricing.globalContext.ackNorthAmericaBillingLabel",
  "pages.pricing.globalContext.mustAckBeforeCheckout",
  "pages.pricing.checkout.ctaJoinNorthAmericaPathways",
  "pages.pricing.checkout.northAmericaBillingSubcopy",
  "pages.pricing.checkout.continueToSecureCheckout",
  "pages.pricing.checkout.continueToNorthAmericaCheckout",
  /** Paid-plan primary CTA + recurring disclosure (pricing page hardening). */
  "pages.pricing.conversion.ctaSubscribe",
  "pages.pricing.checkout.recurringShort",
  /** Plan-heading narrative must exist for core tiers (RSC `resolveMarketingCopy` + client `t()`). */
  "pages.pricing.narrative.rn.subhead",
  "pages.pricing.narrative.rpn.subhead",
  "pages.pricing.narrative.lvn_lpn.subhead",
];

const REQUIRED_NAV_KEYS = ["footer.emailBannerTitle", "footer.emailBannerSubtitle"];

const REQUIRED_BRAND_KEYS = ["brand.nurseNest", "brand.homeAriaLabel"];

/** Substrings that must never appear in production-facing values (case-insensitive). */
const FORBIDDEN_SUBSTRINGS = [
  /** Production missing-key sentinel from `marketing-i18n-core` — must never ship as authored EN copy. */
  "content unavailable right now. please refresh the page.",
  "lorem ipsum",
  "<<stub",
  "tbd —",
  "tbd--",
  "{{missing",
  "[missing:",
  /** Humanized-key fallbacks from `marketing-i18n-core` (must never ship as visible EN copy). */
  "value1 title",
  "value2 title",
  "value3 title",
  "included heading",
  "not included heading",
  "not included lead",
  "reassure cancel title",
  "reassure fees title",
  "reassure secure title",
  "worth it question",
  "after pay question",
  "after pay answer",
  "after pay refund link",
  "after pay terms link",
  "after pay refund suffix",
  "after pay terms suffix",
];

/** Whole-value stubs (trimmed, lowercased). */
const FORBIDDEN_EXACT = new Set([
  "title",
  "lead",
  "kicker",
  "label",
  "description",
  "subtitle",
  "cta",
  "text",
  "heading",
  "eyebrow",
  "intro",
  "value1",
  "included1",
  "question",
  "answer",
  "placeholder",
  "todo",
  "button",
]);

/** Value is a leaked flat i18n key path (never show raw keys as copy). */
function looksLikeLeakedKeyPath(v) {
  const t = v.trim();
  if (!/^[a-z][a-z0-9_.]*$/i.test(t)) return false;
  return (
    t.startsWith("pages.") ||
    t.startsWith("nav.") ||
    t.startsWith("footer.") ||
    t.startsWith("components.") ||
    t.startsWith("brand.")
  );
}

/** Mirrors dev-only humanized tail helper in `src/lib/marketing-i18n/marketing-message-value-policy.ts`. */
function humanizedKeyFallback(key) {
  const tail = key.includes(".") ? (key.split(".").pop() ?? key) : key;
  const words = tail.replace(/([A-Z])/g, " $1").replace(/[-_]/g, " ").trim();
  if (!words) return "NurseNest";
  const t = words.charAt(0).toUpperCase() + words.slice(1);
  return t.length > 80 ? `${t.slice(0, 77)}…` : t;
}

function validateValue(key, value) {
  if (typeof value !== "string") {
    return `key "${key}" is not a string`;
  }
  const v = value.trim();
  if (!v) return `key "${key}" is empty`;
  const lower = v.toLowerCase();
  for (const sub of FORBIDDEN_SUBSTRINGS) {
    if (lower.includes(sub.toLowerCase())) return `key "${key}" contains forbidden substring "${sub}"`;
  }
  if (FORBIDDEN_EXACT.has(lower)) return `key "${key}" is forbidden stub value "${value.trim()}"`;
  if (looksLikeLeakedKeyPath(v)) return `key "${key}" looks like a raw i18n path: ${v}`;
  return null;
}

function validatePricingConversionClarityKeys(pages) {
  const errors = [];
  let keys;
  try {
    keys = readJson(PRICING_CONVERSION_CLARITY_KEYS);
  } catch (e) {
    return [`missing pricing conversion clarity contract: ${e instanceof Error ? e.message : String(e)}`];
  }
  if (!Array.isArray(keys) || keys.length === 0) {
    errors.push("pricing-conversion-clarity-keys.json must be a non-empty array");
    return errors;
  }
  for (const key of keys) {
    const err = validateValue(key, pages[key]);
    if (err) errors.push(err);
    else {
      const v = String(pages[key]).trim();
      const human = humanizedKeyFallback(key);
      if (v.toLowerCase() === human.toLowerCase()) {
        errors.push(
          `key "${key}" equals humanized missing-key fallback "${human}" — add real English copy in en/pages.json`,
        );
      }
    }
  }
  return errors;
}

/** Any English `pages.*` value must not contain known pricing UI stub phrases (case-insensitive). */
function assertNoPricingStubPhrasesAnywhereInEnPages(pages) {
  const needles = [
    "value1 title",
    "value2 title",
    "value3 title",
    "included heading",
    "not included heading",
    "reassure cancel title",
    "worth it question",
    "after pay question",
  ];
  const errors = [];
  for (const [key, value] of Object.entries(pages)) {
    if (typeof value !== "string" || !key.startsWith("pages.")) continue;
    const lower = value.toLowerCase();
    for (const n of needles) {
      if (lower.includes(n)) errors.push(`key "${key}" contains forbidden stub phrase "${n}"`);
    }
  }
  return errors;
}

function readJson(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`missing file: ${path.relative(pkgRoot, filePath)}`);
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function assertLayoutSingleChrome() {
  const src = fs.readFileSync(DEFAULT_MARKETING_LAYOUT, "utf8");
  const footers = src.match(/<SiteFooter\b/g) ?? [];
  const headers = src.match(/<SiteHeader\b/g) ?? [];
  if (footers.length !== 1) {
    throw new Error(
      `(default)/layout.tsx must contain exactly one <SiteFooter /> (found ${footers.length}) — duplicate chrome risks broken layout.`,
    );
  }
  if (headers.length !== 1) {
    throw new Error(
      `(default)/layout.tsx must contain exactly one <SiteHeader /> (found ${headers.length}) — duplicate chrome risks broken layout.`,
    );
  }
}

function main() {
  const errors = [];

  try {
    assertLayoutSingleChrome();
  } catch (e) {
    errors.push(e instanceof Error ? e.message : String(e));
  }

  let pages;
  let nav;
  let brand;
  try {
    pages = readJson(PAGES_EN);
    nav = readJson(NAV_EN);
    brand = readJson(BRAND_EN);
  } catch (e) {
    console.error("[validate-marketing-production-surface]", e);
    process.exit(1);
  }

  for (const key of REQUIRED_PAGE_KEYS) {
    const err = validateValue(key, pages[key]);
    if (err) errors.push(err);
  }
  for (const key of REQUIRED_NAV_KEYS) {
    const err = validateValue(key, nav[key]);
    if (err) errors.push(err);
  }
  for (const key of REQUIRED_BRAND_KEYS) {
    const err = validateValue(key, brand[key]);
    if (err) errors.push(err);
  }

  for (const line of validatePricingConversionClarityKeys(pages)) errors.push(line);

  for (const line of assertNoPricingStubPhrasesAnywhereInEnPages(pages)) errors.push(line);

  if (errors.length) {
    console.error("[validate-marketing-production-surface] FAILED:");
    for (const line of errors) console.error("  -", line);
    process.exit(1);
  }

  const chromeScript = path.join(pkgRoot, "scripts", "validate-marketing-chrome-critical-keys.mts");
  execFileSync(process.execPath, ["--import", "tsx", chromeScript], {
    cwd: pkgRoot,
    stdio: "inherit",
  });

  const shardPlaceholderScript = path.join(pkgRoot, "scripts", "validate-marketing-en-shard-placeholder-leakage.mts");
  execFileSync(process.execPath, ["--import", "tsx", shardPlaceholderScript], {
    cwd: pkgRoot,
    stdio: "inherit",
  });

  console.log(
    "[validate-marketing-production-surface] OK — en pages/nav homepage + pricing conversion clarity + shell checks + merged chrome/hero shape + en shard placeholder scan passed.",
  );
}

main();
