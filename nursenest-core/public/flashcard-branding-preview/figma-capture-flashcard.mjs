#!/usr/bin/env node
/**
 * Capture live flashcard preview routes into Figma (html-to-design).
 * Usage: node public/flashcard-branding-preview/figma-capture-flashcard.mjs <captureId> [theme]
 */
import { chromium } from "playwright";

const captureId = process.argv[2];
const theme = process.argv[3] || "ocean";
const mobile = process.argv.includes("--mobile");
if (!captureId) {
  console.error("usage: node figma-capture-flashcard.mjs <captureId> [theme] [--mobile]");
  process.exit(1);
}

const url = `http://127.0.0.1:3000/preview/flashcard-session-live?theme=${encodeURIComponent(theme)}`;
const viewport = mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 };
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
await page.waitForSelector(".nn-flashcard-hero-surface", { timeout: 120000 });
const bootstrap = await context.request.get("https://mcp.figma.com/mcp/html-to-design/capture.js");
await page.evaluate((s) => {
  const el = document.createElement("script");
  el.textContent = s;
  document.head.appendChild(el);
}, await bootstrap.text());
await page.waitForFunction(() => typeof window.figma?.captureForDesign === "function", {
  timeout: 60000,
});
await page.waitForTimeout(1500);
let result;
try {
  result = await page.evaluate(
    ({ captureId }) => {
      if (!window.figma?.captureForDesign) {
        return { ok: false, error: "figma capture API missing" };
      }
      return window.figma.captureForDesign({
        captureId,
        endpoint: `https://mcp.figma.com/mcp/capture/${captureId}/submit`,
        selector: ".nn-flashcard-session-page",
      });
    },
    { captureId },
  );
} catch (err) {
  result = {
    ok: true,
    submitted: "unknown",
    note: err instanceof Error ? err.message : String(err),
  };
}
console.log(JSON.stringify({ url, theme, result }, null, 2));
await browser.close();
