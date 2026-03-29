import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { ApiError, readApiJsonResponse } from "./api-error";

export function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  try {
    const userToken = localStorage.getItem("nursenest-user-token");
    if (userToken) {
      headers["Authorization"] = `Bearer ${userToken}`;
      headers["x-user-token"] = userToken;
    }
    const adminToken = localStorage.getItem("nn_admin_access_token");
    const expiresAt = localStorage.getItem("nn_admin_expires_at");
    if (adminToken && (!expiresAt || Date.now() <= Number(expiresAt))) {
      headers["Authorization"] = `Bearer ${adminToken}`;
    }
  } catch {}
  return headers;
}

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const parsed = await readApiJsonResponse(res);
    const message = `${parsed.status}: ${parsed.message}`;
    const payload = { ...parsed.errorBody, code: parsed.code ?? parsed.errorBody.code };
    if (res.status === 503) {
      const retryAfter = res.headers.get("Retry-After");
      const err = new ApiError(message, 503, payload) as ApiError & { retryAfter?: number };
      (err as any).retryAfter = retryAfter ? parseInt(retryAfter, 10) : 30;
      throw err;
    }
    throw new ApiError(message, parsed.status, payload);
  }
}

const DEFAULT_PAGE_LIMIT = 50;

export function appendPaginationParams(url: string, limit?: number, offset?: number): string {
  const sep = url.includes("?") ? "&" : "?";
  const params: string[] = [];
  params.push(`limit=${limit ?? DEFAULT_PAGE_LIMIT}`);
  if (offset != null) params.push(`offset=${offset}`);
  return `${url}${sep}${params.join("&")}`;
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const authHeaders = getAuthHeaders();
  const res = await fetch(url, {
    method,
    headers: {
      ...authHeaders,
      ...(data ? { "Content-Type": "application/json" } : {}),
    },
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey.join("/") as string, {
      credentials: "include",
      headers: getAuthHeaders(),
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

const FIVE_MINUTES = 5 * 60 * 1000;
const TEN_MINUTES = 10 * 60 * 1000;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: FIVE_MINUTES,
      gcTime: TEN_MINUTES,
      retry: (failureCount, error: any) => {
        if (error?.status === 503 && failureCount < 2) return true;
        return false;
      },
      retryDelay: (attemptIndex, error: any) => {
        const retryAfter = (error as any)?.retryAfter;
        if (retryAfter) return retryAfter * 1000;
        return Math.min(1000 * 2 ** attemptIndex, 30000);
      },
    },
    mutations: {
      retry: false,
    },
  },
});
