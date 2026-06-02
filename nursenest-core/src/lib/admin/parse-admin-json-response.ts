/**
 * Safe parsing for admin `fetch` calls — avoids surfacing opaque “unreadable response” when gateways return HTML/504 bodies.
 */

export type ParsedAdminJsonResult<T> =
  | { ok: true; status: number; json: T }
  | { ok: false; status: number; errorMessage: string; rawBodySnippet?: string };

export async function parseAdminJsonResponse<T = unknown>(res: Response): Promise<ParsedAdminJsonResult<T>> {
  const status = res.status;
  const text = await res.text();
  const trimmed = text.trim();
  let json: unknown;
  try {
    json = trimmed.length ? JSON.parse(trimmed) : {};
  } catch {
    const rawBodySnippet = trimmed.slice(0, 800);
    const errorMessage =
      status === 504
        ? "The request timed out before the server finished. The job may still be running. Check queue status."
        : `Server returned a non-JSON response (HTTP ${status}).`;
    return { ok: false, status, errorMessage, rawBodySnippet };
  }
  return { ok: true, status, json: json as T };
}
