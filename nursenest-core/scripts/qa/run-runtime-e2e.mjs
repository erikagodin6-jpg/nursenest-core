#!/usr/bin/env node
import { spawnSync } from "node:child_process";

const args = new Set(process.argv.slice(2));
const projectArgs = [];

if (args.has("--chromium")) projectArgs.push("--project=runtime-chromium");
if (args.has("--firefox")) projectArgs.push("--project=runtime-firefox");
if (args.has("--webkit")) projectArgs.push("--project=runtime-webkit");

const command = [
  "playwright",
  "test",
  "-c",
  "playwright.runtime-critical.config.ts",
  ...projectArgs,
];

console.log(`[runtime-e2e] ${["npx", ...command].join(" ")}`);

const result = spawnSync("npx", command, {
  stdio: "inherit",
  env: {
    ...process.env,
    CI: process.env.CI ?? "1",
  },
});

if (result.error) {
  console.error("[runtime-e2e] failed to launch Playwright:", result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);
