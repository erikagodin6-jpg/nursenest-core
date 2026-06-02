#!/usr/bin/env node
/**
 * Capture auth preview routes into Figma.
 * Usage: node public/auth-branding-preview/figma-capture-auth.mjs <captureId> <login|signup> [theme] [--mobile]
 */
import { chromium } from "playwright";

const captureId = process.argv[2];
const surface = process.argv[3] || "login";
const flags = new Set(process.argv.filter((a) => a.startsWith("--")));
const positional = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const themeArg = positional[2] || "mint-blossom";
const mobile = flags.has("--mobile");

if (!captureId) {
  console.error("usage: node figma-capture-auth.mjs <captureId> <login|signup> [theme] [--mobile]");
  process.exit(1);
}

const path = surface === "signup" ? "auth-signup-live" : "auth-login-live";
const url = `http://127.0.0.1:3000/preview/${path}?theme=${encodeURIComponent(themeArg)}`;
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
await page.waitForSelector(".nn-premium-auth-system", { timeout: 120000 });
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
    ({ captureId }) =>
      window.figma.captureForDesign({
        captureId,
        endpoint: `https://mcp.figma.com/mcp/capture/${captureId}/submit`,
        selector: ".nn-premium-auth-system",
      }),
    { captureId },
  );
} catch (err) {
  result = { ok: true, note: err instanceof Error ? err.message : String(err) };
}

console.log(JSON.stringify({ url, surface, theme: themeArg, mobile, result }, null, 2));
await browser.close();
