import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import type { Page, TestInfo } from "@playwright/test";
import { dismissMarketingScrims } from "./marketing-navigation-audit";

export type MobileDeviceProfile = {
  name: string;
  width: number;
  height: number;
};

export type MobileUsabilityIssue = {
  id: string;
  device: string;
  viewport: { width: number; height: number };
  route: string;
  issue: string;
  severity: "critical" | "high" | "medium" | "low";
  category: "layout" | "logic";
  /** Relative to repo root (`nursenest-core/` when running from app dir). */
  screenshotPath?: string;
};

const OUT_SUBDIR = "mobile-usability-audit";

export async function writeMobileUsabilityReports(
  issues: MobileUsabilityIssue[],
  outDir = "test-results",
): Promise<{ json: string; md: string }> {
  await mkdir(path.join(outDir, OUT_SUBDIR), { recursive: true });
  const jsonPath = path.join(outDir, OUT_SUBDIR, "mobile-usability-audit-report.json");
  const mdPath = path.join(outDir, OUT_SUBDIR, "mobile-usability-audit-report.md");
  await writeFile(jsonPath, JSON.stringify(issues, null, 2), "utf8");
  const esc = (s: string) => String(s).replace(/\|/g, "\\|").replace(/\n/g, " ");
  const md = [
    "# Mobile usability audit (public marketing)",
    "",
    "Automated checks: horizontal overflow, header/footer presence, touch-target heuristics, hero carousel width, exam/lesson cards, mobile nav drawer, region drawer. Visual overlap is not fully inferred — review screenshots for subtle overlap.",
    "",
    "| ID | Device | Route | Severity | Category | Issue | Screenshot |",
    "|---|---|---|---|---|---|---|",
    ...issues.map((r) => {
      const shot = r.screenshotPath ?? "";
      return `| ${esc(r.id)} | ${esc(r.device)} | ${esc(r.route)} | ${esc(r.severity)} | ${esc(r.category)} | ${esc(r.issue)} | ${esc(shot)} |`;
    }),
    "",
  ].join("\n");
  await writeFile(mdPath, md, "utf8");
  return { json: jsonPath, md: mdPath };
}

