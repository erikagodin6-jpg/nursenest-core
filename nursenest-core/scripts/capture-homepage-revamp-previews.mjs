#!/usr/bin/env node
/**
 * Capture homepage revamp HTML mockups as PNGs for design approval.
 * Usage: node scripts/capture-homepage-revamp-previews.mjs
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "public/homepage-revamp-preview/png");
const base = `file://${path.join(root, "public/homepage-revamp-preview")}`;

const shots = [
  { file: "homepage-ocean-desktop.html", name: "01-home-ocean-desktop", width: 1440, height: 900, fullPage: true },
  { file: "homepage-mobile-ocean.html", name: "02-home-mobile-ocean", width: 390, height: 844, fullPage: true },
  { file: "homepage-midnight-desktop.html", name: "03-home-midnight-desktop", width: 1440, height: 800, fullPage: false },
  { file: "homepage-blossom-desktop.html", name: "04-home-blossom-desktop", width: 1440, height: 800, fullPage: false },
  { file: "homepage-ocean-desktop.html", name: "05-home-hero-crop", width: 1280, height: 720, fullPage: false },
  { file: "homepage-ocean-desktop.html", name: "06-home-macbook-air", width: 1280, height: 800, fullPage: true },
  { file: "homepage-tablet-ocean.html", name: "07-home-tablet-ocean", width: 834, height: 1100, fullPage: true },
  { file: "homepage-features-ocean.html", name: "08-home-features-ocean", width: 1280, height: 600, fullPage: false },
  { file: "homepage-trust-ocean.html", name: "09-home-trust-ocean", width: 1280, height: 500, fullPage: false },
  { file: "homepage-cta-ocean.html", name: "10-home-cta-ocean", width: 1280, height: 400, fullPage: false },
];

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
for (const shot of shots) {
  const page = await browser.newPage({ viewport: { width: shot.width, height: shot.height } });
  await page.goto(`${base}/${shot.file}`, { waitUntil: "networkidle" });
  await page.screenshot({
    path: path.join(outDir, `${shot.name}.png`),
    fullPage: shot.fullPage,
  });
  await page.close();
  console.log("wrote", shot.name);
}
await browser.close();
console.log("done", outDir);
