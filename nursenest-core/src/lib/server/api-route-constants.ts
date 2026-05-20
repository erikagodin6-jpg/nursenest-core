/**
 * Default Route Handler ceilings (seconds) for Vercel / Node runtimes.
 * Add `export const maxDuration = …` in each `route.ts` — Next.js does not inherit these from a parent.
 */
export const API_ROUTE_MAX_DURATION_DEFAULT_SEC = 25;

/** Heavy subscriber list endpoints (Prisma + i18n overlays). */
export const API_ROUTE_MAX_DURATION_LIST_HEAVY_SEC = 60;

/** Public marketing JSON (cached counts). */
export const API_ROUTE_MAX_DURATION_PUBLIC_MARKETING_SEC = 30;
