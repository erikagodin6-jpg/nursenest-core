#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { verifyOptionalContentDirectories } from "./verify-optional-content-directories.mjs";

const require = createRequire(import.meta.url);
const yaml = require("js-yaml");

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const appRoot = path.join(root, "nursenest-core");
const specPath = path.join(root, ".do", "app-nursenest-core-next.yaml");
const liveSpecPath = process.env.NN_DO_LIVE_SPEC_PATH?.trim() || "";
const dockerfilePath = path.join(root, "Dockerfile");
const packagePath = path.join(appRoot, "package.json");
const rootPackagePath = path.join(root, "package.json");
const standaloneStartPath = path.join(appRoot, "scripts", "start-standalone.mjs");
const expectedAppName = "nursenest-core-next";
const expectedServiceName = "web";
const expectedSourceDir = ".";
const expectedRunCommand = "node scripts/start-standalone.mjs";
const runtimeVisibleScopes = new Set(["RUN_TIME", "RUN_AND_BUILD_TIME"]);

const failures = [];
const warnings = [];

function rel(file) {
  return path.relative(root, file) || ".";
}

function fail(message) {
  failures.push(message);
}

function warn(message) {
  warnings.push(message);
}

/**
 * Bootstrap (`scripts/start-standalone.mjs`) calls `validateRuntimeEnvOrThrow` before binding PORT.
 * GENERAL vars declared in the DO spec without `value:` can be empty at runtime → process exits → no healthy upstream.
 */
