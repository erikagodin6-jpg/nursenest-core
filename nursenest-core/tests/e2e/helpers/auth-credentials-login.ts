/**
 * Parses NextAuth/Auth.js credentials POST JSON (`next-auth/react` signIn with redirect:false).
 * Success payloads return `{ url: "/app" }` or a full URL without `error=`; failures embed `error=` in `url`.
 */
export function parseCredentialsCallbackPayload(payload: unknown): {
  ok: boolean;
  redirectUrl: string;
  errorParam: string | null;
} {
  if (!payload || typeof payload !== "object") {
    return { ok: false, redirectUrl: "", errorParam: "invalid_payload" };
  }
  const rec = payload as { url?: unknown };
  const raw = typeof rec.url === "string" ? rec.url : "";
  if (!raw) {
    return { ok: false, redirectUrl: "", errorParam: "missing_url" };
  }
  let errorParam: string | null = null;
  try {
    const abs =
      raw.startsWith("http://") || raw.startsWith("https://")
        ? raw
        : `http://local.invalid${raw.startsWith("/") ? raw : `/${raw}`}`;
    errorParam = new URL(abs).searchParams.get("error");
  } catch {
    errorParam = null;
  }
  const failed = Boolean(errorParam);
  return { ok: !failed, redirectUrl: raw, errorParam };
}
