import { createHash } from "node:crypto";
import { existsSync, lstatSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const DEFAULT_EXCLUDED_DIRS = new Set([
  ".git",
  ".hg",
  ".next",
  ".turbo",
  "coverage",
  "dist",
  "node_modules",
  "reports",
  "test-results",
  "tmp",
]);

function truthyEnv(name, env = process.env) {
  return /^(1|true|yes)$/i.test(String(env[name] ?? "").trim());
}

function normalizeEntry(entry) {
  if (typeof entry === "string") {
    return {
      path: entry,
      excludeDirNames: [],
      excludePathSubstrings: [],
      extensions: null,
    };
  }
  return {
    path: entry.path,
    excludeDirNames: entry.excludeDirNames ?? [],
    excludePathSubstrings: entry.excludePathSubstrings ?? [],
    extensions: entry.extensions ?? null,
  };
}

function fileMatchesEntry(filePath, entry) {
  if (entry.extensions && entry.extensions.length > 0) {
    const ext = path.extname(filePath).toLowerCase();
    if (!entry.extensions.map((value) => value.toLowerCase()).includes(ext)) {
      return false;
    }
  }
  return !entry.excludePathSubstrings.some((fragment) => filePath.includes(fragment));
}

function collectFilesRecursive(resolvedPath, entry, out) {
  if (!existsSync(resolvedPath)) {
    out.push({ type: "missing", path: resolvedPath });
    return;
  }

  const stat = lstatSync(resolvedPath);
  if (stat.isFile()) {
    if (fileMatchesEntry(resolvedPath, entry)) {
      out.push({ type: "file", path: resolvedPath });
    }
    return;
  }

  if (!stat.isDirectory()) {
    return;
  }

  const excludedDirNames = new Set([...DEFAULT_EXCLUDED_DIRS, ...entry.excludeDirNames]);
  const children = readdirSync(resolvedPath).sort((a, b) => a.localeCompare(b));
  for (const child of children) {
    const childPath = path.join(resolvedPath, child);
    let childStat;
    try {
      childStat = lstatSync(childPath);
    } catch {
      continue;
    }
    if (childStat.isDirectory() && excludedDirNames.has(child)) {
      continue;
    }
    if (entry.excludePathSubstrings.some((fragment) => childPath.includes(fragment))) {
      continue;
    }
    collectFilesRecursive(childPath, entry, out);
  }
}

export function computeArtifactFingerprint({
  cwd = process.cwd(),
  inputs,
}) {
  const normalizedInputs = inputs.map(normalizeEntry);
  const collected = [];
  for (const entry of normalizedInputs) {
    const resolvedPath = path.resolve(cwd, entry.path);
    collectFilesRecursive(resolvedPath, entry, collected);
  }

  const hash = createHash("sha256");
  const files = collected
    .map((item) => ({
      ...item,
      normalizedPath: path.relative(cwd, item.path),
    }))
    .sort((a, b) => a.normalizedPath.localeCompare(b.normalizedPath));

  for (const item of files) {
    hash.update(`${item.type}:${item.normalizedPath}\n`);
    if (item.type === "file") {
      hash.update(readFileSync(item.path));
      hash.update("\n");
    }
  }

  return {
    fingerprint: hash.digest("hex"),
    files,
  };
}

function outputExists(resolvedPath) {
  if (!existsSync(resolvedPath)) return false;
  const stat = lstatSync(resolvedPath);
  if (stat.isDirectory()) {
    return readdirSync(resolvedPath).length > 0;
  }
  return stat.isFile();
}

function readCache(cachePath) {
  if (!existsSync(cachePath)) {
    return { cache: null, reason: "cache_missing" };
  }
  try {
    const parsed = JSON.parse(readFileSync(cachePath, "utf8"));
    if (parsed?.schemaVersion === 1 && typeof parsed.fingerprint === "string") {
      return { cache: parsed, reason: null };
    }
  } catch {
    return { cache: null, reason: "cache_corrupt" };
  }
  return { cache: null, reason: "cache_invalid" };
}

export function prepareArtifactCacheDecision({
  stepName,
  cwd = process.cwd(),
  cachePath,
  inputs,
  outputs,
  env = process.env,
}) {
  const forceRebuild = truthyEnv("CI_FORCE_REBUILD", env);
  const resolvedOutputs = outputs.map((outputPath) => path.resolve(cwd, outputPath));
  const missingOutputs = resolvedOutputs.filter((outputPath) => !outputExists(outputPath));
  const { fingerprint, files } = computeArtifactFingerprint({ cwd, inputs });
  const { cache, reason: cacheReadReason } = readCache(path.resolve(cwd, cachePath));

  let action = "rebuild";
  let reason = "fingerprint_changed";

  if (forceRebuild) {
    reason = "CI_FORCE_REBUILD";
  } else if (missingOutputs.length > 0) {
    reason = "output_missing";
  } else if (!cache) {
    reason = cacheReadReason ?? "cache_missing";
  } else if (cache.fingerprint === fingerprint) {
    action = "reuse";
    reason = "fingerprint_match";
  }

  return {
    stepName,
    action,
    reason,
    fingerprint,
    files,
    cachePath: path.resolve(cwd, cachePath),
    outputs: resolvedOutputs,
    missingOutputs,
  };
}

export function writeArtifactCache({
  cachePath,
  stepName,
  fingerprint,
  files,
  outputs,
  metadata = {},
}) {
  const resolvedCachePath = path.resolve(cachePath);
  mkdirSync(path.dirname(resolvedCachePath), { recursive: true });
  writeFileSync(
    resolvedCachePath,
    `${JSON.stringify(
      {
        schemaVersion: 1,
        stepName,
        fingerprint,
        generatedAt: new Date().toISOString(),
        inputs: files.map((item) => ({
          type: item.type,
          path: item.normalizedPath ?? item.path,
        })),
        outputs: outputs.map((outputPath) => path.resolve(outputPath)),
        metadata,
      },
      null,
      2,
    )}\n`,
    "utf8",
  );
}

export function logArtifactCacheDecision(decision, extra = {}) {
  const payload = {
    step: decision.stepName,
    action: decision.action,
    reason: decision.reason,
    fingerprint: decision.fingerprint.slice(0, 12),
    outputs: decision.outputs.map((value) => path.basename(value)),
    ...extra,
  };
  console.log(`[artifact-cache] ${JSON.stringify(payload)}`);
}
