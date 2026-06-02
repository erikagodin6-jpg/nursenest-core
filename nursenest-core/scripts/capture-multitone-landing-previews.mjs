#!/usr/bin/env node
import { chromium } from "playwright";
import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const htmlDir = path.join(root, "public/landing-polish-preview");
const outDir = path.join(htmlDir, "png");

const shots = {
  "01-marketing-ocean-full.html": { w: 1440, h: 900, full: true },
  "02-marketing-blossom-full.html": { w: 1440, h: 900, full: true },
  "03-dashboard-ocean-full.html": { w: 1440, h: 900, full: true },
  "04-dashboard-blossom-full.html": { w: 1440, h: 900, full: true },
  "05-marketing-ocean-mobile.html": { w: 390, h: 844, full: true },
  "06-pathway-hub-ocean.html": { w: 1440, h: 900, full: true },
  "07-pricing-multitone-ocean.html": { w: 1280, h: 700, full: false },
  "08-flashcards-session-blossom.html": { w: 1440, h: 800, full: false },
  "09-cat-readiness-ocean.html": { w: 1440, h: 900, full: false },
  "10-marketing-blossom-mobile.html": { w: 390, h: 844, full: true },
  "11-coaching-panel-compare.html": { w: 1280, h: 600, full: false },
  "12-app-store-hero-composite.html": { w: 1440, h: 800, full: false },
};

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();
const base = `file://${htmlDir}`;

for (const [file, cfg] of Object.entries(shots)) {
  const page = await browser.newPage({ viewport: { width: cfg.w, height: cfg.h } });
  await page.goto(`${base}/${file}`, { waitUntil: "networkidle", timeout: 60000 });
  const outName = file.replace(".html", ".png");
  await page.screenshot({ path: path.join(outDir, outName), fullPage: cfg.full });
  await page.close();
  console.log("wrote", outName);
}
await browser.close();
console.log("total", (await readdir(outDir)).filter((f) => f.endsWith(".png")).length);
