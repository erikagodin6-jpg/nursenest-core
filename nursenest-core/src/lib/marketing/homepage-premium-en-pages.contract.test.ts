/**
 * Contract: canonical English `public/i18n/en/pages.json` ships premium homepage copy
 * (no stub titles, no raw key paths as values).
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

const PAGES_JSON = path.resolve(process.cwd(), "public/i18n/en/pages.json");

const REQUIRED_KEYS: Record<string, string> = {
  "pages.home.hero.eyebrow": "Canada-first nursing exam prep",
  "pages.home.hero.headlinePremium": "Pass the boards with a calm, clinical study plan.",
  "pages.home.hero.subheadingPremium":
    "Study with lessons, flashcards, rationales, and readiness tools built for RN, RPN, NP, and allied health learners.",
  "pages.home.hero.premiumPrimaryCta": "Start free",
  "pages.home.hero.premiumSecondaryCta": "View pricing",
  "pages.home.hero.panel.live": "Live readiness preview",
  "pages.home.hero.panel.readinessLabel": "Readiness",
  "pages.home.hero.panel.streakLabel": "Study streak",
  "pages.home.hero.panel.masteredLabel": "Mastered topics",
  "pages.home.hero.panel.ecgLabel": "ECG practice",
  "pages.home.premium.readiness.dashboardCta": "Open dashboard",
};

const FORBIDDEN_SUBSTRINGS = ["placeholder", "headline premium", "subheading premium", "readiness label"] as const;

describe("homepage premium EN pages.json contract", () => {
  it("has required keys with expected production copy", () => {
    const raw = fs.readFileSync(PAGES_JSON, "utf8");
    const pages = JSON.parse(raw) as Record<string, string>;

    for (const [key, expected] of Object.entries(REQUIRED_KEYS)) {
      assert.equal(typeof pages[key], "string", `missing key: ${key}`);
      assert.equal(pages[key].trim(), expected, key);
    }
  });

  it("does not ship forbidden placeholder fragments on premium home keys", () => {
    const raw = fs.readFileSync(PAGES_JSON, "utf8");
    const pages = JSON.parse(raw) as Record<string, string>;
    const prefix = "pages.home.";
    for (const [key, val] of Object.entries(pages)) {
      if (!key.startsWith(prefix)) continue;
      if (typeof val !== "string") continue;
      const lower = val.toLowerCase();
      for (const bad of FORBIDDEN_SUBSTRINGS) {
        assert.ok(!lower.includes(bad), `forbidden "${bad}" in ${key}=${JSON.stringify(val.slice(0, 120))}`);
      }
      assert.ok(
        !/^(pages|learner|marketing|components|home|nav|footer)\.[a-z0-9_.]+$/i.test(val.trim()),
        `raw i18n path as value: ${key}`,
      );
    }
  });
});
