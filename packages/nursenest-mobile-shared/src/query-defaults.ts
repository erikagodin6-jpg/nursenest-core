export type MobileQueryRetryFn = (failureCount: number, error: unknown) => boolean;

export function isLikelyUnauthorized(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const status = (error as { status?: unknown }).status;
  return status === 401;
}

export function isLikelyForbidden(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const status = (error as { status?: unknown }).status;
  return status === 403;
}

function isRetryableHttpStatus(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const status = (error as { status?: unknown }).status;
  return status === 408 || status === 429 || (typeof status === "number" && status >= 500);
}

/**
 * TanStack Query defaults for mobile reads: bounded retry, no retry on 401/403.
 */
export function mobileQueryClientDefaults(): {
  queries: {
    staleTime: number;
    gcTime: number;
    retry: MobileQueryRetryFn;
    retryDelay: (attemptIndex: number) => number;
  };
  mutations: { retry: number };
} {
  return {
    queries: {
      staleTime: 60_000,
      gcTime: 1_800_000,
      retry: (failureCount, error) => {
        if (isLikelyUnauthorized(error) || isLikelyForbidden(error)) return false;
        if (failureCount >= 3) return false;
        if (typeof (error as { status?: unknown }).status === "number") {
          return isRetryableHttpStatus(error);
        }
        return failureCount < 2;
      },
      retryDelay: (i) => Math.min(1000 * 2 ** i, 30_000),
    },
    mutations: {
      retry: 0,
    },
  };
}
