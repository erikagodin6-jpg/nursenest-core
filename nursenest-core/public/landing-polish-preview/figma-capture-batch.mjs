#!/usr/bin/env node
import { chromium } from "playwright";

const jobs = [
  ["06d87e9b-d64d-4cf3-bfaa-8b2274cd1174", "v3-02-homepage-blossom-tokens.html"],
  ["af5f2742-d4e7-4ddf-8bb5-c6a6cede2749", "v3-03-homepage-mint-blossom-tokens.html"],
];

async function run(captureId, file) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`http://127.0.0.1:8765/${file}`, { waitUntil: "networkidle", timeout: 45000 });
  const r = await page.context().request.get("https://mcp.figma.com/mcp/html-to-design/capture.js");
  await page.evaluate((s) => {
    const el = document.createElement("script");
    el.textContent = s;
    document.head.appendChild(el);
  }, await r.text());
  await page.waitForTimeout(800);
  const result = await Promise.race([
    page.evaluate(
      ({ captureId }) =>
        window.figma?.captureForDesign({
          captureId,
          endpoint: `https://mcp.figma.com/mcp/capture/${captureId}/submit`,
          selector: "body",
        }),
      { captureId },
    ),
    new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), 25000)),
  ]).catch((e) => ({ error: String(e) }));
  console.log(file, result);
  await browser.close();
}

for (const j of jobs) await run(...j);
