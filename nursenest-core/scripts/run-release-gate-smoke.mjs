#!/usr/bin/env node
/**
 * Memory-conscious release-gate wrapper.
 *
 * Always validates env and lists exactly which browser projects will run. Guest
 * projects run whenever BASE_URL is valid; credentialed projects are included
 * only when their matching env group is complete.
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  getReleaseGateEnvStatus,
  printReleaseGateEnvReport,
  resolveReleaseGateBaseUrl,
} from "./validate-release-gate-env.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = new Set(process.argv.slice(2));
const listOnly = args.has("--list") || args.has("--dry-run");

const preflight = printReleaseGateEnvReport();
if (!preflight.ok) {
  process.exit(1);
}

const status = getReleaseGateEnvStatus();
const paidReady = status.optional.find((g) => g.label === "paid learner")?.resolution.ok === true;
const freeReady = status.optional.find((g) => g.label === "free learner")?.resolution.ok === true;
const adminReady = status.optional.find((g) => g.label === "admin staff")?.resolution.ok === true;
const base = resolveReleaseGateBaseUrl();

const projects = ["release-health", "release-phase-1-guest", "release-mobile"];

if (freeReady) projects.push("release-free-user");
if (adminReady) projects.push("release-admin-user");
if (paidReady) {
  projects.push("setup-paid-auth", "release-blocking-paid", "release-synthetic-paid-smoke");
}

const env = { ...process.env, BASE_URL: base.raw };
const host = new URL(base.raw).hostname;
if (host !== "127.0.0.1" && host !== "localhost") {
  env.PLAYWRIGHT_SKIP_WEB_SERVER = "1";
}

console.log("");
console.log("[release-gate-smoke] selected projects:");
for (const project of projects) {
  console.log(`[release-gate-smoke] - ${project}`);
}
if (!freeReady) console.log("[release-gate-smoke] - release-free-user: skipped before run (missing free learner env group)");
if (!adminReady) console.log("[release-gate-smoke] - release-admin-user: skipped before run (missing admin staff env group)");
if (!paidReady) {
  console.log("[release-gate-smoke] - paid projects: skipped before run (missing paid learner env group)");
}
console.log(`[release-gate-smoke] artifacts: ${path.join(root, "test-results", "release-gate")}`);
console.log("");

const pwArgs = [
  "playwright",
  "test",
  "-c",
  "playwright.release-gate.config.ts",
  ...projects.flatMap((project) => ["--project", project]),
  ...(listOnly ? ["--list"] : []),
];

const result = spawnSync("npx", pwArgs, {
  cwd: root,
  env,
  stdio: "inherit",
  shell: process.platform === "win32",
});

const code = result.status === 0 ? 0 : (result.status ?? 1);
if (!listOnly) {
  console.log("");
  console.log(`[release-gate-smoke] ${code === 0 ? "PASS" : "FAIL"} (exit ${code})`);
}
process.exit(code);

