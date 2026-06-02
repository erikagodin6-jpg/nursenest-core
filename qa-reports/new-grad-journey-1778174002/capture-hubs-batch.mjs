/**
 * Resume capture for hub + study routes (gentle pacing). Uses port from BASE_URL.
 * Run: node capture-hubs-batch.mjs
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const APP_ROOT = join(__dirname, "..", "..", "nursenest-core");
const chromiumMod = await import(pathToFileURL(join(APP_ROOT, "node_modules", "playwright-core", "index.js")).href);
const chromium = chromiumMod.default.chromium;

const OUT = join(__dirname, "screenshots");
const BASE = (process.env.BASE_URL || "http://127.0.0.1:3010").replace(/\/$/, "");

const SLUGS = [
  "med-surg",
  "emergency-department",
  "icu",
  "pediatric-icu",
  "neonatal-icu",
  "cardiac-icu",
  "neuro-icu",
  "trauma",
  "long-term-care",
  "rehabilitation",
  "mental-health",
  "pediatrics",
  "maternal-newborn",
  "labour-delivery",
  "oncology-hematology",
  "renal-dialysis",
  "operating-room",
  "pacu",
  "community-public-health",
  "primary-care-clinics",
  "home-care",
  "hospice-palliative-care",
];

const routes = [];
for (const shell of ["us", "canada"]) {
  for (const slug of SLUGS) {
    routes.push({
      route: `/${shell}/new-grad/${slug}`,
      file: `hub-${shell}-${slug}-desktop.png`,
    });
  }
}
routes.push(
  { route: "/us/rn/new-grad-transition/lessons", file: "z-study-us-lessons-desktop.png" },
  { route: "/us/rn/new-grad-transition/questions", file: "z-study-us-questions-desktop.png" },
  { route: "/us/rn/new-grad-transition/cat", file: "z-study-us-cat-desktop.png" },
  {
    route: "/signup?callbackUrl=%2Fus%2Frn%2Fnew-grad-transition%2Flessons",
    file: "z-signup-callback-newgrad-lessons-desktop.png",
  },
  { route: "/en/new-grad", file: "05b-en-new-grad-redirect-check-desktop.png" },
);

/** @type {object[]} */
const rows = [];

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 900 });

for (const { route, file } of routes) {
  const consoleErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error" && !msg.text().includes("webpack-hmr")) consoleErrors.push(msg.text());
  });
  const url = `${BASE}${route}`;
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 120000 });
    await page.waitForTimeout(500);
    const title = await page.title();
    const finalUrl = page.url();
    await page.screenshot({ path: join(OUT, file), fullPage: true });
    rows.push({ route, file, title, finalUrl, consoleErrors: [...consoleErrors] });
  } catch (e) {
    rows.push({ route, file, error: String(e?.message || e) });
  }
  page.removeAllListeners("console");
  await page.waitForTimeout(250);
}

await browser.close();
writeFileSync(join(__dirname, "capture-hubs-meta.json"), JSON.stringify(rows, null, 2));
console.log("done", rows.length, "BASE", BASE);
