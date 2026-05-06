import type {
  MobileNativeApiClient,
  MobileNativeApiErrorKind,
  MobileNativeApiResult,
  MobileNativePreparedRequest,
} from "./contracts";

export type CreateJsonApiClientOptions = {
  readonly baseUrl: string;
  readonly getCookieHeader?: () => string | null | undefined;
  readonly defaultHeaders?: Readonly<Record<string, string>>;
  readonly fetchImpl?: typeof fetch;
  readonly timeoutMs?: number;
};

function classifyError(status: number): MobileNativeApiErrorKind {
  if (status >= 500) return "http_5xx";
  if (status === 401 || status === 403) return "entitlement";
  if (status >= 400) return "http_4xx";
  return "unknown";
}

/**
 * Implements {@link MobileNativeApiClient} using `fetch` + JSON.
 * Auth: pass session cookies via `getCookieHeader` (never secrets in query strings).
 */
export function createJsonApiClient(options: CreateJsonApiClientOptions): MobileNativeApiClient {
  const fetchFn = options.fetchImpl ?? fetch;
  const timeoutMs = options.timeoutMs ?? 30_000;

  return {
    async executeJson<T>(req: MobileNativePreparedRequest): Promise<MobileNativeApiResult<T>> {
      const base = options.baseUrl.replace(/\/$/, "");
      const path = req.path.startsWith("http")
        ? req.path
        : `${base}${req.path.startsWith("/") ? "" : "/"}${req.path}`;
      const headers: Record<string, string> = {
        Accept: "application/json",
        ...(options.defaultHeaders ?? {}),
        ...(req.headers ?? {}),
      };
      if (req.method !== "GET" && req.method !== "DELETE" && !headers["Content-Type"]) {
        headers["Content-Type"] = "application/json";
      }
      const cookie = options.getCookieHeader?.();
      if (cookie) headers.Cookie = cookie;

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const body =
          req.method === "GET" || req.method === "DELETE"
            ? undefined
            : req.bodyJson === undefined
              ? undefined
              : JSON.stringify(req.bodyJson);

        const res = await fetchFn(path, {
          method: req.method,
          headers,
          body,
          signal: controller.signal,
        });
        clearTimeout(timer);

        const text = await res.text();
        let data: unknown = null;
        if (text) {
          try {
            data = JSON.parse(text) as unknown;
          } catch {
            return { ok: false, kind: "parse", status: res.status, message: "Invalid JSON response" };
          }
        }

        if (!res.ok) {
          const errMsg = typeof (data as { error?: string })?.error === "string" ? (data as { error: string }).error : res.statusText;
          return {
            ok: false,
            kind: classifyError(res.status),
            status: res.status,
            message: errMsg,
          };
        }

        return { ok: true, status: res.status, data: data as T };
      } catch (e) {
        clearTimeout(timer);
        const aborted = e instanceof Error && e.name === "AbortError";
        return {
          ok: false,
          kind: aborted ? "timeout" : "network",
          message: e instanceof Error ? e.message : "Request failed",
        };
      }
    },
  };
}
