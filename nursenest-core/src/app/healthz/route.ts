/**
 * Liveness for App Platform / load balancers — **cheap, dependency-free, no DB/auth/Prisma**.
 *
 * - **Runtime:** `edge` — avoids pulling Node-only server chunks onto this path; keeps the handler minimal.
 * - **Routing:** **Not** matched by `src/proxy.ts` — no auth, session, or API rate limits.
 * - **Deeper checks:** process/memory → `GET /api/health`; database → `GET /api/health/ready`.
 *
 * **Cold start (standalone):** The process may log “Ready” and listen on the port before Next finishes
 * lazy `getRequestHandlers()` setup. Probes in that window can see **no HTTP headers until init
 * completes** (“context deadline exceeded while awaiting headers”). That is framework startup ordering,
 * not this handler’s body. Keep App Platform **`initial_delay_seconds`** high enough (see
 * `.do/app-nursenest-core-next.yaml`).
 */
export const runtime = "edge";

/** Fixed body — no `JSON.stringify` / `Date` per request. */
const BODY = '{"status":"ok","service":"nursenest-core"}';

const HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
} as const;

export function GET() {
  return new Response(BODY, { status: 200, headers: HEADERS });
}
