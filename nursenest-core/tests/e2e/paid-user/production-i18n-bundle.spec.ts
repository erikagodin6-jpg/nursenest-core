/**
 * Targeted check that the **deployed** merged translation JSON includes account-nav keys.
 * Distinguishes stale production bundles from client-only / RSC issues.
 *
 * Uses `BASE_URL` (Playwright) — same as `qa:paid-smoke:production` (`https://www.nursenest.ca`).
 */
import { expect, test } from "@playwright/test";
import {
  fetchApiAssetsI18nEn,
  fetchStaticI18nEn,
  formatI18nKeyDiff,
} from "../helpers/production-i18n-assets";

test.describe("Production i18n bundle (account nav keys)", () => {
  test("GET /i18n/en.json contains learner.account.nav.* keys", async ({ request }, testInfo) => {
    const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:3000";
    const r = await fetchStaticI18nEn(request, baseUrl);
    await testInfo.attach("live-i18n-static-en.json", {
      body: Buffer.from(JSON.stringify(r, null, 2)),
      contentType: "application/json",
    });
    const { missing, ok } = formatI18nKeyDiff(r.keysPresent);
    expect(
      ok,
      [
        `Missing keys on static bundle ${r.url}`,
        `status=${r.status}`,
        `cache-control=${r.cacheControl}`,
        `missing=${missing.join(", ")}`,
        `parseOk=${r.parseOk}`,
        `parseError=${r.parseError ?? ""}`,
        `snippet=${r.bodySnippet}`,
      ].join("\n"),
    ).toBe(true);
  });

  test("GET /api/assets/i18n/en.json resolves and contains keys (follows CDN redirect)", async ({ request }, testInfo) => {
    const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:3000";
    const r = await fetchApiAssetsI18nEn(request, baseUrl);
    await testInfo.attach("live-i18n-api-en.json", {
      body: Buffer.from(JSON.stringify(r, null, 2)),
      contentType: "application/json",
    });
    const { missing, ok } = formatI18nKeyDiff(r.keysPresent);
    expect(
      ok,
      [
        `Missing keys after API route (final URL ${r.finalUrl})`,
        `requested=${r.url}`,
        `status=${r.status}`,
        `cache-control=${r.cacheControl}`,
        `missing=${missing.join(", ")}`,
        `parseOk=${r.parseOk}`,
        `parseError=${r.parseError ?? ""}`,
        `snippet=${r.bodySnippet}`,
      ].join("\n"),
    ).toBe(true);
  });
});
