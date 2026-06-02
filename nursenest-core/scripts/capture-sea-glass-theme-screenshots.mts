import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { chromium, type Page } from "playwright";

const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:3000";
const outDir = process.env.SEA_GLASS_SCREENSHOT_DIR ?? "reports/sea-glass-theme-redesign";

const routes = [
  { name: "homepage", path: "/" },
  { name: "dashboard", path: "/app" },
  { name: "rn-hub", path: "/canada/rn/nclex-rn" },
  { name: "lessons", path: "/app/lessons" },
  { name: "flashcards", path: "/app/flashcards?pathwayId=ca-rn-nclex-rn" },
  { name: "practice-tests", path: "/app/practice-tests" },
  { name: "cat-exams", path: "/app/cat" },
] as const;

const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
] as const;

async function seedSeaGlass(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem("nursenest-theme", "sea-glass");
    document.cookie = "nn-theme=sea-glass; path=/; max-age=31536000; SameSite=Lax";
    document.documentElement.setAttribute("data-theme", "sea-glass");
  });
}

mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const results: Array<{
  route: string;
  viewport: string;
  url: string;
  status: number | null;
  screenshot: string;
  dataTheme: string | null;
}> = [];

for (const viewport of viewports) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 1,
  });

  for (const route of routes) {
    const page = await context.newPage();
    await seedSeaGlass(page);
    const url = new URL(route.path, baseUrl).toString();
    const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45_000 }).catch(() => null);
    await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
    await page.waitForTimeout(500);

    const screenshot = join(outDir, `${route.name}-${viewport.name}-sea-glass.png`);
    await page.screenshot({ path: screenshot, fullPage: true });

    results.push({
      route: route.name,
      viewport: viewport.name,
      url,
      status: response?.status() ?? null,
      screenshot,
      dataTheme: await page.locator("html").getAttribute("data-theme").catch(() => null),
    });
    await page.close();
  }

  await context.close();
}

await browser.close();

writeFileSync(join(outDir, "manifest.json"), JSON.stringify({ baseUrl, results }, null, 2));
console.log(JSON.stringify({ outDir, captured: results.length, results }, null, 2));
