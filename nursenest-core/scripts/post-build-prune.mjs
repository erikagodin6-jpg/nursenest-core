#!/usr/bin/env node
/**
 * Production deploy: remove Next.js build cache (not needed for `next start`).
 * Safe to run after `next build`; shrinks artifact size and avoids unbounded cache growth on builders.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const pkgRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const nextCache = path.join(pkgRoot, ".next", "cache");

if (fs.existsSync(nextCache)) {
  fs.rmSync(nextCache, { recursive: true, force: true });
  console.log("[post-build-prune] removed .next/cache");
} else {
  console.log("[post-build-prune] no .next/cache to remove");
}
