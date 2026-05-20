import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const BASE_URL = process.env.QA_BASE_URL || "http://localhost:3000";
const THEME_STORAGE_KEY = "nursenest-theme";

const scenarios = [
  {
    id: "desktop-light",
    theme: "pastel-lavender",
    viewport: { width: 1440, height: 1000 },
    pages: ["/", "/pricing", "/login"],
    mobile: false,
  },
  {
    id: "desktop-dark",
    theme: "dark-clinical",
    viewport: { width: 1440, height: 1000 },
    pages: ["/", "/pricing", "/login"],
    mobile: false,
  },
  {
    id: "mobile-light",
    theme: "mint",
    viewport: { width: 375, height: 812 },
    pages: ["/", "/pricing", "/login"],
    mobile: true,
  },
  {
    id: "mobile-dark",
    theme: "midnight",
    viewport: { width: 375, height: 812 },
    pages: ["/", "/pricing", "/login"],
    mobile: true,
  },
];

function nowStamp() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function checkHeader(page, isMobile) {
  const result = {
    logoVisible: false,
    noLogoArtifact: false,
    navLinksVisible: false,
    loginVisible: false,
    startPracticingVisible: false,
    sectionShellAligned: false,
    utilitySubordinate: false,
    stickyIntentional: false,
    stickyNoJump: false,
    noLogoFlickerOnScroll: false,
    mobileMenuOpens: null,
    mobileNoOverflow: null,
    notes: [],
  };

  const header = page.locator("header.nn-header-nav").first();
  const utility = page.locator(".nn-header-utility, .nn-header-utility-dark").first();
  const logoImg = page.locator(".nn-header-logo-link img.nn-brand-header-logo, .nn-header-logo-link img").first();
  const logoLink = page.locator(".nn-header-logo-link").first();
  const startCta = page.getByRole("link", { name: /start practicing/i }).first();
  const loginAction = page.getByRole("link", { name: /^login$/i }).first();

  const headerPresent = (await page.locator("header.nn-header-nav").count()) > 0;
  if (!headerPresent) {
    result.notes.push("Main header selector not found on this route.");
    return result;
  }

  result.logoVisible = await logoImg.isVisible().catch(() => false);
  const logoNatural = await logoImg.evaluate((img) => ({
    w: img.naturalWidth || 0,
    h: img.naturalHeight || 0,
  })).catch(() => ({ w: 0, h: 0 }));
  if (!(logoNatural.w > 0 && logoNatural.h > 0)) {
    result.notes.push("Logo image natural size missing.");
  }

  const logoChrome = await logoLink.evaluate((el) => {
    const cs = getComputedStyle(el);
    return {
      bg: cs.backgroundColor,
      border: cs.borderTopWidth,
      radius: cs.borderRadius,
      shadow: cs.boxShadow,
    };
  }).catch(() => null);
  result.noLogoArtifact = Boolean(
    logoChrome &&
      (logoChrome.bg === "rgba(0, 0, 0, 0)" || logoChrome.bg === "transparent") &&
      logoChrome.border === "0px" &&
      (logoChrome.shadow === "none" || logoChrome.shadow === "rgb(0, 0, 0) 0px 0px 0px 0px"),
  );
  if (!result.noLogoArtifact) {
    result.notes.push(`Logo wrapper chrome: ${JSON.stringify(logoChrome)}`);
  }

  const navLinksCount = await page.locator("nav .nn-marketing-nav-link").count();
  result.navLinksVisible = navLinksCount >= 4;
  result.loginVisible = await loginAction.isVisible().catch(() => false);
  result.startPracticingVisible = await startCta.isVisible().catch(() => false);

  const shellCheck = await page.evaluate(() => {
    const navShell = document.querySelector("header.nn-header-nav .nn-section-shell");
    return Boolean(navShell);
  }).catch(() => false);
  result.sectionShellAligned = shellCheck;

  const utilityMetrics = await utility.evaluate((el) => {
    const rect = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return { h: rect.height, opacity: Number(cs.opacity || "1") };
  }).catch(() => null);
  const mainMetrics = await header.evaluate((el) => {
    const rect = el.getBoundingClientRect();
    return { h: rect.height };
  }).catch(() => null);
  result.utilitySubordinate = Boolean(
    utilityMetrics &&
      mainMetrics &&
      utilityMetrics.h < mainMetrics.h &&
      utilityMetrics.opacity <= 1,
  );

  const before = await header.boundingBox();
  await page.mouse.wheel(0, 900);
  await page.waitForTimeout(300);
  const after = await header.boundingBox();
  const hasScrolledClass = await header.evaluate((el) =>
    el.classList.contains("nn-header-nav--scrolled"),
  ).catch(() => false);
  result.stickyIntentional = Boolean(before && after && Math.abs((before?.y || 0) - (after?.y || 0)) < 1 && hasScrolledClass);
  result.stickyNoJump = Boolean(before && after && Math.abs((before?.height || 0) - (after?.height || 0)) < 1);
  result.noLogoFlickerOnScroll = await logoImg.isVisible().catch(() => false);

  if (isMobile) {
    const menuButton = page.getByRole("button", { name: /open menu/i }).first();
    const opened = await menuButton.isVisible().catch(() => false);
    if (opened) {
      await menuButton.click();
      await page.waitForTimeout(250);
      const drawer = page.locator(".fixed.inset-0.z-\\[200\\]");
      result.mobileMenuOpens = await drawer.isVisible().catch(() => false);
      const overflowCheck = await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth + 1,
      ).catch(() => false);
      result.mobileNoOverflow = overflowCheck;
    } else {
      result.mobileMenuOpens = false;
      result.mobileNoOverflow = false;
      result.notes.push("Mobile menu trigger not visible.");
    }
  }

  return result;
}

