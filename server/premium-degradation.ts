import type { Request, Response, NextFunction } from "express";
import { getMemoryLevel, shouldReducePayloads } from "./memory-monitor";

export interface DegradationInfo {
  degradedMode: boolean;
  degradationReason?: string;
  memoryLevel?: string;
}

export function premiumDegradationMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    const memLevel = getMemoryLevel();
    const isDegraded = shouldReducePayloads();

    (req as any)._degradation = {
      degradedMode: isDegraded,
      degradationReason: isDegraded ? `Memory pressure: ${memLevel}` : undefined,
      memoryLevel: memLevel,
    } as DegradationInfo;

    next();
  };
}

export function getDegradation(req: Request): DegradationInfo {
  return (req as any)._degradation || { degradedMode: false };
}

export function getDegradedPageSize(): number {
  const level = getMemoryLevel();
  if (level === "critical") return 10;
  if (level === "protection") return 15;
  if (level === "warning") return 20;
  return 50;
}

export function attachDegradationToResponse(res: Response, req: Request): void {
  const degradation = getDegradation(req);
  if (degradation.degradedMode) {
    const originalJson = res.json.bind(res);
    res.json = function(body: any) {
      if (body && typeof body === "object" && !Array.isArray(body)) {
        body.degradedMode = true;
        body.degradationReason = degradation.degradationReason;
      }
      return originalJson(body);
    };
  }
}

export function logDegradedAccess(userId: string, route: string, reason: string, memoryLevel: string): void {
  console.warn(`[PremiumDegradation] Degraded content served — userId=${userId}, route=${route}, reason=${reason}, memoryLevel=${memoryLevel}`);
}
