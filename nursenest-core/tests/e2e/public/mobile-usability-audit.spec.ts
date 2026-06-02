/**
 * Mobile usability audit — public marketing routes at iPhone 14 and Pixel 7 logical sizes.
 *
 * Outputs:
 * - test-results/mobile-usability-audit/mobile-usability-audit-report.json
 * - test-results/mobile-usability-audit/mobile-usability-audit-report.md
 * - test-results/mobile-usability-audit/screenshots/*.png
 *
 * Run: `npx playwright test tests/e2e/public/mobile-usability-audit.spec.ts --project=chromium`
 */
import { test } from "@playwright/test";
import { setGlobalRegionCookie } from "../helpers/country-selector";
import { getE2eBaseURL } from "../helpers/e2e-env";
import {
  auditMobileDrawers,
  auditPublicRoute,
  writeMobileUsabilityReports,
  type MobileDeviceProfile,
  type MobileUsabilityIssue,
} from "../helpers/mobile-usability-audit";
import { LESSON_FLOW_PATHWAY_QA } from "../../../src/lib/qa/lesson-flow-pathways";

const baseURL = getE2eBaseURL();

const DEVICES: MobileDeviceProfile[] = [
  { name: "iPhone 14", width: 390, height: 844 },
  { name: "Pixel 7", width: 412, height: 915 },
];

const usRn = LESSON_FLOW_PATHWAY_QA.find((p) => p.pathwayId === "us-rn-nclex-rn");
if (!usRn) throw new Error("us-rn-nclex-rn pathway missing from LESSON_FLOW_PATHWAY_QA");

const ROUTES = ["/", "/pricing", "/blog", usRn.hubPath, usRn.lessonsPath, "/faq"] as const;

test.use({ trace: "off" });
test.describe.configure({ mode: "serial" });

test("mobile usability audit (public)", async ({ page }, testInfo) => {
  test.setTimeout(600_000);
  await setGlobalRegionCookie(page, "us", baseURL);

  const all: MobileUsabilityIssue[] = [];
  const touchMinIdeal = 44;
  const touchMinHard = 40;

  for (const device of DEVICES) {
    await page.setViewportSize({ width: device.width, height: device.height });

    for (const route of ROUTES) {
      const routeIssues = await auditPublicRoute({
        page,
        testInfo,
        device,
        route,
        touchMinIdeal,
        touchMinHard,
      });
      all.push(...routeIssues);
    }

    const drawerIssues = await auditMobileDrawers({ page, testInfo, device });
    all.push(...drawerIssues);
  }

  const { json, md } = await writeMobileUsabilityReports(all);
  await testInfo.attach("mobile-usability-audit-report.json", { path: json });
  await testInfo.attach("mobile-usability-audit-report.md", { path: md });
});
