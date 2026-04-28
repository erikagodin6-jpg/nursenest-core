/** @type {import('next').NextConfig} */
import os from "node:os";

function envTruthy(name) {
  return /^(1|true|yes)$/i.test(String(process.env[name] ?? "").trim());
}

/** `NN_LOW_MEMORY_BUILD=0` opts out of auto low-RAM heuristics (large self-hosted builders). */
function envExplicitlyFalse(name) {
  const v = String(process.env[name] ?? "").trim();
  return v === "0" || /^false$/i.test(v);
}

const totalRamMb = Math.max(512, Math.floor(os.totalmem() / 1024 / 1024));
/** ~9GiB or less → assume webpack/static workers should stay minimal unless opted out. */
const autoLowMemoryHost = totalRamMb <= 9216;

const lowMemoryOptOut = envExplicitlyFalse("NN_LOW_MEMORY_BUILD");
const isLowMemoryBuild =
  !lowMemoryOptOut &&
  (envTruthy("NN_LOW_MEMORY_BUILD") ||
    envTruthy("CI") ||
    process.env.GITHUB_ACTIONS === "true" ||
    envTruthy("NN_APP_PLATFORM_BUILD") ||
    autoLowMemoryHost);

// `ci:verify` runs `npm run typecheck` before `next build`. Skipping the second integrated pass
// avoids a large RSS spike after webpack on memory-tight hosts (OOM during "Linting and checking…").
// Production image / DO builds must not set `SKIP_NEXT_BUILD_TYPECHECK` unless you run typecheck separately.
const skipNextBuildTypecheck = process.env.SKIP_NEXT_BUILD_TYPECHECK === "1";

const webpackParallelism = isLowMemoryBuild ? 1 : 2;

function shouldEmitBuildConfigDiagnostics() {
  if (String(process.env.NN_NEXT_BUILD_CONFIG_LOG ?? "").trim() === "0") return false;
  return (
    process.env.npm_lifecycle_event === "build" ||
    (Array.isArray(process.argv) && process.argv.includes("build"))
  );
}

if (shouldEmitBuildConfigDiagnostics()) {
  console.log(
    "[nn-next-build-config]",
    JSON.stringify({
      lowMemoryMode: isLowMemoryBuild,
      totalRamMb,
      autoLowMemoryHost,
      NN_LOW_MEMORY_BUILD: process.env.NN_LOW_MEMORY_BUILD ?? null,
      CI: process.env.CI ?? null,
      GITHUB_ACTIONS: process.env.GITHUB_ACTIONS ?? null,
      NN_APP_PLATFORM_BUILD: process.env.NN_APP_PLATFORM_BUILD ?? null,
      experimentalCpus: isLowMemoryBuild ? 1 : "(Next default — not overridden)",
      webpackParallelism,
      webpackPersistentCache: false,
      webpackBuildWorker: isLowMemoryBuild ? false : true,
      memoryBasedWorkersCount: false,
      parallelServerCompiles: false,
      parallelServerBuildTraces: false,
      staticGenerationMaxConcurrency:
        "(not a Next 14.2 config key — worker pool size follows experimental.cpus when set)",
      skipNextIntegratedTypecheck: skipNextBuildTypecheck,
    }),
  );
}

const experimental = {
  externalDir: true,
  /** Prevents Next from scaling static workers from free RAM (can overshoot on small VMs). */
  memoryBasedWorkersCount: false,
  parallelServerCompiles: false,
  parallelServerBuildTraces: false,
  workerThreads: false,
  /**
   * `true`: run webpack in a child process (can help peak RSS on large hosts; adds a second Node heap).
   * `false` for low-memory profile: single process + `parallelism` cap to reduce total RSS during compile.
   */
  webpackBuildWorker: isLowMemoryBuild ? false : true,
};

if (isLowMemoryBuild) {
  experimental.cpus = 1;
}

const nextConfig = {
  output: "standalone",

  reactStrictMode: true,

  typescript: {
    ignoreBuildErrors: skipNextBuildTypecheck,
  },

  experimental,

  webpack: (config, { dev }) => {
    config.parallelism = webpackParallelism;
    // PackFileCacheStrategy can throw ENOENT under load; disabling persistent cache trims disk + mmap pressure.
    if (!dev) {
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
