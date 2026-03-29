import type { Request, Response, NextFunction } from "express";

interface ConcurrencyConfig {
  maxConcurrent: number;
  label: string;
}

interface ConcurrencyStats {
  label: string;
  current: number;
  max: number;
  totalServed: number;
  totalRejected: number;
}

const limiters = new Map<string, { current: number; max: number; totalServed: number; totalRejected: number; label: string }>();

export function concurrencyLimiter(config: ConcurrencyConfig) {
  const key = config.label;
  if (!limiters.has(key)) {
    limiters.set(key, { current: 0, max: config.maxConcurrent, totalServed: 0, totalRejected: 0, label: config.label });
  }

  return (req: Request, res: Response, next: NextFunction) => {
    const state = limiters.get(key)!;

    if (state.current >= state.max) {
      state.totalRejected++;
      res.setHeader("Retry-After", "10");
      return res.status(503).json({
        error: `Too many concurrent requests for ${state.label}. Please retry shortly.`,
        retryAfter: 10,
        concurrencyLimit: true,
      });
    }

    state.current++;
    state.totalServed++;

    let decremented = false;
    const onDone = () => {
      if (!decremented) {
        decremented = true;
        state.current = Math.max(0, state.current - 1);
      }
    };
    res.on("finish", onDone);
    res.on("close", onDone);

    next();
  };
}

export function getConcurrencyStats(): ConcurrencyStats[] {
  return Array.from(limiters.values()).map(s => ({
    label: s.label,
    current: s.current,
    max: s.max,
    totalServed: s.totalServed,
    totalRejected: s.totalRejected,
  }));
}
