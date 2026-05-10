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
  } = {},
): RuntimeVersionPayload {
  const payload: RuntimeVersionPayload = {
    ok: Boolean(meta),
    commit: meta?.commit ?? null,
    branch: meta?.branch ?? null,
    recordedAt: meta?.recordedAt ?? null,
    environment: meta?.environment ?? null,
    buildPlatform: meta?.buildPlatform ?? null,
    deploymentMode: runtime.deploymentMode ?? null,
    runtimeEnvironment: runtime.nodeEnv ?? null,
    source: meta?.source ?? null,
  };

  if (!meta) {
    payload.message = missingMetaMessage;
  }

  return payload;
}

export function runtimeVersionHeaders() {
  return {
    "Cache-Control": "no-store",
  };
}
