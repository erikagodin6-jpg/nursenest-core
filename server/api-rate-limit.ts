import rateLimit from "express-rate-limit";
import type { Request, Response, NextFunction } from "express";

/**
 * Broad API burst guard (per IP). Skips webhooks and non-API paths.
 * Tune with API_RATE_LIMIT_MAX_PER_MINUTE (default 100). Disable with API_RATE_LIMIT_DISABLED=true.
 */
export function createPublicApiRateLimiter() {
  if (String(process.env.API_RATE_LIMIT_DISABLED || "").toLowerCase() === "true") {
    return (_req: Request, _res: Response, next: NextFunction) => next();
  }

  const max = Number(process.env.API_RATE_LIMIT_MAX_PER_MINUTE || "100");
  const safeMax = Number.isFinite(max) && max >= 30 ? Math.floor(max) : 100;

  return rateLimit({
    windowMs: 60_000,
    max: safeMax,
    message: { error: "Too many requests. Please slow down." },
    standardHeaders: true,
    legacyHeaders: false,
    validate: { trustProxy: true, xForwardedForHeader: true },
    skip: (req: Request) => {
      const p = req.path || "";
      if (!p.startsWith("/api")) return true;
      if (p.startsWith("/api/stripe/webhook")) return true;
      return false;
    },
  });
}
