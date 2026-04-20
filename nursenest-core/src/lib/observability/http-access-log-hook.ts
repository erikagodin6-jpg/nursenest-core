/**
 * Node HTTP `request`/`finish` logging for horizontal scaling / log drains (DigitalOcean, Axiom, etc.).
 * Enable with `ACCESS_LOG_STRUCTURED=true` (default on in production unless `ACCESS_LOG_STRUCTURED=false`).
 *
 * Installs **only** `http.createServer` / `https.createServer` wrapping — not prototype-level `emit` patching —
 * so standalone bootstrap preload (`createServer` chain) and normal Next request dispatch stay compatible.
 *
 * Emits one line per request (excluding static asset paths) with:
 * `responseTimeMs`, `statusCode`, `route`, CPU delta (`cpuUsageUserUs` / `cpuUsageSystemUs`),
 * `memoryUsageHeapMb`, `memoryUsageRssMb`. Slow threshold: **> 1000ms** → `slow_request`.
 * 5xx responses also emit `request_error_response` for alert routing (no bodies / PII).
 */
import http from "node:http";
import https from "node:https";
import { safeServerLog } from "@/lib/observability/safe-server-log";

let installed = false;

function shouldEmitAccessLog(): boolean {
  if (process.env.ACCESS_LOG_STRUCTURED === "false") return false;
  if (process.env.ACCESS_LOG_STRUCTURED === "true") return true;
  return process.env.NODE_ENV === "production";
}

/** Skip high-volume static chunks so logs stay actionable under load tests. */
function shouldSkipPathForAccessLog(rawUrl: string): boolean {
  const pathOnly = rawUrl.split("?")[0] ?? "";
  if (pathOnly.startsWith("/_next/static/") || pathOnly.startsWith("/_next/image")) return true;
  if (pathOnly === "/favicon.ico" || pathOnly === "/robots.txt" || pathOnly === "/healthz") return true;
  const leaf = pathOnly.split("/").pop() ?? "";
  if (/\.(ico|png|jpe?g|gif|webp|svg|woff2?|ttf|eot|map|css|js)$/i.test(leaf)) return true;
  return false;
}

function shouldEmitLifecycleStart(route: string): boolean {
  return route === "/" || route === "/tools";
}

type HttpRequestListener = (req: http.IncomingMessage, res: http.ServerResponse) => void;

function wrapRequestListenerWithAccessLog(inner: HttpRequestListener): HttpRequestListener {
  return function accessLogWrappedListener(req, res) {
    const rawUrl = req.url ?? "";
    if (!shouldSkipPathForAccessLog(rawUrl)) {
      const started = Date.now();
      const cpu0 = process.cpuUsage();
      const route = rawUrl.split("?")[0]?.slice(0, 160) ?? "";
      if (shouldEmitLifecycleStart(route)) {
        safeServerLog("http", "request_start", {
          schema: "nn.http_access.v1",
          route,
          method: req.method ?? "GET",
        });
      }
      res.on("finish", () => {
        try {
          const responseTimeMs = Date.now() - started;
          const mem = process.memoryUsage();
          const cpu = process.cpuUsage(cpu0);
          const memoryUsageHeapMb = Math.round(mem.heapUsed / 1024 / 1024);
          const memoryUsageRssMb = Math.round(mem.rss / 1024 / 1024);
          const statusCode = res.statusCode ?? 0;
          const baseMeta = {
            schema: "nn.http_access.v1",
            route,
            method: req.method ?? "GET",
            statusCode,
            responseTimeMs,
            cpuUsageUserUs: cpu.user,
            cpuUsageSystemUs: cpu.system,
            memoryUsageHeapMb,
            memoryUsageRssMb,
          };
          safeServerLog("http", "request_complete", {
            ...baseMeta,
            cpuUserUs: cpu.user,
            cpuSystemUs: cpu.system,
            heapUsedMb: memoryUsageHeapMb,
            rssMb: memoryUsageRssMb,
          });
          if (responseTimeMs > 1000) {
            safeServerLog("http", "slow_request", {
              ...baseMeta,
              thresholdMs: 1000,
            });
            if (shouldEmitLifecycleStart(route)) {
              safeServerLog("http", "request_slow", {
                ...baseMeta,
                thresholdMs: 1000,
              });
            }
          }
          if (statusCode >= 500) {
            safeServerLog("http", "request_error_response", {
              schema: "nn.http_access.v1",
              route,
              method: req.method ?? "GET",
              statusCode,
              responseTimeMs,
            });
          }
        } catch {
          /* ignore */
        }
      });
    }
    return inner(req, res);
  };
}

type CreateServerFn = typeof http.createServer;

function patchCreateServer(module: typeof http): void {
  const createServer = module.createServer;
  if (typeof createServer !== "function") return;
  const marker = "__nnHttpAccessLogCreateServerPatched" as const;
  if ((createServer as unknown as Record<string, boolean>)[marker]) return;

  const originalCreateServer = createServer;
  function patchedCreateServer(this: unknown, ...args: unknown[]) {
    const listenerIndex =
      typeof args[0] === "function" ? 0 : typeof args[1] === "function" ? 1 : -1;

    if (listenerIndex >= 0) {
      const originalListener = args[listenerIndex] as HttpRequestListener;
      args[listenerIndex] = wrapRequestListenerWithAccessLog(originalListener);
    }

    return (originalCreateServer as (...a: unknown[]) => http.Server).apply(this, args);
  }

  (patchedCreateServer as unknown as Record<string, boolean>)[marker] = true;
  (module as { createServer: CreateServerFn }).createServer = patchedCreateServer as CreateServerFn;
}

export function installHttpAccessLogHook(): void {
  if (installed || !shouldEmitAccessLog()) return;
  installed = true;

  patchCreateServer(http);
  patchCreateServer(https as unknown as typeof http);
}
