#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { verifyOptionalContentDirectories } from "./verify-optional-content-directories.mjs";
import { writeDoRuntimeVerificationCache } from "../nursenest-core/scripts/lib/runtime-env-contract.mjs";

const require = createRequire(import.meta.url);
const yaml = require("js-yaml");

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const appRoot = path.join(root, "nursenest-core");
const specPath = path.join(root, ".do", "app-nursenest-core-next.yaml");
const dockerfilePath = path.join(root, "Dockerfile");
const packagePath = path.join(appRoot, "package.json");
const rootPackagePath = path.join(root, "package.json");
const productionStartPath = path.join(root, "scripts", "start-production.mjs");

const expectedAppName = "nursenest-core-next";
const expectedServiceName = "web";
const expectedRunCommand = "node scripts/start-production.mjs";
const expectedImageRegistryType = "GHCR";
const expectedImageRepository = "erikagodin6-jpg/nursenest";
const expectedAccountEmail = process.env.NN_DO_EXPECTED_ACCOUNT_EMAIL?.trim() || "erikagodin6@gmail.com";
const expectedTeamName = process.env.NN_DO_EXPECTED_TEAM?.trim() || "My Team";
const runtimeVisibleScopes = new Set(["RUN_TIME", "RUN_AND_BUILD_TIME"]);

const failures = [];
const warnings = [];

function fail(message) {
  failures.push(message);
}

function warn(message) {
  warnings.push(message);
}

function read(file) {
  if (!existsSync(file)) {
    fail(`missing ${path.relative(root, file) || "."}`);
    return "";
  }

  return readFileSync(file, "utf8");
}

