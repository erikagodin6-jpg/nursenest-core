/**
 * Compatibility bridge for runtimes that still execute `middleware.ts`.
 *
 * Next.js 16+ prefers `src/proxy.ts`, but some deployed environments may still
 * rely on middleware discovery. Re-export the same handler + matcher so auth
 * and admin path headers run for `/admin` in both modes.
 */
export { proxy as middleware, config } from "./proxy";
