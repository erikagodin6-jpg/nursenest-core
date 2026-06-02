/**
 * Runtime-safe Auth.js trust-host env normalization.
 *
 * Do not mutate auth URL env vars during App Platform / Next build.
 * Runtime only.
 */

const runtime = globalThis as unknown as {
  process?: {
    env?: Record<string, string | undefined>;
  };
};

const env = runtime.process?.env;

function isTruthy(value: string | undefined): boolean {
  return /^(1|true|yes)$/i.test(String(value ?? "").trim());
}

function isBlank(value: string | undefined): boolean {
  return value !== undefined && value.trim().length === 0;
}

function deleteEnvKey(key: string): void {
  if (!env) return;

  try {
    Reflect.deleteProperty(env, key);
  } catch {
    /* env may be frozen */
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
    /* env may be read-only */
  }
}

/**
 * Critical:
 * During `next build`, do not alter AUTH_URL / NEXTAUTH_URL.
 * Next/Webpack can inline or snapshot env access during compilation.
 */
if (env && !isTruthy(env.NN_APP_PLATFORM_BUILD)) {
  if (isBlank(env.AUTH_URL)) {
    deleteEnvKey("AUTH_URL");
  }

  if (isBlank(env.NEXTAUTH_URL)) {
    deleteEnvKey("NEXTAUTH_URL");
  }

  setEnvDefault("AUTH_TRUST_HOST", "true");
}