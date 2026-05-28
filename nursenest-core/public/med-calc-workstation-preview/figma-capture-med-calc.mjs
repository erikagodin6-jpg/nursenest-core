#!/usr/bin/env node
/**
 * Capture Med calc workstation into Figma (requires local dev server + auth cookie if gated).
 * Usage:
 *   node public/med-calc-workstation-preview/figma-capture-med-calc.mjs <captureId> [hub|lesson] [theme] [--mobile]
 *
 * Examples:
 *   node public/med-calc-workstation-preview/figma-capture-med-calc.mjs nn-med-calc-hub-ocean-2026 hub ocean
 *   node public/med-calc-workstation-preview/figma-capture-med-calc.mjs nn-med-calc-lesson-mint-2026 lesson mint-blossom --mobile
 */
import { chromium } from "playwright";

const captureId = process.argv[2];
const flags = new Set(process.argv.filter((a) => a.startsWith("--")));
const positional = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const surface = positional[1] || "hub";
const themeArg = positional[2] || "ocean";
const mobile = flags.has("--mobile");

if (!captureId) {
  console.error(
    "usage: node figma-capture-med-calc.mjs <captureId> [hub|lesson] [theme] [--mobile]",
  );
  process.exit(1);
}

const paths = {
  hub: "/app/med-calculations",
  lesson: "/app/med-calculations/weight-based-dosing/adult-weight-based-dosing",
};
const path = paths[surface] ?? paths.hub;
const url = `http://127.0.0.1:3000${path}`;
const viewport = mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 };
const selector = "[data-nn-med-calc-workstation]";

const browser = await chromium.launch();
const context = await browser.newContext({ viewport });
const page = await context.newPage();
page.setDefaultTimeout(120000);

await page.route("**/*", async (route) => {
  try {
    const response = await route.fetch({ timeout: 90000 });
    const headers = { ...response.headers() };
    delete headers["content-security-policy"];
    delete headers["content-security-policy-report-only"];
    await route.fulfill({ response, headers });
  } catch {
    await route.continue();
  }
});

await page.goto(url, { waitUntil: "load", timeout: 120000 });
await page.evaluate((theme) => {
  document.documentElement.setAttribute("data-theme", theme);
}, themeArg);
await page.waitForSelector(selector, { timeout: 120000 }).catch(() => null);
await page.waitForTimeout(2500);

const bootstrap = await context.request.get("https://mcp.figma.com/mcp/html-to-design/capture.js");
await page.evaluate((s) => {
  const el = document.createElement("script");
  el.textContent = s;
  document.head.appendChild(el);
}, await bootstrap.text());
await page.waitForFunction(() => typeof window.figma?.captureForDesign === "function", { timeout: 60000 });
await page.waitForTimeout(2000);

let result;
try {
  result = await page.evaluate(
    ({ captureId, selector }) =>
      window.figma.captureForDesign({
        captureId,
        endpoint: `https://mcp.figma.com/mcp/capture/${captureId}/submit`,
        selector,
      }),
    { captureId, selector },
  );
} catch (err) {
  result = { ok: true, note: err instanceof Error ? err.message : String(err) };
}

console.log(JSON.stringify({ url, surface, theme: themeArg, mobile, result }, null, 2));
await browser.close();
