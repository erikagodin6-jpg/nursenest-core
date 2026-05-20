#!/usr/bin/env node
/**
 * Captures full-page PNGs from `/preview/[surface]` (design-review shells).
 *
 * Env:
 *   UI_PREVIEW_THEMES=ocean,midnight — capture each route per theme (?theme=); filenames get -theme suffix when >1 theme.
 *   UI_PREVIEW_MIRROR_REPORTS=1 — copy `preview-screenshots/` → `../reports/ui-redesign-preview/` for PR attachments.
 */
import { spawn } from "node:child_process";
import { cp, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputRoot = path.join(root, "preview-screenshots");
const port = process.env.UI_PREVIEW_PORT || "3100";
const baseUrl = process.env.UI_PREVIEW_BASE_URL || `http://127.0.0.1:${port}`;
const shouldStartServer = !process.env.UI_PREVIEW_BASE_URL;

const themes = (
  process.env.UI_PREVIEW_THEMES?.split(/[,]+/).map((s) => s.trim()).filter(Boolean) ?? ["ocean"]
);
const multiTheme = themes.length > 1;

const routes = [
  "homepage",
  "pricing",
  "faq",
  "lesson",
  "dashboard",
  "flashcards",
  "flashcard-session",
  "practice-tests",
  "practice-runner",
  "cat",
  "blog",
  "blog-detail",
  "admin",
  "report-cards",
  "analytics",
  "tools",
  "pre-nursing",
  "np-hub",
  "rn-hub",
  "allied-hub",
];

const devices = [
  { name: "desktop", width: 1440, height: 1100 },
  { name: "tablet", width: 1024, height: 1100 },
  { name: "mobile", width: 390, height: 900 },
];

async function waitForServer(url, timeoutMs = 420_000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(4_000) });
      if (res.status < 500) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 1_500));
  }
  throw new Error(`[ui-preview] Timed out waiting for ${url}`);
}

let server = null;
if (shouldStartServer) {
  server = spawn("npm", ["run", "dev:next", "--", "--hostname", "127.0.0.1", "--port", port], {
    cwd: root,
    stdio: "inherit",
    env: {
      ...process.env,
      AUTH_SECRET: process.env.AUTH_SECRET || "dev-test-secret-dev-test-secret-dev-test",
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "dev-test-secret-dev-test-secret-dev-test",
      NN_UI_PREVIEW_MODE: "1",
      NN_ENV_VALIDATION_MODE: process.env.NN_ENV_VALIDATION_MODE || "off",
      AI_ADMIN_GENERATION_ENABLED: process.env.AI_ADMIN_GENERATION_ENABLED || "false",
      NN_SKIP_DEV_AUTH_SECRET: "1",
      RUN_HEAVY_BUILD_TASKS: "false",
      NEXT_PUBLIC_QA_BYPASS_TURNSTILE: "1",
      QA_BYPASS_TURNSTILE: "1",
    },
  });
}

try {
  await mkdir(outputRoot, { recursive: true });
  for (const device of devices) {
    await mkdir(path.join(outputRoot, device.name), { recursive: true });
  }

  await waitForServer(`${baseUrl}/preview/homepage`);

  const browser = await chromium.launch();
  try {
    for (const device of devices) {
      const page = await browser.newPage({ viewport: { width: device.width, height: device.height } });
      for (const route of routes) {
        for (const theme of themes) {
          const qs = new URLSearchParams();
          qs.set("theme", theme);
          const url = `${baseUrl}/preview/${route}?${qs.toString()}`;
          await page.goto(url, { waitUntil: "networkidle", timeout: 90_000 });
          const suffix = multiTheme ? `-${theme}` : "";
          await page.screenshot({
            path: path.join(outputRoot, device.name, `${route}${suffix}.png`),
            fullPage: true,
          });
        }
      }
      await page.close();
    }
  } finally {
    await browser.close();
  }

  console.log(`[ui-preview] screenshots written to ${outputRoot}`);

  if (process.env.UI_PREVIEW_MIRROR_REPORTS === "1") {
    const reportDir = path.join(root, "..", "reports", "ui-redesign-preview");
    await mkdir(reportDir, { recursive: true });
    await cp(outputRoot, reportDir, { recursive: true });
    console.log(`[ui-preview] mirrored to ${reportDir}`);
  }
} finally {
  if (server) {
    server.kill("SIGTERM");
  }
}
