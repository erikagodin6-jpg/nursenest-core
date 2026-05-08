#!/usr/bin/env node
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const canvasPath = path.join(root, "docs", "ui-canvas", "nursenest-premium-ui-canvas.html");
const outDir = path.join(root, "docs", "ui-canvas", "screenshots");
const fileUrl = pathToFileURL(canvasPath).toString();
const canvasUrl = ({ theme, device }) => `${fileUrl}?theme=${theme}&device=${device}&capture=1`;

const themes = ["blossom", "ocean", "garden", "dark"];
const devices = [
  { name: "desktop", width: 1440, height: 1200 },
  { name: "tablet", width: 1024, height: 1180 },
  { name: "mobile", width: 390, height: 1000 },
];

await mkdir(outDir, { recursive: true });

const previewDir = path.join(root, "reports", "ui-redesign-preview");
await mkdir(previewDir, { recursive: true });

const browser = await chromium.launch();
try {
  for (const theme of themes) {
    for (const device of devices) {
      const page = await browser.newPage({ viewport: { width: device.width, height: device.height } });
      await page.goto(canvasUrl({ theme, device: device.name }), { waitUntil: "networkidle" });
      await page.screenshot({
        path: path.join(outDir, `${theme}-${device.name}-overview.png`),
        fullPage: true,
      });
      await page.close();
    }
  }

  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
  await page.goto(canvasUrl({ theme: "ocean", device: "desktop" }), { waitUntil: "networkidle" });
  await page.locator("#frame-9").screenshot({ path: path.join(outDir, "ocean-desktop-lesson-detail.png") });
  await page.goto(canvasUrl({ theme: "dark", device: "mobile" }), { waitUntil: "networkidle" });
  await page.locator("#frame-24").screenshot({ path: path.join(outDir, "dark-mobile-lesson-layout.png") });
  await page.goto(canvasUrl({ theme: "garden", device: "desktop" }), { waitUntil: "networkidle" });
  await page.locator("#frame-10").screenshot({ path: path.join(outDir, "garden-desktop-learner-dashboard.png") });
  await page.close();

  const reviewFrames = [
    { id: 1, name: "homepage", theme: "ocean", device: "desktop", width: 1440, height: 1100 },
    { id: 2, name: "pricing-page", theme: "blossom", device: "desktop", width: 1440, height: 1100 },
    { id: 3, name: "faq-page", theme: "garden", device: "desktop", width: 1440, height: 1100 },
    { id: 4, name: "rn-hub", theme: "ocean", device: "desktop", width: 1440, height: 1100 },
    { id: 5, name: "rpn-hub", theme: "garden", device: "desktop", width: 1440, height: 1100 },
    { id: 6, name: "np-hub", theme: "blossom", device: "desktop", width: 1440, height: 1100 },
    { id: 9, name: "lesson-page-desktop", theme: "ocean", device: "desktop", width: 1440, height: 1100 },
    { id: 24, name: "lesson-page-mobile", theme: "dark", device: "mobile", width: 390, height: 900 },
    { id: 10, name: "learner-dashboard", theme: "garden", device: "desktop", width: 1440, height: 1100 },
    { id: 11, name: "flashcards-hub", theme: "ocean", device: "desktop", width: 1440, height: 1100 },
    { id: 12, name: "flashcard-session", theme: "dark", device: "desktop", width: 1440, height: 1100 },
    { id: 13, name: "practice-test-builder", theme: "ocean", device: "desktop", width: 1440, height: 1100 },
    { id: 14, name: "practice-test-runner", theme: "garden", device: "desktop", width: 1440, height: 1100 },
    { id: 15, name: "cat-exam-interface", theme: "dark", device: "desktop", width: 1440, height: 1100 },
    { id: 18, name: "blog-index", theme: "ocean", device: "desktop", width: 1440, height: 1100 },
    { id: 19, name: "blog-detail", theme: "garden", device: "desktop", width: 1440, height: 1100 },
  ];

  for (const frame of reviewFrames) {
    const reviewPage = await browser.newPage({ viewport: { width: frame.width, height: frame.height } });
    await reviewPage.goto(canvasUrl({ theme: frame.theme, device: frame.device }), { waitUntil: "networkidle" });
    await reviewPage.locator(`#frame-${frame.id}`).screenshot({
      path: path.join(previewDir, `${frame.name}-${frame.theme}-${frame.device}.png`),
    });
    await reviewPage.close();
  }
} finally {
  await browser.close();
}

console.log(`[ui-canvas] screenshots written to ${outDir}`);
console.log(`[ui-canvas] review previews written to ${previewDir}`);
