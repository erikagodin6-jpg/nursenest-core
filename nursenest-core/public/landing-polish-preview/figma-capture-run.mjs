#!/usr/bin/env node
import { chromium } from "playwright";

const captureId = process.argv[2];
const path = process.argv[3] || "v3-01-homepage-ocean-tokens.html";
if (!captureId) {
  console.error("usage: node figma-capture-run.mjs <captureId> [htmlFile]");
  process.exit(1);
}

const url = `http://127.0.0.1:8765/${path}`;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.route("**/*", async (route) => {
  const response = await route.fetch();
  const headers = { ...response.headers() };
  delete headers["content-security-policy"];
  delete headers["content-security-policy-report-only"];
  await route.fulfill({ response, headers });
});
await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
const r = await page.context().request.get("https://mcp.figma.com/mcp/html-to-design/capture.js");
await page.evaluate((s) => {
  const el = document.createElement("script");
  el.textContent = s;
  document.head.appendChild(el);
}, await r.text());
await page.waitForTimeout(1200);
const result = await page.evaluate(
  ({ captureId }) =>
    window.figma.captureForDesign({
      captureId,
      endpoint: `https://mcp.figma.com/mcp/capture/${captureId}/submit`,
      selector: "body",
    }),
  { captureId },
);
console.log(JSON.stringify(result));
await browser.close();
