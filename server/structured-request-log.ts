import type { Request, Response, NextFunction } from "express";
import { emitStructuredLog } from "./log-sink";

const SLOW_MS = Math.min(
  Math.max(parseInt(process.env.REQUEST_LOG_SLOW_MS || "3000", 10), 500),
  60_000,
);

function getUserIdForLog(req: Request): string | undefined {
  const auth = (req as Request & { authUser?: { id?: string } }).authUser;
  if (auth?.id) return String(auth.id);
  const legacy = (req as Request & { user?: { id?: string } }).user;
  if (legacy?.id) return String(legacy.id);
  return undefined;
}

function truncatePath(url: string, max = 512): string {
  if (url.length <= max) return url;
  return `${url.slice(0, max)}…`;
}

/**
 * JSON access logs for /api (and /readyz, /healthz). Includes requestId; userId when entitlement middleware set req.authUser.
 */
export function structuredRequestLogMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();

    res.on("finish", () => {
      const path = req.originalUrl || req.url || req.path;
      if (!path.startsWith("/api") && path !== "/readyz" && path !== "/healthz") {
        return;
      }

      const durationMs = Date.now() - start;
      const pathTrunc = truncatePath(path);
      const payload = {
        level: "info" as const,
        type: "http_request",
        method: req.method,
        path: pathTrunc,
        route: pathTrunc,
        status: res.statusCode,
        durationMs,
        requestId: req.requestId,
        userId: getUserIdForLog(req),
        slow: durationMs >= SLOW_MS,
      };
      if (payload.slow) {
        emitStructuredLog(
          { ...payload, level: "warn", type: "http_slow_request" },
          "warn",
        );
      } else {
        emitStructuredLog(payload);
      }
    });

    next();
  };
}
