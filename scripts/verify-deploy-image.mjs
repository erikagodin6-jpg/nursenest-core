#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const specPath = path.join(root, ".do", "app-nursenest-core-next.yaml");
const dockerfilePath = path.join(root, "Dockerfile");

function fail(message) {
  console.error(`[verify-deploy-image] FATAL: ${message}`);
  process.exit(1);
}

function readSpec() {
  if (!existsSync(specPath)) {
    fail(`missing production spec: ${path.relative(root, specPath)}`);
  }
  return readFileSync(specPath, "utf8");
}

function activeLines(text) {
  return text
    .split(/\r?\n/)
    .map((line) => line.replace(/\s+#.*$/, ""))
    .filter((line) => line.trim() && !line.trimStart().startsWith("#"));
}

function extractScalar(lines, key) {
  const pattern = new RegExp(`^\\s*${key}:\\s*(.+?)\\s*$`);
  for (const line of lines) {
    const match = line.match(pattern);
    if (match) return match[1].replace(/^["']|["']$/g, "");
  }
  return null;
}

function extractImageReference(lines) {
  const imageKeys = ["image", "image_name", "docker_image", "registry_image"];
  for (const key of imageKeys) {
    const value = extractScalar(lines, key);
    if (value) return value;
  }

  const ghcrLine = lines.find((line) => /\bghcr\.io\//.test(line));
  if (ghcrLine) {
    const match = ghcrLine.match(/(ghcr\.io\/[^\s"']+)/);
    if (match) return match[1];
  }

  return null;
}

const spec = readSpec();
const lines = activeLines(spec);
const imageRef = extractImageReference(lines);
const dockerfilePathValue = extractScalar(lines, "dockerfile_path");
const sourceDirValue = extractScalar(lines, "source_dir");

if (imageRef) {
  console.log("DEPLOY MODE: GHCR IMAGE");
  console.log(`[verify-deploy-image] expected image: ${imageRef}`);
  if (!/:[^/:]+$/.test(imageRef)) {
    fail(`image reference is missing an explicit tag: ${imageRef}`);
  }
  const pull = spawnSync("docker", ["pull", imageRef], {
    cwd: root,
    stdio: "inherit",
  });
  if (pull.error) {
    fail(`docker pull could not start: ${pull.error.message}`);
  }
  if (pull.status !== 0) {
    fail(`docker pull failed for ${imageRef}`);
  }
  console.log(`[verify-deploy-image] docker pull succeeded: ${imageRef}`);
  process.exit(0);
}

console.log("DEPLOY MODE: DOCKERFILE BUILD");
console.log("[verify-deploy-image] expected build source: .");
console.log("[verify-deploy-image] expected Dockerfile: Dockerfile");

if (sourceDirValue !== ".") {
  fail(`production spec must set source_dir: . (found ${sourceDirValue ?? "missing"})`);
}

if (dockerfilePathValue !== "Dockerfile") {
  fail(`production spec must set dockerfile_path: Dockerfile (found ${dockerfilePathValue ?? "missing"})`);
}

if (!existsSync(dockerfilePath)) {
  fail("Dockerfile is missing at repo root");
}

console.log("[verify-deploy-image] Dockerfile build spec is deterministic");