function assertRunTimeGeneralKeyHasLiteralValue(specText, key) {
  const needle = `- key: ${key}`;
  const idx = specText.indexOf(needle);
  if (idx === -1) {
    fail(`app spec must declare "${needle}" (bootstrap runtime-env guard)`);
    return;
  }
  const tail = specText.slice(idx).split(/\r?\n/);
  let sawValue = false;
  for (let i = 1; i < tail.length; i += 1) {
    const line = tail[i];
    if (/^\s*-\s*key:/.test(line)) break;
    if (/^\s*value\s*:/.test(line)) {
      sawValue = true;
      break;
    }
  }
  if (!sawValue) {
    fail(
      `RUN_TIME env "${key}" must declare explicit value: in app spec — empty GENERAL vars crash bootstrap (DigitalOcean: no_healthy_upstream / 503).`,
    );
  }
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

function envBlock(specText, key) {
  const needle = `- key: ${key}`;
  const idx = specText.indexOf(needle);
  if (idx === -1) return null;
  const block = [];
  const tail = specText.slice(idx).split(/\r?\n/);
  for (let i = 0; i < tail.length; i += 1) {
    const line = tail[i];
    if (i > 0 && /^\s*-\s*key:/.test(line)) break;
    block.push(line);
  }
  return block.join("\n");
}

function envBlockScalar(specText, key, field) {
  const block = envBlock(specText, key);
  if (!block) return null;
  const pattern = new RegExp(`^\\s*${field}:\\s*(.+?)\\s*$`, "m");
  const match = block.match(pattern);
  return match ? match[1].trim().replace(/^["']|["']$/g, "") : null;
}

function parseSpecModel(specText, label) {
  try {
    return yaml.load(specText) ?? {};
  } catch (error) {
    fail(`${label} spec must be valid YAML: ${error instanceof Error ? error.message : String(error)}`);
    return {};
  }
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function findService(specModel, serviceName = expectedServiceName) {
  return asArray(specModel?.services).find((service) => service?.name === serviceName) ?? null;
}

function findIngressComponentNames(specModel) {
  const names = new Set();
  for (const rule of asArray(specModel?.ingress?.rules)) {
    const name = rule?.component?.name;
    if (typeof name === "string" && name.trim()) names.add(name.trim());
  }
  return names;
}

function findRouteServiceNames(specModel) {
  return new Set(asArray(specModel?.services).filter((service) => asArray(service?.routes).length > 0).map((service) => service.name));
}

function findEnvEntry(envs, key) {
  return asArray(envs).find((env) => env?.key === key) ?? null;
}

function findEffectiveEnvEntry(specModel, serviceName, key) {
  const service = findService(specModel, serviceName);
  const serviceEntry = findEnvEntry(service?.envs, key);
  if (serviceEntry) return { attachment: "service", serviceName, entry: serviceEntry };

  const appEntry = findEnvEntry(specModel?.envs, key);
  if (appEntry) return { attachment: "app", serviceName: null, entry: appEntry };

  return null;
}

function summarizeSpec(specModel, label) {
  const service = findService(specModel);
  const db = findEffectiveEnvEntry(specModel, expectedServiceName, "DATABASE_URL");
  return {
    label,
    appName: specModel?.name ?? null,
    serviceName: service?.name ?? null,
    sourceDir: service?.source_dir ?? null,
    runCommand: service?.run_command ?? null,
    databaseUrlKeyPresent: Boolean(db),
    databaseUrlScope: db?.entry?.scope ?? null,
    databaseUrlAttachment: db?.attachment ?? null,
    databaseUrlServiceName: db?.serviceName ?? null,
    ingressComponents: [...findIngressComponentNames(specModel)],
    routeServices: [...findRouteServiceNames(specModel)],
  };
}

function assertIncludes(haystack, needle, context) {
  if (!haystack.includes(needle)) fail(`${context} must include ${needle}`);
}

const spec = read(specPath);
const specModel = parseSpecModel(spec, "repo");
const dockerfile = read(dockerfilePath);
const pkg = read(packagePath);
const rootPkg = read(rootPackagePath);
const standaloneStart = read(standaloneStartPath);
const lines = activeLines(spec);
const keys = envKeys(lines);
const repoSummary = summarizeSpec(specModel, "repo");
let liveSummary = null;
if (liveSpecPath) {
  if (!existsSync(liveSpecPath)) {
    warn(`NN_DO_LIVE_SPEC_PATH was set but file does not exist: ${liveSpecPath}`);
  } else {
    const liveSpec = readFileSync(liveSpecPath, "utf8");
    liveSummary = summarizeSpec(parseSpecModel(liveSpec, "live"), "live");
  }
}
let appPackage = null;
try {
  appPackage = pkg ? JSON.parse(pkg) : null;
} catch {
  fail("nursenest-core/package.json must be valid JSON");
}
let rootPackage = null;
try {
  rootPackage = rootPkg ? JSON.parse(rootPkg) : null;
} catch {
  fail("package.json must be valid JSON");
}

function verifyStartScript({ label, command, baseDir, allowRootStandalone = false }) {
  if (typeof command !== "string" || !command.trim()) {
    fail(`${label} must expose a non-empty start command`);
    return;
  }
  if (command.includes("--import ./instrumentation.node.ts")) {
    fail(`${label} must not preload ./instrumentation.node.ts; it is optional and not copied into the Docker runtime image`);
  }
  if (command.includes("start-production.mjs")) {
    fail(`${label} must not use start-production.mjs in the standalone Docker runtime`);
  }
  if (!command.includes("scripts/start-standalone.mjs")) {
    fail(`${label} must use scripts/start-standalone.mjs for production startup`);
  }

  const relativeRefs = [
    ...command.matchAll(/(?:^|\s)(?:node|--import|\.)\s+(\.{1,2}\/\S+|scripts\/\S+|nursenest-core\/\S+)/g),
  ].map((m) => m[1].replace(/^["']|["']$/g, ""));

  for (const ref of relativeRefs) {
    if (ref === "./scripts/.node-memory-exports.sh" && command.includes("scripts/ensure-node-memory.mjs")) {
      continue;
    }
    const sourcePath = path.resolve(baseDir, ref);
    if (!existsSync(sourcePath)) {
      fail(`${label} references missing file ${ref}`);
    }
    if (ref.includes("instrumentation.node.ts")) {
      fail(`${label} references optional instrumentation preload ${ref}`);
    }
    if (ref === "nursenest-core/scripts/start-standalone.mjs" && allowRootStandalone) {
      continue;
    }
    if (ref.startsWith("scripts/")) {
      continue;
    }
    if (ref.startsWith("./") && !ref.startsWith("./scripts/")) {
      fail(`${label} references ${ref}, which is not under a Docker-copied app runtime directory`);
    }
    if (ref.startsWith("../scripts/")) {
      assertIncludes(
        dockerfile,
        "COPY --from=builder /app/scripts ../scripts",
        `Dockerfile runner stage for ${label} reference ${ref}`,
      );
    }
  }
}

console.log("[verify:do-runtime] checking DigitalOcean Dockerfile runtime contract");
console.log(`[verify:do-runtime] repo spec summary ${JSON.stringify(repoSummary)}`);
if (liveSummary) console.log(`[verify:do-runtime] live spec summary ${JSON.stringify(liveSummary)}`);

assertRunTimeGeneralKeyHasLiteralValue(spec, "AI_ADMIN_GENERATION_ENABLED");

if (repoSummary.appName !== expectedAppName) {
  fail(`expected app name ${expectedAppName}, found ${repoSummary.appName ?? "missing"}`);
}

if (repoSummary.serviceName !== expectedServiceName) {
  fail(`expected running service name ${expectedServiceName}, found ${repoSummary.serviceName ?? "missing"}`);
}

if (
  repoSummary.ingressComponents.length > 0 &&
  !repoSummary.ingressComponents.includes(expectedServiceName)
) {
  fail(`ingress does not route to expected service ${expectedServiceName}; found ${repoSummary.ingressComponents.join(", ")}`);
}

if (scalar(lines, "dockerfile_path") !== "Dockerfile") {
  fail(`expected dockerfile_path: Dockerfile, found ${scalar(lines, "dockerfile_path") ?? "missing"}`);
}

if (repoSummary.sourceDir !== expectedSourceDir) {
  fail(`expected source_dir: ${expectedSourceDir}, found ${repoSummary.sourceDir ?? "missing"}`);
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

if (repoSummary.runCommand !== expectedRunCommand) {
  fail(`expected run_command: ${expectedRunCommand}, found ${repoSummary.runCommand ?? "missing"}`);
}

if (!keys.has("AUTH_SECRET") && !keys.has("NEXTAUTH_SECRET")) {
  fail("app spec must document AUTH_SECRET and/or NEXTAUTH_SECRET as a runtime secret");
}

const repoDatabaseUrl = findEffectiveEnvEntry(specModel, expectedServiceName, "DATABASE_URL");
if (!repoDatabaseUrl) {
  fail(`DATABASE_URL absent from effective runtime env for running service ${expectedServiceName}`);
} else {
  const databaseUrlScope = repoDatabaseUrl.entry?.scope;
  const databaseUrlType = repoDatabaseUrl.entry?.type;
  if (!runtimeVisibleScopes.has(databaseUrlScope)) {
    fail(
      `DATABASE_URL must be runtime-visible for service ${expectedServiceName}; accepted scopes: ${[...runtimeVisibleScopes].join(", ")}; found ${databaseUrlScope ?? "missing"}`,
    );
  }
  if (databaseUrlScope === "RUN_AND_BUILD_TIME") {
    warn("DATABASE_URL scope RUN_AND_BUILD_TIME is runtime-visible on DigitalOcean, but RUN_TIME is preferred to avoid build-time DB exposure.");
  }
  if (databaseUrlType !== "SECRET") {
    fail(`DATABASE_URL must be declared as type SECRET, found ${databaseUrlType ?? "missing"}`);
  }
  if (repoDatabaseUrl.attachment !== "service") {
    warn(`DATABASE_URL is ${repoDatabaseUrl.attachment}-level, not service-level; verify DigitalOcean applies it to service ${expectedServiceName}.`);
  }
}

if (liveSummary) {
  for (const field of ["appName", "serviceName", "sourceDir", "runCommand", "databaseUrlAttachment"]) {
    if (repoSummary[field] !== liveSummary[field]) {
      warn(`live spec drift: ${field} repo=${repoSummary[field] ?? "missing"} live=${liveSummary[field] ?? "missing"}`);
    }
  }
  if (!liveSummary.databaseUrlKeyPresent) {
    fail(`live spec: DATABASE_URL absent from effective runtime env for running service ${expectedServiceName}`);
  } else if (!runtimeVisibleScopes.has(liveSummary.databaseUrlScope)) {
    fail(
      `live spec: DATABASE_URL scope is not runtime-visible for service ${expectedServiceName}; accepted scopes: ${[...runtimeVisibleScopes].join(", ")}; found ${liveSummary.databaseUrlScope ?? "missing"}`,
    );
  } else if (repoSummary.databaseUrlScope === "RUN_TIME" && liveSummary.databaseUrlScope === "RUN_AND_BUILD_TIME") {
    warn("live spec drift: repo expects DATABASE_URL scope RUN_TIME, live has RUN_AND_BUILD_TIME; this is runtime-visible but broader than preferred.");
  }
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

const packageStartScript = appPackage?.scripts?.start;
verifyStartScript({ label: "nursenest-core/package.json start", command: packageStartScript, baseDir: appRoot });

const rootPackageStartScript = rootPackage?.scripts?.start;
verifyStartScript({
  label: "package.json start",
  command: rootPackageStartScript,
  baseDir: root,
  allowRootStandalone: true,
});

for (const specFile of [".do/app-nursenest-core-next.yaml", ".do/app.yaml"]) {
  const specText = read(path.join(root, specFile));
  const specRunCommand = scalar(activeLines(specText), "run_command");
  if (specRunCommand) {
    verifyStartScript({ label: `${specFile} run_command`, command: specRunCommand, baseDir: appRoot });
  }
}

const contentDirectoryResult = verifyOptionalContentDirectories({ root });
for (const message of contentDirectoryResult.failures) {
  fail(message);
}

if (failures.length > 0) {
  for (const message of warnings) {
    console.warn(`[verify:do-runtime] WARN: ${message}`);
  }
  for (const message of failures) {
    console.error(`[verify:do-runtime] FAIL: ${message}`);
  }
  process.exit(1);
}

for (const message of warnings) {
  console.warn(`[verify:do-runtime] WARN: ${message}`);
}

console.log("[verify:do-runtime] DEPLOY MODE: DOCKERFILE BUILD");
console.log("[verify:do-runtime] startup command: node scripts/start-standalone.mjs");
console.log("[verify:do-runtime] public health: /healthz immediate, /readyz gated by child readiness");
console.log("[verify:do-runtime] auth secret env documented: AUTH_SECRET or NEXTAUTH_SECRET");
