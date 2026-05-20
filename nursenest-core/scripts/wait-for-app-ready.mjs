#!/usr/bin/env node
/**
 * Back-compat entry for marketing capture and legacy scripts.
 * Uses **relaxed** HTTP completion checks (any 2xx–5xx counts as transport success unless overridden).
 *
 * For strict **HTTP 200** gates (Playwright / CI): `node scripts/qa/wait-for-app-ready.mjs`
 * or `npm run wait:app:ready`.
 */
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { waitForAppReady as waitForAppReadyQa } from "./qa/wait-for-app-ready.mjs";

export async function waitForAppReady(opts = {}) {
  return waitForAppReadyQa({ strictHttp200: false, ...opts });
}

const isMain =
  Boolean(process.argv[1]) && pathToFileURL(resolve(process.argv[1])).href === import.meta.url;

if (isMain) {
  waitForAppReady()
    .then(() => process.exit(0))
    .catch((e) => {
      console.error(e instanceof Error ? e.message : e);
      process.exit(1);
    });
}
