/**
 * Bounded request body reads for Route Handlers — limits allocation from malicious huge JSON POSTs.
 * Rejects oversize Content-Length first; streamed bodies are capped by byte count.
 */
import { NextResponse } from "next/server";
import { safeServerLog } from "@/lib/observability/safe-server-log";

/** Email + password / token forms. */
export const JSON_BODY_AUTH_FORM = 16_384;
/** Small public hooks (newsletter, etc.). */
export const JSON_BODY_TINY = 8_192;
/** Typical JSON mutations (learner settings, AI prompts with modest context). */
export const JSON_BODY_STANDARD = 32_768;
/** Study Coach — context fields are zod-capped; allow headroom for JSON overhead. */
export const JSON_BODY_COACH = 52_428;
/** Stripe checkout — tier, duration, policy version only. */
export const JSON_BODY_CHECKOUT = 16_384;
/** Signup wizard — profile fields + captcha token. */
export const JSON_BODY_SIGNUP = 65_536;

/** Small structured learner POSTs (CAT step, session start) — prevents huge JSON.parse allocations. */
export const JSON_BODY_LEARNER_CAT = 24_576;

/**
 * Exam submit / large answer maps — bounded below typical LB body limits; still caps worst-case parse size.
 * Malicious multi‑MB JSON can OOM the Node heap before zod runs.
 */
export const JSON_BODY_EXAM_SUBMIT = 786_432;

/** Baseline assessment submit (`answers` record) — one entry per question id. */
export const JSON_BODY_BASELINE_SUBMIT = 524_288;

export async function readTextBodyWithByteLimit(
  req: Request,
  maxBytes: number,
): Promise<{ ok: true; text: string } | { ok: false; status: 413 }> {
  const cl = req.headers.get("content-length");
  if (cl) {
    const n = parseInt(cl, 10);
    if (Number.isFinite(n) && n > maxBytes) {
      return { ok: false, status: 413 };
    }
  }

  if (req.body === null) {
    return { ok: true, text: "" };
  }

  const reader = req.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value?.length) continue;
      if (total + value.length > maxBytes) {
        await reader.cancel().catch(() => {});
        safeServerLog("api", "request_body_too_large", {
          phase: "stream",
          maxBytes,
          readBytes: total + value.length,
          severity: "warning",
        });
        return { ok: false, status: 413 };
      }
      total += value.length;
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const full = new Uint8Array(total);
  let offset = 0;
  for (const c of chunks) {
    full.set(c, offset);
    offset += c.length;
  }
  return { ok: true, text: new TextDecoder().decode(full) };
}

export type ParseJsonBodyResult =
  | { ok: true; value: unknown }
  | { ok: false; response: NextResponse };

/**
 * Reads at most `maxBytes` of UTF-8 body text, then `JSON.parse`.
 * Empty body → 400 (matches typical `req.json()` failure for missing payload).
 */
export async function parseJsonBodyWithLimit(req: Request, maxBytes: number): Promise<ParseJsonBodyResult> {
  const raw = await readTextBodyWithByteLimit(req, maxBytes);
  if (!raw.ok) {
    safeServerLog("api", "json_body_rejected", {
      code: "payload_too_large",
      maxBytes,
      severity: "warning",
    });
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Payload too large", code: "payload_too_large" },
        { status: 413, headers: { "Cache-Control": "no-store" } },
      ),
    };
  }
  const text = raw.text.trim();
  if (text.length === 0) {
    return { ok: false, response: NextResponse.json({ error: "Invalid JSON" }, { status: 400 }) };
  }
  try {
    return { ok: true, value: JSON.parse(text) as unknown };
  } catch {
    return { ok: false, response: NextResponse.json({ error: "Invalid JSON" }, { status: 400 }) };
  }
}
