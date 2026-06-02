#!/usr/bin/env node
import { chromium } from "playwright";
import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const htmlDir = path.join(root, "public/leaf-branding-preview");
const outDir = path.join(htmlDir, "png");

const sizes = {
  "01-homepage-hero-leaf-ocean.html": { w: 1280, h: 720, full: false },
  "02-dashboard-readiness-ocean.html": { w: 1280, h: 600, full: false },
  "03-coaching-panel-ocean.html": { w: 1280, h: 480, full: false },
  "04-cat-analytics-ocean.html": { w: 1280, h: 520, full: false },
  "05-empty-state-ocean.html": { w: 480, h: 400, full: false },
  "06-loading-state-ocean.html": { w: 480, h: 360, full: false },
  "07-onboarding-ocean.html": { w: 1280, h: 560, full: false },
  "08-blossom-organic-soft.html": { w: 1280, h: 640, full: false },
  "09-midnight-deep-silhouette.html": { w: 1280, h: 640, full: false },
  "10-progress-growth-metaphor.html": { w: 720, h: 320, full: false },
  "11-section-divider-gradient.html": { w: 1280, h: 280, full: false },
  "12-marketing-screenshot-composite.html": { w: 1280, h: 700, full: false },
};

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();
const base = `file://${htmlDir}`;

for (const [file, cfg] of Object.entries(sizes)) {
  const name = file.replace(".html", ".png");
  const page = await browser.newPage({ viewport: { width: cfg.w, height: cfg.h } });
  await page.goto(`${base}/${file}`, { waitUntil: "networkidle" });
  await page.screenshot({
    path: path.join(outDir, name),
    fullPage: cfg.full,
  });
  await page.close();
  console.log("wrote", name);
}
await browser.close();
const count = (await readdir(outDir)).filter((f) => f.endsWith(".png")).length;
console.log("done", count, "pngs in", outDir);