function parseJsonText(text, label) {
  try {
    return JSON.parse(text);
  } catch (error) {
    fail(`${label} returned invalid JSON: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
}

function runCommand(command, args, { cwd = root, allowFailure = false } = {}) {
  const result = spawnSync(command, args, {
    cwd,
    env: process.env,
    encoding: "utf8",
    maxBuffer: 20 * 1024 * 1024,
  });

  if (!allowFailure && result.status !== 0) {
    const stderr = result.stderr?.trim();
    const stdout = result.stdout?.trim();
    fail(
      `${command} ${args.join(" ")} failed with exit ${result.status ?? 1}: ${stderr || stdout || "(no output)"}`,
    );
  }

  return result;
}

function runDoctlJson(args, label) {
  const result = runCommand("doctl", args, { allowFailure: true });
  if (result.status !== 0) {
    const detail = result.stderr?.trim() || result.stdout?.trim() || "(no output)";
    fail(`${label} failed: ${detail}`);
    return null;
  }

  const parsed = parseJsonText(result.stdout, label);
  if (parsed == null) return null;
  return Array.isArray(parsed) ? parsed : [parsed];
}

function runDoctlText(args, label) {
  const result = runCommand("doctl", args, { allowFailure: true });
  if (result.status !== 0) {
    const detail = result.stderr?.trim() || result.stdout?.trim() || "(no output)";
    fail(`${label} failed: ${detail}`);
    return null;
  }

  return result.stdout;
}

function unwrapSingle(items) {
  if (!Array.isArray(items) || items.length === 0) return null;
  return items[0] ?? null;
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
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

function parseSpecModel(specText, label) {
  try {
    return yaml.load(specText) ?? {};
  } catch (error) {
    fail(`${label} spec must be valid YAML: ${error instanceof Error ? error.message : String(error)}`);
    return {};
  }
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
  return [...names];
}

function findRouteServiceNames(specModel) {
  return asArray(specModel?.services)
    .filter((service) => asArray(service?.routes).length > 0)
    .map((service) => service.name);
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

function sanitizeEnvAttachment(specModel, key) {
  const effective = findEffectiveEnvEntry(specModel, expectedServiceName, key);
  if (!effective) {
    return {
      key,
      present: false,
      attachment: null,
      scope: null,
      type: null,
    };
  }

  return {
    key,
    present: true,
    attachment: effective.attachment,
    scope: effective.entry?.scope ?? null,
    type: effective.entry?.type ?? null,
  };
}

function summarizeSpec(specModel, label) {
  const service = findService(specModel);
  const sourceType = service?.image
    ? "image"
    : service?.github
      ? "github"
      : service?.gitlab
        ? "gitlab"
        : service?.git
          ? "git"
          : service?.source_dir
            ? "source_dir"
            : "unknown";
  return {
    label,
    appName: specModel?.name ?? null,
    serviceName: service?.name ?? null,
    sourceDir: service?.source_dir ?? null,
    sourceType,
    runCommand: service?.run_command ?? null,
    imageRegistryType: service?.image?.registry_type ?? null,
    imageRepository: service?.image?.repository ?? null,
    imageTag: service?.image?.tag ?? null,
    imageDigest: service?.image?.digest ?? null,
    ingressComponents: findIngressComponentNames(specModel),
    routeServices: findRouteServiceNames(specModel),
    databaseUrl: sanitizeEnvAttachment(specModel, "DATABASE_URL"),
    directUrl: sanitizeEnvAttachment(specModel, "DIRECT_URL"),
    authSecret: sanitizeEnvAttachment(specModel, "AUTH_SECRET"),
    nextauthSecret: sanitizeEnvAttachment(specModel, "NEXTAUTH_SECRET"),
  };
}

function assertIncludes(haystack, needle, context) {
  if (!haystack.includes(needle)) {
    fail(`${context} must include ${needle}`);
  }
}

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

function verifyStartScript({ label, command, baseDir, dockerfile, allowStandalone = false }) {
  if (typeof command !== "string" || !command.trim()) {
    fail(`${label} must expose a non-empty start command`);
    return;
  }
  if (command.includes("--import ./instrumentation.node.ts")) {
    fail(`${label} must not preload ./instrumentation.node.ts; it is optional and not copied into the Docker runtime image`);
  }

  if (!allowStandalone) {
    if (command.includes("scripts/start-standalone.mjs")) {
      fail(`${label} must not rely on scripts/start-standalone.mjs for production startup`);
    }
    if (!command.includes("scripts/start-production.mjs")) {
      fail(`${label} must use scripts/start-production.mjs for production startup`);
    }
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
    if (ref.startsWith("scripts/")) {
      continue;
    }
    if (ref.startsWith("./") && !ref.startsWith("./scripts/")) {
      fail(`${label} references ${ref}, which is not under a Docker-copied app runtime directory`);
    }
  }
}


function readPackageJson(file, label) {
  try {
    return JSON.parse(read(file));
  } catch {
    fail(`${label} must be valid JSON`);
    return null;
  }
}

function pickExpectedApp(apps) {
  const envAppId = process.env.NN_DO_APP_ID?.trim();
  if (envAppId) {
    return apps.find((app) => app?.id === envAppId) ?? null;
  }
  return (
    apps.find((app) => app?.spec_name === expectedAppName) ??
    apps.find((app) => app?.spec?.name === expectedAppName) ??
    null
  );
}

function parseDeploymentRows(text) {
  if (!text) return [];
  return text
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter(Boolean)
    .map((line) => {
      const match = line.match(/^(\S+)\s{2,}(.+?)\s{2,}(\S+)\s{2,}(.+)$/);
      if (!match) {
        return null;
      }
      return {
        id: match[1],
        cause: match[2],
        phase: match[3],
        created: match[4],
      };
    })
    .filter(Boolean);
}

function extractCommitShaFromCause(cause) {
  const match = String(cause ?? "").match(/\bcommit\s+([0-9a-f]{7,40})\b/i);
  return match?.[1] ?? null;
}

function summarizeDeployment(deployment) {
  if (!deployment) return null;
  const sourceCommit =
    asArray(deployment?.services).find((service) => service?.name === expectedServiceName)?.source_commit_hash ??
    extractCommitShaFromCause(deployment?.cause) ??
    null;
  return {
    id: deployment.id ?? null,
    phase: deployment.phase ?? null,
    cause: deployment.cause ?? null,
    sourceCommitHash: sourceCommit,
    previousDeploymentId: deployment.previous_deployment_id ?? null,
    clonedFrom: deployment.cloned_from ?? null,
  };
}

function isRollbackLikeDeployment(deployment) {
  const cause = String(deployment?.cause ?? "").toLowerCase();
  return cause.includes("rollback") || Boolean(deployment?.cloned_from);
}

function listStripeEnvKeysJson() {
  const result = runCommand(
    process.execPath,
    ["--import", "tsx", "scripts/list-stripe-runtime-env-keys.mts", "--json"],
    { cwd: appRoot, allowFailure: true },
  );
  if (result.status !== 0) {
    warn(
      `Could not resolve Stripe runtime env keys via list-stripe-runtime-env-keys: ${
        result.stderr?.trim() || result.stdout?.trim() || "(no output)"
      }`,
    );
    return [];
  }

  const parsed = parseJsonText(result.stdout, "list-stripe-runtime-env-keys --json");
  return Array.isArray(parsed) ? parsed.filter((key) => typeof key === "string") : [];
}

function sanitizeAccount(account) {
  return {
    email: account?.email ?? null,
    team: account?.team?.name ?? account?.team ?? null,
    status: account?.status ?? null,
  };
}

function gitSha(args) {
  const result = runCommand("git", args, { cwd: root, allowFailure: true });
  if (result.status !== 0) return null;
  return result.stdout.trim() || null;
}

function verifyLiveSpec(summary, label) {
  if (!summary) return;

  if (summary.appName !== expectedAppName) {
    fail(`${label}: expected app name ${expectedAppName}, found ${summary.appName ?? "missing"}`);
  }
  if (summary.serviceName !== expectedServiceName) {
    fail(`${label}: expected service ${expectedServiceName}, found ${summary.serviceName ?? "missing"}`);
  }
  if (summary.runCommand !== expectedRunCommand) {
    fail(`${label}: expected run_command ${expectedRunCommand}, found ${summary.runCommand ?? "missing"}`);
  }
  if (summary.sourceType !== "image") {
    fail(
      `${label}: expected service ${expectedServiceName} to deploy from a pre-built image source, found ${summary.sourceType ?? "missing"}`,
    );
  }
  if (summary.imageRegistryType !== expectedImageRegistryType) {
    fail(
      `${label}: expected image registry_type ${expectedImageRegistryType}, found ${summary.imageRegistryType ?? "missing"}`,
    );
  }
  if (summary.imageRepository !== expectedImageRepository) {
    fail(
      `${label}: expected image repository ${expectedImageRepository}, found ${summary.imageRepository ?? "missing"}`,
    );
  }
  if (!summary.imageTag && !summary.imageDigest) {
    fail(`${label}: image tag or digest must be set for service ${expectedServiceName}`);
  }
  if (summary.ingressComponents.length > 0 && !summary.ingressComponents.includes(expectedServiceName)) {
    fail(`${label}: ingress does not route to ${expectedServiceName}; found ${summary.ingressComponents.join(", ")}`);
  }
}

const specText = read(specPath);
const specModel = parseSpecModel(specText, "repo");
const dockerfile = read(dockerfilePath);
const packageJson = readPackageJson(packagePath, "nursenest-core/package.json");
const rootPackageJson = readPackageJson(rootPackagePath, "package.json");
const productionStart = read(productionStartPath);
const lines = activeLines(specText);
const keys = envKeys(lines);
const repoSummary = summarizeSpec(specModel, "repo");

console.log("[verify:do-runtime] checking DigitalOcean runtime contract");
console.log(`[verify:do-runtime] repo spec summary ${JSON.stringify(repoSummary)}`);

assertRunTimeGeneralKeyHasLiteralValue(specText, "AI_ADMIN_GENERATION_ENABLED");
verifyLiveSpec(repoSummary, "repo spec");

if (scalar(lines, "http_port") !== "8080") {
  fail(`expected http_port: 8080, found ${scalar(lines, "http_port") ?? "missing"}`);
}
if (!/liveness_health_check:[\s\S]*http_path:\s*\/healthz/.test(specText)) {
  fail("liveness_health_check must point to /healthz");
}
if (!/health_check:[\s\S]*http_path:\s*\/readyz/.test(specText)) {
  fail("health_check must point to /readyz");
}
if (!keys.has("AUTH_SECRET") && !keys.has("NEXTAUTH_SECRET")) {
  fail("app spec must declare AUTH_SECRET and/or NEXTAUTH_SECRET as a runtime secret");
}
if (!keys.has("DIRECT_URL")) {
  fail("app spec must declare DIRECT_URL as a runtime secret for Prisma migrations");
}
if (!keys.has("NEXTAUTH_SECRET")) {
  fail("app spec must declare NEXTAUTH_SECRET as a runtime secret");
}
if (repoSummary.authSecret.present && repoSummary.authSecret.type !== "SECRET") {
  fail(`repo spec: AUTH_SECRET must be declared as type SECRET, found ${repoSummary.authSecret.type ?? "missing"}`);
}
if (!repoSummary.databaseUrl.present) {
  fail(`repo spec: DATABASE_URL absent from effective runtime env for running service ${expectedServiceName}`);
} else {
  if (repoSummary.databaseUrl.attachment !== "service") {
    fail(`repo spec: DATABASE_URL must be attached under services.${expectedServiceName}.envs, found ${repoSummary.databaseUrl.attachment ?? "missing"}`);
  }
  if (!runtimeVisibleScopes.has(repoSummary.databaseUrl.scope)) {
    fail(
      `repo spec: DATABASE_URL must be runtime-visible for service ${expectedServiceName}; found ${repoSummary.databaseUrl.scope ?? "missing"}`,
    );
  }
  if (repoSummary.databaseUrl.type !== "SECRET") {
    fail(`repo spec: DATABASE_URL must be declared as type SECRET, found ${repoSummary.databaseUrl.type ?? "missing"}`);
  }
  if (repoSummary.databaseUrl.scope === "RUN_AND_BUILD_TIME") {
    warn("repo spec: DATABASE_URL scope RUN_AND_BUILD_TIME is runtime-visible, but RUN_TIME is preferred.");
  }
}
if (!repoSummary.directUrl.present) {
  fail(`repo spec: DIRECT_URL absent from effective runtime env for running service ${expectedServiceName}`);
} else {
  if (repoSummary.directUrl.attachment !== "service") {
    fail(`repo spec: DIRECT_URL must be attached under services.${expectedServiceName}.envs, found ${repoSummary.directUrl.attachment ?? "missing"}`);
  }
  if (!runtimeVisibleScopes.has(repoSummary.directUrl.scope)) {
    fail(
      `repo spec: DIRECT_URL must be runtime-visible for service ${expectedServiceName}; found ${repoSummary.directUrl.scope ?? "missing"}`,
    );
  }
  if (repoSummary.directUrl.type !== "SECRET") {
    fail(`repo spec: DIRECT_URL must be declared as type SECRET, found ${repoSummary.directUrl.type ?? "missing"}`);
  }
}
if (!repoSummary.nextauthSecret.present) {
  fail(`repo spec: NEXTAUTH_SECRET absent from effective runtime env for service ${expectedServiceName}`);
} else if (repoSummary.nextauthSecret.type !== "SECRET") {
  fail(`repo spec: NEXTAUTH_SECRET must be declared as type SECRET, found ${repoSummary.nextauthSecret.type ?? "missing"}`);
}

if (!/FROM\s+node:20-alpine\s+AS\s+runner/.test(dockerfile)) {
  fail("Dockerfile must have a node:20-alpine runner stage");
}
for (const requiredCopy of [
  "COPY --from=builder /app/node_modules ./node_modules",
  "COPY --from=builder /app/dist ./dist",
  "COPY --from=builder /app/scripts ./scripts",
  "COPY --from=builder /app/nursenest-core/scripts ./nursenest-core/scripts",
  "COPY --from=builder /app/nursenest-core/.next/standalone ./nursenest-core/.next/standalone",
  "COPY --from=builder /app/nursenest-core/.next/static ./nursenest-core/.next/static",
  "COPY --from=builder /app/package.json ./package.json",
  "COPY --from=builder /app/package-lock.json ./package-lock.json",
  "COPY --from=builder /app/nursenest-core/public ./public",
  "COPY --from=builder /app/nursenest-core/public ./nursenest-core/public",
  "COPY --from=builder /app/nursenest-core/package.json ./nursenest-core/package.json",
]) {
  assertIncludes(dockerfile, requiredCopy, "Dockerfile runner stage");
}
assertIncludes(dockerfile, "EXPOSE 8080", "Dockerfile");
if (!dockerfile.includes('CMD ["node", "scripts/start-production.mjs"]')) {
  fail('Dockerfile runner CMD must start scripts/start-production.mjs directly');
}

for (const requiredSnippet of [
  "[runtime_env]",
  "DATABASE_URL_present=",
  "DIRECT_URL_present=",
  "AUTH_SECRET_present=",
  "NEXTAUTH_SECRET_present=",
  "delegating to Next standalone",
  "require(dist/index.cjs)",
  "dist/index.cjs is missing.",
]) {
  assertIncludes(productionStart, requiredSnippet, "start-production.mjs");
}

verifyStartScript({
  label: "nursenest-core/package.json start",
  command: packageJson?.scripts?.start,
  baseDir: appRoot,
  dockerfile,
  allowStandalone: true,
});
verifyStartScript({
  label: "package.json start",
  command: rootPackageJson?.scripts?.start,
  baseDir: root,
  dockerfile,
});

for (const specFile of [".do/app-nursenest-core-next.yaml", ".do/app.yaml"]) {
  const candidate = path.join(root, specFile);
  if (!existsSync(candidate)) continue;
  const specCandidate = readFileSync(candidate, "utf8");
  const specRunCommand = scalar(activeLines(specCandidate), "run_command");
  if (specRunCommand) {
    verifyStartScript({
      label: `${specFile} run_command`,
      command: specRunCommand,
      baseDir: root,
      dockerfile,
    });
  }
}

const contentDirectoryResult = verifyOptionalContentDirectories({ root });
for (const message of contentDirectoryResult.failures) {
  fail(message);
}

const accountItems = runDoctlJson(["account", "get", "--output", "json"], "doctl account get");
const apps = runDoctlJson(["apps", "list", "--output", "json"], "doctl apps list");

if (!apps || apps.length === 0) {
  fail("doctl apps list returned no apps — verify the authenticated account/team before deploying.");
}

const account = sanitizeAccount(unwrapSingle(accountItems));
if (expectedAccountEmail && account.email && account.email !== expectedAccountEmail) {
  fail(
    `doctl is authenticated to ${account.email} (team=${account.team ?? "unknown"}), expected ${expectedAccountEmail} (team=${expectedTeamName}).`,
  );
}
if (expectedTeamName && account.team && account.team !== expectedTeamName) {
  fail(
    `doctl is authenticated to team ${account.team} (account=${account.email ?? "unknown"}), expected ${expectedTeamName}.`,
  );
}

const appListEntry = apps ? pickExpectedApp(apps) : null;
if (!appListEntry) {
  fail(
    `could not find DigitalOcean app ${expectedAppName} in apps list for account=${account.email ?? "unknown"} team=${account.team ?? "unknown"}`,
  );
}

const appId = appListEntry?.id ?? null;
const liveAppItems = appId
  ? runDoctlJson(["apps", "get", appId, "--output", "json"], "doctl apps get")
  : null;
const liveApp = unwrapSingle(liveAppItems);
const liveSpecSummary = liveApp ? summarizeSpec(liveApp.spec ?? {}, "live") : null;
if (liveSpecSummary) {
  console.log(`[verify:do-runtime] live spec summary ${JSON.stringify(liveSpecSummary)}`);
  verifyLiveSpec(liveSpecSummary, "live app spec");
  if (!liveSpecSummary.databaseUrl.present) {
    fail(`live app spec: DATABASE_URL absent from effective runtime env for service ${expectedServiceName}`);
  } else {
    if (liveSpecSummary.databaseUrl.attachment !== "service") {
      fail(
        `live app spec: DATABASE_URL must be attached under services.${expectedServiceName}.envs, found ${liveSpecSummary.databaseUrl.attachment ?? "missing"}`,
      );
    }
    if (!runtimeVisibleScopes.has(liveSpecSummary.databaseUrl.scope)) {
      fail(`live app spec: DATABASE_URL scope must be runtime-visible, found ${liveSpecSummary.databaseUrl.scope ?? "missing"}`);
    }
    if (liveSpecSummary.databaseUrl.type !== "SECRET") {
      fail(`live app spec: DATABASE_URL must be type SECRET, found ${liveSpecSummary.databaseUrl.type ?? "missing"}`);
    }
    if (liveSpecSummary.databaseUrl.scope === "RUN_AND_BUILD_TIME") {
      warn("live app spec: DATABASE_URL scope RUN_AND_BUILD_TIME is runtime-visible, but RUN_TIME is preferred.");
    }
  }
  if (!liveSpecSummary.authSecret.present) {
    fail(`live app spec: AUTH_SECRET absent from effective runtime env for service ${expectedServiceName}`);
  } else if (liveSpecSummary.authSecret.type !== "SECRET") {
    fail(`live app spec: AUTH_SECRET must be type SECRET, found ${liveSpecSummary.authSecret.type ?? "missing"}`);
  }
  if (!liveSpecSummary.directUrl?.present) {
    fail(`live app spec: DIRECT_URL absent from effective runtime env for service ${expectedServiceName}`);
  } else {
    if (liveSpecSummary.directUrl.attachment !== "service") {
      fail(
        `live app spec: DIRECT_URL must be attached under services.${expectedServiceName}.envs, found ${liveSpecSummary.directUrl.attachment ?? "missing"}`,
      );
    }
    if (!runtimeVisibleScopes.has(liveSpecSummary.directUrl.scope)) {
      fail(`live app spec: DIRECT_URL scope must be runtime-visible, found ${liveSpecSummary.directUrl.scope ?? "missing"}`);
    }
    if (liveSpecSummary.directUrl.type !== "SECRET") {
      fail(`live app spec: DIRECT_URL must be type SECRET, found ${liveSpecSummary.directUrl.type ?? "missing"}`);
    }
  }
  if (!liveSpecSummary.nextauthSecret?.present) {
    fail(`live app spec: NEXTAUTH_SECRET absent from effective runtime env for service ${expectedServiceName}`);
  } else if (liveSpecSummary.nextauthSecret.type !== "SECRET") {
    fail(`live app spec: NEXTAUTH_SECRET must be type SECRET, found ${liveSpecSummary.nextauthSecret.type ?? "missing"}`);
  }
}

const activeDeploymentId = liveApp?.active_deployment?.id ?? appListEntry?.active_deployment_id ?? null;
const inProgressDeploymentId =
  liveApp?.in_progress_deployment?.id ?? appListEntry?.in_progress_deployment_id ?? null;
const deploymentRows = appId
  ? parseDeploymentRows(
      runDoctlText(
        ["apps", "list-deployments", appId, "--format", "ID,Cause,Phase,Created", "--no-header"],
        "doctl apps list-deployments",
      ) ?? "",
    )
  : [];
const latestDeploymentId = deploymentRows[0]?.id ?? null;
const activeDeployment =
  activeDeploymentId && appId
    ? unwrapSingle(
        runDoctlJson(["apps", "get-deployment", appId, activeDeploymentId, "--output", "json"], "doctl apps get-deployment active"),
      ) ?? liveApp?.active_deployment ?? null
    : liveApp?.active_deployment ?? null;
const latestDeployment =
  latestDeploymentId && appId
    ? unwrapSingle(
        runDoctlJson(["apps", "get-deployment", appId, latestDeploymentId, "--output", "json"], "doctl apps get-deployment latest"),
      )
    : null;
const currentMainCommit = gitSha(["rev-parse", "origin/main"]) ?? gitSha(["rev-parse", "HEAD"]);

const freshness = {
  activeDeploymentId,
  latestDeploymentId: latestDeployment?.id ?? latestDeploymentId,
  inProgressDeploymentId,
  activeDeployment: summarizeDeployment(activeDeployment),
  latestDeployment: summarizeDeployment(latestDeployment),
  activeIsRollback: isRollbackLikeDeployment(activeDeployment),
  latestIsActive: Boolean(activeDeploymentId && latestDeployment?.id && activeDeploymentId === latestDeployment.id),
  logsCommandTargetsActiveDeployment: true,
  logsTargetDeploymentId: activeDeploymentId,
  logsLikelyShowRollbackState: isRollbackLikeDeployment(activeDeployment),
  activeCommitSha:
    summarizeDeployment(activeDeployment)?.sourceCommitHash ??
    liveApp?.services?.find((service) => service?.name === expectedServiceName)?.source_commit_hash ??
    null,
  latestCommitSha: summarizeDeployment(latestDeployment)?.sourceCommitHash ?? extractCommitShaFromCause(deploymentRows[0]?.cause) ?? null,
  currentMainCommit,
};

console.log(`[verify:do-runtime] doctl account ${JSON.stringify(account)}`);
console.log(
  `[verify:do-runtime] deployment freshness ${JSON.stringify({
    activeDeploymentId: freshness.activeDeploymentId,
    latestDeploymentId: freshness.latestDeploymentId,
    inProgressDeploymentId: freshness.inProgressDeploymentId,
    activeIsRollback: freshness.activeIsRollback,
    latestIsActive: freshness.latestIsActive,
    logsTargetDeploymentId: freshness.logsTargetDeploymentId,
    logsLikelyShowRollbackState: freshness.logsLikelyShowRollbackState,
    activeCommitSha: freshness.activeCommitSha,
    latestCommitSha: freshness.latestCommitSha,
    currentMainCommit: freshness.currentMainCommit,
  })}`,
);

if (freshness.activeIsRollback) {
  warn(
    `active deployment ${freshness.activeDeploymentId ?? "(unknown)"} is a rollback; runtime logs may be showing rollback state instead of the latest attempted deploy.`,
  );
}
if (freshness.latestDeploymentId && freshness.activeDeploymentId && freshness.latestDeploymentId !== freshness.activeDeploymentId) {
  warn(
    `latest deployment ${freshness.latestDeploymentId} is not the active deployment ${freshness.activeDeploymentId}; unscoped doctl runtime logs follow the active deployment.`,
  );
}
if (freshness.activeCommitSha && freshness.currentMainCommit && freshness.activeCommitSha !== freshness.currentMainCommit) {
  warn(
    `active deployment commit ${freshness.activeCommitSha} does not match current main ${freshness.currentMainCommit}; do not mark env fixed until a fresh deployment reaches ACTIVE.`,
  );
}
if (
  freshness.latestCommitSha &&
  freshness.currentMainCommit &&
  !freshness.currentMainCommit.startsWith(freshness.latestCommitSha) &&
  !freshness.latestCommitSha.startsWith(freshness.currentMainCommit)
) {
  warn(
    `latest deployment commit ${freshness.latestCommitSha} does not match current main ${freshness.currentMainCommit}; the newest deploy may still be behind local main.`,
  );
}

const stripeKeys = listStripeEnvKeysJson();
const liveServiceEnvKeys = new Set(
  asArray(findService(liveApp?.spec ?? {}, expectedServiceName)?.envs).map((entry) => entry?.key).filter(Boolean),
);
const missingStripeKeys = stripeKeys.filter((key) => !liveServiceEnvKeys.has(key));
if (missingStripeKeys.length > 0) {
  warn(
    `live app spec is missing ${missingStripeKeys.length} Stripe runtime env keys from list:stripe-runtime-env-keys (${missingStripeKeys.slice(0, 10).join(", ")}${missingStripeKeys.length > 10 ? ", ..." : ""})`,
  );
}

const cacheSummary = {
  checkedAt: new Date().toISOString(),
  account,
  appId,
  appName: expectedAppName,
  serviceName: expectedServiceName,
  repoSummary,
  liveSpecSummary,
  freshness,
  checks: {
    databaseUrlAttached: Boolean(liveSpecSummary?.databaseUrl?.present),
    databaseUrlAttachedToService: liveSpecSummary?.databaseUrl?.attachment === "service",
    databaseUrlRuntimeVisible: runtimeVisibleScopes.has(liveSpecSummary?.databaseUrl?.scope),
    databaseUrlSecret: liveSpecSummary?.databaseUrl?.type === "SECRET",
    directUrlAttached: Boolean(liveSpecSummary?.directUrl?.present),
    directUrlAttachedToService: liveSpecSummary?.directUrl?.attachment === "service",
    directUrlRuntimeVisible: runtimeVisibleScopes.has(liveSpecSummary?.directUrl?.scope),
    directUrlSecret: liveSpecSummary?.directUrl?.type === "SECRET",
    authSecretAttached: Boolean(liveSpecSummary?.authSecret?.present),
    authSecretSecret: liveSpecSummary?.authSecret?.type === "SECRET",
    nextauthSecretAttached: Boolean(liveSpecSummary?.nextauthSecret?.present),
    nextauthSecretSecret: liveSpecSummary?.nextauthSecret?.type === "SECRET",
  },
  warnings,
  failed: failures.length > 0,
};
const cachePath = writeDoRuntimeVerificationCache(appRoot, cacheSummary);
console.log(`[verify:do-runtime] wrote verification cache ${path.relative(root, cachePath)}`);

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

console.log("[verify:do-runtime] verified repo spec, live app spec, runtime env attachment, and deployment freshness");
console.log("[verify:do-runtime] public health: /healthz immediate, /readyz gated by child readiness");
console.log("[verify:do-runtime] startup command: node scripts/start-production.mjs");
