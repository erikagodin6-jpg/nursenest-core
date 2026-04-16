/**
 * Parses NextAuth/Auth.js credentials POST JSON (`next-auth/react` signIn with redirect:false).
 * Success payloads return `{ url: "/app" }` or a full URL without `error=`; failures embed `error=` in `url`.
 */
export function parseCredentialsCallbackPayload(payload: unknown): {
  ok: boolean;
  redirectUrl: string;
  errorParam: string | null;
  /** Auth.js credentials `code` query param when diagnostic codes are enabled on the server. */
  credentialsCode: string | null;
} {
  if (!payload || typeof payload !== "object") {
    return { ok: false, redirectUrl: "", errorParam: "invalid_payload", credentialsCode: null };
  }
  const rec = payload as { url?: unknown };
  const raw = typeof rec.url === "string" ? rec.url : "";
  if (!raw) {
    return { ok: false, redirectUrl: "", errorParam: "missing_url", credentialsCode: null };
  }
  let errorParam: string | null = null;
  let credentialsCode: string | null = null;
  try {
    const abs =
      raw.startsWith("http://") || raw.startsWith("https://")
        ? raw
        : `http://local.invalid${raw.startsWith("/") ? raw : `/${raw}`}`;
    const sp = new URL(abs).searchParams;
    errorParam = sp.get("error");
    credentialsCode = sp.get("code");
  } catch {
    errorParam = null;
    credentialsCode = null;
  }
  const failed = Boolean(errorParam);
  return { ok: !failed, redirectUrl: raw, errorParam, credentialsCode };
}
