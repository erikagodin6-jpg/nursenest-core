import { readFile } from "node:fs/promises";
import { join } from "node:path";

export type BuildMeta = {
  commit?: string | null;
  branch?: string | null;
  recordedAt?: string | null;
  environment?: string | null;
  buildPlatform?: string | null;
  source?: string | null;
};

export type RuntimeVersionPayload = {
  ok: boolean;
  commit: string | null;
  branch: string | null;
  recordedAt: string | null;
  environment: string | null;
  buildPlatform: string | null;
  deploymentMode: string | null;
  runtimeEnvironment: string | null;
  source: string | null;
  message?: string;
};

const missingMetaMessage = "nn-build-meta.json missing; run a production build (prebuild writes this file).";

const commitEnvKeys = [
  "NN_BUILD_COMMIT",
  "SOURCE_COMMIT",
  "SOURCE_VERSION",
  "DIGITALOCEAN_GIT_COMMIT_SHA",
  "GITHUB_SHA",
  "VERCEL_GIT_COMMIT_SHA",
  "COMMIT_SHA",
] as const;

const branchEnvKeys = [
  "NN_BUILD_BRANCH",
  "SOURCE_BRANCH",
  "DIGITALOCEAN_GIT_BRANCH",
  "GITHUB_REF_NAME",
  "VERCEL_GIT_COMMIT_REF",
  "BRANCH_NAME",
] as const;

function firstEnvValue(env: NodeJS.ProcessEnv, keys: readonly string[]) {
  for (const key of keys) {
    const value = env[key]?.trim();
    if (value) return { key, value };
  }
  return null;
}

function normalizeBranch(value: string | null | undefined) {
  if (!value || value === "HEAD") return null;
  return value.replace(/^refs\/heads\//, "").replace(/^origin\//, "").trim() || null;
}

function detectRuntimeBuildPlatform(env: NodeJS.ProcessEnv) {
  if (env.DIGITALOCEAN_APP_ID || env.DIGITALOCEAN_GIT_COMMIT_SHA || env.NN_APP_PLATFORM_BUILD === "true") {
    return "digitalocean";
  }
  if (env.GITHUB_ACTIONS === "true" || env.GITHUB_SHA) return "github-actions";
  if (env.VERCEL === "1" || env.VERCEL_GIT_COMMIT_SHA) return "vercel";
  if (env.CI === "true") return "ci";
  return null;
}

export function buildRuntimeEnvMeta(env: NodeJS.ProcessEnv = process.env): BuildMeta | null {
  const commit = firstEnvValue(env, commitEnvKeys);
  const branch = firstEnvValue(env, branchEnvKeys);
  const commitValue = commit?.value ?? null;
  const branchValue = normalizeBranch(branch?.value);

  if (!commitValue && !branchValue) {
    return null;
  }

  return {
    commit: commitValue,
    branch: branchValue,
    recordedAt: env.NN_BUILD_RECORDED_AT?.trim() || null,
    environment: env.NN_DEPLOY_ENV?.trim() || env.NODE_ENV?.trim() || null,
    buildPlatform: detectRuntimeBuildPlatform(env),
    source: commit ? `env:${commit.key}` : branch ? `env:${branch.key}` : "env:runtime",
  };
}

function mergeMetaWithRuntimeEnv(meta: BuildMeta | null, env: NodeJS.ProcessEnv = process.env): BuildMeta | null {
  const envMeta = buildRuntimeEnvMeta(env);
  if (!meta) return envMeta;
  if (!envMeta) return meta;
  return {
    commit: meta.commit ?? envMeta.commit ?? null,
    branch: meta.branch ?? envMeta.branch ?? null,
    recordedAt: meta.recordedAt ?? envMeta.recordedAt ?? null,
    environment: meta.environment ?? envMeta.environment ?? null,
    buildPlatform: meta.buildPlatform ?? envMeta.buildPlatform ?? null,
    source: meta.commit ? meta.source ?? null : envMeta.source ?? meta.source ?? null,
  };
}

export async function readBuildMeta(cwd = process.cwd()): Promise<BuildMeta | null> {
  const filePath = join(cwd, "public", "nn-build-meta.json");
  try {
    const raw = await readFile(filePath, "utf8");
    return JSON.parse(raw) as BuildMeta;
  } catch {
    return null;
  }
}

export function buildRuntimeVersionPayload(
  meta: BuildMeta | null,
  runtime: {
    nodeEnv?: string | null;
    deploymentMode?: string | null;
    env?: NodeJS.ProcessEnv;
  } = {},
): RuntimeVersionPayload {
  const effectiveMeta = mergeMetaWithRuntimeEnv(meta, runtime.env);
  const payload: RuntimeVersionPayload = {
    ok: Boolean(effectiveMeta),
    commit: effectiveMeta?.commit ?? null,
    branch: effectiveMeta?.branch ?? null,
    recordedAt: effectiveMeta?.recordedAt ?? null,
    environment: effectiveMeta?.environment ?? null,
    buildPlatform: effectiveMeta?.buildPlatform ?? null,
    deploymentMode: runtime.deploymentMode ?? null,
    runtimeEnvironment: runtime.nodeEnv ?? null,
    source: effectiveMeta?.source ?? null,
  };

  if (!effectiveMeta) {
    payload.message = missingMetaMessage;
  }

  return payload;
}

export function runtimeVersionHeaders() {
  return {
    "Cache-Control": "no-store",
  };
}
