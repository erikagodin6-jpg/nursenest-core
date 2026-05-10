import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const base = process.env.EVIDENCE_BASE_URL?.trim() || "http://127.0.0.1:3000";
const outDir =
  process.env.EVIDENCE_OUT_DIR?.trim() ||
  path.join(root, "reports/ui-evidence/learner-cockpit-premiumization");
fs.mkdirSync(outDir, { recursive: true });
const themes = ["ocean", "aurora", "midnight"];

async function applyTheme(page, theme) {
  await page.evaluate((t) => {
    document.documentElement.setAttribute("data-theme", t);
  }, theme);
}

async function capture(browser, viewport, slug, urlPath) {
  const url = `${base}${urlPath}`;
  for (const theme of themes) {
    const page = await browser.newPage({ viewport });
    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180_000 });
      await page.waitForTimeout(4000);
      await applyTheme(page, theme);
      await page.waitForTimeout(500);
      const file = path.join(outDir, `${slug}-${theme}-${viewport.width}x${viewport.height}.png`);
      await page.screenshot({ path: file, fullPage: true });
      console.log("wrote", file);
    } finally {
      await page.close();
    }
  }
}

const browser = await chromium.launch({ headless: true });
try {
  // `/app` middleware redirects to `/login` with a `callbackUrl` that may reference `localhost`,
  // which can hang `page.goto` when the dev server is bound to `127.0.0.1` only. Capture the login
  // gate with an explicit 127.0.0.1 callback for dashboard/report intent.
  const appCb = encodeURIComponent(`${base}/app`);
  const reportCb = encodeURIComponent(`${base}/app/account/report`);
  await capture(
    browser,
    { width: 1440, height: 900 },
    "login-gate-callback-app",
    `/login?callbackUrl=${appCb}`,
  );
  await capture(
    browser,
    { width: 390, height: 844 },
    "login-gate-callback-app",
    `/login?callbackUrl=${appCb}`,
  );
  await capture(
    browser,
    { width: 1440, height: 900 },
    "login-gate-callback-report",
    `/login?callbackUrl=${reportCb}`,
  );
  await capture(
    browser,
    { width: 390, height: 844 },
    "login-gate-callback-report",
    `/login?callbackUrl=${reportCb}`,
  );
  await capture(browser, { width: 1440, height: 900 }, "cat-marketing-nclex-rn", "/us/rn/nclex-rn/cat");
  await capture(browser, { width: 390, height: 844 }, "cat-marketing-nclex-rn", "/us/rn/nclex-rn/cat");
} finally {
  await browser.close();
}
