/**
 * One-off QA capture: saves PNGs under ./screenshots (workspace).
 * Run: cd nursenest-core && node ../qa-reports/new-grad-journey-1778174002/capture-screenshots.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const APP_ROOT = join(__dirname, "..", "..", "nursenest-core");
const chromiumMod = await import(pathToFileURL(join(APP_ROOT, "node_modules", "playwright-core", "index.js")).href);
const chromium = chromiumMod.default.chromium;
const OUT = join(__dirname, "screenshots");
const BASE = (process.env.BASE_URL || "http://127.0.0.1:3000").replace(/\/$/, "");

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

/** @type {{ route: string; viewport: string; file: string; title: string; finalUrl: string; consoleErrors: string[] }[]} */
const rows = [];

async function capture(page, route, fileBase, viewport) {
  const vw = viewport === "mobile" ? { width: 375, height: 812 } : { width: 1440, height: 900 };
  await page.setViewportSize(vw);
  const consoleErrors = [];
  const onConsole = (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  };
  page.on("console", onConsole);
  const url = `${BASE}${route}`;
  let finalUrl = url;
  let title = "";
  try {
    const res = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 120000 });
    finalUrl = page.url();
    await page.waitForTimeout(600);
    title = await page.title();
    const suffix = viewport === "mobile" ? "-mobile" : "-desktop";
    const file = `${fileBase}${suffix}.png`;
    const path = join(OUT, file);
    await page.screenshot({ path, fullPage: true });
    rows.push({ route, viewport, file, title, finalUrl, consoleErrors: [...consoleErrors] });
  } catch (e) {
    rows.push({
      route,
      viewport,
      file: `${fileBase}${viewport === "mobile" ? "-mobile" : "-desktop"}.png`,
      title: title || "(error)",
      finalUrl,
      consoleErrors: [...consoleErrors, String(e?.message || e)],
    });
  } finally {
    page.off("console", onConsole);
  }
}

mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const page = await context.newPage();

// Phase 1 landings
await capture(page, "/us/new-grad", "01-newgrad-us-landing", "desktop");
await capture(page, "/us/new-grad", "02-newgrad-us-landing", "mobile");
await capture(page, "/canada/new-grad", "03-newgrad-canada-landing", "desktop");
await capture(page, "/canada/new-grad", "04-newgrad-canada-landing", "mobile");
await capture(page, "/en/new-grad", "05-newgrad-en-locale-redirect", "desktop");
await capture(page, "/new-grad", "06-newgrad-root-path", "desktop");

let idx = 7;
for (const shell of ["us", "canada"]) {
  for (const slug of SLUGS) {
    const route = `/${shell}/new-grad/${slug}`;
    const fileBase = `${String(idx).padStart(2, "0")}-hub-${shell}-${slug}`;
    await capture(page, route, fileBase, "desktop");
    idx++;
  }
}

// Representative mobile hubs (Phase 6)
for (const slug of ["icu", "med-surg", "community-public-health"]) {
  await capture(page, `/us/new-grad/${slug}`, `m-${slug}-us`, "mobile");
}

// Study surfaces (public marketing)
const studyRoutes = [
  ["/us/rn/new-grad-transition/lessons", "study-us-lessons"],
  ["/us/rn/new-grad-transition/questions", "study-us-questions"],
  ["/us/rn/new-grad-transition/cat", "study-us-cat"],
];
for (const [route, label] of studyRoutes) {
  await capture(page, route, `z-${label}`, "desktop");
}

// Signup (Phase 7)
await capture(
  page,
  "/signup?callbackUrl=%2Fus%2Frn%2Fnew-grad-transition%2Flessons",
  "z-signup-callback-newgrad-lessons",
  "desktop",
);

await browser.close();

writeFileSync(join(__dirname, "capture-meta.json"), JSON.stringify(rows, null, 2));
console.log("Wrote", rows.length, "rows to capture-meta.json and PNGs under", OUT);
