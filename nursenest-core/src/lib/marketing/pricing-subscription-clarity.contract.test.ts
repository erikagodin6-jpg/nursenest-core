/**
 * Contract: pricing marketing copy does not imply Advanced ECG is included in standard plans.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

const MARKETING_EN = path.resolve(process.cwd(), "../tools/i18n/marketing/marketing-en.json");

describe("pricing subscription / Advanced ECG marketing copy", () => {
  it("marks Advanced ECG Mastery as separate in subscription FAQ and ECG block", () => {
    const raw = fs.readFileSync(MARKETING_EN, "utf8");
    const m = JSON.parse(raw) as Record<string, string>;
    const a3 = m["pages.pricing.subscriptionFaq.a3"] ?? "";
    const advBody = m["pages.pricing.ecg.advanced.body"] ?? "";
    assert.match(a3, /not included|separate future premium|not part of standard/i, a3);
    assert.match(advBody, /separate future premium|not included in standard/i, advBody);
  });
});
