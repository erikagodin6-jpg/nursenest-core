/**
 * Static guard for mobile conversion-critical study paths.
 *
 * Run from `nursenest-core/`:
 *   node --import tsx --test tests/contracts/mobile-conversion-critical-path.contract.test.ts
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

const ROOT = process.cwd();
const MOBILE_CSS_PATH = path.resolve(ROOT, "src/app/premium-mobile-study-experience-audit.css");
const PAYWALL_PATH = path.resolve(ROOT, "src/components/student/subscription-paywall.tsx");

function read(filePath: string): string {
  return fs.readFileSync(filePath, "utf8");
}

describe("mobile conversion critical path", () => {
  const mobileCss = read(MOBILE_CSS_PATH);
  const paywall = read(PAYWALL_PATH);

  it("keeps paywall conversion CTAs visible and full-width on mobile", () => {
    assert.match(paywall, /data-nn-mobile-paywall-surface/, "paywall mobile surface hook missing");
    assert.match(paywall, /data-nn-mobile-conversion-cta/, "paywall mobile CTA hook missing");
    assert.match(paywall, /nn-paywall-mobile-quick-cta/, "first-viewport mobile paywall CTA missing");
    assert.match(paywall, /nn-mobile-critical-cta/, "mobile critical CTA class missing");
    assert.match(mobileCss, /nn-paywall-premium/, "mobile paywall styles missing");
    assert.match(mobileCss, /nn-mobile-critical-cta[\s\S]*width:\s*100%/, "mobile paywall CTAs must be full-width");
  });

  it("keeps signup, trial-blocked, and checkout-adjacent CTAs tap-safe below 390px", () => {
    assert.match(mobileCss, /@media\s*\(max-width:\s*390px\)/, "390px device guard missing");
    assert.match(mobileCss, /nn-premium-auth-signup-cta/, "signup CTA mobile guard missing");
    assert.match(mobileCss, /nn-trial-blocked\[data-nn-premium-auth-subscription-required\]/, "trial/paywall guard missing");
    assert.match(mobileCss, /font-size:\s*max\(1rem,\s*16px\)/, "mobile inputs must avoid iOS zoom");
  });

  it("bounds rationale panels so explanations remain reachable on compact phones", () => {
    for (const selector of [
      "nn-question-session-rationale",
      "nn-practice-exam-rationale-panel",
      "nn-practice-rationale-full__scroll",
      "nn-flashcard-rationale-panel",
      "nn-flashcard-rationale-panel__body",
    ]) {
      assert.match(mobileCss, new RegExp(selector), `${selector} mobile rationale guard missing`);
    }
    assert.match(mobileCss, /max-height:\s*min\(68dvh,\s*34rem\)/, "compact rationale height cap missing");
    assert.match(mobileCss, /-webkit-overflow-scrolling:\s*touch/, "touch scrolling guard missing");
  });
});
