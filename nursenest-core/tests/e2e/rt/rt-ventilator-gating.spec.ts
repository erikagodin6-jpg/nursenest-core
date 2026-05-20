/**
 * RT Ventilator module — anonymous HTTP gates + allied marketing sanity (guest-safe).
 * Heavy learner flows stay in unit/server tests; browser probes use bounded request timeouts.
 */
import { expect, test } from "@playwright/test";
import { requireOrigin } from "../helpers/navigation-e2e";

test.describe.configure({ timeout: 180_000 });

test("anonymous GET /modules/rt-ventilator is not an open 200", async ({ page, baseURL }) => {
  test.skip(!baseURL, "BASE_URL required");
  const origin = requireOrigin(baseURL);
  const res = await page.request.get(`${origin}/modules/rt-ventilator`, { timeout: 45_000 });
  expect([404, 401, 403]).toContain(res.status());
});

test("anonymous GET /modules/rt-ventilator/waveforms is not an open 200", async ({ page, baseURL }) => {
  test.skip(!baseURL, "BASE_URL required");
  const origin = requireOrigin(baseURL);
  const res = await page.request.get(`${origin}/modules/rt-ventilator/waveforms`, { timeout: 45_000 });
  expect([404, 401, 403]).toContain(res.status());
});

test("RT allied marketing hub surfaces respond without 5xx", async ({ page, baseURL }) => {
  test.skip(!baseURL, "BASE_URL required");
  const origin = requireOrigin(baseURL);
  for (const path of [
    "/allied/respiratory",
    "/respiratory-therapy/ventilator-training",
  ]) {
    const res = await page.request.get(`${origin}${path}`, { timeout: 45_000 });
    expect(res.status(), path).toBeLessThan(500);
    expect(res.status(), path).not.toBe(503);
  }
});
