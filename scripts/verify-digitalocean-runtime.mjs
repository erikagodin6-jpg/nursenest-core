#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const appRoot = path.join(root, "nursenest-core");
const specPath = path.join(root, ".do", "app-nursenest-core-next.yaml");
const dockerfilePath = path.join(root, "Dockerfile");
const packagePath = path.join(appRoot, "package.json");
const standaloneStartPath = path.join(appRoot, "scripts", "start-standalone.mjs");

const failures = [];

function rel(file) {
  return path.relative(root, file) || ".";
}

function fail(message) {
  failures.push(message);
}

function read(file) {
  if (!existsSync(file)) {
    fail(`missing ${rel(file)}`);
    return "";
  }
  return readFileSync(file, "utf8");
}

function activeLines(text) {
  return text
    .split(/\r?\n/)
    .map((line) => line.replace(/\s+#.*$/, ""))
    .filter((line) => line.trim() && !line.trimStart().startsWith("#"));
}

function scalar(lines, key) {
  const pattern = new RegExp(`^\\s*${key}:\\s*(.+?)\\s*$`);
  for (const line of lines) {
    const match = line.match(pattern);
    if (match) return match[1].trim().replace(/^["']|["']$/g, "");
  }
  return null;
}

function envKeys(lines) {
  const keys = new Set();
  for (const line of lines) {
    const match = line.match(/^\s*-\s*key:\s*(.+?)\s*$/);
    if (match) keys.add(match[1].replace(/^["']|["']$/g, ""));
  }
  return keys;
}

function assertIncludes(haystack, needle, context) {
  if (!haystack.includes(needle)) fail(`${context} must include ${needle}`);
}

const spec = read(specPath);
const dockerfile = read(dockerfilePath);
const pkg = read(packagePath);
const standaloneStart = read(standaloneStartPath);
const lines = activeLines(spec);
const keys = envKeys(lines);

console.log("[verify:do-runtime] checking DigitalOcean Dockerfile runtime contract");

if (scalar(lines, "dockerfile_path") !== "Dockerfile") {
  fail(`expected dockerfile_path: Dockerfile, found ${scalar(lines, "dockerfile_path") ?? "missing"}`);
}

if (scalar(lines, "source_dir") !== ".") {
  fail(`expected source_dir: ., found ${scalar(lines, "source_dir") ?? "missing"}`);
}

if (scalar(lines, "branch") !== "main") {
  fail(`expected production branch main, found ${scalar(lines, "branch") ?? "missing"}`);
}

for (const forbidden of ["ghcr.io", "image:", "image_name:", "docker_image:", "registry_image:"]) {
  if (lines.some((line) => line.includes(forbidden))) {
    fail(`app spec contains stale image/registry reference: ${forbidden}`);
  }
}

if (!/liveness_health_check:[\s\S]*http_path:\s*\/healthz/.test(spec)) {
  fail("liveness_health_check must point to /healthz");
}

if (!/health_check:[\s\S]*http_path:\s*\/readyz/.test(spec)) {
  fail("health_check readiness must point to /readyz");
}

if (scalar(lines, "http_port") !== "8080") {
  fail(`expected http_port: 8080, found ${scalar(lines, "http_port") ?? "missing"}`);
}

if (scalar(lines, "run_command") !== "node scripts/start-standalone.mjs") {
  fail(
    `expected run_command: node scripts/start-standalone.mjs, found ${scalar(lines, "run_command") ?? "missing"}`,
  );
}

if (!keys.has("AUTH_SECRET") && !keys.has("NEXTAUTH_SECRET")) {
  fail("app spec must document AUTH_SECRET and/or NEXTAUTH_SECRET as a runtime secret");
}

if (!keys.has("NODE_MAX_OLD_SPACE_SIZE_MB")) {
  fail("app spec must set NODE_MAX_OLD_SPACE_SIZE_MB for standalone child runtime heap");
}

if (!keys.has("AUTH_SECRET")) {
  console.warn("[verify:do-runtime] warning: AUTH_SECRET is preferred over legacy NEXTAUTH_SECRET");
}

if (!/FROM\s+node:20-alpine\s+AS\s+runner/.test(dockerfile)) {
  fail("Dockerfile must have a node:20-alpine runner stage");
}

for (const requiredCopy of [
  "COPY --from=builder /app/nursenest-core/.next ./.next",
  "COPY --from=builder /app/nursenest-core/public ./public",
  "COPY --from=builder /app/nursenest-core/scripts ./scripts",
  "COPY --from=builder /app/nursenest-core/package.json ./package.json",
]) {
  assertIncludes(dockerfile, requiredCopy, "Dockerfile runner stage");
}

assertIncludes(dockerfile, "EXPOSE 8080", "Dockerfile");
assertIncludes(dockerfile, "NODE_MAX_OLD_SPACE_SIZE_MB=768", "Dockerfile runner ENV");

if (!/(CMD|ENTRYPOINT)\s+\[/.test(dockerfile)) {
  fail("Dockerfile runner stage must define CMD or ENTRYPOINT");
}

if (!dockerfile.includes('CMD ["node", "scripts/start-standalone.mjs"]')) {
  fail("Dockerfile runner CMD must start scripts/start-standalone.mjs directly");
}

if (!existsSync(standaloneStartPath)) {
  fail("startup path nursenest-core/scripts/start-standalone.mjs does not exist");
}

for (const requiredSnippet of [
  "process.env.PORT",
  "process.env.HOSTNAME || \"0.0.0.0\"",
  "const internalHost = \"127.0.0.1\"",
  "livenessProbePath = \"/healthz\"",
  "readinessProbePath = \"/readyz\"",
  "server.listen(publicPort, publicHost",
  "PORT: String(internalPort)",
  "HOSTNAME: internalHost",
]) {
  assertIncludes(standaloneStart, requiredSnippet, "start-standalone.mjs");
}

if (!pkg.includes("\"verify:standalone-artifact\"")) {
  fail("nursenest-core/package.json must expose verify:standalone-artifact");
}

if (failures.length > 0) {
  for (const message of failures) {
    console.error(`[verify:do-runtime] FAIL: ${message}`);
  }
  process.exit(1);
}

console.log("[verify:do-runtime] DEPLOY MODE: DOCKERFILE BUILD");
console.log("[verify:do-runtime] startup command: node scripts/start-standalone.mjs");
console.log("[verify:do-runtime] public health: /healthz immediate, /readyz gated by child readiness");
console.log("[verify:do-runtime] auth secret env documented: AUTH_SECRET or NEXTAUTH_SECRET");
