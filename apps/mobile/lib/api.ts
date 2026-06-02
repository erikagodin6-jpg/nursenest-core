import { apiPaths } from "@nursenest/mobile-shared";
import { log } from "./logging";

export class ApiError extends Error {
  readonly status: number;
  readonly body: unknown;
  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

function joinOrigin(origin: string, path: string) {
  const base = origin.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

async function parseJsonSafe(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

const RETRYABLE_STATUS = new Set([408, 425, 429, 500, 502, 503, 504]);

function backoffMs(attempt: number): number {
  return Math.min(1000 * 2 ** attempt, 30_000);
}

async function sleep(ms: number) {
  await new Promise((r) => setTimeout(r, ms));
}

export async function apiJson(
  origin: string,
  path: string,
  cookieJar: string | null,
  init?: RequestInit & { onUnauthorized?: () => void },
): Promise<unknown> {
  const { onUnauthorized, ...rest } = init ?? {};
  const method = (rest.method ?? "GET").toUpperCase();
  const maxRetries = method === "GET" ? 3 : 0;

  let lastNetworkError: unknown;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(joinOrigin(origin, path), {
        ...rest,
        headers: {
          Accept: "application/json",
          ...(cookieJar ? { Cookie: cookieJar } : {}),
          ...(rest.headers ?? {}),
        },
      });

      const body = await parseJsonSafe(res);

      if (res.status === 401) {
        onUnauthorized?.();
        throw new ApiError("Unauthorized", 401, body);
      }

      if (res.status === 403) {
        throw new ApiError("Forbidden", 403, body);
      }

      if (!res.ok) {
        if (method === "GET" && RETRYABLE_STATUS.has(res.status) && attempt < maxRetries) {
          await sleep(backoffMs(attempt));
          continue;
        }
        throw new ApiError(typeof body === "string" ? body : "Request failed", res.status, body);
      }

      return body;
    } catch (e) {
      if (e instanceof ApiError) throw e;
      lastNetworkError = e;
      if (method !== "GET" || attempt >= maxRetries) throw e;
      log.warn("api_json_network_retry", { attempt, path: path.slice(0, 80) });
      await sleep(backoffMs(attempt));
    }
  }
  throw lastNetworkError instanceof Error ? lastNetworkError : new Error("api_json_failed");
}

export async function apiPatchJson(
  origin: string,
  path: string,
  cookieJar: string | null,
  jsonBody: Record<string, unknown>,
  onUnauthorized?: () => void,
): Promise<unknown> {
  return apiJson(origin, path, cookieJar, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(jsonBody),
    onUnauthorized,
  });
}

export { apiPaths };
