/**
 * UI verification captures for docs (Playwright).
 * Run from nursenest-core: BASE_URL=http://127.0.0.1:3000 node scripts/browser-verify-screenshots.mjs
 */
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgRoot = join(__dirname, "..");
const repoRoot = join(pkgRoot, "..");
const outDir = join(repoRoot, "docs", "verification-screenshots");
const base = (process.env.BASE_URL ?? "http://127.0.0.1:3000").replace(/\/$/, "");

const routes = [
  { path: "/app/practice-tests", slug: "practice-tests" },
  { path: "/canada/new-grad", slug: "canada-new-grad" },
  { path: "/allied/allied-health", slug: "allied-global-hub" },
  { path: "/allied/mlt", slug: "allied-mlt-occupation" },
  { path: "/app/dashboard", slug: "learner-dashboard" },
];

const viewports = [
  { w: 1280, h: 800, tag: "desktop" },
  { w: 390, h: 844, tag: "mobile" },
];

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const summary = [];

for (const vp of viewports) {
  const context = await browser.newContext({ viewport: { width: vp.w, height: vp.h } });
  for (const r of routes) {
    const page = await context.newPage();
    const url = `${base}${r.path}`;
    let title = "";
    let status = 0;
    try {
      const res = await page.goto(url, { waitUntil: "networkidle", timeout: 120000 });
      status = res?.status() ?? 0;
      await page.waitForTimeout(500);
      title = await page.title();
      const file = join(outDir, `${r.slug}-${vp.tag}.png`);
      await page.screenshot({ path: file, fullPage: false });
      summary.push({ url, file, status, title: title.slice(0, 160) });
    } catch (e) {
      summary.push({ url, file: null, status, error: String(e) });
    } finally {
      await page.close().catch(() => {});
    }
  }
  await context.close();
}

await browser.close();
const reportPath = join(repoRoot, "docs", "verification", "screenshot-capture-log.json");
await mkdir(dirname(reportPath), { recursive: true });
await writeFile(reportPath, JSON.stringify({ base, capturedAt: new Date().toISOString(), summary }, null, 2), "utf8");
console.log(JSON.stringify({ outDir, reportPath, shots: summary.length }, null, 2));