function summarizeChecks(checks, isMobile) {
  const entries = [
    ["A.mainHeader", checks.logoVisible && checks.noLogoArtifact && checks.navLinksVisible && checks.loginVisible && checks.startPracticingVisible && checks.sectionShellAligned],
    ["B.utilityStrip", checks.utilitySubordinate],
    ["C.sticky", checks.stickyIntentional && checks.stickyNoJump && checks.noLogoFlickerOnScroll],
    ["F.assetRendering", checks.logoVisible && checks.noLogoArtifact],
  ];
  if (isMobile) {
    entries.push(["E.mobileDrawer", Boolean(checks.mobileMenuOpens && checks.mobileNoOverflow)]);
  }
  return Object.fromEntries(entries.map(([k, v]) => [k, v ? "pass" : "fail"]));
}

async function run() {
  const outDir = path.join(process.cwd(), "reports", `header-qa-${nowStamp()}`);
  await ensureDir(outDir);

  const browser = await chromium.launch({ headless: true });
  const report = [];

  for (const scenario of scenarios) {
    const context = await browser.newContext({
      viewport: scenario.viewport,
      colorScheme: scenario.id.includes("dark") ? "dark" : "light",
    });
    await context.addInitScript(({ themeKey, themeValue }) => {
      window.localStorage.setItem(themeKey, themeValue);
      document.documentElement.setAttribute("data-theme", themeValue);
    }, { themeKey: THEME_STORAGE_KEY, themeValue: scenario.theme });

    const page = await context.newPage();
    const scenarioResult = {
      scenario: scenario.id,
      theme: scenario.theme,
      viewport: scenario.viewport,
      pages: [],
      screenshots: [],
    };

    for (const route of scenario.pages) {
      const url = `${BASE_URL}${route}`;
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
      await page.waitForTimeout(600);
      const checks = await checkHeader(page, scenario.mobile);
      const summary = summarizeChecks(checks, scenario.mobile);
      const shotPath = path.join(outDir, `${scenario.id}-${route === "/" ? "home" : route.replace(/\//g, "_")}.png`);
      await page.screenshot({ path: shotPath, fullPage: false });
      scenarioResult.screenshots.push(shotPath);
      scenarioResult.pages.push({
        route,
        url,
        checks,
        summary,
      });
      if (scenario.mobile && route === "/") {
        const menuButton = page.getByRole("button", { name: /open menu/i }).first();
        if (await menuButton.isVisible().catch(() => false)) {
          await menuButton.click();
          await page.waitForTimeout(250);
          const drawerShot = path.join(outDir, `${scenario.id}-home-drawer-open.png`);
          await page.screenshot({ path: drawerShot, fullPage: false });
          scenarioResult.screenshots.push(drawerShot);
        }
      }
    }

    report.push(scenarioResult);
    await context.close();
  }

  await browser.close();

  const reportPath = path.join(outDir, "report.json");
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2), "utf8");
  console.log(JSON.stringify({ outDir, reportPath, scenarios: report.length }, null, 2));
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
