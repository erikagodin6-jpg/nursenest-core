import { queryClient } from "./queryClient";

interface HealthStatus {
  status: "healthy" | "degraded" | "down" | "unknown";
  emergency: boolean;
  services: Array<{ service: string; status: string; latencyMs: number; details?: string }>;
  timestamp: number;
}

let lastHealth: HealthStatus = { status: "unknown", emergency: false, services: [], timestamp: 0 };
let healthPollingInterval: ReturnType<typeof setInterval> | null = null;
const healthListeners = new Set<(h: HealthStatus) => void>();

export function getHealthStatus(): HealthStatus {
  return lastHealth;
}

export function onHealthChange(listener: (h: HealthStatus) => void): () => void {
  healthListeners.add(listener);
  return () => healthListeners.delete(listener);
}

async function pollHealth(): Promise<void> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch("/api/health", { signal: controller.signal });
    clearTimeout(timeout);
    if (res.ok) {
      lastHealth = await res.json();
    } else {
      lastHealth = { status: "degraded", emergency: false, services: [], timestamp: Date.now() };
    }
  } catch {
    lastHealth = { status: "unknown", emergency: false, services: [], timestamp: Date.now() };
  }
  healthListeners.forEach((l) => {
    try { l(lastHealth); } catch {}
  });
}

export function startHealthPolling(intervalMs = 30000): void {
  if (healthPollingInterval) return;
  pollHealth();
  healthPollingInterval = setInterval(pollHealth, intervalMs);
}

export function stopHealthPolling(): void {
  if (healthPollingInterval) {
    clearInterval(healthPollingInterval);
    healthPollingInterval = null;
  }
}

interface ClientCircuitBreaker {
  name: string;
  state: "closed" | "open";
  failureCount: number;
  threshold: number;
  cooldownMs: number;
  openedAt: number | null;
}

const clientBreakers = new Map<string, ClientCircuitBreaker>();

function getClientBreaker(name: string, threshold = 3, cooldownMs = 15000): ClientCircuitBreaker {
  let cb = clientBreakers.get(name);
  if (!cb) {
    cb = { name, state: "closed", failureCount: 0, threshold, cooldownMs, openedAt: null };
    clientBreakers.set(name, cb);
  }
  return cb;
}

export function isClientCircuitOpen(name: string): boolean {
  const cb = clientBreakers.get(name);
  if (!cb || cb.state === "closed") return false;
  if (Date.now() - (cb.openedAt || 0) > cb.cooldownMs) {
    cb.state = "closed";
    cb.failureCount = 0;
    cb.openedAt = null;
    return false;
  }
  return true;
}

export function recordClientSuccess(name: string): void {
  const cb = clientBreakers.get(name);
  if (cb) {
    cb.state = "closed";
    cb.failureCount = 0;
    cb.openedAt = null;
  }
}

export function recordClientFailure(name: string): void {
  const cb = getClientBreaker(name);
  cb.failureCount++;
  if (cb.failureCount >= cb.threshold) {
    cb.state = "open";
    cb.openedAt = Date.now();
  }
}

export async function resilientFetch(
  url: string,
  options?: RequestInit & { circuitName?: string; retries?: number; timeoutMs?: number; fallbackData?: any }
): Promise<Response> {
  const circuitName = options?.circuitName || url;
  const retries = options?.retries ?? 2;
  const timeoutMs = options?.timeoutMs ?? 10000;

  if (isClientCircuitOpen(circuitName)) {
    if (options?.fallbackData !== undefined) {
      return new Response(JSON.stringify(options.fallbackData), {
        status: 200,
        headers: { "Content-Type": "application/json", "X-Fallback": "true" },
      });
    }
    throw new Error(`Service temporarily unavailable: ${circuitName}`);
  }

  let lastError: Error | null = null;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), timeoutMs);
      const res = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeout);
      if (res.ok || res.status < 500) {
        recordClientSuccess(circuitName);
        return res;
      }
      recordClientFailure(circuitName);
      lastError = new Error(`HTTP ${res.status}`);
    } catch (err: any) {
      recordClientFailure(circuitName);
      lastError = err;
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
      }
    }
  }

  if (options?.fallbackData !== undefined) {
    return new Response(JSON.stringify(options.fallbackData), {
      status: 200,
      headers: { "Content-Type": "application/json", "X-Fallback": "true" },
    });
  }
  throw lastError || new Error("Request failed");
}

export function generateIncidentId(): string {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 6);
  return `INC-${ts}-${rand}`.toUpperCase();
}

export function invalidateAndRefresh(queryKeys: string[]): void {
  for (const key of queryKeys) {
    queryClient.invalidateQueries({ queryKey: [key] });
  }
}
