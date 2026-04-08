/**
 * DigitalOcean / Render / Railway are not auto-detected like VERCEL or CF_PAGES.
 * @auth/core setEnvDefaults() treats an empty AUTH_URL string as a real URL, which forces trustHost off.
 *
 * Do **not** write `process.env.FOO = …` or `delete process.env.FOO` here: Next.js webpack inlines
 * `process.env.*` in RSC/middleware bundles and turns those into invalid syntax ("Invalid left-hand side").
 * Use dynamic access via a plain object reference instead.
 */
const g = globalThis as unknown as { process?: { env?: Record<string, string | undefined> } };
const env = g.process?.env;
if (env) {
  const url = env.AUTH_URL;
  const legacyUrl = env.NEXTAUTH_URL;
  if (url !== undefined && url.trim() === "") {
    try {
      Reflect.deleteProperty(env, "AUTH_URL");
    } catch {
      /* frozen env in some runtimes */
    }
  }
  if (legacyUrl !== undefined && legacyUrl.trim() === "") {
    try {
      Reflect.deleteProperty(env, "NEXTAUTH_URL");
    } catch {
      /* ignore */
    }
  }
  const v = env.AUTH_TRUST_HOST;
  if (v === undefined || v === "") {
    try {
      env.AUTH_TRUST_HOST = "true";
    } catch {
      /* ignore */
    }
  }
}
