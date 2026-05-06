export type MobileApiClientConfig = {
  baseUrl: string;
  getAccessToken: () => Promise<string | null>;
  /** Active exam pathway (RN/RPN/NP V1) — appended to deck list & practice creates when missing. */
  getPathwayId: () => string | null;
  /** Optional extra headers (locale cookies, feature flags). */
  getExtraHeaders?: () => Promise<Record<string, string>>;
  /** When true, send cookies (web session); usually false on native. */
  credentialsInclude?: boolean;
};

export type MobileJsonErrorBody = {
  error?: string;
  code?: string;
  reason?: string;
  retryable?: boolean;
};

export class MobileApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = "MobileApiError";
    this.status = status;
    this.body = body;
  }

  get isUnauthorized(): boolean {
    return this.status === 401;
  }

  get isForbidden(): boolean {
    return this.status === 403;
  }
}

function joinUrl(base: string, path: string): string {
  const b = base.replace(/\/+$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${b}${p}`;
}

const RETRYABLE = new Set([408, 425, 429, 500, 502, 503, 504]);

export type MobileFetchInit = Omit<RequestInit, "body"> & {
  jsonBody?: unknown;
  studySurfaceHeader?: Record<string, string>;
};

/**
 * Central fetch: auth bearer, pathway query on GET list routes, no retry on 401/403, bounded retries on transient 5xx.
 */
export function createMobileApiClient(cfg: MobileApiClientConfig) {
  async function request<T>(
    path: string,
    init: MobileFetchInit,
    attempt = 0,
  ): Promise<T> {
    const token = await cfg.getAccessToken();
    const extra = (await cfg.getExtraHeaders?.()) ?? {};
    const headers: Record<string, string> = {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...extra,
      ...init.studySurfaceHeader,
    };
    if (token) headers.Authorization = `Bearer ${token}`;

    const pathwayId = cfg.getPathwayId();
    let url = joinUrl(cfg.baseUrl, path);
    try {
      const pathname = new URL(url).pathname;
      if (pathname === "/api/flashcards/decks" && pathwayId) {
        const u = new URL(url);
        if (!u.searchParams.has("pathwayId")) u.searchParams.set("pathwayId", pathwayId);
        url = u.toString();
      }
    } catch {
      /* ignore malformed base+path */
    }

    const { jsonBody, studySurfaceHeader: _hdr, ...rest } = init;
    const body = jsonBody !== undefined ? JSON.stringify(jsonBody) : undefined;

    const res = await fetch(url, {
      ...rest,
      headers,
      ...(body !== undefined ? { body } : {}),
      credentials: cfg.credentialsInclude ? "include" : (rest.credentials ?? "omit"),
    });

    if (res.status === 401 || res.status === 403) {
      let parsed: unknown;
      try {
        parsed = await res.json();
      } catch {
        parsed = null;
      }
      throw new MobileApiError(res.status === 401 ? "Unauthorized" : "Forbidden", res.status, parsed);
    }

    if (!res.ok) {
      const method = (init.method ?? "GET").toUpperCase();
      const idempotent = method === "GET" || method === "HEAD";
      if (idempotent && RETRYABLE.has(res.status) && attempt < 2) {
        await new Promise((r) => setTimeout(r, 300 * (attempt + 1)));
        return request<T>(path, init, attempt + 1);
      }
      let parsed: unknown;
      try {
        parsed = await res.json();
      } catch {
        parsed = { error: await res.text().catch(() => "") };
      }
      throw new MobileApiError(`HTTP ${res.status}`, res.status, parsed);
    }

    if (res.status === 204) return undefined as T;
    return (await res.json()) as T;
  }

  return { request };
}

export type MobileApiClient = ReturnType<typeof createMobileApiClient>;
