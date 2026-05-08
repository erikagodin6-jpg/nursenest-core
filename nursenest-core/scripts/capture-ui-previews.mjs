#!/usr/bin/env node
import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputRoot = path.join(root, "preview-screenshots");
const port = process.env.UI_PREVIEW_PORT || "3100";
const baseUrl = process.env.UI_PREVIEW_BASE_URL || `http://127.0.0.1:${port}`;
const shouldStartServer = !process.env.UI_PREVIEW_BASE_URL;

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
        const url = `${baseUrl}/preview/${route}`;
        await page.goto(url, { waitUntil: "networkidle", timeout: 90_000 });
        await page.screenshot({
          path: path.join(outputRoot, device.name, `${route}.png`),
          fullPage: true,
        });
      }
      await page.close();
    }
  } finally {
    await browser.close();
  }

  console.log(`[ui-preview] screenshots written to ${outputRoot}`);
} finally {
  if (server) {
    server.kill("SIGTERM");
  }
}
