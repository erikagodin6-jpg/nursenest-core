/**
 * DigitalOcean / Render / Railway are not auto-detected like VERCEL or CF_PAGES.
 * @auth/core setEnvDefaults() does: trustHost ??= !!(AUTH_URL ?? AUTH_TRUST_HOST ?? …).
 * An empty AUTH_URL string is NOT nullish, so it becomes the first value and !!( "") === false,
 * which forces trustHost off even when you intended to trust the host.
 * @see https://authjs.dev/getting-started/deployment
 */
if (typeof process !== "undefined" && process.env) {
  const url = process.env.AUTH_URL;
  const legacyUrl = process.env.NEXTAUTH_URL;
  if (url !== undefined && url.trim() === "") {
    delete process.env.AUTH_URL;
  }
  if (legacyUrl !== undefined && legacyUrl.trim() === "") {
    delete process.env.NEXTAUTH_URL;
  }

  const v = process.env.AUTH_TRUST_HOST;
  if (v === undefined || v === "") {
    process.env.AUTH_TRUST_HOST = "true";
  }
}
