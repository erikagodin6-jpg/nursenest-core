/**
 * Optional Node HTTP `request`/`finish` logging for structured ops metrics (DigitalOcean log drains).
 * Enable with `ACCESS_LOG_STRUCTURED=true` (default on in production unless `ACCESS_LOG_STRUCTURED=false`).
 */
import http from "node:http";
import { safeServerLog } from "@/lib/observability/safe-server-log";

let installed = false;

function shouldEmitAccessLog(): boolean {
  if (process.env.ACCESS_LOG_STRUCTURED === "false") return false;
  if (process.env.ACCESS_LOG_STRUCTURED === "true") return true;
  return process.env.NODE_ENV === "production";
}

export function installHttpAccessLogHook(): void {
  if (installed || !shouldEmitAccessLog()) return;
  installed = true;

  const origEmit = http.Server.prototype.emit;
  http.Server.prototype.emit = function emitPatched(this: http.Server, event: string | symbol, ...args: unknown[]) {
    if (event === "request" && args.length >= 2) {
      const req = args[0] as http.IncomingMessage;
      const res = args[1] as http.ServerResponse;
      const rawUrl = req.url ?? "";
      if (rawUrl.startsWith("/api/") || rawUrl === "/healthz" || rawUrl.startsWith("/healthz?")) {
        const started = Date.now();
        const cpu0 = process.cpuUsage();
        res.on("finish", () => {
          try {
            const responseTimeMs = Date.now() - started;
            const route = rawUrl.split("?")[0]?.slice(0, 160) ?? "";
            const mem = process.memoryUsage();
            const cpu = process.cpuUsage(cpu0);
            safeServerLog("http", "request_complete", {
              route,
              method: req.method ?? "GET",
              statusCode: res.statusCode ?? 0,
              responseTimeMs,
              cpuUserUs: cpu.user,
              cpuSystemUs: cpu.system,
              heapUsedMb: Math.round(mem.heapUsed / 1024 / 1024),
              rssMb: Math.round(mem.rss / 1024 / 1024),
            });
            if (responseTimeMs > 1000) {
              safeServerLog("http", "slow_request", {
                route,
                responseTimeMs,
                statusCode: res.statusCode ?? 0,
              });
            }
          } catch {
            /* ignore */
          }
        });
      }
    }
    return origEmit.apply(this, args as never);
  };
}
