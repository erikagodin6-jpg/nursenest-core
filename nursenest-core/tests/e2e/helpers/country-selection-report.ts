import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { expect } from "@playwright/test";
import { expectMobileRegionSettingsHeading, openMobileRegionLanguageDrawer } from "./mobile-drawer";

export type CountrySelectionReportRow = {
  scenario: string;
  platform: "desktop" | "mobile";
  pass: boolean;
  beforeUrl: string;
  afterUrl: string;
  beforeLabel: string;
  afterLabel: string;
  notes?: string;
};

export async function writeCountrySelectionReport(rows: CountrySelectionReportRow[]): Promise<{ json: string; md: string }> {
  const outDir = join(process.cwd(), "test-results");
  await mkdir(outDir, { recursive: true });
  const jsonPath = join(outDir, "country-selection-behavior-report.json");
  const mdPath = join(outDir, "country-selection-behavior-report.md");
  await writeFile(jsonPath, JSON.stringify(rows, null, 2), "utf8");

  const lines = [
    "# Country selection behavior",
    "",
    "| Scenario | Platform | Pass | Before URL | After URL | Before label | After label | Notes |",
    "|---|---|---|---|---|---|---|---|",
  ];
  for (const r of rows) {
    const esc = (s: string) => s.replace(/\|/g, "\\|").replace(/\n/g, " ");
    lines.push(
      `| ${esc(r.scenario)} | ${r.platform} | ${r.pass ? "PASS" : "FAIL"} | ${esc(r.beforeUrl)} | ${esc(r.afterUrl)} | ${esc(r.beforeLabel)} | ${esc(r.afterLabel)} | ${esc(r.notes ?? "")} |`,
    );
  }
  lines.push("");
  await writeFile(mdPath, lines.join("\n"), "utf8");
  return { json: jsonPath, md: mdPath };
}

const HEADER_CHROME = ".nn-header-animate-in";

/**
 * Country/region as shown in marketing chrome: desktop uses `Country:` / `Region:` triggers; on small
 * viewports those live in the `md:` grid and are hidden — read the Region & Settings drawer summary instead.
 */
export async function readPrimaryCountryAriaLabel(page: import("@playwright/test").Page): Promise<string> {
  const desktopTriggers = page
    .locator(
      `${HEADER_CHROME} button[aria-label*="Country:"], ${HEADER_CHROME} button[aria-label*="Region:"]`,
    )
    .filter({ visible: true });
  if ((await desktopTriggers.count()) > 0) {
    return (await desktopTriggers.first().getAttribute("aria-label")) ?? "";
  }

  await openMobileRegionLanguageDrawer(page);
  await expectMobileRegionSettingsHeading(page);
  const summary = page
    .locator(
      `${HEADER_CHROME} div.fixed.inset-0.z-\\[210\\] div.min-h-0.flex-1.overflow-y-auto > div.rounded-xl.border`,
    )
    .first();
  await expect(summary).toBeVisible({ timeout: 15_000 });
  const text = (await summary.innerText()).replace(/\s+/g, " ").trim();
  await page
    .getByRole("button", { name: /^Close settings$/i })
    .first()
    .evaluate((el) => (el as HTMLButtonElement).click());
  await expect(page.getByRole("heading", { name: /Region & Settings/i })).toBeHidden({ timeout: 5000 }).catch(() => {});
  return `drawer:${text}`;
}
