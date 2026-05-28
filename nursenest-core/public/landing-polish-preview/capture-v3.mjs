#!/usr/bin/env node
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const dir = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(dir, "png-v3-tokens");
const shots = {
  "v3-01-homepage-ocean-tokens.html": [1440, 900],
  "v3-02-homepage-blossom-tokens.html": [1440, 900],
  "v3-03-homepage-mint-blossom-tokens.html": [1440, 900],
  "v3-04-homepage-aurora-tokens.html": [1440, 900],
  "v3-05-homepage-ocean-mobile.html": [390, 844],
  "v3-06-homepage-mint-blossom-mobile.html": [390, 844],
};
await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();
for (const [file, [w, h]] of Object.entries(shots)) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.goto(`file://${path.join(dir, file)}`, { waitUntil: "networkidle", timeout: 60000 });
  await page.screenshot({ path: path.join(outDir, file.replace(".html", ".png")), fullPage: true });
  await page.close();
  console.log(file);
}
await browser.close();
