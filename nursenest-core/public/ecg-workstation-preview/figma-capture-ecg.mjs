/**
 * Playwright capture for ECG telemetry workstation surfaces.
 * Run from nursenest-core/: node public/ecg-workstation-preview/figma-capture-ecg.mjs
 * Requires dev server at BASE_URL (default http://127.0.0.1:3000).
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "png");
const BASE = process.env.BASE_URL ?? "http://127.0.0.1:3000";

const ROUTES = [
  { name: "01-ecg-hub-ocean", path: "/modules/ecg", theme: "ocean" },
  { name: "02-basic-lessons-ocean", path: "/modules/ecg/basic/lessons", theme: "ocean" },
  { name: "03-basic-lessons-midnight", path: "/modules/ecg/basic/lessons", theme: "midnight" },
  { name: "04-advanced-drills-blossom", path: "/modules/ecg/advanced/video-drills", theme: "blossom" },
];

async function main() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  for (const route of ROUTES) {
    await page.goto(`${BASE}${route.path}`, { waitUntil: "networkidle" });
    await page.evaluate((theme) => {
      document.documentElement.setAttribute("data-theme", theme);
    }, route.theme);
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(OUT, `${route.name}.png`), fullPage: true });
    console.log("wrote", route.name);
  }
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
