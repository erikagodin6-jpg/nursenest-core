/**
 * Browser telemetry governance — public + authenticated learner partitions.
 *
 * Public: no psychometric leakage on LOFT marketing surfaces.
 * Authenticated: no raw cognition envelope / competency state in HTML or public analytics props.
 */
import fs from "node:fs";
import { expect, test } from "@playwright/test";
import { gotoExpectOk } from "../helpers/navigation-e2e";
import { PAID_USER_AUTH_FILE } from "../helpers/auth-state-paths";

const FORBIDDEN_PUBLIC_MARKERS = [
  /Start Another CAT/i,
  /Review This CAT/i,
  /Pass probability:\s*\d+%/i,
  /standard error on theta/i,
  /learnerCognitionEnvelope/i,
  /competencyStates/i,
  /stateFingerprint/i,
  /remediationPathwayIds/i,
];

const FORBIDDEN_AUTHENTICATED_HTML = [
  /learnerCognitionEnvelope/i,
  /"competencyStates"\s*:\s*\[/i,
  /stateFingerprint/i,
  /repairOperations/i,
  /integrityChecksum/i,
];

test.describe("PostHog / telemetry governance — public LOFT surfaces", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("CNPLE simulation marketing does not expose CAT pass-outlook copy", async ({ page }) => {
    await gotoExpectOk(page, "/canada/np/cnple/simulation");
    assertNoPublicLeak(await page.content());
  });

  test("CNPLE case hub redirect avoids CAT launch chrome", async ({ page }) => {
    await page.goto("/app/practice-tests/cat-launch?pathwayId=ca-np-cnple", {
      waitUntil: "domcontentloaded",
    });
    await page.waitForURL(/\/app\/cases\/cnple/, { timeout: 30_000 });
    assertNoPublicLeak(await page.content());
  });
});

test.describe("Authenticated telemetry isolation matrix", () => {
  test.skip(
    !fs.existsSync(PAID_USER_AUTH_FILE),
    "Requires paid auth storage from setup-paid-auth",
  );
  test.use({ storageState: PAID_USER_AUTH_FILE });

  test("study plan does not embed raw cognition envelope in HTML", async ({ page }) => {
    await gotoExpectOk(page, "/app/study-plan");
    const html = await page.content();
    for (const re of FORBIDDEN_AUTHENTICATED_HTML) {
      expect(html).not.toMatch(re);
    }
    assertNoPublicLeak(html);
  });

  test("dashboard does not inline cognition envelope or graph traversal payloads", async ({ page }) => {
    await gotoExpectOk(page, "/app/dashboard");
    const html = await page.content();
    expect(html).not.toMatch(/integrityChecksum/i);
    expect(html).not.toMatch(/repairOperations/i);
    expect(html).not.toMatch(/graphContinuity/i);
    assertNoPublicLeak(html);
  });

  test("practice hub avoids competency-state and remediation pathway leakage in HTML", async ({ page }) => {
    await gotoExpectOk(page, "/app/practice");
    const html = await page.content();
    for (const re of FORBIDDEN_AUTHENTICATED_HTML) {
      expect(html).not.toMatch(re);
    }
    assertNoPublicLeak(html);
  });

  test("report card does not leak cognition envelope or graph continuity blobs", async ({ page }) => {
    await gotoExpectOk(page, "/app/report-card");
    const html = await page.content();
    for (const re of FORBIDDEN_AUTHENTICATED_HTML) {
      expect(html).not.toMatch(re);
    }
    expect(html).not.toMatch(/graphContinuity/i);
    assertNoPublicLeak(html);
  });

  test("account overview avoids remediation-path and competency-state leakage", async ({ page }) => {
    await gotoExpectOk(page, "/app/account/overview");
    const html = await page.content();
    expect(html).not.toMatch(/remediationPathwayIds/i);
    expect(html).not.toMatch(/learnerCognitionEnvelope/i);
    assertNoPublicLeak(html);
  });

  test("rn-coaching-state JSON excludes raw envelope body", async ({ request }) => {
    const res = await request.get("/api/learner/rn-coaching-state?pathwayId=us-rn-nclex-rn");
    expect(res.ok()).toBeTruthy();
    const text = await res.text();
    expect(text).not.toMatch(/learnerCognitionEnvelope/i);
    expect(text).not.toMatch(/"competencyStates"\s*:\s*\[/);
    expect(text).not.toMatch(/stateFingerprint/i);
    if (text.includes("cognitionVersion")) {
      expect(text).toMatch(/cognitionSchemaVersion|envelopeVersion|ontologyRevision/);
    }
  });
});

function assertNoPublicLeak(html: string) {
  for (const re of FORBIDDEN_PUBLIC_MARKERS) {
    expect(html).not.toMatch(re);
  }
}
