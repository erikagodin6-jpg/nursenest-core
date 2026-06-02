#!/usr/bin/env node
import { chromium } from "playwright";
import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const htmlDir = path.join(root, "public/landing-polish-preview");
const outDir = path.join(htmlDir, "png-v2-pastel");

const shots = {
  "v2-01-homepage-ocean-pastel.html": { w: 1440, h: 900, full: true },
  "v2-02-homepage-blossom-pastel.html": { w: 1440, h: 900, full: true },
  "v2-03-homepage-aurora-pastel.html": { w: 1440, h: 900, full: true },
  "v2-04-homepage-depth-optional.html": { w: 1440, h: 900, full: true },
  "v2-05-homepage-ocean-mobile.html": { w: 390, h: 844, full: true },
  "v2-06-homepage-blossom-mobile.html": { w: 390, h: 844, full: true },
  "v2-07-homepage-aurora-mobile.html": { w: 390, h: 844, full: true },
};

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();
const base = `file://${htmlDir}`;

for (const [file, cfg] of Object.entries(shots)) {
  const page = await browser.newPage({ viewport: { width: cfg.w, height: cfg.h } });
  await page.goto(`${base}/${file}`, { waitUntil: "networkidle", timeout: 60000 });
  const out = file.replace(".html", ".png");
  await page.screenshot({ path: path.join(outDir, out), fullPage: cfg.full });
  await page.close();
  console.log("wrote", out);
}
await browser.close();
console.log("done", outDir);
