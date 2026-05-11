export const DIGITALOCEAN_STANDALONE_RUNTIME_EVIDENCE = Object.freeze({
  appName: "nursenest-core-next",
  componentName: "web",
  sourceDir: ".",
  runCommand: "node scripts/start-standalone.mjs",
});

export function hasRuntimeValue(env, key) {
  return Boolean(String(env?.[key] ?? "").trim());
}

export function buildForwardedRuntimeEnv(baseEnv = process.env, overrides = {}) {
  return {
    ...baseEnv,
    ...overrides,
  };
}

export function runtimeEnvPresenceSnapshot(env = process.env) {
  return {
    DATABASE_URL_present: hasRuntimeValue(env, "DATABASE_URL"),
    POSTGRES_URL_present: hasRuntimeValue(env, "POSTGRES_URL"),
    POSTGRESQL_URL_present: hasRuntimeValue(env, "POSTGRESQL_URL"),
    DIRECT_URL_present: hasRuntimeValue(env, "DIRECT_URL"),
    DATABASE_DIRECT_URL_present: hasRuntimeValue(env, "DATABASE_DIRECT_URL"),
  };
}
