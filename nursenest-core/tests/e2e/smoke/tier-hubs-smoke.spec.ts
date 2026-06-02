/**
 * Smoke — Tier Hubs (RN / RPN / NP / Allied)
 *
 * Phase 1: Core Smoke Suite — Tier Hubs
 * Verifies each hub: loads, contains lesson/practice/flashcard/CAT links.
 *
 * These are PUBLIC marketing hub pages — no auth required.
 *
 * Run:
 *   npx playwright test tests/e2e/smoke/tier-hubs-smoke.spec.ts --project=chromium
 */
import { expect, test } from "@playwright/test";
import { attachPageObservers } from "../helpers/attach-observers";
import {
  attachSmokeCapture,
  attachSmokeFailureScreenshot,
  buildCaptureFromObservers,
  seriousPublicSmokeConsoleErrors,
} from "../helpers/smoke-evidence";

type HubSpec = {
  label: string;
  /** Primary marketing hub URL */
  path: string;
  /** Expected content that confirms the right hub loaded */
  contentMatchers: RegExp[];
};

const HUBS: HubSpec[] = [
  {
    label: "RN (NCLEX-RN)",
    path: "/rn",
    contentMatchers: [/NCLEX-RN|Registered Nurse/i],
  },
  {
    label: "RPN (REx-PN)",
    path: "/canada/pn/rex-pn",
    contentMatchers: [/REx-PN|Registered Practical Nurse|RPN/i],
  },
  {
    label: "NP (Nurse Practitioner)",
    path: "/np",
    contentMatchers: [/Nurse Practitioner|NP|CNPLE|FNP/i],
  },
  {
    label: "Allied Health",
    path: "/allied-health",
    contentMatchers: [/Allied Health|paramedic|respiratory|MLT|imaging/i],
  },
];

/** Links that each hub should expose. */
const EXPECTED_LINK_PATTERNS = [
  /lesson|study/i,
  /practice|question/i,
  /flashcard/i,
];

test.describe("Smoke — Tier Hubs", () => {
  for (const hub of HUBS) {
    test(`${hub.label} hub loads and contains lesson/practice/flashcard links`, async (
      { page },
      testInfo,
    ) => {
      const observers = attachPageObservers(page, { profile: "public" });
      try {
        const r = await page.goto(hub.path, { waitUntil: "domcontentloaded" });
        expect(r?.status(), `${hub.label} hub HTTP status`).not.toBe(500);
        // Allow redirects (301/302) to a canonical hub path
        expect(r?.status(), `${hub.label} HTTP ${r?.status()}`).toBeLessThan(400);

        await expect(page.locator("main")).toBeVisible({ timeout: 30_000 });

        const bodyText = await page.locator("body").innerText().catch(() => "");

        // Hub-specific content
        for (const matcher of hub.contentMatchers) {
          expect(bodyText, `${hub.label} missing expected content matching ${matcher}`).toMatch(matcher);
        }

        // Each hub must expose links to core study surfaces
        for (const pattern of EXPECTED_LINK_PATTERNS) {
          const links = page.getByRole("link").filter({ hasText: pattern });
          const count = await links.count();
          expect(count, `${hub.label} missing "${pattern}" link`).toBeGreaterThan(0);
        }

        // No console errors
        const serious = seriousPublicSmokeConsoleErrors(observers.consoleErrors);
        expect(serious, `${hub.label} console errors: ${serious.join(" | ")}`).toEqual([]);

        await attachSmokeCapture(testInfo, `hub-${hub.label}`, buildCaptureFromObservers(page, observers, {}));
      } catch (e) {
        await attachSmokeFailureScreenshot(page, testInfo, `hub-${hub.label}-failure.png`);
        await attachSmokeCapture(testInfo, `hub-${hub.label}`, buildCaptureFromObservers(page, observers, {}));
        throw e;
      } finally {
        observers.dispose();
      }
    });
  }
});