export async function captureAuditScreenshot(
  page: Page,
  testInfo: TestInfo,
  device: MobileDeviceProfile,
  route: string,
  checkId: string,
): Promise<string> {
  const safeRoute = route.replace(/\//g, "_").replace(/^_|_$/g, "") || "root";
  const dir = path.join("test-results", OUT_SUBDIR, "screenshots");
  await mkdir(dir, { recursive: true });
  const file = `${device.name.replace(/\s+/g, "-")}-${safeRoute}-${checkId}-${randomUUID().slice(0, 8)}.png`;
  const fullPath = path.join(dir, file);
  await page.screenshot({ path: fullPath, fullPage: false });
  const rel = path.join("test-results", OUT_SUBDIR, "screenshots", file);
  await testInfo.attach(`audit-${checkId}-${device.name}-${safeRoute}`, { path: fullPath });
  return rel;
}

export async function measureHorizontalOverflow(page: Page): Promise<{
  document: { scrollWidth: number; clientWidth: number; excess: number };
  main: { scrollWidth: number; clientWidth: number; excess: number } | null;
}> {
  return page.evaluate(() => {
    const d = document.documentElement;
    const docExcess = d.scrollWidth - d.clientWidth;
    const mainEl = document.querySelector("main");
    if (!mainEl) {
      return {
        document: { scrollWidth: d.scrollWidth, clientWidth: d.clientWidth, excess: docExcess },
        main: null,
      };
    }
    const m = mainEl as HTMLElement;
    const mExcess = m.scrollWidth - m.clientWidth;
    return {
      document: { scrollWidth: d.scrollWidth, clientWidth: d.clientWidth, excess: docExcess },
      main: { scrollWidth: m.scrollWidth, clientWidth: m.clientWidth, excess: mExcess },
    };
  });
}

export { dismissMarketingScrims };

function issueIdPrefix(device: MobileDeviceProfile, route: string): string {
  const r = route.replace(/\//g, "_").replace(/^_|_$/g, "") || "root";
  return `${device.name.replace(/\s+/g, "-")}-${r}`;
}

export async function auditPublicRoute(args: {
  page: Page;
  testInfo: TestInfo;
  device: MobileDeviceProfile;
  route: string;
  /** iOS HIG suggests 44pt; flag below 40px as high, 40–44 as medium. */
  touchMinIdeal: number;
  touchMinHard: number;
}): Promise<MobileUsabilityIssue[]> {
  const { page, testInfo, device, route, touchMinIdeal, touchMinHard } = args;
  const issues: MobileUsabilityIssue[] = [];
  const prefix = issueIdPrefix(device, route);
  let seq = 0;

  const add = async (
    partial: Omit<MobileUsabilityIssue, "id" | "device" | "viewport" | "route"> & { screenshot?: boolean },
  ) => {
    const id = `${prefix}-${++seq}`;
    let screenshotPath: string | undefined;
    const wantShot =
      partial.screenshot !== false &&
      (partial.severity === "critical" || partial.severity === "high" || partial.severity === "medium");
    if (wantShot) {
      screenshotPath = await captureAuditScreenshot(page, testInfo, device, route, id);
    }
    issues.push({
      id,
      device: device.name,
      viewport: { width: device.width, height: device.height },
      route,
      issue: partial.issue,
      severity: partial.severity,
      category: partial.category,
      screenshotPath,
    });
  };

  const r = await page.goto(route, { waitUntil: "domcontentloaded" });
  if (!r?.ok()) {
    await add({
      issue: `Navigation failed: HTTP ${r?.status() ?? "?"}`,
      severity: "critical",
      category: "logic",
    });
    return issues;
  }

  await dismissMarketingScrims(page);

  const publicNav = page.locator('[data-nn-nav-mode="public"]');
  try {
    await publicNav.waitFor({ state: "visible", timeout: 60_000 });
  } catch {
    await add({
      issue: "Public marketing nav [data-nn-nav-mode=public] not visible within 60s",
      severity: "critical",
      category: "layout",
    });
    return issues;
  }

  const header = page.locator(".nn-header-animate-in").first();
  if (!(await header.isVisible().catch(() => false))) {
    await add({
      issue: "Header .nn-header-animate-in not visible",
      severity: "high",
      category: "layout",
    });
  }

  const overflow = await measureHorizontalOverflow(page);
  if (overflow.document.excess > 2) {
    await add({
      issue: `Document horizontal overflow: scrollWidth ${overflow.document.scrollWidth}px > clientWidth ${overflow.document.clientWidth}px (excess ${overflow.document.excess}px)`,
      severity: overflow.document.excess > 16 ? "high" : "medium",
      category: "layout",
    });
  }
  if (overflow.main && overflow.main.excess > 2) {
    await add({
      issue: `<main> horizontal overflow: excess ${overflow.main.excess}px`,
      severity: overflow.main.excess > 16 ? "medium" : "low",
      category: "layout",
    });
  }

  const openMenu = page.getByRole("button", { name: /Open menu/i }).first();
  if (!(await openMenu.isVisible().catch(() => false))) {
    await add({
      issue: 'Mobile "Open menu" control not visible (header may not be in mobile layout)',
      severity: "high",
      category: "layout",
    });
  } else {
    const box = await openMenu.boundingBox();
    const minSide = box ? Math.min(box.width, box.height) : 0;
    if (minSide < touchMinHard) {
      await add({
        issue: `Open menu touch target min side ${Math.round(minSide)}px < ${touchMinHard}px`,
        severity: "high",
        category: "layout",
      });
    } else if (minSide < touchMinIdeal) {
      await add({
        issue: `Open menu touch target min side ${Math.round(minSide)}px (below ${touchMinIdeal}px iOS guideline; often acceptable at 40px)`,
        severity: "low",
        category: "layout",
      });
    }
  }

  if (route === "/") {
    const carousel = page.locator('[data-testid="hero-carousel"]');
    if (await carousel.count()) {
      const carouselOverflow = await carousel.evaluate((el) => {
        const h = el as HTMLElement;
        return { sw: h.scrollWidth, cw: h.clientWidth, left: h.getBoundingClientRect().left };
      });
      if (carouselOverflow.sw > carouselOverflow.cw + 2) {
        await add({
          issue: `Hero carousel internal overflow: scrollWidth ${carouselOverflow.sw} > clientWidth ${carouselOverflow.cw}`,
          severity: "medium",
          category: "layout",
        });
      }
      const vw = await page.evaluate(() => window.innerWidth);
      const right = await carousel.evaluate((el) => {
        const r = (el as HTMLElement).getBoundingClientRect();
        return r.right;
      });
      if (right > vw + 2) {
        await add({
          issue: `Hero carousel extends past viewport right (${Math.round(right)}px > ${vw}px)`,
          severity: "high",
          category: "layout",
        });
      }
    }

    const examCard = page.locator("[data-nn-exam-card-id]").first();
    if (await examCard.count()) {
      const cardRight = await examCard.evaluate((el) => (el as HTMLElement).getBoundingClientRect().right);
      const vw = await page.evaluate(() => window.innerWidth);
      if (cardRight > vw + 2) {
        await add({
          issue: `First exam card extends past viewport (${Math.round(cardRight)}px > ${vw}px)`,
          severity: "high",
          category: "layout",
        });
      }
    }
  }

  if (route.includes("/lessons")) {
    const lib = page.locator("#pathway-lesson-library");
    await lib.waitFor({ state: "visible", timeout: 45_000 }).catch(() => {});
    const emptyHub = page.locator('[data-nn-empty="curriculum-hub-empty"]');
    if (await emptyHub.count()) {
      await add({
        issue: "Lessons hub shows empty curriculum state (no indexed lessons in this environment)",
        severity: "low",
        category: "layout",
      });
    } else {
      const lessonLink = lib.locator(`a[href*="/lessons"]`).first();
      await lessonLink.waitFor({ state: "visible", timeout: 30_000 }).catch(() => {});
      if (await lessonLink.count()) {
        const rect = await lessonLink.evaluate((el) => (el as HTMLElement).getBoundingClientRect());
        const vw = await page.evaluate(() => window.innerWidth);
        if (rect.right > vw + 2 || rect.left < -2) {
          await add({
            issue: `First lesson link not fully within viewport (left ${Math.round(rect.left)}, right ${Math.round(rect.right)}, vw ${vw})`,
            severity: "high",
            category: "layout",
          });
        }
      } else {
        await add({
          issue: "No lesson links under #pathway-lesson-library (unexpected if hub is non-empty)",
          severity: "medium",
          category: "layout",
        });
      }
    }
  }

  const tablist = page.locator('[role="tablist"]').first();
  if (await tablist.count()) {
    const vw = await page.evaluate(() => window.innerWidth);
    const tr = await tablist.evaluate((el) => {
      const r = (el as HTMLElement).getBoundingClientRect();
      return { left: r.left, right: r.right };
    });
    if (tr.left < -2 || tr.right > vw + 2) {
      await add({
        issue: `Tablist partially off-screen (left ${Math.round(tr.left)}, right ${Math.round(tr.right)})`,
        severity: "medium",
        category: "layout",
      });
    }
  }

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(200);
  const footer = page.locator("footer").first();
  if (await footer.count()) {
    const vis = await footer.isVisible();
    if (!vis) {
      await add({
        issue: "Footer not visible after scrolling to bottom",
        severity: "medium",
        category: "layout",
      });
    } else {
      const fw = await footer.evaluate((el) => (el as HTMLElement).getBoundingClientRect().width);
      const vw = await page.evaluate(() => window.innerWidth);
      if (fw > vw + 2) {
        await add({
          issue: `Footer wider than viewport (${Math.round(fw)}px > ${vw}px)`,
          severity: "medium",
          category: "layout",
        });
      }
    }
  }

  await page.evaluate(() => window.scrollTo(0, 0));

  return issues;
}

export async function auditMobileDrawers(args: {
  page: Page;
  testInfo: TestInfo;
  device: MobileDeviceProfile;
}): Promise<MobileUsabilityIssue[]> {
  const { page, testInfo, device } = args;
  const issues: MobileUsabilityIssue[] = [];
  const route = "/pricing";
  const prefix = `${issueIdPrefix(device, route)}-drawer`;
  let seq = 0;

  const add = async (
    partial: Omit<MobileUsabilityIssue, "id" | "device" | "viewport" | "route">,
  ) => {
    const id = `${prefix}-${++seq}`;
    const screenshotPath =
      partial.severity === "critical" || partial.severity === "high" || partial.severity === "medium"
        ? await captureAuditScreenshot(page, testInfo, device, route, id)
        : undefined;
    issues.push({
      id,
      device: device.name,
      viewport: { width: device.width, height: device.height },
      route,
      issue: partial.issue,
      severity: partial.severity,
      category: partial.category,
      screenshotPath,
    });
  };

  const r = await page.goto(route, { waitUntil: "domcontentloaded" });
  if (!r?.ok()) {
    await add({
      issue: `Drawer audit: HTTP ${r?.status() ?? "?"}`,
      severity: "critical",
      category: "logic",
    });
    return issues;
  }
  await dismissMarketingScrims(page);
  await page.locator('[data-nn-nav-mode="public"]').waitFor({ state: "visible", timeout: 60_000 });

  const openBtn = page.getByRole("button", { name: /Open menu/i }).first();
  await openBtn.click({ timeout: 15_000 });
  const closeBtns = page.getByRole("button", { name: /^Close menu$/i });
  const closeVisible = await closeBtns.first().isVisible().catch(() => false);
  if (!closeVisible) {
    await add({
      issue: "Mobile nav: Open menu clicked but Close menu not visible",
      severity: "critical",
      category: "logic",
    });
  } else {
    // Prefer an explicit Close control — repeated Escape can leave the overlay open (blocks header chrome).
    await closeBtns.nth(1).click({ timeout: 10_000 }).catch(async () => {
      await closeBtns.first().click({ timeout: 10_000 });
    });
    await page
      .getByRole("button", { name: /Open menu/i })
      .first()
      .waitFor({ state: "visible", timeout: 10_000 });
    const expanded = await openBtn.getAttribute("aria-expanded");
    if (expanded === "true") {
      for (let i = 0; i < 6; i++) await page.keyboard.press("Escape");
    }
    const openAgain = await page.getByRole("button", { name: /Open menu/i }).first().isVisible();
    const stillExpanded = (await openBtn.getAttribute("aria-expanded")) === "true";
    if (!openAgain || stillExpanded) {
      await add({
        issue:
          "Mobile nav: after Close, drawer still open or Open menu unavailable (aria-expanded=" +
          String(await openBtn.getAttribute("aria-expanded")) +
          ")",
        severity: "high",
        category: "logic",
      });
    }
  }

  const regionBtn = page.getByRole("button", { name: /Region and language settings/i }).first();
  if (await regionBtn.isVisible().catch(() => false)) {
    await regionBtn.click({ timeout: 15_000 });
    const heading = page.getByRole("heading", { name: /Region & Settings/i });
    if (!(await heading.isVisible({ timeout: 10_000 }).catch(() => false))) {
      await add({
        issue: "Region drawer: heading 'Region & Settings' not visible after opening",
        severity: "high",
        category: "logic",
      });
    } else {
      await page.keyboard.press("Escape");
    }
  }

  return issues;
}
