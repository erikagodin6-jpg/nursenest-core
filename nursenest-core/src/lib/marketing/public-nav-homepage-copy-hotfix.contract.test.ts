import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { buildMarketingTierHubStrip } from "@/lib/navigation/marketing-tier-hub-strip";
import { scanFlatMarketingMessagesForForbiddenValues } from "@/lib/marketing-i18n/marketing-message-value-policy";
import { MINIMAL_MARKETING_LAYOUT_SHELL_MESSAGES } from "@/lib/marketing-i18n/minimal-marketing-layout-shell-fallback";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = path.resolve(__dirname, "..", "..", "..");
const REPO_ROOT = path.resolve(PKG_ROOT, "..");
const SITE_HEADER = path.join(PKG_ROOT, "src", "components", "layout", "site-header.tsx");
const MARKETING_EN = path.join(REPO_ROOT, "tools", "i18n", "marketing", "marketing-en.json");

const PUBLIC_NAV_LABELS = [
  "Pricing",
  "About",
  "Blog",
  "FAQ",
  "Pre-Nursing",
  "Tools",
  "RN",
  "RPN",
  "NP",
  "New Grad",
  "Allied",
  "Log In",
  "Start Free",
] as const;

const PUBLIC_NAV_SHELL_KEYS = [
  "nav.pricing",
  "nav.about",
  "footer.blog",
  "footer.faq",
  "nav.preNursing",
  "nav.tools",
  "nav.mega.rn.label",
  "nav.mega.pn.labelCA",
  "nav.mega.np.label",
  "nav.mega.newGrad.label",
  "nav.mega.allied.label",
  "nav.logIn",
  "nav.signup",
] as const;

function readMarketingMessages(): Record<string, unknown> {
  return JSON.parse(fs.readFileSync(MARKETING_EN, "utf8")) as Record<string, unknown>;
}

test("canonical English marketing homepage copy does not contain placeholder tokens or raw homepage keys", () => {
  const marketing = readMarketingMessages();
  const homepageMessages = Object.fromEntries(
    Object.entries(marketing).filter(([key]) => key.startsWith("pages.home.")),
  ) as Record<string, unknown>;

  assert.ok(Object.keys(homepageMessages).length > 0, "expected homepage marketing messages");
  assert.deepEqual(scanFlatMarketingMessagesForForbiddenValues("marketing-en pages.home", homepageMessages), []);

  for (const [key, value] of Object.entries(homepageMessages)) {
    assert.equal(typeof value, "string", `${key} must be a string`);
    assert.doesNotMatch(value, /\bTODO\b|homepage\.|pages\.home\./i, `${key} must not leak placeholder text`);
  }
});

test("minimal marketing shell fallback covers every public nav label used on homepage first paint", () => {
  for (const [index, key] of PUBLIC_NAV_SHELL_KEYS.entries()) {
    assert.equal(
      MINIMAL_MARKETING_LAYOUT_SHELL_MESSAGES[key],
      PUBLIC_NAV_LABELS[index],
      `${key} must default to ${PUBLIC_NAV_LABELS[index]}`,
    );
  }
});

test("desktop public header exposes required more links, tier hubs, and guest auth labels", () => {
  const siteHeader = fs.readFileSync(SITE_HEADER, "utf8");

  for (const snippet of [
    'key: "pricing"',
    'key: "about"',
    'key: "blog"',
    'key: "faq"',
    'key: "pre-nursing"',
    'key: "tools"',
    "marketingMoreLinks.map",
    "tierHubMenus.map",
    'surface: "site_header_desktop"',
    't("nav.logIn")',
    't("nav.signup")',
  ]) {
    assert.match(siteHeader, new RegExp(snippet.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), snippet);
  }
});

test("mobile public drawer exposes required more links, tier hubs, and guest auth labels", () => {
  const siteHeader = fs.readFileSync(SITE_HEADER, "utf8");
  const mobileDrawerStart = siteHeader.indexOf("site_header_mobile_drawer");
  assert.ok(mobileDrawerStart > 0, "expected mobile drawer analytics marker");
  const mobileDrawer = siteHeader.slice(mobileDrawerStart);

  for (const snippet of [
    "marketingMoreLinks.map",
    "tierHubMenus.map",
    'surface: "site_header_mobile_drawer"',
    't("nav.logIn")',
    't("nav.signup")',
  ]) {
    assert.match(mobileDrawer, new RegExp(snippet.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), snippet);
  }
});

test("Canada public tier strip labels match required product nav labels", () => {
  const marketing = readMarketingMessages() as Record<string, string>;
  const items = buildMarketingTierHubStrip("CA", (key) => marketing[key] ?? key);
  const labels = items.map((item) => item.label);

  assert.deepEqual(labels, ["RN", "RPN", "NP", "New Grad", "Allied"]);
});
