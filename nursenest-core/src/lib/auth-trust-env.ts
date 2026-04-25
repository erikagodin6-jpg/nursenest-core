/**
 * Runtime-safe Auth.js trust-host env normalization.
 *
 * Do not use direct `process.env.X = ...` or `delete process.env.X` here.
 * Middleware/RSC bundling can inline those expressions incorrectly.
 */

const runtime = globalThis as unknown as {
  process?: {
    env?: Record<string, string | undefined>;
  };
};

const env = runtime.process?.env;

function isBlank(value: string | undefined): boolean {
  return value !== undefined && value.trim().length === 0;
}

function deleteEnvKey(key: string): void {
  if (!env) return;

  try {
    Reflect.deleteProperty(env, key);
  } catch {
    /* env may be frozen in some runtimes */
  }
}

function setEnvDefault(key: string, value: string): void {
  if (!env) return;

  const current = env[key];

  if (current !== undefined && current.trim().length > 0) {
    return;
  }

  try {
    env[key] = value;
  } catch {
    /* env may be read-only in some runtimes */
  }
}

if (env) {
  if (isBlank(env.AUTH_URL)) {
    deleteEnvKey("AUTH_URL");
  }

  if (isBlank(env.NEXTAUTH_URL)) {
    deleteEnvKey("NEXTAUTH_URL");
  }

  setEnvDefault("AUTH_TRUST_HOST", "true");
}