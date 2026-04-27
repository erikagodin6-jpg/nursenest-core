/**
 * Validates inbound webhook callers. Prefer a dedicated secret over reusing the Postmark API token.
 *
 * Env (first match wins):
 * - `POSTMARK_INBOUND_WEBHOOK_SECRET` — recommended.
 * - `INBOUND_EMAIL_WEBHOOK_SECRET` — alias.
 *
 * Accepted proofs (any one):
 * - `Authorization: Bearer <secret>`
 * - HTTP Basic from Postmark inbound "HTTP credentials" (`https://user:pass@host/...`): password (or full `user:pass`) must equal the secret.
 * - Query `?secret=<secret>` on the webhook URL (use only with HTTPS).
 *
 * If unset in production (`NODE_ENV=production`), requests are rejected (fail closed).
 */
export function getInboundWebhookSecret(): string | null {
  const a = process.env["POSTMARK_INBOUND_WEBHOOK_SECRET"]?.trim();
  const b = process.env["INBOUND_EMAIL_WEBHOOK_SECRET"]?.trim();
  return a || b || null;
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

function verifyAgainstSecret(request: Request, configured: string): boolean {
  const auth = request.headers.get("authorization")?.trim() ?? "";
  const bearer = /^Bearer\s+(.+)$/i.exec(auth);
  if (bearer?.[1] && timingSafeEqual(bearer[1].trim(), configured)) {
    return true;
  }

  if (auth.toLowerCase().startsWith("basic ")) {
    try {
      const raw = Buffer.from(auth.slice(6).trim(), "base64").toString("utf8");
      const colon = raw.indexOf(":");
      const pass = colon >= 0 ? raw.slice(colon + 1) : raw;
      const userPass = colon >= 0 ? raw : "";
      if (timingSafeEqual(pass, configured) || (userPass && timingSafeEqual(userPass, configured))) {
        return true;
      }
    } catch {
      /* ignore */
    }
  }

  try {
    const url = new URL(request.url);
    const q = url.searchParams.get("secret");
    if (q && timingSafeEqual(q.trim(), configured)) return true;
  } catch {
    /* ignore */
  }

  return false;
}

export function verifyInboundWebhookBearer(request: Request): { ok: true } | { ok: false; reason: "missing_webhook_secret" | "invalid_bearer" } {
  const configured = getInboundWebhookSecret();
  if (!configured) {
    if (process.env.NODE_ENV === "production") {
      return { ok: false, reason: "missing_webhook_secret" };
    }
    return { ok: true };
  }

  if (!verifyAgainstSecret(request, configured)) {
    return { ok: false, reason: "invalid_bearer" };
  }
  return { ok: true };
}
