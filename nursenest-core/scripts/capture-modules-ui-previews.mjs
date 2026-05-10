#!/usr/bin/env node
/**
 * Playwright capture for `/preview/modules-*` redesign matrix.
 * Output: nursenest-core/preview-screenshots/modules/{theme}/{device}/{slug}.png
 * Manifest: ../reports/ui-redesign-preview/modules/manifest.json (repo root)
 *
 * From nursenest-core/: `npm run ui-preview:capture:modules`
 * Optional: UI_PREVIEW_BASE_URL=http://127.0.0.1:3000
 */
import { mkdir, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputRoot = path.join(root, "preview-screenshots", "modules");
const reportDir = path.join(root, "..", "reports", "ui-redesign-preview", "modules");
const port = process.env.UI_PREVIEW_PORT || "3100";
const baseUrl = process.env.UI_PREVIEW_BASE_URL || `http://127.0.0.1:${port}`;
const shouldStartServer = !process.env.UI_PREVIEW_BASE_URL;

const moduleSurfaces = [
  "modules-shell-current",
  "modules-shell-proposed",
  "modules-hub-current",
  "modules-hub-proposed",
  "modules-lesson-current",
  "modules-lesson-proposed",
  "modules-quiz-current",
  "modules-quiz-proposed",
  "modules-nav-current",
  "modules-nav-proposed",
  "modules-mobile-current",
  "modules-mobile-proposed",
];

const themes = ["aurora", "ocean", "garden", "midnight", "apex"];

const devices = [
  { name: "desktop", width: 1440, height: 1200 },
  { name: "mobile", width: 390, height: 900 },
];

async function waitForServer(url, timeoutMs = 420_000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(4_000) });
      if (res.status < 500) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 1_500));
  }
  throw new Error(`[modules-ui-preview] Timed out waiting for ${url}`);
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

const manifest = { generatedAt: new Date().toISOString(), baseUrl, captures: [] };

try {
  await mkdir(outputRoot, { recursive: true });
  await mkdir(reportDir, { recursive: true });

  await waitForServer(`${baseUrl}/preview/modules-hub-current`);

  const browser = await chromium.launch();
  try {
    for (const theme of themes) {
      for (const device of devices) {
        await mkdir(path.join(outputRoot, theme, device.name), { recursive: true });
        const page = await browser.newPage({ viewport: { width: device.width, height: device.height } });
        for (const slug of moduleSurfaces) {
          const url = `${baseUrl}/preview/${slug}?theme=${theme}`;
          await page.goto(url, { waitUntil: "networkidle", timeout: 120_000 });
          const rel = path.join(theme, device.name, `${slug}.png`);
          const abs = path.join(outputRoot, rel);
          await page.screenshot({ path: abs, fullPage: true });
          manifest.captures.push({
            theme,
            device: device.name,
            slug,
            path: `nursenest-core/preview-screenshots/modules/${rel}`,
          });
        }
        await page.close();
      }
    }
  } finally {
    await browser.close();
  }

  await writeFile(path.join(reportDir, "manifest.json"), JSON.stringify(manifest, null, 2), "utf8");
  console.log(`[modules-ui-preview] wrote ${manifest.captures.length} screenshots under ${outputRoot}`);
  console.log(`[modules-ui-preview] manifest: ${path.join(reportDir, "manifest.json")}`);
} finally {
  if (server) server.kill("SIGTERM");
}
