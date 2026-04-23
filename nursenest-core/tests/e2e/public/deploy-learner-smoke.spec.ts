/**
 * Fast deploy-time smoke — public learner surfaces + billing entrypoints (no auth).
 *
 *   PLAYWRIGHT_SKIP_WEB_SERVER=1 BASE_URL=https://www.example.com npx playwright test tests/e2e/public/deploy-learner-smoke.spec.ts --project=chromium
 *
 * Uses `x-nn-traffic-source: synthetic` so server metrics tag these requests separately from real users.
 */
import { expect, test } from "@playwright/test";
import { SYNTHETIC_PUBLIC_LEARNER_PATHS } from "../../../src/lib/observability/synthetic-monitored-paths";
import {
  NN_TRAFFIC_SOURCE_HEADER,
  NN_TRAFFIC_SOURCE_SYNTHETIC,
} from "../../../src/lib/observability/traffic-source-constants";
import { requireOrigin } from "../helpers/navigation-e2e";

const synth = { [NN_TRAFFIC_SOURCE_HEADER]: NN_TRAFFIC_SOURCE_SYNTHETIC } as const;

test.describe("Deploy learner smoke (API)", () => {
  test("GET /api/health", async ({ request, baseURL }) => {
    requireOrigin(baseURL);
    const res = await request.get("/api/health", { headers: synth });
    expect(res.ok()).toBeTruthy();
  });

  test("GET /api/public/home-stats", async ({ request, baseURL }) => {
    requireOrigin(baseURL);
    const res = await request.get("/api/public/home-stats", { headers: synth });
    expect(res.ok()).toBeTruthy();
  });

  test("GET /api/pricing/options", async ({ request, baseURL }) => {
    requireOrigin(baseURL);
    const res = await request.get("/api/pricing/options", { headers: synth });
    expect(res.ok()).toBeTruthy();
  });

  test("GET /api/lessons — unauthenticated (401)", async ({ request, baseURL }) => {
    requireOrigin(baseURL);
    const res = await request.get("/api/lessons?limit=1", { headers: synth });
    expect(res.status()).toBe(401);
  });

  test("POST /api/subscriptions/checkout — unauthenticated (401)", async ({ request, baseURL }) => {
    requireOrigin(baseURL);
    const res = await request.post("/api/subscriptions/checkout", {
      headers: { ...synth, "content-type": "application/json" },
      data: "{}",
    });
    expect(res.status()).toBe(401);
  });

  test("POST /api/subscriptions/webhook — invalid signature (4xx, not 5xx)", async ({ request, baseURL }) => {
    requireOrigin(baseURL);
    const res = await request.post("/api/subscriptions/webhook", {
      headers: {
        ...synth,
        "content-type": "application/json",
        "stripe-signature": "t=0,v1=invalid",
      },
      data: "{}",
    });
    expect(res.status()).toBeGreaterThanOrEqual(400);
    expect(res.status()).toBeLessThan(500);
  });
});

test.describe("Deploy learner smoke (HTML)", () => {
  test("marketing surfaces return 200", async ({ request, baseURL }) => {
    requireOrigin(baseURL);
    const paths = [
      "/",
      "/pricing",
      "/login",
      SYNTHETIC_PUBLIC_LEARNER_PATHS.usRnMarketingLesson,
      SYNTHETIC_PUBLIC_LEARNER_PATHS.usRnMarketingQuestions,
      SYNTHETIC_PUBLIC_LEARNER_PATHS.usRnCat,
      SYNTHETIC_PUBLIC_LEARNER_PATHS.flashcardsHub,
      SYNTHETIC_PUBLIC_LEARNER_PATHS.practiceExamsHub,
    ];
    for (const path of paths) {
      const res = await request.get(path, {
        headers: { ...synth, accept: "text/html,*/*;q=0.8" },
      });
      expect(res.ok(), `${path} → ${res.status()}`).toBeTruthy();
    }
  });
});
