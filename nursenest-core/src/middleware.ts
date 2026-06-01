/**
 * Next.js middleware entry point.
 *
 * Next.js ONLY recognises middleware from a file literally named `middleware.ts`
 * (or `middleware.js`) in the `src/` directory. The implementation lives in
 * `proxy.ts`; this file re-exports it under the required `middleware` name so
 * the build picks it up.
 *
 * Bug history: proxy.ts previously exported only `proxy` (named) with no
 * `middleware.ts` shim, which left `middleware-manifest.json` empty and
 * silently skipped all middleware work: edge auth checks, x-nn-request-pathname
 * header, referral attribution cookies, and narrow-viewport hints all stopped
 * running. This is the single-file fix.
 */
export { proxy as middleware, config } from "./proxy";
