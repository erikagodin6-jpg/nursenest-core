#!/usr/bin/env node
/**
 * Compatibility wrapper for legacy runtime entrypoints that resolve under
 * nursenest-core/scripts/. The canonical production entrypoint lives in the
 * monorepo root at scripts/start-production.mjs.
 */
import path from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootStart = path.resolve(scriptDir, "..", "..", "scripts", "start-production.mjs");

await import(pathToFileURL(rootStart).href);
