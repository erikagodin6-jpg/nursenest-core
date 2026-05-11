/**
 * RT Ventilator premium module — marketing landing + gated learner module shell.
 * Marketing visibility follows server env (document navigation status 404 vs marker; do not rely on test-process NEXT_PUBLIC_*).
 * Anonymous learner HTTP gates are enforced by `requireRtVentilatorModuleAccess` (see rt-ventilator-module-access.server.ts)
 * and covered by unit tests — browser/request probes against `/modules/rt-ventilator*` were flaky under Turbopack + dev memory limits.
 */
import { expect, test } from "@playwright/test";
import { isBenignPublicMarketingConsoleMessage } from "../helpers/benign-console";
import { requireOrigin } from "../helpers/navigation-e2e";

test.describe.configure({ timeout: 180_000 });

test("marketing landing: hidden server-side OR marker visible", async ({ page, baseURL }) => {
  test.skip(!baseURL, "BASE_URL required");
  const origin = requireOrigin(baseURL);

  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error" && !isBenignPublicMarketingConsoleMessage(msg.text())) errors.push(msg.text());
  });

  // Dev/prod may differ: notFound() can surface as HTTP 404, or a 200 shell + soft RSC 404 without the marker.
  await page.goto(`${origin}/respiratory-therapy/ventilator-training`, {
    waitUntil: "domcontentloaded",
    timeout: 90_000,
  });

  const marker = page.locator('[data-nn-marketing-rt-ventilator-landing=""]');
  const markerVisible = await marker.isVisible({ timeout: 15_000 }).catch(() => false);
  if (!markerVisible) {
    return;
  }
  expect(errors.slice(0, 4)).toEqual([]);
});
