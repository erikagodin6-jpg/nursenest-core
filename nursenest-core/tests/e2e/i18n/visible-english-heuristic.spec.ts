/**
 * Browser heuristic: on non-English marketing routes, sample visible text for likely English leakage.
 * Not a substitute for human review — flags high–ASCII lines with common English stopwords.
 *
 * Run: `PLAYWRIGHT_SKIP_WEB_SERVER=1 BASE_URL=https://www.example.com npm run qa:i18n:visible-audit`
 */
import { expect, test } from "@playwright/test";
import { dismissMarketingScrims } from "../helpers/marketing-smoke-scrims";

const SAMPLES = (process.env.E2E_I18N_AUDIT_LOCALES ?? "fr,de,ar,ja").split(",").map((s) => s.trim()).filter(Boolean);

/** Lines that look like raw i18n keys in the DOM. */
const RAW_KEYISH = /^[a-z][a-z0-9]*(\.[a-z][a-z0-9_]*){2,}$/i;

function englishLeakScore(lines: string[]): { rawKeyish: string[]; asciiEnglishy: string[] } {
  const rawKeyish: string[] = [];
  const asciiEnglishy: string[] = [];
  const stop = /\b(the|and|your|with|for|this|that|from|have|pricing|subscribe|dashboard)\b/i;
  for (const line of lines) {
    const t = line.trim();
    if (t.length < 8 || t.length > 220) continue;
    if (RAW_KEYISH.test(t)) rawKeyish.push(t.slice(0, 200));
    if (/^[\x00-\x7F]+$/.test(t) && stop.test(t) && /[a-z]{3,}/i.test(t)) {
      asciiEnglishy.push(t.slice(0, 200));
    }
  }
  return { rawKeyish, asciiEnglishy };
}

test.describe("Visible text heuristic (marketing locales)", () => {
  test("sample pages for English leakage signals", async ({ page }, testInfo) => {
    test.setTimeout(300_000);
    const report: Record<string, unknown> = { locales: {} };
    for (const locale of SAMPLES) {
        const path = locale === "en" ? "/" : `/${locale}`;
        const r = await page.goto(path, { waitUntil: "domcontentloaded" });
        expect(r?.ok(), `HTTP ${r?.status()} for ${path}`).toBeTruthy();
        await dismissMarketingScrims(page);
        await page.locator("main, [role='main']").first().waitFor({ state: "visible", timeout: 60_000 }).catch(() => {});
        let text = "";
        try {
          text = await page.locator("main, [role='main']").first().innerText({ timeout: 45_000 });
        } catch {
          text = await page.locator("body").innerText();
        }
        const lines = text.split(/\n+/);
        const scored = englishLeakScore(lines);
        (report.locales as Record<string, unknown>)[locale] = {
          path,
          rawKeyishLines: scored.rawKeyish.slice(0, 30),
          asciiEnglishyLines: scored.asciiEnglishy.slice(0, 40),
        };
        expect(
          scored.rawKeyish.length,
          `possible raw i18n keys visible on ${path}: ${scored.rawKeyish.slice(0, 5).join(" | ")}`,
        ).toBeLessThanOrEqual(8);
      }
    await testInfo.attach("visible-english-heuristic.json", {
      body: Buffer.from(JSON.stringify(report, null, 2)),
      contentType: "application/json",
    });
  });
});
